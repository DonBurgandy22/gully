  Object.entries(edgeMap).forEach(([key, e]) => {
    const isActive = activeEdgeSet.has(key);
    e.active = isActive;
    if(isActive) {
      e.line.material.color.set(0xFFD700);
      e.line.material.opacity = 0.9;
      e.pulse.material.opacity = 1;
    } else {
      e.line.material.color.set(0x334466);
      e.line.material.opacity = Math.max(0.15, 0.4);
      e.pulse.material.opacity = 0;
    }
  });

  // Sync missing edges from state.all_edges
  for(const [src, tgt, data] of state.all_edges) {
    const key = src+'->'+tgt;
    if(!edgeMap[key]) {
      const srcNode = nodeMap[src];
      const tgtNode = nodeMap[tgt];
      if(!srcNode || !tgtNode) continue;
      const points = [srcNode.mesh.position.clone(), tgtNode.mesh.position.clone()];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({color:0x334466, transparent:true, opacity:0.3});
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      const pGeo = new THREE.SphereGeometry(2.5, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0});
      const pulse = new THREE.Mesh(pGeo, pMat);
      scene.add(pulse);
      edgeMap[key] = {line, pulse, src:srcNode.mesh.position, tgt:tgtNode.mesh.position, active:false, t:0};
    }
  }

  // Status bar
  const dot = document.getElementById('status-dot');
  const txt = document.getElementById('status-text');
  const taskEl = document.getElementById('status-task');
  if(activeSet.size > 0) {
    dot.style.background = '#FFD700';
    txt.style.color = '#FFD700';
    txt.textContent = `Active (${activeSet.size} nodes)`;
  } else {
    dot.style.background = '#333';
    txt.style.color = '#888';
    txt.textContent = 'Idle';
  }
  taskEl.textContent = state.task || '';

  // Add pending nodes
  (state.pending_nodes || []).forEach(pn => {
    if(nodeMap[pn.id]) return;
    addDynamicNode(pn);
  });

  // Add pending edges
  (state.pending_edges || []).forEach(pe => {
    const key = pe.source+'->'+pe.target;
    if(edgeMap[key]) return;
    const src = nodeMap[pe.source], tgt = nodeMap[pe.target];
    if(!src || !tgt) return;
    const points = [src.mesh.position.clone(), tgt.mesh.position.clone()];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({color:0x334466, transparent:true, opacity:0.3});
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    const pGeo = new THREE.SphereGeometry(2.5, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0});
    const pulse = new THREE.Mesh(pGeo, pMat);
    scene.add(pulse);
    edgeMap[key] = {line, pulse, src:src.mesh.position, tgt:tgt.mesh.position, active:false, t:0};
  });

  // Create missing edges from state.all_edges
  for(const [src, tgt, data] of (state.all_edges || [])) {
    const key = src+'->'+tgt;
    if(!edgeMap[key]) {
      const srcNode = nodeMap[src];
      const tgtNode = nodeMap[tgt];
      if(!srcNode || !tgtNode) continue;
      const points = [srcNode.mesh.position.clone(), tgtNode.mesh.position.clone()];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({color:0x334466, transparent:true, opacity:0.3});
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      const pGeo = new THREE.SphereGeometry(2.5, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0});
      const pulse = new THREE.Mesh(pGeo, pMat);
      scene.add(pulse);
      edgeMap[key] = {line, pulse, src:srcNode.mesh.position, tgt:tgtNode.mesh.position, active:false, t:0};
    }
  }
}
