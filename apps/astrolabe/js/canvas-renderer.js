// Astrolabe Canvas Renderer
const AstrolabeCanvasRenderer = (function () {
  const CONFIG = AstrolabeConfig.CANVAS_CONFIG;

  let canvas = null;
  let ctx = null;
  let logicalWidth = 0;
  let logicalHeight = 0;
  let nodes = {};
  let imageCache = {};
  let selectedNodeId = null;

  // View state
  let viewState = {
    zoom: 1.75,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    // Momentum
    vx: 0,
    vy: 0,
    rafId: null,
    renderTick: false,
    // Smooth Zoom
    targetZoom: 1.75,
    zoomRafId: null,
    zoomFocus: { x: 0, y: 0 }
  };

  // Cached node bounds for perspective calculation
  let nodeBoundsCache = { minY: 0, maxY: 0, centerX: 0 };

  // Node bounds for hit testing (in canvas coordinates)
  let nodeBounds = {};

  // Background stars
  let stars = [];

  function init(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');

    // Set up event listeners
    setupEventListeners();

    // Handle resize
    window.addEventListener('resize', debounce(handleResize, 100));
    handleResize();
  }

  function handleResize() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    // Cap DPR at 1.5 for performance while maintaining good sharpness
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Set logical size
    logicalWidth = rect.width;
    logicalHeight = rect.height;

    // Set physical size to match container * DPR
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale context to match logical coordinate system
    ctx.scale(dpr, dpr);

    // Enable high quality image smoothing (reset by canvas resize)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Generate background stars
    generateStars();

    // Center the view initially
    if (viewState.offsetX === 0 && viewState.offsetY === 0) {
      centerView();
    }

    render();
  }

  function generateStars() {
    stars = [];
    // Density-based count: ~1 star per 3000 pixels squared
    const numStars = Math.floor((logicalWidth * logicalHeight) / 3000);

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }

  function drawBackground() {
    // Deep space gradient (Top Center Light Source)
    const gradient = ctx.createRadialGradient(
      logicalWidth / 2, logicalHeight * 0.05, 0,
      logicalWidth / 2, logicalHeight * 0.05, Math.max(logicalWidth, logicalHeight) * 1.2
    );
    gradient.addColorStop(0, '#385f9eff');
    gradient.addColorStop(0.4, '#121f39ff');
    gradient.addColorStop(0.75, '#020304ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Draw stars
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });
  }


  function centerView() {
    if (!canvas || Object.keys(nodes).length === 0) return;

    // Apply coordinate scaling
    const xScale = CONFIG.xScale || 1;
    const yScale = CONFIG.yScale || 1;

    // Calculate bounds of all nodes (with scaling and Y flipped)
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    Object.values(nodes).forEach(node => {
      const pos = node.pos || [0, 0];
      const scaledX = pos[0] * xScale;
      const scaledY = -pos[1] * yScale; // Flip Y and scale
      minX = Math.min(minX, scaledX);
      maxX = Math.max(maxX, scaledX);
      minY = Math.min(minY, scaledY);
      maxY = Math.max(maxY, scaledY);
    });

    // Cache bounds for perspective calculation (with padding)
    nodeBoundsCache = {
      minY: minY - 80,
      maxY: maxY + 80,
      centerX: (minX + maxX) / 2
    };

    // Center point of nodes
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Offset to center nodes in canvas
    viewState.offsetX = logicalWidth / 2 - centerX * viewState.zoom;
    viewState.offsetY = logicalHeight / 2 - centerY * viewState.zoom;
  }

  function setData(nodeData, images) {
    nodes = nodeData;
    imageCache = images;
    centerView();
    render();
  }

  function setSelectedNode(nodeId) {
    selectedNodeId = nodeId;
    render();
  }

  function getSelectedNode() {
    return selectedNodeId ? nodes[selectedNodeId] : null;
  }

  // Transform world coordinates to screen coordinates with perspective
  function worldToScreen(x, y) {
    // Apply coordinate scaling
    const xScale = CONFIG.xScale || 1;
    const yScale = CONFIG.yScale || 1;
    x = x * xScale;
    y = -y * yScale; // Flip Y axis and scale

    // Use cached bounds (already flipped and scaled in centerView)
    const minY = nodeBoundsCache.minY;
    const maxY = nodeBoundsCache.maxY;
    const worldCenterX = nodeBoundsCache.centerX;
    const yRange = maxY - minY || 1;

    // Calculate perspective factor (0 at top, 1 at bottom)
    // Larger y values (bottom of screen) are wider, smaller y (top) are narrower
    const yNorm = (y - minY) / yRange; // 0 at top, 1 at bottom
    const perspectiveFactor = CONFIG.perspectiveRatio + yNorm * (1 - CONFIG.perspectiveRatio);

    // Apply horizontal perspective compression from world center
    const relativeX = x - worldCenterX;
    const adjustedX = worldCenterX + relativeX * perspectiveFactor;

    const screenX = adjustedX * viewState.zoom + viewState.offsetX;
    const screenY = y * viewState.zoom + viewState.offsetY;

    return { x: screenX, y: screenY, scale: perspectiveFactor };
  }

  // Screen to world coordinates (inverse of perspective transform)
  function screenToWorld(screenX, screenY) {
    // Apply pan and zoom inverse
    // adjustedX is the perspective-distorted world X
    // wy is the scaled and flipped world Y
    const adjustedX = (screenX - viewState.offsetX) / viewState.zoom;
    const wy = (screenY - viewState.offsetY) / viewState.zoom;

    // Retrieve cached bounds for perspective calculation
    const minY = nodeBoundsCache.minY;
    const maxY = nodeBoundsCache.maxY;
    const worldCenterX = nodeBoundsCache.centerX;
    const yRange = maxY - minY || 1;

    // Calculate perspective factor based on Y
    // (Same logic as worldToScreen)
    const yNorm = (wy - minY) / yRange;
    const perspectiveFactor = CONFIG.perspectiveRatio + yNorm * (1 - CONFIG.perspectiveRatio);

    // Unapply perspective distortion
    // adjustedX = worldCenterX + (wx - worldCenterX) * perspectiveFactor
    // => wx - worldCenterX = (adjustedX - worldCenterX) / perspectiveFactor
    const safeFactor = perspectiveFactor === 0 ? 0.001 : perspectiveFactor;
    const wx = worldCenterX + (adjustedX - worldCenterX) / safeFactor;

    // Unapply coordinate scaling and flipping
    const xScale = CONFIG.xScale || 1;
    const yScale = CONFIG.yScale || 1;

    // worldToScreen: x = x * xScale
    const x = wx / xScale;

    // worldToScreen: y = -y * yScale
    const y = -wy / yScale;

    return { x: x, y: y };
  }

  function render() {
    if (!ctx || !canvas) return;

    // Draw background with stars
    drawBackground();

    // Build connection map
    const connections = [];
    Object.entries(nodes).forEach(([id, node]) => {
      const connectedIds = node.connected || [];
      connectedIds.forEach(connectedId => {
        const connectedNode = nodes[connectedId];
        if (connectedNode) {
          connections.push({
            from: node,
            to: connectedNode
          });
        }
      });
    });

    // Draw connections first (behind nodes)
    drawConnections(connections);

    // Sort nodes by y position for proper layering (back to front)
    const sortedNodes = Object.entries(nodes).sort((a, b) => {
      const posA = a[1].pos || [0, 0];
      const posB = b[1].pos || [0, 0];
      return posA[1] - posB[1]; // Draw nodes with smaller y (top) first
    });

    // Draw nodes
    nodeBounds = {};
    sortedNodes.forEach(([id, node]) => {
      drawNode(id, node);
    });

    // Draw selected node pin on top
    if (selectedNodeId && nodes[selectedNodeId]) {
      drawSelectedPin(nodes[selectedNodeId]);
    }
  }

  function drawConnections(connections) {
    ctx.lineCap = 'butt';

    const activeConnections = [];
    const inactiveConnections = [];

    // Separate active/inactive
    connections.forEach(conn => {
      const coords = getLineCoords(conn);
      if (coords.startX !== null) {
        if (conn.from.isActive && conn.to.isActive) {
          activeConnections.push(coords);
        } else {
          inactiveConnections.push(coords);
        }
      }
    });

    // Draw Inactive (Dim)
    if (inactiveConnections.length > 0) {
      ctx.beginPath();
      inactiveConnections.forEach(({ startX, startY, endX, endY }) => {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      });
      ctx.lineWidth = CONFIG.lineWidth * viewState.zoom;
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.3)';
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    // Draw Active (Strong Neon)
    if (activeConnections.length > 0) {
      ctx.save();
      ctx.beginPath();
      activeConnections.forEach(({ startX, startY, endX, endY }) => {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      });

      // Single strong stroke with intense glow
      // 'lighter' composition adds the glow color to background, making it intense
      ctx.globalCompositeOperation = 'lighter';

      // The Glow
      ctx.shadowColor = '#00f7ff'; // Cyan/Electric Blue glow
      ctx.shadowBlur = 20;

      // The Core Line
      ctx.strokeStyle = '#e0ffff'; // Almost white cyan
      ctx.lineWidth = CONFIG.lineWidth * 1.0 * viewState.zoom; // Thin crisp line

      ctx.stroke();
      ctx.restore();
    }
  }

  // Helper to calculate line coordinates
  function getLineCoords(conn) {
    const fromPos = conn.from.pos || [0, 0];
    const toPos = conn.to.pos || [0, 0];

    const from = worldToScreen(fromPos[0], fromPos[1]);
    const to = worldToScreen(toPos[0], toPos[1]);

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= 0) return { startX: null };

    const nx = dx / dist;
    const ny = dy / dist;

    // Ellipse calculation to match flattened nodes
    // Must match the squash factor in drawNode (checking step history: 0.52)
    const squash = 0.52;
    // Penetration factor base
    const paddingFactor = 0.72;

    // Calculate effective radius for FROM node at connection angle
    const fromBase = (CONFIG.nodeSize * from.scale * viewState.zoom) / 2;
    const fromRx = fromBase;
    const fromRy = fromBase * squash;
    // Ellipse radius in direction (nx, ny)
    const fromR = (fromRx * fromRy) / Math.sqrt(Math.pow(fromRy * nx, 2) + Math.pow(fromRx * ny, 2));

    // Add extra padding for X component to reduce overlap (approx 2-5% logic)
    const startLen = fromR * (paddingFactor + Math.abs(nx) * 0.05);

    // Calculate effective radius for TO node at connection angle
    const toBase = (CONFIG.nodeSize * to.scale * viewState.zoom) / 2;
    const toRx = toBase;
    const toRy = toBase * squash;
    const toR = (toRx * toRy) / Math.sqrt(Math.pow(toRy * nx, 2) + Math.pow(toRx * ny, 2));
    const endLen = toR * (paddingFactor + Math.abs(nx) * 0.05);

    if (dist < startLen + endLen) return { startX: null };

    return {
      startX: from.x + nx * startLen,
      startY: from.y + ny * startLen,
      endX: to.x - nx * endLen,
      endY: to.y - ny * endLen
    };
  }

  function drawNode(id, node) {
    const pos = node.pos || [0, 0];
    const screen = worldToScreen(pos[0], pos[1]);

    const imgName = node.img || 'tianerong-xingpan-point01.png';
    const img = imageCache[imgName];

    const isSelected = id === selectedNodeId;
    const isActive = node.isActive !== false; // Default to true if not specified
    const baseSize = isSelected ? CONFIG.selectedNodeSize : CONFIG.nodeSize;
    const size = baseSize * screen.scale * (viewState.zoom * 0.5 + 0.5) * 1.25;

    // Store bounds for hit testing
    nodeBounds[id] = {
      x: screen.x - size / 2,
      y: screen.y - size / 2,
      width: size,
      height: size
    };

    // Draw glow behind node
    const bgRadius = size * 0.8; // Wide ambient glow
    const ringRadius = size * 0.6; // Tighter source ring

    // Floating effect & Tilt
    const glowY = screen.y + size * 0.03;

    // Skew calculation for "Trapezoidal" perspective
    // Pivot at bottom (glowY), shift top (y < glowY) based on x-distance from center
    // Left side (x < center) -> Skew negative?
    // x' = x + skew * y.
    // Top is y_local < 0.
    // If x < center, we want Top to shift Right (x+).
    // neg * skew = pos -> skew must be negative.
    // skew = (x - center) * k. (neg * pos = neg). Matches.
    const skewAngle = (screen.x - logicalWidth / 2) * 0.0006;

    const gradient = ctx.createRadialGradient(
      screen.x, glowY, 0,
      screen.x, glowY, bgRadius
    );

    if (!isActive) {
      gradient.addColorStop(0, 'rgba(100, 100, 100, 0.2)');
      gradient.addColorStop(0.5, 'rgba(80, 80, 80, 0.1)');
      gradient.addColorStop(1, 'rgba(60, 60, 60, 0)');
    } else if (isSelected) {
      // Yellow/Gold glow for selected - softer
      gradient.addColorStop(0, 'rgba(255, 240, 150, 0.4)');
      gradient.addColorStop(0.5, 'rgba(255, 220, 100, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 180, 0, 0)');
    } else {
      // Neon Cyan Glow (Desaturated & Spread)
      gradient.addColorStop(0, 'rgba(180, 240, 255, 0.2)');
      gradient.addColorStop(0.6, 'rgba(100, 200, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(50, 150, 255, 0)');
    }

    // 1. Draw Ambient Glow (Flat/Shadow) - Unaffected by skew
    ctx.save();
    ctx.translate(screen.x, glowY);
    ctx.scale(1, 0.52); // Squash Y axis
    ctx.translate(-screen.x, -glowY);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screen.x, glowY, bgRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Draw Skewed Object (Rings + Image)
    ctx.save();

    // Pivot at Bottom Center (Glow Position)
    // This keeps the "feet" of the node fixed, while the body leans
    ctx.translate(screen.x, glowY);
    ctx.transform(1, 0, skewAngle, 1, 0, 0);
    ctx.translate(-screen.x, -glowY);

    // A. Draw Rings (at glowY)
    if (isActive) {
      ctx.save();
      ctx.translate(screen.x, glowY);
      ctx.scale(1, 0.52);
      ctx.translate(-screen.x, -glowY);

      // Outer Ring (Glow Only - Optimized)
      ctx.beginPath();
      ctx.arc(screen.x, glowY, ringRadius * 0.85, 0, Math.PI * 2);

      ctx.lineWidth = 3;
      if (isSelected) {
        ctx.strokeStyle = 'rgba(255, 235, 100, 0.1)';
        ctx.shadowColor = 'rgba(255, 235, 100, 1.0)';
        ctx.shadowBlur = 15;
      } else {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.shadowColor = 'rgba(0, 240, 255, 0.9)';
        ctx.shadowBlur = 15;
      }
      ctx.stroke();

      // Inner Ring
      ctx.beginPath();
      ctx.arc(screen.x, glowY, ringRadius * 0.5, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;

      if (isSelected) {
        ctx.strokeStyle = 'rgba(255, 235, 100, 0.2)';
        ctx.shadowColor = 'rgba(255, 235, 100, 0.8)';
      } else {
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
        ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
      }
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.restore();
    }

    // B. Draw Image or Fallback
    const drawWidth = size;
    const drawHeight = size * 0.54;

    // Update bounds for hit testing
    nodeBounds[id] = {
      x: screen.x - drawWidth / 2,
      y: screen.y - drawHeight / 2,
      width: drawWidth,
      height: drawHeight
    };

    if (img) {
      // Apply grayscale filter for inactive nodes
      if (!isActive) {
        ctx.filter = 'grayscale(100%) brightness(0.6)';
      }

      // Draw image with glow for selected node
      if (isSelected && isActive) {
        ctx.shadowColor = 'rgba(255, 220, 50, 0.8)';
        ctx.shadowBlur = 25;
      }

      ctx.drawImage(
        img,
        screen.x - drawWidth / 2,
        screen.y - drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.filter = 'none';
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } else {
      // Fallback: draw ellipse
      ctx.beginPath();
      // Adjust ellipse center if needed? 
      // Image draws at screen.y. 
      // Skew pivot is glowY. 
      // transform handles shift.
      ctx.ellipse(screen.x, screen.y, drawWidth / 2, drawHeight / 2, 0, 0, Math.PI * 2);

      if (!isActive) {
        ctx.fillStyle = '#666666';
      } else {
        ctx.fillStyle = isSelected ? '#00aaff' : '#4488ff';
      }
      ctx.fill();
      ctx.strokeStyle = isActive ? '#ffffff' : '#888888';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore(); // End Skew

    // Draw node name label below
    if (node.name && viewState.zoom >= 0.7) {
      const fontSize = Math.max(10, 12 * screen.scale * viewState.zoom);
      ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Text shadow for readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;

      if (!isActive) {
        ctx.fillStyle = '#888888';
      } else {
        ctx.fillStyle = isSelected ? '#ffeb3b' : '#ccddff';
      }

      const labelY = screen.y + drawHeight / 2 + 8;
      ctx.fillText(node.name, screen.x, labelY);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }

  function drawSelectedPin(node) {
    const pin = document.getElementById('astrolabe-pin');
    if (!pin) return;

    // Use pure CSS animation for floating, just update position here
    const pos = node.pos || [0, 0];
    const screen = worldToScreen(pos[0], pos[1]);

    // Scale pin with zoom
    // Base size approximation (tianerong-xingpan-now.png)
    const baseSize = 60;
    const size = baseSize * 0.6 * viewState.zoom; // 0.6 scale factor

    pin.style.display = 'block';
    pin.style.left = `${screen.x}px`;
    pin.style.top = `${screen.y - size * 0.2}px`; // Shift up by 20% height

    pin.style.width = `${size}px`;
    pin.style.height = `${size}px`;

    // Explicitly set animation to ensure it plays
    // user wanted faster, so 1.2s infinite
    pin.style.animation = 'pinFloat 1.2s ease-in-out infinite';
  }

  // Event handling
  function setupEventListeners() {
    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
  }

  function handleMouseLeave(e) {
    viewState.isDragging = false;
    viewState.hasMoved = false;
    canvas.style.cursor = 'grab';
  }

  function momentumLoop() {
    if (!viewState.rafId) return;

    viewState.offsetX += viewState.vx;
    viewState.offsetY += viewState.vy;

    viewState.vx *= 0.5; // Heavy friction for short slide
    viewState.vy *= 0.5;

    render();

    if (Math.abs(viewState.vx) < 0.5 && Math.abs(viewState.vy) < 0.5) {
      cancelAnimationFrame(viewState.rafId);
      viewState.rafId = null;
    } else {
      viewState.rafId = requestAnimationFrame(momentumLoop);
    }
  }

  function handleMouseDown(e) {
    if (viewState.rafId) {
      cancelAnimationFrame(viewState.rafId);
      viewState.rafId = null;
    }
    viewState.isDragging = true;
    viewState.hasMoved = false;
    viewState.startX = e.clientX;
    viewState.startY = e.clientY;
    viewState.lastX = e.clientX;
    viewState.lastY = e.clientY;
    viewState.vx = 0;
    viewState.vy = 0;
    canvas.style.cursor = 'grabbing';
  }

  function handleMouseMove(e) {
    if (!viewState.isDragging) {
      const nodeId = getNodeAtPoint(e.offsetX, e.offsetY);
      const isClickable = nodeId && nodes[nodeId] && nodes[nodeId].isActive !== false;
      canvas.style.cursor = isClickable ? 'pointer' : 'grab';
      return;
    }

    const dx = e.clientX - viewState.lastX;
    const dy = e.clientY - viewState.lastY;

    viewState.vx = dx;
    viewState.vy = dy;

    const totalDx = Math.abs(e.clientX - viewState.startX);
    const totalDy = Math.abs(e.clientY - viewState.startY);
    if (totalDx > 5 || totalDy > 5) {
      viewState.hasMoved = true;
    }

    viewState.offsetX += dx;
    viewState.offsetY += dy;
    viewState.lastX = e.clientX;
    viewState.lastY = e.clientY;

    if (!viewState.renderTick) {
      viewState.renderTick = true;
      requestAnimationFrame(() => {
        render();
        viewState.renderTick = false;
      });
    }
  }

  function handleMouseUp(e) {
    if (viewState.isDragging && !viewState.hasMoved) {
      const nodeId = getNodeAtPoint(e.offsetX, e.offsetY);
      if (nodeId && nodes[nodeId] && nodes[nodeId].isActive !== false) {
        setSelectedNode(nodeId);
        canvas.dispatchEvent(new CustomEvent('nodeSelected', {
          detail: { nodeId, node: nodes[nodeId] }
        }));
      }
    } else if (viewState.isDragging) {
      // momentum with clamp
      const maxSpeed = 12;
      viewState.vx = Math.max(-maxSpeed, Math.min(maxSpeed, viewState.vx));
      viewState.vy = Math.max(-maxSpeed, Math.min(maxSpeed, viewState.vy));

      if (Math.abs(viewState.vx) > 1 || Math.abs(viewState.vy) > 1) {
        viewState.rafId = requestAnimationFrame(momentumLoop);
      }
    }
    viewState.isDragging = false;
    viewState.hasMoved = false;
    canvas.style.cursor = 'grab';
  }

  function smoothZoomLoop() {
    if (!viewState.zoomRafId) return;

    // Interpolation factor (0.1 = slow/smooth, 0.3 = fast, 0.6 = snappy)
    const factor = 0.6;
    const diff = viewState.targetZoom - viewState.zoom;

    // Snap when close
    if (Math.abs(diff) < 0.005) {
      viewState.zoom = viewState.targetZoom;
      viewState.zoomRafId = null;
      render();
      return;
    }

    const newZoom = viewState.zoom + diff * factor;
    const scale = newZoom / viewState.zoom;

    // Adjust offset to keep focus point stable
    const fx = viewState.zoomFocus.x;
    const fy = viewState.zoomFocus.y;

    viewState.offsetX = fx - (fx - viewState.offsetX) * scale;
    viewState.offsetY = fy - (fy - viewState.offsetY) * scale;
    viewState.zoom = newZoom;

    render();
    viewState.zoomRafId = requestAnimationFrame(smoothZoomLoop);
  }

  function handleWheel(e) {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? -CONFIG.zoomStep : CONFIG.zoomStep;

    // Update target zoom
    const nextTarget = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, viewState.targetZoom + delta));

    if (nextTarget !== viewState.targetZoom) {
      viewState.targetZoom = nextTarget;
      viewState.zoomFocus = { x: mouseX, y: mouseY };

      if (!viewState.zoomRafId) {
        viewState.zoomRafId = requestAnimationFrame(smoothZoomLoop);
      }
    }
  }

  // Touch handling
  let touchStartDist = 0;
  let touchStartZoom = 1;

  function handleTouchStart(e) {
    e.preventDefault();
    if (viewState.rafId) {
      cancelAnimationFrame(viewState.rafId);
      viewState.rafId = null;
    }

    if (e.touches.length === 1) {
      // Single touch - drag
      viewState.isDragging = true;
      viewState.hasMoved = false;
      viewState.startX = e.touches[0].clientX;
      viewState.startY = e.touches[0].clientY;
      viewState.lastX = e.touches[0].clientX;
      viewState.lastY = e.touches[0].clientY;
      viewState.vx = 0;
      viewState.vy = 0;
    } else if (e.touches.length === 2) {
      // Pinch zoom
      viewState.isDragging = false;
      touchStartDist = getTouchDistance(e.touches);
      touchStartZoom = viewState.zoom;
    }
  }

  function handleTouchMove(e) {
    e.preventDefault();

    if (e.touches.length === 1 && viewState.isDragging) {
      const dx = e.touches[0].clientX - viewState.lastX;
      const dy = e.touches[0].clientY - viewState.lastY;

      viewState.vx = dx;
      viewState.vy = dy;

      // Check if moved more than threshold
      const totalDx = Math.abs(e.touches[0].clientX - viewState.startX);
      const totalDy = Math.abs(e.touches[0].clientY - viewState.startY);
      if (totalDx > 10 || totalDy > 10) {
        viewState.hasMoved = true;
      }

      viewState.offsetX += dx;
      viewState.offsetY += dy;
      viewState.lastX = e.touches[0].clientX;
      viewState.lastY = e.touches[0].clientY;

      if (!viewState.renderTick) {
        viewState.renderTick = true;
        requestAnimationFrame(() => {
          render();
          viewState.renderTick = false;
        });
      }
    } else if (e.touches.length === 2) {
      const dist = getTouchDistance(e.touches);
      const scale = dist / touchStartDist;
      const newZoom = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, touchStartZoom * scale));

      if (newZoom !== viewState.zoom) {
        viewState.zoom = newZoom;
        viewState.targetZoom = newZoom;

        if (viewState.zoomRafId) {
          cancelAnimationFrame(viewState.zoomRafId);
          viewState.zoomRafId = null;
        }

        if (!viewState.renderTick) {
          viewState.renderTick = true;
          requestAnimationFrame(() => {
            render();
            viewState.renderTick = false;
          });
        }
      }
    }
  }

  function handleTouchEnd(e) {
    // Check click if single touch ended and didn't move
    if (viewState.isDragging && !viewState.hasMoved) {
      // Use changedTouches for the ended touch
      const touch = e.changedTouches[0];
      // Need correct offset on canvas?
      // clientX/Y are page coords. Canvas might have offset. 
      // Mouse events use e.offsetX. Touch doesn't have it standard.
      // We need rect.
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const nodeId = getNodeAtPoint(x, y); // Logical or physical? 
      // getNodeAtPoint uses Logical coords (input to it).
      // ScreenToWorld uses inputs directly...
      // `handleMouseMove` uses e.offsetX which is physical pixel distance on element?
      // `rect.width` is Logical.
      // `e.offsetX` is mouse pos relative to target padding box.
      // If canvas is styled 100%, offsetX matches CSS px.
      // Inside `getNodeAtPoint`, we compare with `screen.x` which uses `viewState.offsetX` (Logical).
      // So Inputs must be Logical.
      // `touch.clientX - rect.left` is Logical CSS pixel. Correct.

      if (nodeId && nodes[nodeId] && nodes[nodeId].isActive !== false) {
        setSelectedNode(nodeId);
        canvas.dispatchEvent(new CustomEvent('nodeSelected', {
          detail: { nodeId, node: nodes[nodeId] }
        }));
      }
    } else if (viewState.isDragging) {
      const maxSpeed = 12;
      viewState.vx = Math.max(-maxSpeed, Math.min(maxSpeed, viewState.vx));
      viewState.vy = Math.max(-maxSpeed, Math.min(maxSpeed, viewState.vy));

      if (Math.abs(viewState.vx) > 1 || Math.abs(viewState.vy) > 1) {
        viewState.rafId = requestAnimationFrame(momentumLoop);
      }
    }

    // Only stop dragging if no fingers left?
    if (e.touches.length === 0) {
      viewState.isDragging = false;
      viewState.hasMoved = false;
    }
  }

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getNodeAtPoint(x, y) {
    // Check nodes in reverse order (front to back)
    const nodeIds = Object.keys(nodeBounds).reverse();
    for (const id of nodeIds) {
      const bounds = nodeBounds[id];
      if (x >= bounds.x && x <= bounds.x + bounds.width &&
        y >= bounds.y && y <= bounds.y + bounds.height) {
        return id;
      }
    }
    return null;
  }

  // Zoom controls
  function zoomIn() {
    const nextTarget = Math.min(CONFIG.maxZoom, viewState.targetZoom + CONFIG.zoomStep);
    if (nextTarget !== viewState.targetZoom) {
      viewState.targetZoom = nextTarget;
      viewState.zoomFocus = { x: logicalWidth / 2, y: logicalHeight / 2 };

      if (!viewState.zoomRafId) {
        viewState.zoomRafId = requestAnimationFrame(smoothZoomLoop);
      }
    }
  }

  function zoomOut() {
    const nextTarget = Math.max(CONFIG.minZoom, viewState.targetZoom - CONFIG.zoomStep);
    if (nextTarget !== viewState.targetZoom) {
      viewState.targetZoom = nextTarget;
      viewState.zoomFocus = { x: logicalWidth / 2, y: logicalHeight / 2 };

      if (!viewState.zoomRafId) {
        viewState.zoomRafId = requestAnimationFrame(smoothZoomLoop);
      }
    }
  }

  function resetView() {
    viewState.zoom = 1.75;
    viewState.targetZoom = 1.75;
    if (viewState.zoomRafId) {
      cancelAnimationFrame(viewState.zoomRafId);
      viewState.zoomRafId = null;
    }
    centerView();
    render();
  }

  function clearSelection() {
    selectedNodeId = null;
    const pin = document.getElementById('astrolabe-pin');
    if (pin) pin.style.display = 'none';
    render();
  }

  // Utility
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  return {
    init,
    setData,
    setSelectedNode,
    getSelectedNode,
    clearSelection,
    render,
    zoomIn,
    zoomOut,
    resetView
  };
})();
