"""
Steel reinforcement material properties and databases.
"""
from dataclasses import dataclass
from typing import Dict, List, Tuple
import math


@dataclass
class SteelGrade:
    """Steel reinforcement grade properties."""
    name: str  # e.g., "500Y"
    yield_strength: float  # fy [MPa]
    ultimate_strength: float  # fu [MPa]
    elastic_modulus: float = 200000  # Es [MPa]
    density: float = 7850  # kg/m³
    elongation: float = 10.0  # Minimum elongation [%]
    
    @property
    def yield_strain(self) -> float:
        """Yield strain."""
        return self.yield_strength / self.elastic_modulus


class SteelMaterialDB:
    """Database of steel reinforcement properties."""
    
    # SANS 10100 steel grades
    SANS_GRADES = {
        '250R': SteelGrade('250R', 250, 410),  # Mild steel
        '450R': SteelGrade('450R', 450, 530),  # High yield
        '500Y': SteelGrade('500Y', 500, 550),  # High yield deformed
    }
    
    # Eurocode steel grades
    EUROCODE_GRADES = {
        'B500A': SteelGrade('B500A', 500, 550),
        'B500B': SteelGrade('B500B', 500, 550),
        'B500C': SteelGrade('B500C', 500, 550),
    }
    
    # ACI steel grades
    ACI_GRADES = {
        'Grade40': SteelGrade('Grade40', 276, 414),  # 40 ksi
        'Grade60': SteelGrade('Grade60', 414, 621),  # 60 ksi
        'Grade75': SteelGrade('Grade75', 517, 690),  # 75 ksi
    }
    
    @classmethod
    def get_grade(cls, name: str, code: str = 'SANS') -> SteelGrade:
        """Get steel grade by name and code standard."""
        if code.upper() == 'SANS':
            return cls.SANS_GRADES.get(name)
        elif code.upper() == 'EUROCODE':
            return cls.EUROCODE_GRADES.get(name)
        elif code.upper() == 'ACI':
            return cls.ACI_GRADES.get(name)
        return None
    
    @classmethod
    def list_grades(cls, code: str = 'SANS') -> List[str]:
        """List available steel grades for a code standard."""
        if code.upper() == 'SANS':
            return list(cls.SANS_GRADES.keys())
        elif code.upper() == 'EUROCODE':
            return list(cls.EUROCODE_GRADES.keys())
        elif code.upper() == 'ACI':
            return list(cls.ACI_GRADES.keys())
        return []


class ReinforcementBar:
    """Individual reinforcement bar."""
    
    # Standard bar sizes (mm)
    STANDARD_SIZES = [6, 8, 10, 12, 16, 20, 25, 32, 40]
    
    def __init__(self, diameter: float, grade: str = '500Y', code: str = 'SANS'):
        self.diameter = diameter  # mm
        self.grade = SteelMaterialDB.get_grade(grade, code)
        self.area = self.calculate_area()
        self.weight_per_meter = self.calculate_weight()
        
    def calculate_area(self) -> float:
        """Calculate cross-sectional area in mm²."""
        return math.pi * (self.diameter ** 2) / 4
    
    def calculate_weight(self) -> float:
        """Calculate weight per meter in kg/m."""
        return self.area * 1e-6 * self.grade.density
    
    def get_yield_force(self) -> float:
        """Calculate yield force in kN."""
        return self.area * self.grade.yield_strength * 1e-3
    
    def __repr__(self) -> str:
        return f"ReinforcementBar({self.diameter}mm {self.grade.name})"


class ReinforcementLayout:
    """Layout of reinforcement bars in a section."""
    
    def __init__(self):
        self.bars = []  # List of (bar, position, layer)
        self.spacing = 0.15  # Default spacing [m]
        self.cover = 0.025  # Default cover [m]
        
    def add_bar(self, bar: ReinforcementBar, position: float, layer: int = 1):
        """Add a bar at specified position from bottom."""
        self.bars.append({
            'bar': bar,
            'position': position,
            'layer': layer
        })
    
    def add_bars_symmetrical(self, bar: ReinforcementBar, num_bars: int, 
                            total_width: float, layer: int = 1):
        """Add bars symmetrically across width."""
        if num_bars == 1:
            self.add_bar(bar, total_width / 2, layer)
        else:
            spacing = total_width / (num_bars - 1)
            for i in range(num_bars):
                pos = i * spacing
                self.add_bar(bar, pos, layer)
    
    def calculate_total_area(self) -> float:
        """Calculate total reinforcement area in mm²."""
        return sum(bar['bar'].area for bar in self.bars)
    
    def calculate_centroid(self) -> float:
        """Calculate centroid of reinforcement from bottom."""
        if not self.bars:
            return 0
        
        total_area = self.calculate_total_area()
        if total_area == 0:
            return 0
        
        moment = sum(bar['bar'].area * bar['position'] for bar in self.bars)
        return moment / total_area
    
    def get_effective_depth(self, total_depth: float) -> float:
        """
        Calculate effective depth.
        d = total_depth - cover - bar_diameter/2 - distance to centroid
        """
        centroid = self.calculate_centroid()
        max_bar_diameter = max(bar['bar'].diameter for bar in self.bars) if self.bars else 0
        
        return total_depth - self.cover - (max_bar_diameter / 2000) - centroid
    
    def to_dict(self) -> Dict:
        """Convert layout to dictionary."""
        return {
            'bars': [
                {
                    'diameter': bar['bar'].diameter,
                    'grade': bar['bar'].grade.name,
                    'position': bar['position'],
                    'layer': bar['layer']
                }
                for bar in self.bars
            ],
            'spacing': self.spacing,
            'cover': self.cover,
            'total_area': self.calculate_total_area(),
            'centroid': self.calculate_centroid()
        }


def calculate_development_length(bar_diameter: float, concrete_strength: float,
                               steel_yield: float, bar_type: str = 'deformed',
                               cover_conditions: str = 'good') -> float:
    """
    Calculate development length for reinforcement bars.
    Simplified formula based on SANS 10100.
    
    Args:
        bar_diameter: Bar diameter [mm]
        concrete_strength: f'c [MPa]
        steel_yield: fy [MPa]
        bar_type: 'plain' or 'deformed'
        cover_conditions: 'good', 'poor', or 'very_poor'
    
    Returns:
        Development length [mm]
    """
    # Basic development length
    if bar_type == 'deformed':
        basic_length = 0.145 * steel_yield * bar_diameter / (concrete_strength ** 0.5)
    else:  # plain bars
        basic_length = 0.27 * steel_yield * bar_diameter / (concrete_strength ** 0.5)
    
    # Adjustment factors
    factors = {
        'good': 1.0,
        'poor': 1.4,
        'very_poor': 2.0
    }
    
    factor = factors.get(cover_conditions, 1.0)
    
    return basic_length * factor


def calculate_lap_length(bar_diameter: float, concrete_strength: float,
                        steel_yield: float, lap_type: str = 'tension',
                        bar_type: str = 'deformed') -> float:
    """
    Calculate lap length for reinforcement bars.
    
    Args:
        lap_type: 'tension' or 'compression'
    
    Returns:
        Lap length [mm]
    """
    dev_length = calculate_development_length(bar_diameter, concrete_strength,
                                             steel_yield, bar_type)
    
    if lap_type == 'tension':
        return 1.0 * dev_length  # Class A lap
    else:  # compression
        return 0.7 * dev_length


def calculate_bar_spacing(bar_diameter: float, concrete_strength: float,
                         aggregate_size: float = 20) -> Dict[str, float]:
    """
    Calculate minimum and maximum bar spacing.
    
    Returns:
        Dictionary with min and max spacing [mm]
    """
    # Minimum spacing (SANS 10100)
    min_spacing = max(
        bar_diameter,
        aggregate_size + 5,
        20  # mm
    )
    
    # Maximum spacing for crack control
    max_spacing_tension = min(
        300,  # mm
        3 * bar_diameter
    )
    
    max_spacing_compression = min(
        300,  # mm
        12 * bar_diameter
    )
    
    return {
        'min_spacing': min_spacing,
        'max_spacing_tension': max_spacing_tension,
        'max_spacing_compression': max_spacing_compression
    }


class ReinforcementSchedule:
    """Reinforcement bar bending schedule."""
    
    def __init__(self):
        self.items = []
        
    def add_item(self, bar: ReinforcementBar, length: float, quantity: int,
                shape: str = 'straight', bending_details: Dict = None):
        """Add a bar to the schedule."""
        self.items.append({
            'bar': bar,
            'length': length,
            'quantity': quantity,
            'shape': shape,
            'bending_details': bending_details or {},
            'weight': bar.weight_per_meter * length * quantity
        })
    
    def calculate_total_weight(self) -> float:
        """Calculate total weight of reinforcement in kg."""
        return sum(item['weight'] for item in self.items)
    
    def generate_schedule(self) -> List[Dict]:
        """Generate bending schedule."""
        schedule = []
        for i, item in enumerate(self.items, 1):
            schedule.append({
                'mark': f"B{i:02d}",
                'diameter': item['bar'].diameter,
                'grade': item['bar'].grade.name,
                'length': item['length'],
                'quantity': item['quantity'],
                'shape': item['shape'],
                'weight_each': item['bar'].weight_per_meter * item['length'],
                'weight_total': item['weight'],
                'bending_details': item['bending_details']
            })
        return schedule
    
    def estimate_cost(self, rate_per_kg: float = 25.0) -> Dict:
        """Estimate reinforcement cost."""
        total_weight = self.calculate_total_weight()
        return {
            'total_weight_kg': total_weight,
            'rate_per_kg': rate_per_kg,
            'material_cost': total_weight * rate_per_kg,
            'fabrication_cost': total_weight * rate_per_kg * 0.3,  # 30% for fabrication
            'total_cost': total_weight * rate_per_kg * 1.3
        }