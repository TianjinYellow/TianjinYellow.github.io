(function () {
  if (!document.body.matches(".home-page, .lab-page")) return;

  const canvas = document.createElement("canvas");
  canvas.className = "rain-layer";
  canvas.setAttribute("aria-hidden", "true");
  const context = canvas.getContext("2d");
  if (!context) return;
  document.body.prepend(canvas);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let drops = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastTime = 0;

  function makeDrop(initial) {
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : -40,
      length: 9 + Math.random() * 25,
      speed: 38 + Math.random() * 72,
      opacity: 0.08 + Math.random() * 0.15,
      thickness: 0.45 + Math.random() * 0.55,
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(120, Math.max(24, Math.round((width * height) / 16000)));
    drops = Array.from({ length: count }, function () { return makeDrop(true); });
  }

  function draw(time) {
    if (reducedMotion.matches || document.hidden) {
      frame = 0;
      lastTime = 0;
      return;
    }
    const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    context.clearRect(0, 0, width, height);
    const color = document.documentElement.getAttribute("data-theme") === "dark"
      ? "205, 231, 229" : "82, 126, 123";
    drops.forEach(function (drop, index) {
      drop.y += drop.speed * elapsed;
      if (drop.y - drop.length > height) drops[index] = makeDrop(false);
      const gradient = context.createLinearGradient(drop.x, drop.y - drop.length, drop.x, drop.y);
      gradient.addColorStop(0, "rgba(" + color + ", 0)");
      gradient.addColorStop(1, "rgba(" + color + ", " + drop.opacity + ")");
      context.strokeStyle = gradient;
      context.lineWidth = drop.thickness;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(drop.x - drop.length * 0.08, drop.y - drop.length);
      context.lineTo(drop.x, drop.y);
      context.stroke();
    });
    frame = requestAnimationFrame(draw);
  }

  function updateMotion() {
    if (reducedMotion.matches || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      context.clearRect(0, 0, width, height);
    } else if (!frame) {
      frame = requestAnimationFrame(draw);
    }
  }

  resize();
  updateMotion();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", updateMotion);
  reducedMotion.addEventListener("change", updateMotion);
})();
