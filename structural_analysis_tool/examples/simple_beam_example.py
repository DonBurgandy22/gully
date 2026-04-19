"""
Simple beam analysis example with AI integration.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.core.beam_analyzer import BeamAnalyzer, BeamGeometry, MaterialProperties
from src.ai_integration.design_assistant import AIDesignAssistant


def main():
    print("=" * 60)
    print("STRUCTURAL BEAM ANALYSIS WITH AI INTEGRATION")
    print("=" * 60)
    print()
    
    # 1. Create beam geometry
    print("1. Creating beam geometry...")
    geometry = BeamGeometry(
        width=0.3,    # 300mm
        depth=0.5,    # 500mm
        length=6.0,   # 6m span
        cover=0.025   # 25mm cover
    )
    
    # 2. Define material properties
    print("2. Defining material properties...")
    materials = MaterialProperties(
        concrete_fc=30,   # C30 concrete
        steel_fy=500      # 500Y steel
    )
    
    # 3. Create beam analyzer
    print("3. Creating beam analyzer...")
    beam = BeamAnalyzer(geometry, materials)
    
    # 4. Apply loads
    print("4. Applying loads...")
    # Self-weight is automatically added
    beam.add_udl(5.0, "live")  # 5 kN/m live load
    beam.add_point_load(3.0, 20.0, "live")  # 20 kN point load at 3m
    
    # 5. Create AI design assistant
    print("5. Initializing AI design assistant...")
    ai = AIDesignAssistant()
    
    # 6. Perform analysis with AI insights
    print("6. Performing analysis with AI insights...")
    print("-" * 40)
    results = ai.analyze_beam(beam)
    
    # 7. Generate and display report
    print("\n7. GENERATING DESIGN REPORT")
    print("-" * 40)
    report = ai.generate_report(beam, results)
    print(report)
    
    # 8. Export to JSON
    print("\n8. Exporting analysis to JSON...")
    json_output = ai.export_to_json(beam, results)
    
    # Save to file
    output_file = "beam_analysis_output.json"
    with open(output_file, 'w') as f:
        f.write(json_output)
    print(f"   Analysis saved to: {output_file}")
    
    # 9. Try optimization
    print("\n9. Attempting design optimization...")
    print("-" * 40)
    optimized_beam = ai.optimize_beam(beam)
    optimized_results = ai.analyze_beam(optimized_beam)
    
    print(f"   Original depth: {beam.geometry.depth:.3f} m")
    print(f"   Optimized depth: {optimized_beam.geometry.depth:.3f} m")
    
    orig_status = results['summary']['design_status']
    opt_status = optimized_results['summary']['design_status']
    print(f"   Original status: {orig_status}")
    print(f"   Optimized status: {opt_status}")
    
    # 10. Quick summary
    print("\n10. QUICK SUMMARY")
    print("-" * 40)
    summary = results['summary']
    print(f"   Design Status: {summary['design_status']}")
    print(f"   Safety Factor: {summary['safety_factor']:.2f}")
    print(f"   Estimated Cost: ZAR {summary['cost_estimate']['total']:,.0f}")
    print(f"   Key Issues: {summary['key_issues']}")
    
    print("\n" + "=" * 60)
    print("ANALYSIS COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()