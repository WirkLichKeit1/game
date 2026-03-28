// Camadas de parallax - Fase 2: Capibaribe

export const parallaxMangrove = (W) => [
    {
        // Névoa
        speed: 0.06,
        alpha: 0.18,
        draw(ctx, tx, H) {
            ctx.fillStyle = "#2a5a38";
            ctx.fillRect(tx, H * 0.45, W, 18);
            ctx.fillRect(tx + 100, H * 0.52, W * 0.7, 12);
            ctx.fillRect(tx + 300, H * 0.38, W * 0.5, 10);
        },
    },
    {
        // Silhueta de arvore de mangue
        speed: 0.18,
        alpha: 0.55,
        draw(ctx, tx, H) {
            const trees = [
                { x: 30, h: 140 }, { x: 110, h: 110 }, { x: 200, h: 160 },
                { x: 310, h: 120 }, { x: 400, h: 150 }, { x: 510, h: 130 },
                { x: 600, h: 145 }, { x: 700, h: 115 }, { x: 790, h: 155 },
            ];
            ctx.fillStyle = "#122a1c";
            for (const t of trees) {
                ctx.fillRect(tx + t.x + 14, H - t.h, 8, t.h);
                ctx.beginPath();
                ctx.moveTo(tx + t.x, H - t.h + 20);
                ctx.lineTo(tx + t.x + 36, H - t.h + 20);
                ctx.lineTo(tx + t.x + 18, H - t.h - 30);
                ctx.fill();
            }
        },
    },
    {
        // Reflexo ondulado do rio
        speed: 0.38,
        alpha: 0.3,
        draw(ctx, tx, H) {
            ctx.fillStyle = "#0a2e1c";
            ctx.fillRect(tx, H * 0.78, W, 6);
            ctx.fillRect(tx, H * 0.83, W, 4);
            ctx.fillStyle = "#122a1c";
            ctx.fillRect(tx + 60, H * 0.80, 80, 2);
            ctx.fillRect(tx + 300, H * 0.81, 60, 2);
            ctx.fillRect(tx + 600, H * 0.79, 100, 2);
        },
    },
];