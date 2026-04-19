import sys
import numpy as np

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QFormLayout, QDoubleSpinBox, QGroupBox,
    QSplitter, QTreeWidget, QTreeWidgetItem, QMessageBox, QFileDialog
)

import pyvista as pv
from pyvistaqt import QtInteractor

import ezdxf
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


# -------------------------
# Deterministic 2D Frame Solver (linear)
# DOFs per node: [ux, uy, rz]
# -------------------------
def frame2d_element_stiffness(E, A, I, x1, y1, x2, y2):
    L = float(np.hypot(x2 - x1, y2 - y1))
    if L <= 0:
        raise ValueError("Zero-length element.")

    c = (x2 - x1) / L
    s = (y2 - y1) / L

    # Local stiffness (6x6)
    k = np.zeros((6, 6), dtype=float)

    # Axial
    k_ax = E * A / L
    k[0, 0] += k_ax
    k[0, 3] -= k_ax
    k[3, 0] -= k_ax
    k[3, 3] += k_ax

    # Bending
    k_b = E * I / (L ** 3)
    kb = k_b * np.array([
        [0,    0,      0, 0,    0,      0],
        [0,   12,   6*L, 0,  -12,   6*L],
        [0,  6*L, 4*L*L, 0, -6*L, 2*L*L],
        [0,    0,      0, 0,    0,      0],
        [0,  -12,  -6*L, 0,   12,  -6*L],
        [0,  6*L, 2*L*L, 0, -6*L, 4*L*L],
    ], dtype=float)
    k += kb

    # Transformation T
    T = np.array([
        [ c,  s, 0,  0,  0, 0],
        [-s,  c, 0,  0,  0, 0],
        [ 0,  0, 1,  0,  0, 0],
        [ 0,  0, 0,  c,  s, 0],
        [ 0,  0, 0, -s,  c, 0],
        [ 0,  0, 0,  0,  0, 1],
    ], dtype=float)

    k_global = T.T @ k @ T
    return k_global, L, T


def assemble_global_stiffness(nodes_xy, elements, E, A, I):
    n_nodes = len(nodes_xy)
    ndof = 3 * n_nodes
    K = np.zeros((ndof, ndof), dtype=float)

    cache = []
    for (i, j) in elements:
        x1, y1 = nodes_xy[i]
        x2, y2 = nodes_xy[j]
        ke, L, T = frame2d_element_stiffness(E, A, I, x1, y1, x2, y2)

        dofs = [3*i, 3*i+1, 3*i+2, 3*j, 3*j+1, 3*j+2]
        for a in range(6):
            for b in range(6):
                K[dofs[a], dofs[b]] += ke[a, b]

        cache.append({"i": i, "j": j, "L": L, "T": T})
    return K, cache


def solve_displacements(K, F, fixed_dofs):
    all_dofs = np.arange(K.shape[0])
    fixed = np.array(sorted(list(fixed_dofs)), dtype=int)
    free = np.setdiff1d(all_dofs, fixed)

    Kff = K[np.ix_(free, free)]
    Ff = F[free]
    if Kff.shape[0] == 0:
        raise ValueError("No free DOFs to solve.")

    uf = np.linalg.solve(Kff, Ff)

    u = np.zeros_like(F, dtype=float)
    u[free] = uf
    u[fixed] = 0.0

    R = K @ u - F
    return u, R


def element_end_forces_local(nodes_xy, elem, u_global, E, A, I):
    i = elem["i"]; j = elem["j"]
    x1, y1 = nodes_xy[i]; x2, y2 = nodes_xy[j]
    _, L, T = frame2d_element_stiffness(E, A, I, x1, y1, x2, y2)

    dofs = np.array([3*i, 3*i+1, 3*i+2, 3*j, 3*j+1, 3*j+2], dtype=int)
    ue_global = u_global[dofs]
    ue_local = T @ ue_global

    # Local stiffness rebuild
    k = np.zeros((6, 6), dtype=float)
    k_ax = E * A / L
    k[0, 0] += k_ax; k[0, 3] -= k_ax
    k[3, 0] -= k_ax; k[3, 3] += k_ax

    k_b = E * I / (L ** 3)
    kb = k_b * np.array([
        [0,    0,      0, 0,    0,      0],
        [0,   12,   6*L, 0,  -12,   6*L],
        [0,  6*L, 4*L*L, 0, -6*L, 2*L*L],
        [0,    0,      0, 0,    0,      0],
        [0,  -12,  -6*L, 0,   12,  -6*L],
        [0,  6*L, 2*L*L, 0, -6*L, 4*L*L],
    ], dtype=float)
    k += kb

    return k @ ue_local  # [N1,V1,M1,N2,V2,M2]


def build_portal_frame(span, eaves, rise):
    nodes = [
        (0.0, 0.0),
        (0.0, eaves),
        (span/2.0, eaves + rise),
        (span, eaves),
        (span, 0.0),
    ]
    elements = [(0, 1), (1, 2), (2, 3), (3, 4)]
    return nodes, elements


def export_dxf(filepath, nodes_xy, elements, title="PORTAL FRAME GA"):
    doc = ezdxf.new("R2018")
    msp = doc.modelspace()

    doc.layers.new(name="STRUCT", dxfattribs={"color": 7})
    doc.layers.new(name="TEXT", dxfattribs={"color": 2})

    for (i, j) in elements:
        x1, y1 = nodes_xy[i]
        x2, y2 = nodes_xy[j]
        msp.add_line((x1, y1), (x2, y2), dxfattribs={"layer": "STRUCT"})

    for (x, y) in nodes_xy:
        msp.add_circle((x, y), radius=0.10, dxfattribs={"layer": "STRUCT"})

    maxx = max(p[0] for p in nodes_xy)
    maxy = max(p[1] for p in nodes_xy)
    msp.add_text(title, dxfattribs={"height": 0.35, "layer": "TEXT"}).set_placement((0, maxy + 1.0))

    eaves = nodes_xy[1][1]
    msp.add_text(f"SPAN = {maxx:.2f} m", dxfattribs={"height": 0.25, "layer": "TEXT"}).set_placement((maxx*0.35, -1.0))
    msp.add_text(f"EAVES = {eaves:.2f} m", dxfattribs={"height": 0.25, "layer": "TEXT"}).set_placement((-2.0, eaves*0.5))

    doc.saveas(filepath)


def export_pdf(filepath, inputs, reactions, end_forces, nodes_xy, u):
    c = canvas.Canvas(filepath, pagesize=A4)
    W, H = A4

    y = H - 50
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Structural MVP Report (Prototype)")
    y -= 22

    c.setFont("Helvetica", 9)
    c.drawString(50, y, "Prototype only. Not for construction unless reviewed and signed off by a professional engineer.")
    y -= 22

    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "Inputs")
    y -= 16
    c.setFont("Helvetica", 10)
    for k, v in inputs.items():
        c.drawString(60, y, f"{k}: {v}")
        y -= 14

    y -= 10
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "Key Results")
    y -= 16
    c.setFont("Helvetica", 10)

    def rxn(n):
        return reactions[3*n+0], reactions[3*n+1], reactions[3*n+2]

    r0 = rxn(0); r4 = rxn(4)
    c.drawString(60, y, f"Node 0: Rx={r0[0]:.1f} N, Ry={r0[1]:.1f} N, Mz={r0[2]:.1f} Nm"); y -= 14
    c.drawString(60, y, f"Node 4: Rx={r4[0]:.1f} N, Ry={r4[1]:.1f} N, Mz={r4[2]:.1f} Nm"); y -= 18

    uys = [u[3*i+1] for i in range(len(nodes_xy))]
    max_uy = max(uys, key=lambda x: abs(x))
    c.drawString(60, y, f"Max uy: {max_uy:.6e} m"); y -= 18

    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Element End Forces (local) maxima (approx)")
    y -= 14
    c.setFont("Helvetica", 9)

    for idx, fe in enumerate(end_forces):
        Nmax = max(abs(fe[0]), abs(fe[3]))
        Vmax = max(abs(fe[1]), abs(fe[4]))
        Mmax = max(abs(fe[2]), abs(fe[5]))
        c.drawString(60, y, f"E{idx}: Nmax={Nmax:.1f} N | Vmax={Vmax:.1f} N | Mmax={Mmax:.1f} Nm")
        y -= 12
        if y < 80:
            c.showPage()
            y = H - 50
            c.setFont("Helvetica", 9)

    c.showPage()
    c.save()


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Structural AI MVP Prototype (Portal Frame)")

        self.E = 200e9
        self.A = 0.010
        self.I = 8.0e-6

        self.nodes = None
        self.elements = None
        self.u = None
        self.reactions = None
        self.end_forces = None

        root = QWidget()
        self.setCentralWidget(root)

        splitter = QSplitter(Qt.Horizontal)

        self.tree = QTreeWidget()
        self.tree.setHeaderLabel("Project Browser")
        splitter.addWidget(self.tree)

        self.plotter = QtInteractor()
        splitter.addWidget(self.plotter.interactor)

        right = QWidget()
        rlayout = QVBoxLayout(right)

        params_box = QGroupBox("Portal Frame Parameters (m)")
        form = QFormLayout(params_box)
        self.span_in = QDoubleSpinBox(); self.span_in.setRange(1, 200); self.span_in.setValue(30.0)
        self.eaves_in = QDoubleSpinBox(); self.eaves_in.setRange(1, 50); self.eaves_in.setValue(6.0)
        self.rise_in = QDoubleSpinBox(); self.rise_in.setRange(0.1, 25); self.rise_in.setValue(2.0)
        form.addRow("Span", self.span_in)
        form.addRow("Eaves height", self.eaves_in)
        form.addRow("Roof rise", self.rise_in)

        load_box = QGroupBox("Loads (demo)")
        load_form = QFormLayout(load_box)
        self.roof_udl = QDoubleSpinBox(); self.roof_udl.setRange(0, 50); self.roof_udl.setValue(5.0)
        self.roof_udl.setSuffix(" kN/m (down)")
        load_form.addRow("Roof line load", self.roof_udl)

        self.deform_scale = QDoubleSpinBox(); self.deform_scale.setRange(1, 5000); self.deform_scale.setValue(200.0)
        load_form.addRow("Deform scale", self.deform_scale)

        self.btn_build = QPushButton("Build Model")
        self.btn_solve = QPushButton("Run Analysis")
        self.btn_results = QPushButton("Show Results")
        self.btn_dxf = QPushButton("Export DXF Drawing")
        self.btn_pdf = QPushButton("Export PDF Report")

        self.btn_build.clicked.connect(self.build_model)
        self.btn_solve.clicked.connect(self.run_analysis)
        self.btn_results.clicked.connect(self.show_results)
        self.btn_dxf.clicked.connect(self.export_drawing)
        self.btn_pdf.clicked.connect(self.export_report)

        self.status = QLabel("Status: Ready")

        rlayout.addWidget(params_box)
        rlayout.addWidget(load_box)
        rlayout.addWidget(self.btn_build)
        rlayout.addWidget(self.btn_solve)
        rlayout.addWidget(self.btn_results)
        rlayout.addWidget(self.btn_dxf)
        rlayout.addWidget(self.btn_pdf)
        rlayout.addStretch(1)
        rlayout.addWidget(self.status)

        splitter.addWidget(right)
        splitter.setSizes([240, 850, 320])

        layout = QHBoxLayout(root)
        layout.addWidget(splitter)

        self.plotter.set_background("white")
        self.plotter.add_axes()

        self.build_model()

    def build_model(self):
        span = float(self.span_in.value())
        eaves = float(self.eaves_in.value())
        rise = float(self.rise_in.value())
        self.nodes, self.elements = build_portal_frame(span, eaves, rise)
        self.u = self.reactions = self.end_forces = None
        self.populate_tree()
        self.draw_undeformed()
        self.status.setText("Status: Model built.")

    def populate_tree(self):
        self.tree.clear()
        model_item = QTreeWidgetItem(["Model"])
        nodes_item = QTreeWidgetItem(["Nodes"])
        elems_item = QTreeWidgetItem(["Elements"])
        for idx, (x, y) in enumerate(self.nodes):
            QTreeWidgetItem(nodes_item, [f"Node {idx}: ({x:.3f}, {y:.3f})"])
        for eidx, (i, j) in enumerate(self.elements):
            QTreeWidgetItem(elems_item, [f"Elem {eidx}: {i} -> {j}"])
        model_item.addChild(nodes_item)
        model_item.addChild(elems_item)
        self.tree.addTopLevelItem(model_item)
        self.tree.expandAll()

    def draw_undeformed(self):
        self.plotter.clear()
        self.plotter.add_axes()
        pts = np.array([[x, y, 0.0] for (x, y) in self.nodes], dtype=float)
        for (i, j) in self.elements:
            self.plotter.add_mesh(pv.Line(pts[i], pts[j]), line_width=5)
        self.plotter.add_mesh(pv.PolyData(pts), point_size=12, render_points_as_spheres=True)
        self.plotter.reset_camera()
        self.plotter.render()

    def run_analysis(self):
        try:
            K, cache = assemble_global_stiffness(self.nodes, self.elements, self.E, self.A, self.I)
            F = np.zeros(K.shape[0], dtype=float)

            # Fixed bases for demo
            fixed_dofs = set([0, 1, 2,  3*4+0, 3*4+1, 3*4+2])

            # Simplified roof UDL distribution
            w = float(self.roof_udl.value()) * 1000.0
            span = self.nodes[4][0] - self.nodes[0][0]
            total = w * span
            F[3*1 + 1] -= 0.25 * total
            F[3*2 + 1] -= 0.50 * total
            F[3*3 + 1] -= 0.25 * total

            self.u, self.reactions = solve_displacements(K, F, fixed_dofs)
            self.end_forces = [element_end_forces_local(self.nodes, e, self.u, self.E, self.A, self.I) for e in cache]

            self.status.setText("Status: Analysis complete.")
        except Exception as e:
            QMessageBox.critical(self, "Analysis Error", str(e))

    def show_results(self):
        if self.u is None:
            QMessageBox.information(self, "No Results", "Run analysis first.")
            return

        scale = float(self.deform_scale.value())
        pts0 = np.array([[x, y, 0.0] for (x, y) in self.nodes], dtype=float)
        ptsd = pts0.copy()
        for n in range(len(self.nodes)):
            ptsd[n, 0] += scale * self.u[3*n + 0]
            ptsd[n, 1] += scale * self.u[3*n + 1]

        self.plotter.clear()
        self.plotter.add_axes()

        for (i, j) in self.elements:
            self.plotter.add_mesh(pv.Line(pts0[i], pts0[j]), line_width=4)
        for (i, j) in self.elements:
            self.plotter.add_mesh(pv.Line(ptsd[i], ptsd[j]), line_width=8)

        self.plotter.add_mesh(pv.PolyData(pts0), point_size=10, render_points_as_spheres=True)
        self.plotter.add_mesh(pv.PolyData(ptsd), point_size=12, render_points_as_spheres=True)

        msgs = []
        for idx, fe in enumerate(self.end_forces or []):
            Nmax = max(abs(fe[0]), abs(fe[3])) / 1000.0
            Vmax = max(abs(fe[1]), abs(fe[4])) / 1000.0
            Mmax = max(abs(fe[2]), abs(fe[5])) / 1000.0
            msgs.append(f"E{idx}: N~{Nmax:.1f}kN V~{Vmax:.1f}kN M~{Mmax:.1f}kNm")
        self.status.setText(" | ".join(msgs[:3]) + (" ..." if len(msgs) > 3 else ""))

        self.plotter.reset_camera()
        self.plotter.render()

    def export_drawing(self):
        path, _ = QFileDialog.getSaveFileName(self, "Save DXF", "portal_frame.dxf", "DXF (*.dxf)")
        if not path:
            return
        try:
            export_dxf(path, self.nodes, self.elements, title="PORTAL FRAME GA (Prototype)")
            QMessageBox.information(self, "DXF Exported", f"Saved:\n{path}")
        except Exception as e:
            QMessageBox.critical(self, "DXF Export Error", str(e))

    def export_report(self):
        if self.u is None or self.reactions is None or self.end_forces is None:
            QMessageBox.information(self, "No Results", "Run analysis first.")
            return
        path, _ = QFileDialog.getSaveFileName(self, "Save PDF", "portal_frame_report.pdf", "PDF (*.pdf)")
        if not path:
            return

        inputs = {
            "Span (m)": f"{self.span_in.value():.3f}",
            "Eaves (m)": f"{self.eaves_in.value():.3f}",
            "Rise (m)": f"{self.rise_in.value():.3f}",
            "Roof UDL (kN/m)": f"{self.roof_udl.value():.3f}",
            "E (Pa)": f"{self.E:.3e}",
            "A (m^2)": f"{self.A:.3e}",
            "I (m^4)": f"{self.I:.3e}",
        }
        try:
            export_pdf(path, inputs, self.reactions, self.end_forces, self.nodes, self.u)
            QMessageBox.information(self, "PDF Exported", f"Saved:\n{path}")
        except Exception as e:
            QMessageBox.critical(self, "PDF Export Error", str(e))


def main():
    app = QApplication(sys.argv)
    w = MainWindow()
    w.resize(1450, 850)
    w.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()


