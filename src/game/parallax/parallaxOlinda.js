// Camada de parallax - Fase 3: Olinda Alta

export const parallaxOlinda = (W) => [
    {
        // Nuvens alaranjadas de entardecer
        speed: 0.07,
        alpha: 0.45,
        draw(ctx, tx, H) {
            const clouds = [
                { x: 40,  y: H * 0.10, w: 140, h: 22 },
                { x: 260, y: H * 0.07, w: 100, h: 18 },
                { x: 480, y: H * 0.12, w: 160, h: 24 },
                { x: 700, y: H * 0.09, w: 120, h: 20 },
            ];
            for (const c of clouds) {
                ctx.fillStyle = "#8a3a18";
                ctx.fillRect(tx + c.x, c.y, c.w, c.h);
                ctx.fillStyle = "#6a2a18";
                ctx.fillRect(tx + c.x + 6, c.y - 6, c.w - 12, 10);
            }
        },
    },
    {
        // Silhueta de casarões coloniais
        speed: 0.2,
        alpha: 0.6,
        draw(ctx, tx, H) {
            const houses = [
                { x: 0,   w: 80, h: 120, roof: 16 },
                { x: 85,  w: 60, h: 100, roof: 14 },
                { x: 150, w: 90, h: 140, roof: 18 },
                { x: 245, w: 70, h: 110, roof: 15 },
                { x: 320, w: 85, h: 130, roof: 17 },
                { x: 410, w: 65, h: 105, roof: 14 },
                { x: 480, w: 95, h: 145, roof: 18 },
                { x: 580, w: 75, h: 115, roof: 16 },
                { x: 660, w: 80, h: 125, roof: 17 },
                { x: 745, w: 60, h: 100, roof: 14 },
            ];
            for (const h of houses) {
                ctx.fillStyle = "#2a1a0e";
                const baseY = H - h.h;
                ctx.fillRect(tx + h.x, baseY, h.w, h.h);
                ctx.beginPath();
                ctx.moveTo(tx + h.x - 4, baseY);
                ctx.lineTo(tx + h.x + h.w + 4, baseY);
                ctx.lineTo(tx + h.x + h.w / 2, baseY - h.roof);
                ctx.fill();
                // Janelas
                ctx.fillStyle = "#d4601a";
                ctx.fillRect(tx + h.x + 10, H - h.h + 20, 12, 16);
                if (h.w > 70) {
                    ctx.fillRect(tx + h.x + h.w - 22, H - h.h + 20, 12, 16);
                }
            }
        },
    },
];