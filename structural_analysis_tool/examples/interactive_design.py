"""
Interactive beam design with AI assistance.
"""
import sys
import os
import json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.core.beam_analyzer import BeamAnalyzer, BeamGeometry, MaterialProperties
from src.ai_integration.design_assistant import AIDesignAssistant
from src.materials.concrete import ConcreteMaterialDB
from src.materials.steel import SteelMaterialDB


class InteractiveDesigner:
    """Interactive beam designer with AI assistance."""
    
    def __init__(self):
        self.ai = AIDesignAssistant()
        self.beam = None
        self.results = None
        
    def run(self):
        """Run interactive design session."""
        print("=" * 60)
        print("INTERACTIVE BEAM DESIGN WITH BURGANDY AI")
        print("=" * 60)
        print()
        
        while True:
            print("\nMAIN MENU")
            print("1. Create new beam")
            print("2. Analyze current beam")
            print("3. Optimize design")
            print("4. View recommendations")
            print("5. Export analysis")
            print("6. Load from JSON")
            print("7. Exit")
            
            choice = input("\nEnter choice (1-7): ").strip()
            
            if choice == "1":
                self.create_beam()
            elif choice == "2":
                self.analyze_beam()
            elif choice == "3":
                self.optimize_design()
            elif choice == "4":
                self.view_recommendations()
            elif choice == "5":
                self.export_analysis()
            elif choice == "6":
                self.load_from_json()
            elif choice == "7":
                print("\nExiting. Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.")
    
    def create_beam(self):
        """Create a new beam interactively."""
        print("\n--- CREATE NEW BEAM ---")
        
        # Get geometry
        print("\nBeam Geometry:")
        length = float(input("  Span length (m) [6.0]: ") or "6.0")
        width = float(input("  Width (m) [0.3]: ") or "0.3")
        depth = float(input("  Depth (m) [0.5]: ") or "0.5")
        cover = float(input("  Concrete cover (m) [0.025]: ") or "0.025")
        
        geometry = BeamGeometry(width, depth, length, cover)
        
        # Get materials
        print("\nMaterial Properties:")
        
        # Concrete
        print("  Available concrete grades:")
        concrete_grades = ConcreteMaterialDB.list_grades('SANS')
        for i, grade in enumerate(concrete_grades, 1):
            print(f"    {i}. {grade}")
        
        concrete_choice = input(f"  Select concrete grade (1-{len(concrete_grades)}) [3]: ") or "3"
        concrete_grade = concrete_grades[int(concrete_choice) - 1]
        concrete = ConcreteMaterialDB.get_grade(concrete_grade, 'SANS')
        
        # Steel
        print("\n  Available steel grades:")
        steel_grades = SteelMaterialDB.list_grades('SANS')
        for i, grade in enumerate(steel_grades, 1):
            print(f"    {i}. {grade}")
        
        steel_choice = input(f"  Select steel grade (1-{len(steel_grades)}) [3]: ") or "3"
        steel_grade = steel_grades[int(steel_choice) - 1]
        steel = SteelMaterialDB.get_grade(steel_grade, 'SANS')
        
        materials = MaterialProperties(
            concrete_fc=concrete.compressive_strength,
            concrete_ec=concrete.elastic_modulus,
            steel_fy=steel.yield_strength
        )
        
        # Create beam
        self.beam = BeamAnalyzer(geometry, materials)
        
        # Add loads
        print("\nLoad Definition:")
        print("  1. Self-weight (automatically included)")
        
        add_udl = input("  Add uniformly distributed load? (y/n) [n]: ").lower() == 'y'
        if add_udl:
            udl_magnitude = float(input("    UDL magnitude (kN/m): "))
            udl_type = input("    Load type (dead/live) [live]: ") or "live"
            self.beam.add_udl(udl_magnitude, udl_type)
        
        add_point = input("  Add point load? (y/n) [n]: ").lower() == 'y'
        if add_point:
            point_magnitude = float(input("    Point load magnitude (kN): "))
            point_position = float(input("    Position from left support (m): "))
            point_type = input("    Load type (dead/live) [live]: ") or "live"
            self.beam.add_point_load(point_position, point_magnitude, point_type)
        
        print(f"\nBeam created successfully!")
        print(f"  Dimensions: {width}m x {depth}m x {length}m")
        print(f"  Materials: {concrete_grade} concrete, {steel_grade} steel")
    
    def analyze_beam(self):
        """Analyze the current beam."""
        if not self.beam:
            print("No beam defined. Please create a beam first.")
            return
        
        print("\n--- ANALYZING BEAM ---")
        self.results = self.ai.analyze_beam(self.beam)
        
        # Display key results
        analysis = self.results['analysis']
        design = self.results['design']
        deflection = self.results['deflection']
        summary = self.results['summary']
        
        print("\nKEY RESULTS:")
        print(f"  Maximum Moment: {analysis['max_moment']:.1f} kNm")
        print(f"  Maximum Shear: {analysis['max_shear']:.1f} kN")
        print(f"  Deflection: {analysis['max_deflection']*1000:.1f} mm")
        print(f"    Allowable: {deflection['limit']*1000:.1f} mm")
        print(f"    Status: {'OK' if deflection['ok'] else 'EXCEEDS LIMIT'}")
        print(f"  Required Reinforcement: {design['required_area']*1e6:.0f} mm²")
        print(f"  Suggested Bars: {design['suggested_bars']} mm")
        print(f"  Design Status: {summary['design_status']}")
        print(f"  Safety Factor: {summary['safety_factor']:.2f}")
        
        # Show high priority recommendations
        high_recs = [r for r in self.results['recommendations'] if r.priority == 'high']
        if high_recs:
            print("\nHIGH PRIORITY RECOMMENDATIONS:")
            for rec in high_recs:
                print(f"  • {rec.issue}")
                print(f"    → {rec.recommendation}")
    
    def optimize_design(self):
        """Optimize the beam design."""
        if not self.beam or not self.results:
            print("Please analyze a beam first.")
            return
        
        print("\n--- OPTIMIZING DESIGN ---")
        
        # Get optimization constraints
        print("\nOptimization Constraints:")
        max_deflection_ratio = float(input("  Maximum deflection ratio (L/?) [250]: ") or "250")
        min_safety = float(input("  Minimum safety factor [1.5]: ") or "1.5")
        max_cost = float(input("  Maximum cost per meter (ZAR) [5000]: ") or "5000")
        
        constraints = {
            'max_deflection_ratio': max_deflection_ratio,
            'min_safety_factor': min_safety,
            'max_cost_per_meter': max_cost
        }
        
        # Optimize
        optimized = self.ai.optimize_beam(self.beam, constraints)
        optimized_results = self.ai.analyze_beam(optimized)
        
        # Compare
        print("\nOPTIMIZATION RESULTS:")
        print(f"  Original depth: {self.beam.geometry.depth:.3f} m")
        print(f"  Optimized depth: {optimized.geometry.depth:.3f} m")
        
        orig_cost = self.results['summary']['cost_estimate']['per_meter']
        opt_cost = optimized_results['summary']['cost_estimate']['per_meter']
        print(f"  Original cost: ZAR {orig_cost:,.0f}/m")
        print(f"  Optimized cost: ZAR {opt_cost:,.0f}/m")
        
        savings = ((orig_cost - opt_cost) / orig_cost * 100) if orig_cost > 0 else 0
        print(f"  Potential savings: {savings:.1f}%")
        
        # Ask if user wants to adopt optimized design
        adopt = input("\nAdopt optimized design? (y/n) [n]: ").lower() == 'y'
        if adopt:
            self.beam = optimized
            self.results = optimized_results
            print("Optimized design adopted.")
    
    def view_recommendations(self):
        """View all AI recommendations."""
        if not self.results:
            print("Please analyze a beam first.")
            return
        
        print("\n--- AI RECOMMENDATIONS ---")
        
        for priority in ['high', 'medium', 'low']:
            recs = [r for r in self.results['recommendations'] if r.priority == priority]
            if recs:
                print(f"\n{priority.upper()} PRIORITY:")
                for i, rec in enumerate(recs, 1):
                    print(f"  {i}. {rec.issue}")
                    print(f"     Recommendation: {rec.recommendation}")
                    if rec.code_reference:
                        print(f"     Code: {rec.code_reference}")
                    if rec.calculation:
                        print(f"     Calculation: {rec.calculation}")
    
    def export_analysis(self):
        """Export analysis to JSON file."""
        if not self.results:
            print("Please analyze a beam first.")
            return
        
        filename = input("\nEnter filename [beam_analysis.json]: ") or "beam_analysis.json"
        
        json_output = self.ai.export_to_json(self.beam, self.results)
        
        with open(filename, 'w') as f:
            f.write(json_output)
        
        print(f"Analysis exported to {filename}")
        
        # Also generate text report
        report = self.ai.generate_report(self.beam, self.results)
        report_file = filename.replace('.json', '_report.txt')
        with open(report_file, 'w') as f:
            f.write(report)
        
        print(f"Text report saved to {report_file}")
    
    def load_from_json(self):
        """Load beam from JSON file."""
        filename = input("\nEnter JSON filename: ").strip()
        
        if not os.path.exists(filename):
            print(f"File {filename} not found.")
            return
        
        try:
            with open(filename, 'r') as f:
                data = json.load(f)
            
            # Extract beam data
            if 'beam' in data:
                beam_data = json.dumps(data['beam'])
                self.beam = BeamAnalyzer.from_json(beam_data)
                
                # Extract results if available
                if 'analysis' in data:
                    self.results = data
                    print(f"Loaded beam and analysis from {filename}")
                else:
                    self.results = None
                    print(f"Loaded beam from {filename}. Please run analysis.")
            else:
                print("Invalid JSON format: 'beam' data not found.")
                
        except Exception as e:
            print(f"Error loading file: {e}")


def main():
    """Main function."""
    designer = InteractiveDesigner()
    designer.run()


if __name__ == "__main__":
    main()