interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
}

interface Anchor {
  x: number;
  y: number;
}

interface FlowPath {
  n1: Anchor;
  n2: Anchor;
  cpx: number;
  cpy: number;
}

interface Particle {
  path: FlowPath;
  t: number;
  speed: number;
  color: string;
}

export function mountNetworkBackground(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let nodes: Node[] = [];
  let flowPaths: FlowPath[] = [];
  let particles: Particle[] = [];
  const mouse = { x: -1000, y: -1000 };

  function init(): void {
    nodes = [];
    const count = Math.floor((canvas.width * canvas.height) / 22000);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.6,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    flowPaths = [];
    particles = [];
    const anchors: Anchor[] = [];
    for (let i = 0; i < 5; i++) {
      anchors.push({
        x: (0.1 + 0.8 * Math.random()) * canvas.width,
        y: (0.1 + 0.8 * Math.random()) * canvas.height,
      });
    }
    for (let i = 0; i < anchors.length; i++) {
      const targets = [(i + 1) % anchors.length, (i + 2) % anchors.length];
      for (const j of targets) {
        if (i >= j) continue;
        const n1 = anchors[i]!;
        const n2 = anchors[j]!;
        flowPaths.push({
          n1,
          n2,
          cpx: (n1.x + n2.x) / 2 + (Math.random() - 0.5) * 240,
          cpy: (n1.y + n2.y) / 2 + (Math.random() - 0.5) * 240,
        });
      }
    }
    for (const path of flowPaths) {
      const c = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < c; i++) {
        particles.push({
          path,
          t: Math.random(),
          speed: 0.0012 + Math.random() * 0.0025,
          color: Math.random() < 0.55 ? "#4cc9f0" : "#8b5cf6",
        });
      }
    }
  }

  function pt(p: FlowPath, t: number): { x: number; y: number } {
    const u = 1 - t;
    return {
      x: u * u * p.n1.x + 2 * u * t * p.cpx + t * t * p.n2.x,
      y: u * u * p.n1.y + 2 * u * t * p.cpy + t * t * p.n2.y,
    };
  }

  function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  }

  function draw(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.02;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(76, 201, 240, ${(1 - d / 130) * 0.13})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (d < 220) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - d / 220) * 0.45})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    for (const p of flowPaths) {
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.n1.x, p.n1.y);
      ctx.quadraticCurveTo(p.cpx, p.cpy, p.n2.x, p.n2.y);
      ctx.stroke();
    }

    for (const part of particles) {
      part.t += part.speed;
      if (part.t > 1) part.t = 0;
      for (let i = 0; i < 14; i++) {
        const t = part.t - i * 0.008;
        if (t < 0) continue;
        const p = pt(part.path, t);
        const a = (1 - i / 14) * 0.65;
        ctx.fillStyle =
          part.color + Math.floor(a * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 - i * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const n of nodes) {
      const pulse = (Math.sin(n.pulse) + 1) * 0.5;
      ctx.fillStyle = `rgba(76, 201, 240, ${0.35 + pulse * 0.35})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + pulse * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  draw();
}
