interface Anchor {
  x: number;
  y: number;
}

interface Path {
  n1: Anchor;
  n2: Anchor;
  cpx: number;
  cpy: number;
}

interface Particle {
  path: Path;
  t: number;
  speed: number;
  color: string;
}

export function mountAboutNetwork(c: HTMLCanvasElement): void {
  const cx = c.getContext("2d");
  if (!cx) return;

  let nodes: Anchor[] = [];
  let paths: Path[] = [];
  let parts: Particle[] = [];

  function init(): void {
    nodes = [
      { x: c.width * 0.5, y: c.height * 0.25 },
      { x: c.width * 0.2, y: c.height * 0.55 },
      { x: c.width * 0.8, y: c.height * 0.55 },
      { x: c.width * 0.35, y: c.height * 0.82 },
      { x: c.width * 0.65, y: c.height * 0.82 },
    ];
    const edges: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [1, 2],
    ];
    paths = edges.map(([a, b]) => {
      const n1 = nodes[a]!;
      const n2 = nodes[b]!;
      return {
        n1,
        n2,
        cpx: (n1.x + n2.x) / 2 + (Math.random() - 0.5) * 50,
        cpy: (n1.y + n2.y) / 2 + (Math.random() - 0.5) * 50,
      };
    });
    parts = [];
    for (const p of paths) {
      parts.push({
        path: p,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.003,
        color: Math.random() < 0.5 ? "#4cc9f0" : "#8b5cf6",
      });
    }
  }

  function resize(): void {
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
    init();
  }

  function pt(p: Path, t: number): { x: number; y: number } {
    const u = 1 - t;
    return {
      x: u * u * p.n1.x + 2 * u * t * p.cpx + t * t * p.n2.x,
      y: u * u * p.n1.y + 2 * u * t * p.cpy + t * t * p.n2.y,
    };
  }

  function loop(): void {
    if (!cx) return;
    cx.clearRect(0, 0, c.width, c.height);
    for (const p of paths) {
      cx.strokeStyle = "rgba(255,255,255,0.08)";
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(p.n1.x, p.n1.y);
      cx.quadraticCurveTo(p.cpx, p.cpy, p.n2.x, p.n2.y);
      cx.stroke();
    }
    for (const part of parts) {
      part.t += part.speed;
      if (part.t > 1) part.t = 0;
      for (let i = 0; i < 10; i++) {
        const t = part.t - i * 0.012;
        if (t < 0) continue;
        const p = pt(part.path, t);
        const a = (1 - i / 10) * 0.85;
        cx.fillStyle =
          part.color + Math.floor(a * 255).toString(16).padStart(2, "0");
        cx.beginPath();
        cx.arc(p.x, p.y, 2.2 - i * 0.15, 0, Math.PI * 2);
        cx.fill();
      }
    }
    for (const node of nodes) {
      const grad = cx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 14);
      grad.addColorStop(0, "rgba(76, 201, 240, 0.4)");
      grad.addColorStop(1, "rgba(76, 201, 240, 0)");
      cx.fillStyle = grad;
      cx.beginPath();
      cx.arc(node.x, node.y, 14, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = "#fff";
      cx.beginPath();
      cx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      cx.fill();
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  resize();
  loop();
}
