(() => {
  const button = document.querySelector('.footer-signature');
  const svg = button.querySelector('svg');
  const ns = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(ns, 'defs');
  const gradient = document.createElementNS(ns, 'radialGradient');
  gradient.id = 'footer-copper-tint';
  gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
  gradient.setAttribute('r', '230');
  [[0,1],[0.45,0.94],[1,0]].forEach(([offset,opacity]) => {
    const stop = document.createElementNS(ns, 'stop');
    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', '#ffffff');
    stop.setAttribute('stop-opacity', opacity);
    gradient.append(stop);
  });
  defs.append(gradient);
  const mask = document.createElementNS(ns, 'mask');
  mask.id = 'footer-tint-mask';
  mask.setAttribute('maskUnits', 'userSpaceOnUse');
  mask.setAttribute('x', '0'); mask.setAttribute('y', '0');
  mask.setAttribute('width', '1320'); mask.setAttribute('height', '408');
  const field = document.createElementNS(ns, 'rect');
  field.setAttribute('width', '1320'); field.setAttribute('height', '408');
  field.setAttribute('fill', 'url(#footer-copper-tint)');
  mask.append(field); defs.append(mask);
  const overlay = document.createElementNS(ns, 'g');
  overlay.classList.add('signature-tint');
  // Keep the original paths and transforms, so both layers match exactly.
  [...svg.children].forEach(child => overlay.append(child.cloneNode(true)));
  overlay.querySelectorAll('path').forEach(path => path.setAttribute('fill', '#c78c6b'));
  overlay.setAttribute('mask', 'url(#footer-tint-mask)');
  svg.append(defs, overlay);
  button.removeAttribute('aria-pressed');
  button.setAttribute('aria-label', 'Explorar el cobre sobre el logo de NODO');
  let x = 660, y = 204, targetX = x, targetY = y, alpha = 0, targetAlpha = 0, frame = 0, last = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function draw(time) {
    const dt = Math.min(64, time - (last || time - 16)); last = time;
    const follow = reduced.matches ? 1 : 1 - Math.exp(-dt / 65);
    const fade = reduced.matches ? 1 : 1 - Math.exp(-dt / (targetAlpha ? 100 : 240));
    x += (targetX - x) * follow; y += (targetY - y) * follow;
    alpha += (targetAlpha - alpha) * fade;
    gradient.setAttribute('cx', x); gradient.setAttribute('cy', y);
    overlay.style.opacity = alpha;
    if (Math.abs(targetX-x) + Math.abs(targetY-y) > .1 || Math.abs(targetAlpha-alpha) > .002) frame = requestAnimationFrame(draw);
    else { frame = 0; last = 0; overlay.style.opacity = targetAlpha; }
  }
  function update(event) {
    const rect = svg.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width * 1320;
    targetY = (event.clientY - rect.top) / rect.height * 408;
    if (alpha < .01) { x = targetX; y = targetY; }
    targetAlpha = 1;
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function leave() { targetAlpha = 0; if (!frame) frame = requestAnimationFrame(draw); }
  button.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') update(e); });
  button.addEventListener('pointermove', update);
  button.addEventListener('pointerdown', update);
  button.addEventListener('pointerleave', leave);
  button.addEventListener('pointercancel', leave);
  button.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') leave(); });
  button.addEventListener('focus', () => { targetX = 660; targetY = 204; targetAlpha = 1; if (!frame) frame = requestAnimationFrame(draw); });
  button.addEventListener('blur', leave);
})();
