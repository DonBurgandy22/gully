"""
run_demo.py — Burgandy Cognitive Framework prototype runner.

Runs all three demos, generates HTML + PNG visualizations, and writes
the activation report to outputs/sample_activation_report.md.
"""
from __future__ import annotations
import io
import sys
from pathlib import Path

# Force UTF-8 stdout on Windows to avoid cp1252 encoding errors
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# Make src importable without installing the package
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from src.graph_builder import load_full_graph
from src.simulation import run_all_demos
from src.visualization import generate_html, generate_png, generate_3d_html, generate_3d_threejs, extract_activation_dict
from src.scoring import rank_nodes_by_influence, multi_path_analysis, compute_centrality
from src.loop_engine import cycle_summary, named_loops
from src.utils import (
    get_outputs_dir,
    write_activation_report,
    format_activation_table,
    file_size_str,
    ensure_outputs_dir,
)


def print_section(title: str) -> None:
    width = 60
    print(f"\n{'=' * width}")
    print(f"  {title}")
    print(f"{'=' * width}")


def main() -> None:
    print_section("BURGANDY COGNITIVE FRAMEWORK — Demo Run")

    # ── 1. Load graph ──────────────────────────────────────────
    print("\n[1/6] Loading graph data...")
    G, nodes, edges, clusters = load_full_graph(ROOT)
    print(f"      Nodes: {G.number_of_nodes()}  |  Edges: {G.number_of_edges()}")

    # ── 2. Cycle / loop summary ────────────────────────────────
    print("\n[2/6] Detecting cycles...")
    print(cycle_summary(G))
    print("\n  Named canonical loops:")
    for name, path in named_loops():
        print(f"    {name}")
        print(f"      {' -> '.join(path)}")

    # ── 3. Influence scoring ───────────────────────────────────
    print("\n[3/6] Top-10 nodes by influence score:")
    top_influence = rank_nodes_by_influence(G)[:10]
    for rank, (node_id, score) in enumerate(top_influence, 1):
        weight = G.nodes[node_id].get("node_weight", 0.0)
        print(f"    {rank:2}. {node_id:<35} score={score:.4f}  weight={weight:.2f}")

    # ── 4. Multi-path convergence on mathematics ───────────────
    print("\n[4/6] Multi-path convergence analysis -> mathematics:")
    analysis = multi_path_analysis(G, "mathematics")
    print(f"      Reachable from {analysis['total_sources']} distinct sources.")
    for entry in analysis["reachable_from"][:8]:
        print(f"    {entry['source']:<35} path_cost={entry['path_cost']:.2f}")

    # ── 5. Run all demos ───────────────────────────────────────
    print("\n[5/6] Running simulations...")
    results = run_all_demos(G, nodes)

    for result in results:
        print(f"\n  -- {result.demo_name} --")
        print(f"     Seeds        : {', '.join(result.seed_nodes)}")
        print(f"     Iterations   : {result.iterations_run}")
        print(f"     Activated    : {len(result.activated_nodes)} nodes")
        print(f"     Saturated    : {result.saturated_nodes or 'None'}")
        print("     Top 8 activated:")
        for rec in result.activated_nodes[:8]:
            bar = "|" * int(rec.final_activation * 15)
            print(f"       {rec.node_id:<35} {rec.final_activation:.4f}  {bar}")

    # ── 6. Generate outputs ────────────────────────────────────
    print("\n[6/6] Generating outputs...")
    out_dir = ensure_outputs_dir()

    # Write activation report
    report_path = out_dir / "sample_activation_report.md"
    write_activation_report(results, report_path)
    print(f"  [OK] Activation report  -> {report_path}  ({file_size_str(report_path)})")

    # Use Demo 1 activations for visualizations (richest spread)
    activated_dict = extract_activation_dict(results[0])

    # HTML visualization
    html_path = out_dir / "burgandy_network.html"
    generate_html(G, nodes, html_path, activated=activated_dict)
    if html_path.exists():
        print(f"  [OK] HTML network       -> {html_path}  ({file_size_str(html_path)})")
    else:
        print(f"  [SKIP] HTML network (pyvis unavailable)")

    # PNG visualization
    png_path = out_dir / "burgandy_network.png"
    generate_png(G, nodes, png_path, activated=activated_dict)
    if png_path.exists():
        print(f"  [OK] PNG network        -> {png_path}  ({file_size_str(png_path)})")
    else:
        print(f"  [SKIP] PNG network (matplotlib unavailable)")

    # Three.js smooth 3D (primary - no stutter, live state support)
    html_3d_path = out_dir / "burgandy_network_3d.html"
    generate_3d_threejs(G, nodes, html_3d_path, activated=activated_dict)
    if html_3d_path.exists():
        print(f"  [OK] 3D Three.js        -> {html_3d_path}  ({file_size_str(html_3d_path)})")
        print(f"       Run: python serve.py  then open http://localhost:8765/burgandy_network_3d.html")

    # ── Summary ────────────────────────────────────────────────
    print_section("BUILD COMPLETE")

    created_files = sorted(ROOT.rglob("*"))
    print("\nFiles:")
    for f in created_files:
        if f.is_file() and "__pycache__" not in str(f):
            rel = f.relative_to(ROOT)
            print(f"  {str(rel):<55} {file_size_str(f)}")

    print(f"\nRun:     python run_demo.py")
    print(f"Outputs: {out_dir / 'burgandy_network.html'}  (open in browser for interactive view)")
    print(f"Report:  {out_dir / 'sample_activation_report.md'}")


if __name__ == "__main__":
    main()
