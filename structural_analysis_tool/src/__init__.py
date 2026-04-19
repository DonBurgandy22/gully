"""
Structural Analysis Tool with AI Integration
"""

__version__ = "0.1.0"
__author__ = "Burgandy AI + Daryl Mack"

from .core.beam_analyzer import BeamAnalyzer
from .ai_integration.design_assistant import AIDesignAssistant
from .materials.concrete import ConcreteGrade, ConcreteMaterialDB
from .materials.steel import SteelGrade, SteelMaterialDB
# from .loads.load_cases import LoadCase, LoadCombination  # Not implemented yet