// Camadas de parallax - Fase 1: Praia do Pina

export const parallaxBeach = (W) => [
    {
        // Nuvens suaves no céu
        speed: 0.08,
        alpha: 0.5,
        draw(ctx, tx, H) {
            const clouds = [
                { x: 60, y: H * 0.12, w: 120, h: 28 },
                { x: 280, y: H * 0.8, w: 160, h: 32 },
                { x: 520, y: H * 0.14, w: 100, h: 24 },
                { x: 720, y: H * 0.10, w: 140, h: 30 },
            ];
            for (const c of clouds) {
                ctx.fillStyle = "#4a8ab0";
                ctx.fillRect(tx + c.x, c.y, c.w, c.h);
                ctx.fillStyle = "#6aaac8";
                ctx.fillRect(tx + c.x + 8, c.y - 8, c.w - 16, 12);
            }
        },
    },
    {
        // Faixa de mar com reflexo de luz
        speed: 0.2,
        alpha: 0.35,
        draw(ctx, tx, H) {
            ctx.fillStyle = "#1e5878";
            ctx.fillRect(tx, H * 0.62, W, H * 0.15);
            ctx.fillStyle = "#2a7898";
            ctx.fillRect(tx + 40, H * 0.64, 60, 4);
            ctx.fillRect(tx + 200, H * 0.67, 40, 3);
            ctx.fillRect(tx + 500, H * 0.65, 80, 4);
            ctx.fillRect(tx + 700, H * 0.68, 50, 3);
        },
    },
    {
        // Ondas na beira da areia
        speed: 0.4,
        alpha: 0.4,
        draw(ctx, tx, H) {
            ctx.fillStyle = "#2a7898";
            const waveY = H * 0.82;
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(tx + i * 200, waveY + i * 3, 120, 3);
                ctx.fillRect(tx + i * 200 + 140, waveY + i * 3 + 1, 40, 2);
            }
        },
    },
];