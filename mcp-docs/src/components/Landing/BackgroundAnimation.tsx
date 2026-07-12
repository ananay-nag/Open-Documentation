import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  text?: string;
  colorIndex: number;
}

export const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const textPool = [
      '@RegisterServer()',
      '@UseServer()',
      '@Tool()',
      '@Prompt()',
      '@Resource()',
      '@CallTool()',
      '@ListTools()',
      '@GetPrompt()',
      '@ReadResource()',
      'McpServer',
      'TypeScript SDK',
      'decorators',
      'JSON-RPC',
      'SSETransport',
      'HonoTransport',
      'ExpressTransport',
      'Model Context Protocol',
      'type-safe routing',
      'MCP'
    ];

    const isMobile = width < 768;
    const nodes: Node[] = [];
    const nodeCount = isMobile ? 12 : Math.min(42, Math.floor((width * height) / 32000));

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      const isText = i < textPool.length && !isMobile;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: isText ? 0 : Math.random() * 2 + 1,
        text: isText ? textPool[i] : undefined,
        colorIndex: Math.floor(Math.random() * 3)
      });
    }

    // Shifting mesh gradient specs
    const meshPoints = [
      { x: 0.15, y: 0.25, r: 0.45, angle: 0, speed: 0.0006 },
      { x: 0.85, y: 0.35, r: 0.55, angle: Math.PI, speed: 0.0005 },
      { x: 0.5, y: 0.8, r: 0.5, angle: Math.PI / 2, speed: 0.0007 }
    ];

    let lastScrollY = window.scrollY;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // Resolve colors and stroke/fill values based on theme
      let nodeColors: string[];
      let lineStroke: string;
      let gridStroke: string;
      let nodeBg: string;
      let nodeBorderAlpha: number;
      let textAlpha: number;
      let dotAlpha: number;
      let lineAlphaMax: number;

      if (isDark) {
        // Dark theme: light, little pink shade and visible
        nodeColors = [
          'rgba(244, 114, 182, ',  // Pink-400 (#F472B6)
          'rgba(249, 168, 212, ',  // Pink-300 (#F9A8D4)
          'rgba(236, 72, 153, ',   // Pink-500 (#EC4899)
        ];
        lineStroke = 'rgba(244, 114, 182, 0.078)';
        gridStroke = 'rgba(244, 14, 132, 0.04)'; // faint pink grid
        nodeBg = 'rgba(15, 23, 42, 0.15)'; // dark block bg
        nodeBorderAlpha = 0.08;
        textAlpha = 0.40;      // dim pink text
        dotAlpha = 0.20;       // dim dots
        lineAlphaMax = 0.12;   // dim lines
      } else {
        // Light theme: little dark, dark grey, dark blue and visible
        nodeColors = [
          'rgba(30, 41, 59, ',    // Slate-800 (#1E293B)
          'rgba(30, 58, 138, ',   // Blue-900 (#1E3A8A)
          'rgba(71, 85, 105, ',   // Slate-600 (#475569)
        ];
        lineStroke = 'rgba(30, 41, 59, ';
        gridStroke = 'rgba(145, 3, 135, 0.03)'; // faint dark grid
        nodeBg = 'rgba(169, 91, 195, 0.02)'; // light block bg
        nodeBorderAlpha = 0.08;
        textAlpha = 0.16;      // dim dark text
        dotAlpha = 0.12;       // dim dots
        lineAlphaMax = 0.10;   // dim lines
      }

      // 1. Shifting Deep Mesh Gradient Background
      meshPoints.forEach((p, idx) => {
        p.angle += p.speed;
        const xOffset = Math.cos(p.angle) * 0.06 * width;
        const yOffset = Math.sin(p.angle) * 0.06 * height;
        const gx = p.x * width + xOffset;
        const gy = p.y * height + yOffset - (currentScrollY * 0.12);

        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, p.r * width);

        let pColor: string;
        let alpha: number;
        if (isDark) {
          pColor = idx === 0 ? 'rgba(244, 114, 182, ' : idx === 1 ? 'rgba(219, 39, 119, ' : 'rgba(124, 58, 237, ';
          alpha = 0.08;
        } else {
          pColor = idx === 0 ? 'rgba(30, 58, 138, ' : idx === 1 ? 'rgba(71, 85, 105, ' : 'rgba(15, 23, 42, ';
          alpha = 0.035;
        }

        grad.addColorStop(0, pColor + `${alpha})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // 2. Isometric Grid Background (Desktop Only for Performance Cap)
      if (!isMobile) {
        ctx.strokeStyle = gridStroke;
        ctx.lineWidth = 1;
        const gridSpacing = 84;
        const scrollParallaxOffset = currentScrollY * 0.28;

        for (let c = -height; c < width + height; c += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, c + scrollParallaxOffset * 0.5);
          ctx.lineTo(width, width * 0.5 + c + scrollParallaxOffset * 0.5);
          ctx.stroke();
        }

        for (let c = 0; c < width + height * 2; c += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, c - scrollParallaxOffset * 0.5);
          ctx.lineTo(width, -width * 0.5 + c - scrollParallaxOffset * 0.5);
          ctx.stroke();
        }
      }

      // Smooth scroll interpolation (LERP)
      currentScrollY += (targetScrollY - currentScrollY) * 0.085;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // 3. Floating Node Networks
      if (!isMobile) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = 170;
            if (dist < maxDist) {
              const alpha = ((maxDist - dist) / maxDist) * lineAlphaMax;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = lineStroke + `${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      // Draw and update nodes
      nodes.forEach((node) => {
        node.y -= scrollDiff * 0.15;

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -50) node.x = width + 50;
        if (node.x > width + 50) node.x = -50;
        if (node.y < -50) node.y = height + 50;
        if (node.y > height + 50) node.y = -50;

        const nodeColor = nodeColors[node.colorIndex];

        if (node.text) {
          ctx.font = '500 11px monospace';
          const textWidth = ctx.measureText(node.text).width;

          ctx.beginPath();
          ctx.roundRect(node.x - 6, node.y - 12, textWidth + 12, 18, 4);
          ctx.fillStyle = nodeBg;
          ctx.fill();
          ctx.strokeStyle = nodeColor + `${nodeBorderAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = nodeColor + `${textAlpha})`;
          ctx.fillText(node.text, node.x, node.y + 1);
        } else {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fillStyle = nodeColor + `${dotAlpha})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none transition-colors duration-200"
    />
  );
};
