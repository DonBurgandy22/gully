"""
Test basic functionality of the Structural Analysis Tool.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.core.beam_analyzer import BeamAnalyzer, BeamGeometry, MaterialProperties
from src.ai_integration.design_assistant import AIDesignAssistant


def test_beam_creation():
    """Test basic beam creation."""
    print("Testing beam creation...")
    
    geometry = BeamGeometry(width=0.3, depth=0.5, length=6.0)
    materials = MaterialProperties(concrete_fc=30, steel_fy=500)
    
    beam = BeamAnalyzer(geometry, materials)
    
    assert beam.geometry.width == 0.3
    assert beam.geometry.depth == 0.5
    assert beam.geometry.length == 6.0
    assert beam.materials.concrete_fc == 30
    assert beam.materials.steel_fy == 500
    
    print("[OK] Beam creation test passed")
    return True


def test_beam_analysis():
    """Test beam analysis."""
    print("Testing beam analysis...")
    
    geometry = BeamGeometry(width=0.3, depth=0.5, length=6.0)
    materials = MaterialProperties(concrete_fc=30, steel_fy=500)
    
    beam = BeamAnalyzer(geometry, materials)
    beam.add_udl(5.0, "live")  # 5 kN/m
    
    results = beam.analyze()
    
    assert 'max_moment' in results
    assert 'max_shear' in results
    assert 'max_deflection' in results
    assert results['max_moment'] > 0
    assert results['max_shear'] > 0
    
    print("[OK] Beam analysis test passed")
    return True


def test_reinforcement_design():
    """Test reinforcement design."""
    print("Testing reinforcement design...")
    
    geometry = BeamGeometry(width=0.3, depth=0.5, length=6.0)
    materials = MaterialProperties(concrete_fc=30, steel_fy=500)
    
    beam = BeamAnalyzer(geometry, materials)
    beam.add_udl(10.0, "live")  # 10 kN/m for meaningful moment
    
    beam.analyze()
    design = beam.design_reinforcement()
    
    assert 'required_area' in design
    assert 'minimum_area' in design
    assert 'suggested_bars' in design
    assert design['required_area'] > 0
    
    print("[OK] Reinforcement design test passed")
    return True


def test_ai_assistant():
    """Test AI design assistant."""
    print("Testing AI design assistant...")
    
    geometry = BeamGeometry(width=0.3, depth=0.5, length=6.0)
    materials = MaterialProperties(concrete_fc=30, steel_fy=500)
    
    beam = BeamAnalyzer(geometry, materials)
    beam.add_udl(5.0, "live")
    
    ai = AIDesignAssistant()
    results = ai.analyze_beam(beam)
    
    assert 'analysis' in results
    assert 'design' in results
    assert 'deflection' in results
    assert 'recommendations' in results
    assert 'summary' in results
    
    # Should have at least self-weight analysis
    assert results['analysis']['max_moment'] > 0
    
    print("[OK] AI assistant test passed")
    return True


def test_json_export_import():
    """Test JSON export and import."""
    print("Testing JSON export/import...")
    
    geometry = BeamGeometry(width=0.3, depth=0.5, length=6.0)
    materials = MaterialProperties(concrete_fc=30, steel_fy=500)
    
    beam = BeamAnalyzer(geometry, materials)
    beam.add_udl(5.0, "live")
    beam.analyze()
    
    # Export to JSON
    json_str = beam.to_json()
    assert isinstance(json_str, str)
    assert len(json_str) > 100
    
    # Import from JSON
    beam2 = BeamAnalyzer.from_json(json_str)
    
    # Check key properties
    assert beam2.geometry.width == beam.geometry.width
    assert beam2.geometry.depth == beam.geometry.depth
    assert beam2.geometry.length == beam.geometry.length
    assert beam2.materials.concrete_fc == beam.materials.concrete_fc
    assert beam2.materials.steel_fy == beam.materials.steel_fy
    
    print("[OK] JSON export/import test passed")
    return True


def run_all_tests():
    """Run all tests."""
    print("=" * 60)
    print("RUNNING STRUCTURAL ANALYSIS TOOL TESTS")
    print("=" * 60)
    
    tests = [
        test_beam_creation,
        test_beam_analysis,
        test_reinforcement_design,
        test_ai_assistant,
        test_json_export_import,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"[FAILED] {test.__name__} failed: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"TEST SUMMARY: {passed} passed, {failed} failed")
    print("=" * 60)
    
    if failed == 0:
        print("\n[OK] All tests passed! The Structural Analysis Tool is working correctly.")
        return True
    else:
        print(f"\n[FAILED] {failed} test(s) failed. Please check the implementation.")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    
    if success:
        print("\nNext steps:")
        print("1. Run the interactive designer: python examples/interactive_design.py")
        print("2. Try the simple example: python examples/simple_beam_example.py")
        print("3. Check the documentation in README.md")
    else:
        print("\nPlease fix the failing tests before proceeding.")