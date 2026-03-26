// Axis-Aligned Bounding Box - colisão entre dois retângulos
// Retorna o quanto um corpo está penetrando o outro (overlap)
// e de qual lado veio a colisão

export function resolveAABB(moving, static_) {
    const m = moving.bounds;
    const s = static_.bounds;

    // Sem colisão
    if (m.right <= s.left || m.left >= s.right || m.bottom <= s.top || m.top >= s.bottom) {
        return null;
    }

    // Calcula overlap em cada eixo
    const overlapX = Math.min(m.right - s.left, s.right - m.left);
    const overlapY = Math.min(m.bottom - s.top, s.bottom - m.top);

    // Resolve pelo eixo de menor penetração
    if (overlapY < overlapX) {
        if (m.bottom - s.top < s.bottom -m.top) {
            // Colisão por cima - player caindo em cima da plataforma
            return { axis: "y", direction: "bottom", overlap: overlapY };
        } else {
            // Colisão por baixo - player bateu a cabeça
            return { axis: "y", direction: "top", overlap: overlapY };
        }
    } else {
        if (m.right - s.left < s.right - m.left) {
            return { axis: "x", direction: "right", overlap: overlapX };
        } else {
            return { axis: "x", direction: "left", overlap: overlapX };
        }
    }
}