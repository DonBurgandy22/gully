"""
Beam Analyzer - Core analysis engine for concrete beams.
"""
import numpy as np
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, field
import json


@dataclass
class BeamGeometry:
    """Beam cross-sectional geometry."""
    width: float  # b [m]
    depth: float  # h [m]
    cover: float = 0.025  # Concrete cover [m]
    length: float = 6.0  # Span length [m]
    
    @property
    def area(self) -> float:
        """Cross-sectional area."""
        return self.width * self.depth
    
    @property
    def moment_of_inertia(self) -> float:
        """Second moment of area."""
        return self.width * self.depth**3 / 12
    
    @property
    def effective_depth(self) -> float:
        """Effective depth to reinforcement."""
        return self.depth - self.cover


@dataclass
class Reinforcement:
    """Steel reinforcement configuration."""
    bars_top: List[float] = field(default_factory=list)  # Top bar diameters [mm]
    bars_bottom: List[float] = field(default_factory=list)  # Bottom bar diameters [mm]
    spacing: float = 0.15  # Bar spacing [m]
    yield_strength: float = 500  # fy [MPa]
    
    @property
    def area_top(self) -> float:
        """Total area of top reinforcement."""
        return sum(np.pi * (d/1000)**2 / 4 for d in self.bars_top)
    
    @property
    def area_bottom(self) -> float:
        """Total area of bottom reinforcement."""
        return sum(np.pi * (d/1000)**2 / 4 for d in self.bars_bottom)


@dataclass
class MaterialProperties:
    """Material properties for concrete and steel."""
    concrete_fc: float = 30  # Concrete compressive strength [MPa]
    concrete_ec: float = 30e3  # Concrete elastic modulus [MPa]
    steel_fy: float = 500  # Steel yield strength [MPa]
    steel_es: float = 200e3  # Steel elastic modulus [MPa]
    density_concrete: float = 2400  # kg/m³
    density_steel: float = 7850  # kg/m³


class BeamAnalyzer:
    """Main beam analysis and design class."""
    
    def __init__(self, geometry: BeamGeometry, materials: Optional[MaterialProperties] = None):
        self.geometry = geometry
        self.materials = materials or MaterialProperties()
        self.reinforcement = Reinforcement()
        self.loads = []
        self.results = {}
        
    def add_point_load(self, position: float, magnitude: float, load_type: str = "live"):
        """Add a point load to the beam."""
        self.loads.append({
            'type': 'point',
            'position': position,
            'magnitude': magnitude,
            'load_type': load_type
        })
        
    def add_udl(self, magnitude: float, load_type: str = "dead"):
        """Add a uniformly distributed load."""
        self.loads.append({
            'type': 'udl',
            'magnitude': magnitude,
            'load_type': load_type
        })
        
    def analyze(self) -> Dict:
        """Perform beam analysis."""
        L = self.geometry.length
        E = self.materials.concrete_ec * 1e6  # Convert to Pa
        I = self.geometry.moment_of_inertia
        
        # Calculate self-weight
        self_weight = self.geometry.area * self.materials.density_concrete * 9.81  # N/m
        self.add_udl(self_weight, "dead")
        
        # Initialize results
        max_moment = 0
        max_shear = 0
        max_deflection = 0
        
        # Simple beam analysis (simplified)
        for load in self.loads:
            if load['type'] == 'udl':
                w = load['magnitude']
                M_max = w * L**2 / 8
                V_max = w * L / 2
                delta_max = 5 * w * L**4 / (384 * E * I)
                
            elif load['type'] == 'point':
                P = load['magnitude']
                a = load['position']
                b = L - a
                
                if a <= L:
                    M_max = P * a * b / L
                    V_max = max(P * b / L, P * a / L)
                    # Simplified deflection
                    delta_max = P * a**2 * b**2 / (3 * E * I * L)
                    
            max_moment = max(max_moment, M_max)
            max_shear = max(max_shear, V_max)
            max_deflection = max(max_deflection, delta_max)
            
        # Calculate stresses
        bending_stress = max_moment * (self.geometry.depth/2) / I
        shear_stress = 1.5 * max_shear / self.geometry.area
        
        self.results = {
            'max_moment': max_moment,
            'max_shear': max_shear,
            'max_deflection': max_deflection,
            'bending_stress': bending_stress,
            'shear_stress': shear_stress,
            'loads': self.loads,
            'geometry': {
                'width': self.geometry.width,
                'depth': self.geometry.depth,
                'length': self.geometry.length,
                'area': self.geometry.area,
                'inertia': self.geometry.moment_of_inertia
            },
            'materials': {
                'concrete_fc': self.materials.concrete_fc,
                'concrete_ec': self.materials.concrete_ec,
                'steel_fy': self.materials.steel_fy
            }
        }
        
        return self.results
    
    def design_reinforcement(self) -> Dict:
        """Design required reinforcement based on analysis."""
        if not self.results:
            self.analyze()
            
        M = self.results['max_moment']
        b = self.geometry.width
        d = self.geometry.effective_depth
        f_c = self.materials.concrete_fc * 1e6  # Pa
        f_y = self.materials.steel_fy * 1e6  # Pa
        
        # Simplified reinforcement design (SANS 10100 simplified)
        # Neutral axis depth
        x = d * (1 - np.sqrt(1 - 2 * M / (0.156 * f_c * b * d**2)))
        
        # Required steel area
        A_s_req = 0.87 * f_y * x * b / f_y
        
        # Minimum reinforcement
        A_s_min = 0.0013 * b * d
        
        # Maximum reinforcement
        A_s_max = 0.04 * b * d
        
        A_s = max(A_s_req, A_s_min)
        A_s = min(A_s, A_s_max)
        
        # Suggest bar sizes
        bar_sizes = [8, 10, 12, 16, 20, 25, 32]  # mm
        bar_areas = [np.pi * (d/1000)**2 / 4 for d in bar_sizes]
        
        # Find suitable bar combination
        suggested_bars = []
        remaining_area = A_s
        
        for bar_size, bar_area in zip(reversed(bar_sizes), reversed(bar_areas)):
            if remaining_area >= bar_area:
                num_bars = int(np.ceil(remaining_area / bar_area))
                suggested_bars.extend([bar_size] * num_bars)
                remaining_area -= num_bars * bar_area
                
        # Shear reinforcement
        V = self.results['max_shear']
        v = V / (b * d)
        v_c = 0.79 * (100 * A_s / (b * d))**(1/3) * (f_c/25)**(1/3) / 1.25  # Simplified
        
        shear_reinforcement_required = v > v_c
        
        design = {
            'required_area': A_s,
            'minimum_area': A_s_min,
            'maximum_area': A_s_max,
            'suggested_bars': suggested_bars,
            'neutral_axis_depth': x,
            'shear_reinforcement_required': shear_reinforcement_required,
            'shear_stress': v,
            'concrete_shear_capacity': v_c,
            'design_moment': M
        }
        
        return design
    
    def check_deflection(self, limit_ratio: float = 250) -> Dict:
        """Check deflection against span/limit_ratio."""
        if not self.results:
            self.analyze()
            
        delta = self.results['max_deflection']
        L = self.geometry.length
        
        limit = L / limit_ratio
        ok = delta <= limit
        
        return {
            'actual_deflection': delta,
            'limit': limit,
            'ratio': delta / limit if limit > 0 else float('inf'),
            'ok': ok,
            'exceeds_limit': not ok
        }
    
    def to_json(self) -> str:
        """Export beam data to JSON."""
        data = {
            'geometry': {
                'width': self.geometry.width,
                'depth': self.geometry.depth,
                'length': self.geometry.length,
                'cover': self.geometry.cover
            },
            'materials': {
                'concrete_fc': self.materials.concrete_fc,
                'concrete_ec': self.materials.concrete_ec,
                'steel_fy': self.materials.steel_fy,
                'steel_es': self.materials.steel_es
            },
            'reinforcement': {
                'bars_top': self.reinforcement.bars_top,
                'bars_bottom': self.reinforcement.bars_bottom,
                'spacing': self.reinforcement.spacing
            },
            'loads': self.loads,
            'results': self.results
        }
        
        return json.dumps(data, indent=2, default=str)
    
    @classmethod
    def from_json(cls, json_str: str):
        """Create BeamAnalyzer from JSON."""
        data = json.loads(json_str)
        
        geometry = BeamGeometry(
            width=data['geometry']['width'],
            depth=data['geometry']['depth'],
            length=data['geometry']['length'],
            cover=data['geometry'].get('cover', 0.025)
        )
        
        materials = MaterialProperties(
            concrete_fc=data['materials']['concrete_fc'],
            concrete_ec=data['materials']['concrete_ec'],
            steel_fy=data['materials']['steel_fy'],
            steel_es=data['materials']['steel_es']
        )
        
        beam = cls(geometry, materials)
        
        if 'reinforcement' in data:
            beam.reinforcement = Reinforcement(
                bars_top=data['reinforcement']['bars_top'],
                bars_bottom=data['reinforcement']['bars_bottom'],
                spacing=data['reinforcement']['spacing']
            )
        
        if 'loads' in data:
            beam.loads = data['loads']
            
        if 'results' in data:
            beam.results = data['results']
            
        return beam