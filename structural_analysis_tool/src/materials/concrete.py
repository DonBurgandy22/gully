"""
Concrete material properties and databases.
"""
from dataclasses import dataclass
from typing import Dict, List


@dataclass
class ConcreteGrade:
    """Concrete grade properties."""
    name: str  # e.g., "C30"
    compressive_strength: float  # f'c [MPa]
    elastic_modulus: float  # Ec [GPa]
    density: float = 2400  # kg/m³
    characteristic_strength: float = None  # fck [MPa]
    
    def __post_init__(self):
        if self.characteristic_strength is None:
            self.characteristic_strength = self.compressive_strength


class ConcreteMaterialDB:
    """Database of concrete material properties."""
    
    # SANS 10100 concrete grades
    SANS_GRADES = {
        'C20': ConcreteGrade('C20', 20, 25),
        'C25': ConcreteGrade('C25', 25, 28),
        'C30': ConcreteGrade('C30', 30, 30),
        'C35': ConcreteGrade('C35', 35, 32),
        'C40': ConcreteGrade('C40', 40, 34),
        'C45': ConcreteGrade('C45', 45, 36),
        'C50': ConcreteGrade('C50', 50, 38),
    }
    
    # Eurocode concrete grades
    EUROCODE_GRADES = {
        'C20/25': ConcreteGrade('C20/25', 20, 29),
        'C25/30': ConcreteGrade('C25/30', 25, 30.5),
        'C30/37': ConcreteGrade('C30/37', 30, 32),
        'C35/45': ConcreteGrade('C35/45', 35, 33.5),
        'C40/50': ConcreteGrade('C40/50', 40, 35),
        'C45/55': ConcreteGrade('C45/55', 45, 36),
        'C50/60': ConcreteGrade('C50/60', 50, 37),
    }
    
    # ACI concrete grades
    ACI_GRADES = {
        '3000psi': ConcreteGrade('3000psi', 20.7, 24.8),
        '4000psi': ConcreteGrade('4000psi', 27.6, 28.6),
        '5000psi': ConcreteGrade('5000psi', 34.5, 31.6),
        '6000psi': ConcreteGrade('6000psi', 41.4, 34.1),
        '8000psi': ConcreteGrade('8000psi', 55.2, 38.8),
    }
    
    @classmethod
    def get_grade(cls, name: str, code: str = 'SANS') -> ConcreteGrade:
        """Get concrete grade by name and code standard."""
        if code.upper() == 'SANS':
            return cls.SANS_GRADES.get(name)
        elif code.upper() == 'EUROCODE':
            return cls.EUROCODE_GRADES.get(name)
        elif code.upper() == 'ACI':
            return cls.ACI_GRADES.get(name)
        return None
    
    @classmethod
    def list_grades(cls, code: str = 'SANS') -> List[str]:
        """List available concrete grades for a code standard."""
        if code.upper() == 'SANS':
            return list(cls.SANS_GRADES.keys())
        elif code.upper() == 'EUROCODE':
            return list(cls.EUROCODE_GRADES.keys())
        elif code.upper() == 'ACI':
            return list(cls.ACI_GRADES.keys())
        return []
    
    @classmethod
    def suggest_grade(cls, required_strength: float, code: str = 'SANS') -> ConcreteGrade:
        """Suggest appropriate concrete grade based on required strength."""
        grades = []
        if code.upper() == 'SANS':
            grades = cls.SANS_GRADES.values()
        elif code.upper() == 'EUROCODE':
            grades = cls.EUROCODE_GRADES.values()
        elif code.upper() == 'ACI':
            grades = cls.ACI_GRADES.values()
        
        # Find grade with strength >= required, but not excessively high
        suitable = [g for g in grades if g.compressive_strength >= required_strength]
        if not suitable:
            # Use highest available grade
            return max(grades, key=lambda g: g.compressive_strength)
        
        # Return lowest suitable grade (most economical)
        return min(suitable, key=lambda g: g.compressive_strength)


def calculate_elastic_modulus(fc: float) -> float:
    """
    Calculate elastic modulus of concrete based on compressive strength.
    E_c = 4700 * sqrt(f'c) [MPa] - ACI formula
    """
    return 4700 * (fc ** 0.5)


def calculate_tensile_strength(fc: float) -> float:
    """
    Calculate tensile strength of concrete.
    f_t = 0.33 * sqrt(f'c) [MPa] - Simplified
    """
    return 0.33 * (fc ** 0.5)


def calculate_creep_coefficient(fc: float, age_at_loading: float = 28, 
                               relative_humidity: float = 70) -> float:
    """
    Calculate creep coefficient for concrete.
    Simplified estimation.
    """
    # Base creep coefficient
    phi_base = 2.0
    
    # Adjustments
    age_factor = 1.0 / (0.1 + age_at_loading ** 0.2)
    humidity_factor = 1 + (100 - relative_humidity) / 100
    
    return phi_base * age_factor * humidity_factor


class ConcreteMixDesign:
    """Concrete mix design parameters."""
    
    def __init__(self, grade: str, code: str = 'SANS'):
        self.grade = ConcreteMaterialDB.get_grade(grade, code)
        self.water_cement_ratio = self._calculate_wc_ratio()
        self.aggregate_cement_ratio = self._calculate_ac_ratio()
        
    def _calculate_wc_ratio(self) -> float:
        """Calculate water-cement ratio based on strength."""
        if self.grade.compressive_strength <= 25:
            return 0.65
        elif self.grade.compressive_strength <= 35:
            return 0.55
        elif self.grade.compressive_strength <= 45:
            return 0.45
        else:
            return 0.40
    
    def _calculate_ac_ratio(self) -> float:
        """Calculate aggregate-cement ratio."""
        if self.grade.compressive_strength <= 25:
            return 6.0
        elif self.grade.compressive_strength <= 35:
            return 5.0
        elif self.grade.compressive_strength <= 45:
            return 4.0
        else:
            return 3.5
    
    def get_mix_proportions(self, volume: float = 1.0) -> Dict:
        """
        Get mix proportions for given volume (m³).
        Returns quantities in kg.
        """
        # Assume cement density = 1440 kg/m³
        # Assume aggregate density = 1600 kg/m³
        
        wc = self.water_cement_ratio
        ac = self.aggregate_cement_ratio
        
        # Solve for cement content
        # Total volume = cement/1440 + water/1000 + aggregate/1600
        # water = wc * cement
        # aggregate = ac * cement
        
        # Simplified: cement content ~ 300-400 kg/m³
        cement = 350  # kg/m³ (typical)
        water = cement * wc
        aggregate = cement * ac
        
        # Scale to requested volume
        cement *= volume
        water *= volume
        aggregate *= volume
        
        return {
            'cement_kg': cement,
            'water_kg': water,
            'aggregate_kg': aggregate,
            'water_cement_ratio': wc,
            'aggregate_cement_ratio': ac,
            'volume_m3': volume
        }