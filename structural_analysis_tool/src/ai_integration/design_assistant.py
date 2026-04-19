"""
AI Design Assistant - Burgandy AI integration for structural design.
"""
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from ..core.beam_analyzer import BeamAnalyzer, BeamGeometry, MaterialProperties


@dataclass
class DesignRecommendation:
    """AI design recommendation."""
    issue: str
    recommendation: str
    priority: str  # "high", "medium", "low"
    code_reference: Optional[str] = None
    calculation: Optional[Dict] = None


class AIDesignAssistant:
    """AI assistant for structural design optimization and code compliance."""
    
    def __init__(self):
        self.recommendations = []
        self.analysis_history = []
        
    def analyze_beam(self, beam: BeamAnalyzer) -> Dict[str, Any]:
        """Perform comprehensive beam analysis with AI insights."""
        # Run standard analysis
        results = beam.analyze()
        design = beam.design_reinforcement()
        deflection = beam.check_deflection()
        
        # Generate AI recommendations
        self.recommendations = self._generate_recommendations(beam, results, design, deflection)
        
        # Store in history
        analysis_entry = {
            'beam_data': beam.to_json(),
            'results': results,
            'design': design,
            'deflection': deflection,
            'recommendations': [r.__dict__ for r in self.recommendations]
        }
        self.analysis_history.append(analysis_entry)
        
        return {
            'analysis': results,
            'design': design,
            'deflection': deflection,
            'recommendations': self.recommendations,
            'summary': self._generate_summary(beam, results, design, deflection)
        }
    
    def _generate_recommendations(self, beam: BeamAnalyzer, results: Dict, 
                                 design: Dict, deflection: Dict) -> List[DesignRecommendation]:
        """Generate AI design recommendations."""
        recommendations = []
        
        # Check deflection
        if deflection.get('exceeds_limit', False):
            recommendations.append(DesignRecommendation(
                issue="Deflection exceeds allowable limit",
                recommendation=f"Increase beam depth from {beam.geometry.depth:.3f}m to {beam.geometry.depth * 1.2:.3f}m or use higher strength concrete",
                priority="high",
                code_reference="SANS 10100: Deflection limits",
                calculation={
                    'actual': deflection['actual_deflection'],
                    'limit': deflection['limit'],
                    'ratio': deflection['ratio']
                }
            ))
        
        # Check reinforcement
        required_area = design.get('required_area', 0)
        min_area = design.get('minimum_area', 0)
        max_area = design.get('maximum_area', float('inf'))
        
        if required_area < min_area:
            recommendations.append(DesignRecommendation(
                issue="Reinforcement area below minimum requirement",
                recommendation=f"Provide minimum reinforcement of {min_area*1e6:.0f} mm² (currently {required_area*1e6:.0f} mm²)",
                priority="high",
                code_reference="SANS 10100-1: Minimum reinforcement"
            ))
        elif required_area > max_area * 0.9:  # Close to maximum
            recommendations.append(DesignRecommendation(
                issue="Reinforcement approaching maximum limit",
                recommendation="Consider increasing beam dimensions or using higher strength materials",
                priority="medium",
                code_reference="SANS 10100-1: Maximum reinforcement"
            ))
        
        # Check shear
        if design.get('shear_reinforcement_required', False):
            recommendations.append(DesignRecommendation(
                issue="Shear reinforcement required",
                recommendation="Provide shear links (stirrups) at appropriate spacing",
                priority="high",
                code_reference="SANS 10100-1: Shear design"
            ))
        
        # Check aspect ratio
        aspect_ratio = beam.geometry.depth / beam.geometry.width
        if aspect_ratio > 4:
            recommendations.append(DesignRecommendation(
                issue="Beam aspect ratio too high",
                recommendation=f"Consider increasing width from {beam.geometry.width:.3f}m to improve stability",
                priority="medium"
            ))
        elif aspect_ratio < 1.5:
            recommendations.append(DesignRecommendation(
                issue="Beam aspect ratio too low",
                recommendation=f"Consider increasing depth from {beam.geometry.depth:.3f}m for better bending resistance",
                priority="medium"
            ))
        
        # Material optimization
        stress_ratio = results.get('bending_stress', 0) / (beam.materials.concrete_fc * 1e6)
        if stress_ratio > 0.8:
            recommendations.append(DesignRecommendation(
                issue="High stress utilization",
                recommendation=f"Consider increasing concrete strength from {beam.materials.concrete_fc} MPa or increasing dimensions",
                priority="medium"
            ))
        
        return recommendations
    
    def _generate_summary(self, beam: BeamAnalyzer, results: Dict, 
                         design: Dict, deflection: Dict) -> Dict:
        """Generate AI summary of the design."""
        safety_factor = 1.0
        if results.get('bending_stress', 0) > 0:
            capacity = beam.materials.concrete_fc * 1e6 * 0.45  # Simplified capacity
            demand = results.get('bending_stress', 0)
            safety_factor = capacity / demand if demand > 0 else float('inf')
        
        return {
            'design_status': 'OK' if not deflection.get('exceeds_limit', False) and 
                                 design.get('required_area', 0) >= design.get('minimum_area', 0) else 'NEEDS REVISION',
            'safety_factor': safety_factor,
            'efficiency': min(1.0, safety_factor),  # Lower is more efficient
            'cost_estimate': self._estimate_cost(beam, design),
            'key_issues': len([r for r in self.recommendations if r.priority == 'high']),
            'optimization_opportunities': len([r for r in self.recommendations if r.priority == 'medium'])
        }
    
    def _estimate_cost(self, beam: BeamAnalyzer, design: Dict) -> Dict:
        """Estimate material costs."""
        # Simplified cost estimation (South African context)
        concrete_volume = beam.geometry.area * beam.geometry.length
        steel_weight = design.get('required_area', 0) * beam.geometry.length * 7850  # kg
        
        # Approximate costs (ZAR)
        concrete_cost = concrete_volume * 2500  # ZAR/m³
        steel_cost = steel_weight * 25  # ZAR/kg
        formwork_cost = beam.geometry.length * beam.geometry.depth * 2 * 500  # ZAR/m²
        
        total = concrete_cost + steel_cost + formwork_cost
        
        return {
            'concrete': concrete_cost,
            'steel': steel_cost,
            'formwork': formwork_cost,
            'total': total,
            'per_meter': total / beam.geometry.length if beam.geometry.length > 0 else 0
        }
    
    def optimize_beam(self, beam: BeamAnalyzer, 
                     constraints: Optional[Dict] = None) -> BeamAnalyzer:
        """Optimize beam design based on constraints."""
        constraints = constraints or {
            'max_deflection_ratio': 250,
            'min_safety_factor': 1.5,
            'max_cost_per_meter': 5000,  # ZAR/m
            'preferred_bar_sizes': [12, 16, 20]  # mm
        }
        
        # Current analysis
        current = self.analyze_beam(beam)
        
        # Try optimization strategies
        optimized_beam = beam
        
        # If deflection is critical, increase depth
        if current['deflection'].get('exceeds_limit', False):
            new_depth = beam.geometry.depth * 1.2
            new_geometry = BeamGeometry(
                width=beam.geometry.width,
                depth=new_depth,
                length=beam.geometry.length,
                cover=beam.geometry.cover
            )
            optimized_beam = BeamAnalyzer(new_geometry, beam.materials)
            optimized_beam.loads = beam.loads.copy()
        
        # If reinforcement is excessive, optimize bar sizes
        design = current['design']
        if design.get('required_area', 0) > 0:
            # Try to use preferred bar sizes
            suggested_bars = design.get('suggested_bars', [])
            if suggested_bars:
                # Filter to preferred sizes
                preferred = [b for b in suggested_bars if b in constraints.get('preferred_bar_sizes', [])]
                if preferred:
                    optimized_beam.reinforcement.bars_bottom = preferred
        
        return optimized_beam
    
    def generate_report(self, beam: BeamAnalyzer, analysis_results: Dict) -> str:
        """Generate comprehensive design report."""
        report = []
        report.append("=" * 60)
        report.append("STRUCTURAL BEAM DESIGN REPORT")
        report.append("=" * 60)
        report.append("")
        report.append("1. BEAM GEOMETRY")
        report.append(f"   Length: {beam.geometry.length:.2f} m")
        report.append(f"   Width: {beam.geometry.width:.3f} m")
        report.append(f"   Depth: {beam.geometry.depth:.3f} m")
        report.append(f"   Cover: {beam.geometry.cover:.3f} m")
        report.append("")
        
        report.append("2. MATERIAL PROPERTIES")
        report.append(f"   Concrete f'c: {beam.materials.concrete_fc} MPa")
        report.append(f"   Steel f_y: {beam.materials.steel_fy} MPa")
        report.append("")
        
        report.append("3. ANALYSIS RESULTS")
        results = analysis_results.get('analysis', {})
        report.append(f"   Maximum Moment: {results.get('max_moment', 0):.1f} kNm")
        report.append(f"   Maximum Shear: {results.get('max_shear', 0):.1f} kN")
        report.append(f"   Maximum Deflection: {results.get('max_deflection', 0)*1000:.1f} mm")
        report.append("")
        
        report.append("4. REINFORCEMENT DESIGN")
        design = analysis_results.get('design', {})
        report.append(f"   Required Area: {design.get('required_area', 0)*1e6:.0f} mm²")
        report.append(f"   Minimum Area: {design.get('minimum_area', 0)*1e6:.0f} mm²")
        report.append(f"   Suggested Bars: {design.get('suggested_bars', [])} mm")
        report.append("")
        
        report.append("5. AI RECOMMENDATIONS")
        for i, rec in enumerate(analysis_results.get('recommendations', []), 1):
            report.append(f"   {i}. [{rec.priority.upper()}] {rec.issue}")
            report.append(f"      -> {rec.recommendation}")
            if rec.code_reference:
                report.append(f"      Code: {rec.code_reference}")
        report.append("")
        
        report.append("6. DESIGN SUMMARY")
        summary = analysis_results.get('summary', {})
        report.append(f"   Status: {summary.get('design_status', 'UNKNOWN')}")
        report.append(f"   Safety Factor: {summary.get('safety_factor', 0):.2f}")
        report.append(f"   Cost Estimate: ZAR {summary.get('cost_estimate', {}).get('total', 0):,.0f}")
        report.append("")
        
        report.append("=" * 60)
        report.append("Report generated by Burgandy AI Structural Assistant")
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def export_to_json(self, beam: BeamAnalyzer, analysis_results: Dict) -> str:
        """Export complete analysis to JSON."""
        # Convert DesignRecommendation objects to dicts
        analysis_results_copy = analysis_results.copy()
        if 'recommendations' in analysis_results_copy:
            analysis_results_copy['recommendations'] = [
                r.__dict__ for r in analysis_results_copy['recommendations']
            ]
        
        data = {
            'beam': json.loads(beam.to_json()),
            'analysis': analysis_results_copy,
            'timestamp': '2026-04-17T12:15:00Z',
            'version': '1.0',
            'generated_by': 'Burgandy AI Structural Assistant'
        }
        return json.dumps(data, indent=2, default=str)