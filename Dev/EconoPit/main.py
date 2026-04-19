# debug prints removed

"""pip install streamlit plotly pandas requests"""
"""streamlit run main.py"""
"""C:/Users/dkmac/AppData/Local/Python/pythoncore-3.14-64/python.exe -m streamlit run main.py"""
"""
EconoPit - Global Money, Assets & Risk Map (MVP)
- Market watcher polls data in the background at a user-controlled interval (default 1s)
- UI refreshes at a user-controlled interval (default 10s)
- Reminder/tick cadence is user-controlled (default 10s)
- Uses Plotly "orthographic" globe as navigation
- Twelve Data quotes (requires TWELVE_DATA_API_KEY env var for live data)

Run:
  python -m pip install streamlit plotly pandas requests streamlit-autorefresh
  python -m streamlit run main.py

Optional Windows toast notifications:
  python -m pip install win10toast
  then toggle "Enable Windows toast" in the sidebar (only works on Windows)
"""

import os
import time
import threading
from dataclasses import dataclass, field
from typing import Dict, Any, List, Tuple

import requests
import pandas as pd
import streamlit as st
import plotly.graph_objects as go
from streamlit_autorefresh import st_autorefresh
import yfinance as yf

# -----------------------------
# Streamlit page config (must be near top)
# -----------------------------
# Optional helper to capture Plotly hover/click events from the browser
try:
    from streamlit_plotly_events import plotly_events
    PLOTLY_EVENTS_AVAILABLE = True
except Exception:
    PLOTLY_EVENTS_AVAILABLE = False
st.set_page_config(page_title="Global Money & Risk Map", layout="wide")

# Modern glossy dark theme styling
st.markdown("""
    <style>
        /* Root variables */
        :root {
            --primary: #00D9FF;
            --secondary: #FF6B9D;
            --dark-bg: #0A0E27;
            --card-bg: rgba(26, 40, 71, 0.6);
            --card-border: rgba(0, 217, 255, 0.2);
            --text-primary: #E8EAED;
            --text-secondary: #A0A3A8;
        }
        
        /* Main app background */
        .stApp {
            background: linear-gradient(135deg, #0A0E27 0%, #1A2847 100%);
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0, 217, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(0, 217, 255, 0.3);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 217, 255, 0.5);
        }
        
        /* Card/Container styling */
        .stMetric, .stDataFrame, [data-testid="stDataFrameAnalyzer"] {
            background: rgba(26, 40, 71, 0.5) !important;
            border: 1px solid rgba(0, 217, 255, 0.15) !important;
            border-radius: 12px !important;
            backdrop-filter: blur(10px);
            padding: 20px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        /* Headers */
        h1, h2, h3 {
            color: #E8EAED;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #00D9FF 0%, #FF6B9D 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* Buttons */
        .stButton > button {
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.3), rgba(255, 107, 157, 0.3));
            border: 1px solid rgba(0, 217, 255, 0.5);
            color: #E8EAED;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            padding: 10px 24px;
        }
        
        .stButton > button:hover {
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.5), rgba(255, 107, 157, 0.5));
            border-color: rgba(0, 217, 255, 0.8);
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(0, 217, 255, 0.2);
        }
        
        /* Input fields */
        .stTextInput input, .stSelectbox select, .stMultiSelect {
            background: rgba(26, 40, 71, 0.7) !important;
            border: 1px solid rgba(0, 217, 255, 0.2) !important;
            color: #E8EAED !important;
            border-radius: 8px !important;
            padding: 10px 12px !important;
        }
        
        /* Sliders */
        .stSlider {
            padding: 20px 0;
        }
        
        .stSlider > div > div > div > div {
            color: #00D9FF;
        }
        
        /* Selectbox dropdown */
        .stSelectbox [data-baseweb="select"] {
            background: rgba(26, 40, 71, 0.7) !important;
            border: 1px solid rgba(0, 217, 255, 0.2) !important;
            border-radius: 8px !important;
        }
        
        /* Info boxes */
        .stInfo {
            background: rgba(0, 217, 255, 0.1);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 12px;
            backdrop-filter: blur(10px);
        }
        
        .stWarning {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 12px;
            backdrop-filter: blur(10px);
        }
        
        /* Divider */
        .stDivider {
            border-color: rgba(0, 217, 255, 0.2);
        }
        
        /* Sidebar */
        [data-testid="stSidebar"] {
            background: linear-gradient(180deg, rgba(26, 40, 71, 0.8) 0%, rgba(15, 20, 50, 0.8) 100%);
            border-right: 1px solid rgba(0, 217, 255, 0.1);
        }
        
        [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3 {
            color: #00D9FF;
        }
        
        /* Metric styling */
        [data-testid="metric-container"] {
            background: rgba(26, 40, 71, 0.5);
            border: 1px solid rgba(0, 217, 255, 0.15);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        /* DataFrame styling */
        [data-testid="stDataFrame"] {
            background: rgba(26, 40, 71, 0.5) !important;
        }
        
        /* Markdown */
        .stMarkdown {
            color: #E8EAED;
        }
        
        /* Expander */
        .streamlit-expanderHeader {
            background: rgba(26, 40, 71, 0.6);
            border: 1px solid rgba(0, 217, 255, 0.15);
            border-radius: 8px;
        }
    </style>
    """, unsafe_allow_html=True)

# -----------------------------
# Data provider config
# -----------------------------
TWELVE_API_KEY = os.getenv("TWELVE_DATA_API_KEY", "")

# Default watchlists
DEFAULT_PAIRS = ["USD/ZAR", "EUR/USD", "USD/JPY", "GBP/USD"]
DEFAULT_SYMBOLS = ["SPY", "QQQ", "GLD", "USO"]  # proxies (depends on provider coverage)

# Basic country coordinates and economic metrics (extend as needed)
COUNTRIES: Dict[str, Dict[str, Any]] = {
    "United States": {"iso3": "USA", "lat": 38.0, "lon": -97.0, "ccy": "USD", "gdp": 27360},
    "China": {"iso3": "CHN", "lat": 35.9, "lon": 104.2, "ccy": "CNY", "gdp": 17950},
    "Germany": {"iso3": "DEU", "lat": 51.2, "lon": 10.4, "ccy": "EUR", "gdp": 4080},
    "Japan": {"iso3": "JPN", "lat": 36.2, "lon": 138.3, "ccy": "JPY", "gdp": 4200},
    "United Kingdom": {"iso3": "GBR", "lat": 55.4, "lon": -3.4, "ccy": "GBP", "gdp": 3280},
    "France": {"iso3": "FRA", "lat": 46.2, "lon": 2.2, "ccy": "EUR", "gdp": 2780},
    "India": {"iso3": "IND", "lat": 20.6, "lon": 78.9, "ccy": "INR", "gdp": 3385},
    "Italy": {"iso3": "ITA", "lat": 41.9, "lon": 12.6, "ccy": "EUR", "gdp": 2010},
    "Brazil": {"iso3": "BRA", "lat": -14.2, "lon": -51.9, "ccy": "BRL", "gdp": 2117},
    "Canada": {"iso3": "CAN", "lat": 56.1, "lon": -106.3, "ccy": "CAD", "gdp": 2140},
    "South Korea": {"iso3": "KOR", "lat": 35.9, "lon": 127.8, "ccy": "KRW", "gdp": 1642},
    "Russia": {"iso3": "RUS", "lat": 61.5, "lon": 105.3, "ccy": "RUB", "gdp": 2100},
    "Spain": {"iso3": "ESP", "lat": 40.5, "lon": -3.7, "ccy": "EUR", "gdp": 1390},
    "Australia": {"iso3": "AUS", "lat": -25.3, "lon": 133.8, "ccy": "AUD", "gdp": 1688},
    "Mexico": {"iso3": "MEX", "lat": 23.6, "lon": -102.6, "ccy": "MXN", "gdp": 1290},
    "Netherlands": {"iso3": "NLD", "lat": 52.1, "lon": 5.3, "ccy": "EUR", "gdp": 1120},
    "Saudi Arabia": {"iso3": "SAU", "lat": 23.9, "lon": 45.1, "ccy": "SAR", "gdp": 1069},
    "Turkey": {"iso3": "TUR", "lat": 38.9, "lon": 35.2, "ccy": "TRY", "gdp": 1098},
    "Switzerland": {"iso3": "CHE", "lat": 46.8, "lon": 8.2, "ccy": "CHF", "gdp": 923},
    "Poland": {"iso3": "POL", "lat": 51.9, "lon": 19.1, "ccy": "PLN", "gdp": 688},
    "Sweden": {"iso3": "SWE", "lat": 60.1, "lon": 18.6, "ccy": "SEK", "gdp": 595},
    "Norway": {"iso3": "NOR", "lat": 60.5, "lon": 8.5, "ccy": "NOK", "gdp": 598},
    "Belgium": {"iso3": "BEL", "lat": 50.5, "lon": 4.5, "ccy": "EUR", "gdp": 594},
    "Austria": {"iso3": "AUT", "lat": 47.5, "lon": 14.6, "ccy": "EUR", "gdp": 516},
    "Indonesia": {"iso3": "IDN", "lat": -0.8, "lon": 113.9, "ccy": "IDR", "gdp": 1319},
    "Thailand": {"iso3": "THA", "lat": 15.9, "lon": 100.9, "ccy": "THB", "gdp": 514},
    "Singapore": {"iso3": "SGP", "lat": 1.4, "lon": 103.8, "ccy": "SGD", "gdp": 592},
    "Malaysia": {"iso3": "MYS", "lat": 4.2, "lon": 101.7, "ccy": "MYR", "gdp": 505},
    "Philippines": {"iso3": "PHL", "lat": 12.9, "lon": 121.8, "ccy": "PHP", "gdp": 537},
    "Vietnam": {"iso3": "VNM", "lat": 14.1, "lon": 108.8, "ccy": "VND", "gdp": 429},
    "Pakistan": {"iso3": "PAK", "lat": 30.4, "lon": 69.2, "ccy": "PKR", "gdp": 635},
    "Bangladesh": {"iso3": "BGD", "lat": 23.7, "lon": 90.4, "ccy": "BDT", "gdp": 415},
    "Nigeria": {"iso3": "NGA", "lat": 9.1, "lon": 8.7, "ccy": "NGN", "gdp": 477},
    "Egypt": {"iso3": "EGY", "lat": 26.8, "lon": 30.8, "ccy": "EGP", "gdp": 477},
    "South Africa": {"iso3": "ZAF", "lat": -30.6, "lon": 22.9, "ccy": "ZAR", "gdp": 405},
    "Kenya": {"iso3": "KEN", "lat": -0.0, "lon": 37.9, "ccy": "KES", "gdp": 118},
    "Israel": {"iso3": "ISR", "lat": 31.0, "lon": 34.9, "ccy": "ILS", "gdp": 530},
    "United Arab Emirates": {"iso3": "ARE", "lat": 23.4, "lon": 53.8, "ccy": "AED", "gdp": 517},
    "Thailand": {"iso3": "THA", "lat": 15.9, "lon": 100.9, "ccy": "THB", "gdp": 514},
    "Argentina": {"iso3": "ARG", "lat": -38.4, "lon": -63.6, "ccy": "ARS", "gdp": 632},
    "Chile": {"iso3": "CHL", "lat": -35.7, "lon": -71.5, "ccy": "CLP", "gdp": 307},
    "Colombia": {"iso3": "COL", "lat": 4.6, "lon": -74.1, "ccy": "COP", "gdp": 314},
    "Peru": {"iso3": "PER", "lat": -9.2, "lon": -75.0, "ccy": "PEN", "gdp": 233},
    "Greece": {"iso3": "GRC", "lat": 39.1, "lon": 21.8, "ccy": "EUR", "gdp": 240},
    "Portugal": {"iso3": "PRT", "lat": 39.4, "lon": -8.2, "ccy": "EUR", "gdp": 282},
    "Ireland": {"iso3": "IRL", "lat": 53.4, "lon": -8.2, "ccy": "EUR", "gdp": 529},
    "New Zealand": {"iso3": "NZL", "lat": -40.9, "lon": 174.9, "ccy": "NZD", "gdp": 249},
    "Hong Kong": {"iso3": "HKG", "lat": 22.4, "lon": 114.1, "ccy": "HKD", "gdp": 398},
    "Taiwan": {"iso3": "TWN", "lat": 23.7, "lon": 120.9, "ccy": "TWD", "gdp": 777},
    "Qatar": {"iso3": "QAT", "lat": 25.4, "lon": 51.2, "ccy": "QAR", "gdp": 235},
    "Hungary": {"iso3": "HUN", "lat": 47.2, "lon": 19.5, "ccy": "HUF", "gdp": 227},
    "Czech Republic": {"iso3": "CZE", "lat": 49.8, "lon": 15.5, "ccy": "CZK", "gdp": 281},
    "Romania": {"iso3": "ROU", "lat": 45.9, "lon": 24.9, "ccy": "RON", "gdp": 301},
}

def calculate_economic_weight(c1: str, c2: str) -> float:
    """Calculate economic linkage weight based on GDP, distance, and development proximity."""
    if c1 == c2:
        return 0.0
    
    c1_data = COUNTRIES[c1]
    c2_data = COUNTRIES[c2]
    
    # GDP factors (larger economies trade more)
    gdp1 = c1_data.get("gdp", 500)
    gdp2 = c2_data.get("gdp", 500)
    gdp_factor = (gdp1 * gdp2) ** 0.5 / 10000  # geometric mean normalized
    
    # Distance factor (closer = more trade)
    import math
    lat1, lon1 = c1_data["lat"], c1_data["lon"]
    lat2, lon2 = c2_data["lat"], c2_data["lon"]
    distance = math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2) + 1
    distance_factor = 150 / (distance ** 1.5)  # Inverse distance
    
    # Currency/regional proximity bonus
    ccy1 = c1_data.get("ccy", "")
    ccy2 = c2_data.get("ccy", "")
    ccy_bonus = 1.5 if ccy1 == ccy2 else 1.0  # Same currency = stronger link
    
    weight = (gdp_factor + distance_factor) * ccy_bonus
    return max(0.1, min(2.0, weight))  # Clamp to reasonable range

def build_flow_edges() -> List[Tuple[str, str, float]]:
    """Generate complete graph of all countries with weighted edges."""
    edges = []
    countries_list = list(COUNTRIES.keys())
    for i, c1 in enumerate(countries_list):
        for c2 in countries_list[i+1:]:
            weight = calculate_economic_weight(c1, c2)
            edges.append((c1, c2, weight))
    return edges

def generate_trade_composition(c1: str, c2: str, weight: float) -> Dict[str, Any]:
    """Generate realistic trade composition between two countries."""
    trade_items = {
        "Manufactured Goods & Electronics": int(30 * weight),
        "Agriculture & Raw Materials": int(15 * weight),
        "Energy (Oil & Gas)": int(20 * weight),
        "Chemicals & Plastics": int(12 * weight),
        "Metals & Minerals": int(10 * weight),
        "Services & Finance": int(13 * weight),
    }
    
    total_flow = sum(trade_items.values())
    c1_ccy = COUNTRIES[c1].get("ccy", "USD")
    c2_ccy = COUNTRIES[c2].get("ccy", "USD")
    
    return {
        "items": trade_items,
        "total_billions": total_flow,
        "primary_flow": f"{c1} → {c2}",
        "secondary_flow": f"{c2} → {c1}",
        "c1_currency": c1_ccy,
        "c2_currency": c2_ccy,
    }

# Build trade flow database
TRADE_FLOWS: Dict[Tuple[str, str], Dict[str, Any]] = {}
for c1 in COUNTRIES:
    for c2 in COUNTRIES:
        if c1 != c2:
            weight = calculate_economic_weight(c1, c2)
            TRADE_FLOWS[(c1, c2)] = generate_trade_composition(c1, c2, weight)

FLOW_EDGES: List[Tuple[str, str, float]] = build_flow_edges()

# -----------------------------
# Optional: Windows toast notifications (safe import)
# -----------------------------
_toaster = None
try:
    from win10toast import ToastNotifier  # type: ignore
    _toaster = ToastNotifier()
except Exception:
    _toaster = None

# -----------------------------
# Thread-safe cache (NO Streamlit calls inside watcher)
# -----------------------------
@dataclass
class MarketCache:
    lock: threading.Lock = field(default_factory=threading.Lock)

    # timing controls (user-controlled)
    watch_interval: float = 1.0      # seconds (poll cadence)
    notify_interval: float = 10.0    # seconds (reminder cadence)

    # watchlists (updated from UI)
    pairs: List[str] = field(default_factory=lambda: DEFAULT_PAIRS.copy())
    symbols: List[str] = field(default_factory=lambda: DEFAULT_SYMBOLS.copy())

    # latest data
    last_poll_ts: float = 0.0
    last_notify_ts: float = 0.0
    fx: pd.DataFrame = field(default_factory=lambda: pd.DataFrame(columns=["pair", "price", "change", "pct_change", "ts"]))
    sym: pd.DataFrame = field(default_factory=lambda: pd.DataFrame(columns=["symbol", "price", "change", "pct_change", "ts"]))
    errors: List[str] = field(default_factory=list)

    # thread status
    started: bool = False

@st.cache_resource
def get_cache() -> MarketCache:
    return MarketCache()

CACHE = get_cache()

# Initialize session state for trade link selection
if "selected_trade_link" not in st.session_state:
    st.session_state.selected_trade_link = None

# -----------------------------
# Provider helpers
# -----------------------------
def safe_float(x, default=None):
    try:
        return float(x)
    except Exception:
        return default

def fetch_fx(pairs: List[str]) -> pd.DataFrame:
    """Fetch FX data from yfinance (free, live)."""
    rows = []
    for p in pairs:
        try:
            # Convert pair notation: USD/ZAR -> USDZAR=X for yfinance
            pair_clean = p.replace("/", "") + "=X"
            ticker = yf.Ticker(pair_clean)
            hist = ticker.history(period="1d")
            
            if not hist.empty:
                latest = hist.iloc[-1]
                prev = hist.iloc[-2] if len(hist) > 1 else latest
                price = float(latest['Close'])
                prev_close = float(prev['Close'])
                change = price - prev_close
                pct_change = (change / prev_close * 100) if prev_close != 0 else 0
                
                rows.append({
                    "pair": p,
                    "price": round(price, 5),
                    "change": round(change, 5),
                    "pct_change": round(pct_change, 2),
                    "ts": str(hist.index[-1]),
                })
            else:
                rows.append({
                    "pair": p,
                    "price": None,
                    "change": None,
                    "pct_change": None,
                    "ts": None,
                })
        except Exception as e:
            rows.append({
                "pair": p,
                "price": None,
                "change": None,
                "pct_change": None,
                "ts": f"Error: {str(e)[:30]}",
            })
    return pd.DataFrame(rows)

def fetch_symbols(symbols: List[str]) -> pd.DataFrame:
    """Fetch stock/ETF data from yfinance (free, live)."""
    rows = []
    for s in symbols:
        try:
            ticker = yf.Ticker(s)
            hist = ticker.history(period="1d")
            
            if not hist.empty:
                latest = hist.iloc[-1]
                prev = hist.iloc[-2] if len(hist) > 1 else latest
                price = float(latest['Close'])
                prev_close = float(prev['Close'])
                change = price - prev_close
                pct_change = (change / prev_close * 100) if prev_close != 0 else 0
                
                rows.append({
                    "symbol": s,
                    "price": round(price, 2),
                    "change": round(change, 2),
                    "pct_change": round(pct_change, 2),
                    "ts": str(hist.index[-1]),
                })
            else:
                rows.append({
                    "symbol": s,
                    "price": None,
                    "change": None,
                    "pct_change": None,
                    "ts": None,
                })
        except Exception as e:
            rows.append({
                "symbol": s,
                "price": None,
                "change": None,
                "pct_change": None,
                "ts": f"Error: {str(e)[:30]}",
            })
    return pd.DataFrame(rows)

# -----------------------------
# Background watcher (NO Streamlit calls here)
# -----------------------------
def market_watcher(cache: MarketCache):
    while True:
        start = time.time()

        # Snapshot config atomically
        with cache.lock:
            pairs = cache.pairs.copy()
            symbols = cache.symbols.copy()
            watch_interval = float(cache.watch_interval)
            notify_interval = float(cache.notify_interval)

        # Fetch data
        try:
            fx_df = fetch_fx(pairs)
            sym_df = fetch_symbols(symbols)
            with cache.lock:
                cache.fx = fx_df
                cache.sym = sym_df
                cache.last_poll_ts = time.time()
        except Exception as e:
            with cache.lock:
                cache.errors.append(f"{type(e).__name__}: {e}")
                cache.errors = cache.errors[-50:]  # keep last 50
                cache.last_poll_ts = time.time()

        # Reminder tick timestamp only (UI decides how to show it)
        now = time.time()
        with cache.lock:
            if now - cache.last_notify_ts >= notify_interval:
                cache.last_notify_ts = now

        # Maintain cadence
        elapsed = time.time() - start
        time.sleep(max(0.0, watch_interval - elapsed))

# Start watcher once
if not CACHE.started:
    CACHE.started = True
    t = threading.Thread(target=market_watcher, args=(CACHE,), daemon=True)
    t.start()

# -----------------------------
# Globe builder
# -----------------------------
def build_globe(selected_country: str, edge_scale: float = 1.0) -> go.Figure:
    lats = [COUNTRIES[c]["lat"] for c in COUNTRIES]
    lons = [COUNTRIES[c]["lon"] for c in COUNTRIES]
    names = list(COUNTRIES.keys())

    marker_sizes = [12 if n == selected_country else 5 for n in names]
    fig = go.Figure()

    fig.add_trace(go.Scattergeo(
        lat=lats,
        lon=lons,
        text=names,
        mode="markers+text",
        textposition="top center",
        marker=dict(size=marker_sizes, color="darkblue"),
        hoverinfo="text",
        name="Countries"
    ))

    def arc_points(lat1, lon1, lat2, lon2, steps=25):
        # MVP interpolation; upgrade to true great-circle later
        lats_ = [lat1 + (lat2 - lat1) * i / steps for i in range(steps + 1)]
        lons_ = [lon1 + (lon2 - lon1) * i / steps for i in range(steps + 1)]
        return lats_, lons_
    
    def get_color_for_weight(w: float) -> str:
        """Return color based on economic link strength (0=weak/blue, 2=strong/red)."""
        w_normalized = min(max(w / 2.0, 0.0), 1.0)  # Normalize to 0-1
        # Blue (weak) -> Green -> Yellow -> Orange -> Red (strong)
        if w_normalized < 0.25:
            return f"rgba(30, 144, 255, {0.1 + w_normalized})"  # Deep blue
        elif w_normalized < 0.5:
            return f"rgba(50, 205, 50, {0.2 + w_normalized})"  # Lime green
        elif w_normalized < 0.75:
            return f"rgba(255, 215, 0, {0.3 + w_normalized})"  # Gold
        else:
            return f"rgba(255, 69, 0, {0.4 + w_normalized * 0.6})"  # Orange-red

    for a, b, w in FLOW_EDGES:
        lat1, lon1 = COUNTRIES[a]["lat"], COUNTRIES[a]["lon"]
        lat2, lon2 = COUNTRIES[b]["lat"], COUNTRIES[b]["lon"]
        arc_lats, arc_lons = arc_points(lat1, lon1, lat2, lon2)

        width = max(0.5, min(4, w * edge_scale))  # Line width by weight
        color = get_color_for_weight(w)
        
        # Create rich hover text with trade info
        trade_data = TRADE_FLOWS.get((a, b))
        total_flow = trade_data['total_billions'] if trade_data else 0
        items_summary = ", ".join([f"{k}" for k in list(trade_data['items'].keys())[:2]]) if trade_data else "Various"
        
        hover_text = (
            f"<b style='font-size:16px; color:#00D9FF'>{a} → {b}</b><br>"
            f"<b>Economic Strength:</b> {w:.2f}/2.0<br>"
            f"<b>Annual Trade:</b> ${total_flow:.0f} billion<br>"
            f"<b>Main commodities:</b> {items_summary}<br>"
            f"<i style='color:#FF6B9D'>👆 Click button below to view full details</i>"
        )
        
        fig.add_trace(go.Scattergeo(
            lat=arc_lats,
            lon=arc_lons,
            mode="lines",
            line=dict(width=width, color=color),
            hoverinfo="text",
            text=hover_text,
            customdata=[[a, b]] * len(arc_lats),  # Attach country pair to each point
            showlegend=False,
            hoverlabel=dict(
                bgcolor="rgba(26, 40, 71, 0.9)",
                bordercolor="rgba(0, 217, 255, 0.5)",
                font=dict(size=12, color="#E8EAED")
            )
        ))

    fig.update_geos(
        projection_type="orthographic",
        showcountries=True,
        showcoastlines=True,
        showland=True,
    )
    fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), height=650)
    return fig

# -----------------------------
# UI
# ————————————————————————————
st.title("🌍 Global Money, Assets & Risk Map")
st.markdown("**Real-time economic flows • Live market data • Trade composition**", help="Monitor global economic interdependencies and trade flows")

with st.sidebar:
    st.header("⚙️ Settings")
    # Theme selector
    st.markdown("---")
    st.subheader("🎨 UI Theme")
    theme_choice = st.selectbox("Choose a visual theme", ["Glossy Dark (default)", "Clean Light"], index=0, key="ui_theme")
    
    st.markdown("---")
    st.subheader("📍 Geography")
    selected_country = st.selectbox("Select country", list(COUNTRIES.keys()), index=1)

    st.markdown("---")
    st.subheader("📊 Watchlists")
    pairs = st.multiselect("FX pairs", DEFAULT_PAIRS, default=DEFAULT_PAIRS)
    symbols = st.multiselect("Market symbols", DEFAULT_SYMBOLS, default=DEFAULT_SYMBOLS)

    st.markdown("---")
    st.subheader("⏱️ Refresh Rates")

    watch_interval = st.slider(
        "Market poll (seconds)",
        min_value=0.5,
        max_value=10.0,
        value=1.0,
        step=0.5,
        help="Background data fetch frequency"
    )

    ui_refresh_seconds = st.slider(
        "UI refresh (seconds)",
        min_value=1,
        max_value=60,
        value=1,
        step=1,
        help="Dashboard update frequency"
    )

    notify_interval = st.slider(
        "Reminder tick (seconds)",
        min_value=5,
        max_value=120,
        value=10,
        step=5,
        help="Alert frequency"
    )

    st.markdown("---")
    st.subheader("🔔 Notifications")
    enable_toast = st.checkbox(
        "Windows toast alerts",
        value=False,
        help="Desktop notifications (Windows only)"
    )

    st.markdown("---")
    st.caption("📡 Data: Yahoo Finance (live quotes)")

# Push settings/watchlists into the cache (main thread only)
with CACHE.lock:
    CACHE.pairs = pairs.copy()
    CACHE.symbols = symbols.copy()
    CACHE.watch_interval = float(watch_interval)
    CACHE.notify_interval = float(notify_interval)

# Apply clean/light override CSS when requested
if st.session_state.get("ui_theme", "Glossy Dark (default)") == "Clean Light":
    st.markdown("""
    <style>
        :root {
            --bg: #ffffff;
            --muted: #6b7280;
            --card: #ffffff;
            --accent: #5b6cff;
            --surface-shadow: rgba(21, 26, 40, 0.06);
        }
        .stApp {
            background: linear-gradient(180deg, #fbfcfe 0%, #f7f8fb 100%);
            color: #0f1724;
        }
        [data-testid="stSidebar"] {
            background: #ffffff !important;
            border-right: 1px solid rgba(15,23,42,0.04) !important;
            box-shadow: 0 6px 24px var(--surface-shadow) !important;
        }
        .stMarkdown, .stText, h1, h2, h3, p {
            color: #0f1724 !important;
        }
        [data-testid="metric-container"] {
            background: var(--card) !important;
            color: #0f1724 !important;
            border: 1px solid rgba(15,23,42,0.06) !important;
            box-shadow: 0 8px 24px var(--surface-shadow) !important;
            border-radius: 12px !important;
        }
        .stButton > button {
            background: var(--accent) !important;
            color: #fff !important;
            border: none !important;
            box-shadow: 0 8px 20px rgba(91,108,255,0.14) !important;
        }
        .stDataFrame, [data-testid="stDataFrame"] {
            background: #ffffff !important;
            border: 1px solid rgba(15,23,42,0.04) !important;
            box-shadow: 0 6px 18px var(--surface-shadow) !important;
            border-radius: 8px !important;
        }
        .streamlit-expanderHeader {
            background: transparent !important;
            border: none !important;
        }
        /* Center content and increase whitespace like the example */
        .st-emotion-cache-zy6yx3 {
            padding-left: 6rem !important;
            padding-right: 6rem !important;
            padding-top: 4rem !important;
            padding-bottom: 6rem !important;
            max-width: 1200px !important;
        }
    </style>
    """, unsafe_allow_html=True)

# UI auto-refresh
st_autorefresh(interval=int(ui_refresh_seconds * 1000), key="ui_autorefresh")

# Read cached data (main thread only)
with CACHE.lock:
    fx_df = CACHE.fx.copy()
    sym_df = CACHE.sym.copy()
    last_poll = CACHE.last_poll_ts
    last_notify = CACHE.last_notify_ts
    errors = CACHE.errors[-5:]

# Optional toast notification (main thread only) — trigger when tick changes
# Use session_state to avoid firing multiple times per rerun.
if "last_toast_tick" not in st.session_state:
    st.session_state["last_toast_tick"] = 0.0

if enable_toast and _toaster is not None and last_notify and last_notify != st.session_state["last_toast_tick"]:
    st.session_state["last_toast_tick"] = last_notify
    try:
        _toaster.show_toast("EconoPit", "Reminder tick: update links & logic", duration=2, threaded=True)
    except Exception:
        pass

# Status strip
st.markdown("---")
c1, c2, c3, c4 = st.columns(4)
with c1:
    st.metric("📊 Market Poll", f"{watch_interval:.1f}s", delta="Background")
with c2:
    st.metric("🔄 UI Refresh", f"{ui_refresh_seconds}s", delta="Dashboard")
with c3:
    st.metric("🔔 Tick Alert", f"{notify_interval:.0f}s", delta="Reminder")
with c4:
    st.metric("⏲️ Last Poll", "—" if last_poll == 0 else time.strftime("%H:%M:%S", time.localtime(last_poll)), delta="UTC")

if errors:
    st.warning(f"⚠️ **Recent Issues** ({len(errors)} found)\n" + "\n".join([f"• {e}" for e in errors]))

# Layout
colA, colB = st.columns([1.2, 1.0], gap="large")

with colA:
    # Create a container for hover effects
    st.markdown("""
        <style>
            .trade-line:hover {
                opacity: 1 !important;
                stroke-width: 2px !important;
            }
        </style>
    """, unsafe_allow_html=True)

    # Render globe
    globe_fig = build_globe(selected_country)
    globe_fig.update_layout(hovermode='closest', clickmode='event+select')

    # Always render the globe so it's visible even if event capture fails
    st.plotly_chart(globe_fig, use_container_width=True, key="globe_chart")

    # Use streamlit-plotly-events when available to capture hover/click
    if PLOTLY_EVENTS_AVAILABLE:
        try:
            events = plotly_events(globe_fig, click_event=True, hover_event=True, key="globe_events", override_height=650)
        except Exception:
            events = []

        # If events exist, extract latest point and update session state
        if events:
            ev = events[-1]
            pts = ev.get('points') or []
            if pts:
                pt = pts[0]
                pair = None
                cd = pt.get('customdata')
                if cd:
                    try:
                        pair = cd[0]
                    except Exception:
                        pair = cd
                else:
                    txt = pt.get('text', '')
                    if isinstance(txt, str) and '→' in txt:
                        parts = txt.split('→')
                        pair = [parts[0].strip().split('<')[0].strip(), parts[1].strip().split('<')[0].strip()]
                    elif isinstance(txt, str) and '↔' in txt:
                        parts = txt.split('↔')
                        pair = [parts[0].strip().split('<')[0].strip(), parts[1].strip().split('<')[0].strip()]

                if pair and len(pair) == 2:
                    st.session_state.selected_trade_link = (pair[0], pair[1])

    # Trade details panel
    st.markdown("---")
    st.subheader("📊 Trade Link Details")
    
    if st.session_state.selected_trade_link:
        c1, c2 = st.session_state.selected_trade_link
        trade_data = TRADE_FLOWS.get((c1, c2))
        
        if trade_data:
            # Header
            st.markdown(f"## {c1} ⟷ {c2}")
            
            col1, col2 = st.columns(2)
            with col1:
                st.metric(f"📤 From {c1}", trade_data['c1_currency'])
            with col2:
                st.metric(f"📥 To {c2}", trade_data['c2_currency'])
            
            st.markdown("### 📦 Trade Composition")
            items_df = pd.DataFrame([
                {"Commodity Type": k, "Annual Flow (Billions $)": v}
                for k, v in trade_data["items"].items()
            ])
            st.dataframe(items_df, use_container_width=True, hide_index=True)
            
            col_metric_left, col_metric_right = st.columns(2)
            with col_metric_left:
                st.metric("💰 Total Annual Flow", f"${trade_data['total_billions']:.0f}B")
            with col_metric_right:
                st.metric("📈 Primary Direction", f"{c1} → {c2}")
            
            if st.button("✕ Clear Selection", key="clear_trade"):
                st.session_state.selected_trade_link = None
                st.rerun()
    else:
        st.info(
            "**👆 Hover over globe lines to see trade details**\n\n"
            "Then use the selector below or click a popular route to view full composition.",
            icon="ℹ️"
        )
    
    # Manual selector with auto-update
    st.markdown("---")
    st.subheader("🔍 Quick Trade Explorer")
    col1, col2, col3 = st.columns([1, 1, 0.8])
    with col1:
        manual_c1 = st.selectbox("From", list(COUNTRIES.keys()), key="manual_c1", index=0)
    with col2:
        manual_c2 = st.selectbox("To", list(COUNTRIES.keys()), key="manual_c2", index=1)
    with col3:
        st.write("")  # Spacer
    
    # Auto-update on selection change
    if manual_c1 != manual_c2:
        if st.button("→ Show Trade Flow", key="search_trade", use_container_width=True):
            st.session_state.selected_trade_link = (manual_c1, manual_c2)
            st.rerun()
    else:
        st.warning("Please select different countries")
    
    # Add popular trade routes
    st.markdown("---")
    st.subheader("⭐ Popular Trade Routes")
    
    # Get top trade flows by volume
    top_trades = sorted(
        [(k, v['total_billions']) for k, v in TRADE_FLOWS.items()],
        key=lambda x: x[1],
        reverse=True
    )[:8]
    
    cols = st.columns(2)
    for idx, ((c1, c2), volume) in enumerate(top_trades):
        col = cols[idx % 2]
        with col:
            if col.button(
                f"**{c1}** → **{c2}**\n${volume:.0f}B/yr",
                key=f"quick_trade_{c1}_{c2}",
                use_container_width=True
            ):
                st.session_state.selected_trade_link = (c1, c2)
                st.rerun()

with colB:
    st.subheader(f"📍 {selected_country} dashboard")

    # A simple USD strength hint: use EUR/USD pct_change if present
    usd_strength_hint = None
    if not fx_df.empty and "pair" in fx_df.columns and "EUR/USD" in fx_df["pair"].values:
        eurusd = fx_df.loc[fx_df["pair"] == "EUR/USD", "pct_change"].iloc[0]
        if eurusd is not None and pd.notna(eurusd):
            usd_strength_hint = -float(eurusd)

    m1, m2, m3 = st.columns(3)
    m1.metric("USD strength (rough hint)", "—" if usd_strength_hint is None else f"{usd_strength_hint:.2f}%")
    m2.metric("FX pairs watched", str(len(pairs)))
    m3.metric("Symbols watched", str(len(symbols)))

    st.markdown("### FX (cached from watcher)")
    st.dataframe(fx_df, use_container_width=True, hide_index=True)

    st.markdown("### Markets (cached from watcher)")
    st.dataframe(sym_df, use_container_width=True, hide_index=True)

    # -----------------------------
    # Time-series viewer (FX per country + market symbols)
    # -----------------------------
    st.markdown("---")
    st.subheader("📈 Time Series Viewer — FX & Markets")

    @st.cache_data(ttl=60 * 60)
    def get_fx_history_for_currency(cur: str):
        """Try common yfinance tickers for a currency vs USD and return a Close series."""
        if not cur or cur.upper() == "USD":
            return None
        cur = cur.upper()
        candidates = [f"{cur}USD=X", f"USD{cur}=X"]
        for tk in candidates:
            try:
                t = yf.Ticker(tk)
                hist = t.history(period="max")
                if hist is not None and not hist.empty:
                    s = hist["Close"].rename(tk)
                    return s
            except Exception:
                continue
        return None

    @st.cache_data(ttl=60 * 60)
    def get_symbol_history(sym: str):
        try:
            t = yf.Ticker(sym)
            hist = t.history(period="max")
            if hist is not None and not hist.empty:
                return hist["Close"].rename(sym)
        except Exception:
            return None
        return None

    # Country selector for FX series
    country_for_series = st.selectbox("Country (FX series)", list(COUNTRIES.keys()), index=0, key="ts_country")
    cur_code = COUNTRIES[country_for_series].get("ccy", "USD")
    fx_series = get_fx_history_for_currency(cur_code)

    if fx_series is None and cur_code == "USD":
        st.info(f"{country_for_series} uses USD — showing flat USD=1 series")
        # create a flat series for display using recent date range
        today = pd.Timestamp.today()
        idx = pd.date_range(end=today, periods=180)
        fx_series = pd.Series(1.0, index=idx, name="USD")

    if fx_series is not None:
        start_default = fx_series.index.min().date()
        end_default = fx_series.index.max().date()
        start_date = st.date_input("Start date", value=start_default, min_value=start_default, max_value=end_default, key="fx_start")
        end_date = st.date_input("End date", value=end_default, min_value=start_default, max_value=end_default, key="fx_end")

        # Filter and plot
        mask = (fx_series.index.date >= start_date) & (fx_series.index.date <= end_date)
        plot_series = fx_series.loc[mask]
        if plot_series.empty:
            st.warning("No historical data in the selected range.")
        else:
            fig_fx = go.Figure()
            fig_fx.add_trace(go.Scatter(x=plot_series.index, y=plot_series.values, mode='lines', name=plot_series.name, line=dict(color='#00D9FF')))
            fig_fx.update_layout(title=f"{country_for_series} ({cur_code}) FX — {plot_series.name}", xaxis_title='Date', yaxis_title='Price', template='plotly_dark', height=350)
            st.plotly_chart(fig_fx, use_container_width=True)
    else:
        st.warning(f"No FX history available for currency: {cur_code}")

    # Symbol viewer
    st.markdown("---")
    st.subheader("🔎 Symbol Time Series")
    symbol_input = st.selectbox("Choose a watched symbol (or type new)", options=(symbols if symbols else DEFAULT_SYMBOLS), index=0, key="ts_symbol_select")
    custom_symbol = st.text_input("Or enter symbol", value="", key="ts_symbol_input")
    chosen_symbol = custom_symbol.strip() if custom_symbol.strip() else symbol_input
    sym_series = get_symbol_history(chosen_symbol)
    if sym_series is not None:
        s_start = sym_series.index.min().date()
        s_end = sym_series.index.max().date()
        s_start_date = st.date_input("Symbol start", value=s_start, min_value=s_start, max_value=s_end, key="sym_start")
        s_end_date = st.date_input("Symbol end", value=s_end, min_value=s_start, max_value=s_end, key="sym_end")
        s_mask = (sym_series.index.date >= s_start_date) & (sym_series.index.date <= s_end_date)
        s_plot = sym_series.loc[s_mask]
        if s_plot.empty:
            st.warning("No symbol history in the selected range.")
        else:
            fig_sym = go.Figure()
            fig_sym.add_trace(go.Scatter(x=s_plot.index, y=s_plot.values, mode='lines', name=chosen_symbol, line=dict(color='#FF6B9D')))
            fig_sym.update_layout(title=f"{chosen_symbol} — Close", xaxis_title='Date', yaxis_title='Price', template='plotly_dark', height=350)
            st.plotly_chart(fig_sym, use_container_width=True)
    else:
        st.info(f"No historical data found for symbol: {chosen_symbol}")

    st.markdown("### Interpretation (rules-based, MVP)")
    notes = []
    if usd_strength_hint is not None:
        if usd_strength_hint > 0.2:
            notes.append("USD strengthening → global USD funding tighter; EM FX often pressured.")
        elif usd_strength_hint < -0.2:
            notes.append("USD weakening → easier USD funding conditions; EM FX often supported.")
        else:
            notes.append("USD roughly stable → look to risk/commodities for direction.")

    if notes:
        st.write("• " + "\n• ".join(notes))
    else:
        st.write("Add API key + FX pair data to enable interpretation.")

# Small tick indicator in-app (safe and useful)
if last_notify:
    st.caption(f"⏱ Reminder tick last fired at {time.strftime('%H:%M:%S', time.localtime(last_notify))}")

st.info(
    "Next upgrade: compute arc thickness from BIS/IMF exposures and adjust in real-time using risk regime signals."
)
