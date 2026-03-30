// Gerencia orientação e layout do jogo
// PC: letterbox 16:9 sempre
// Mobile: vertical (padrão) ou horizontal

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "manguerun_layout";
const ASPECT = 800 / 560;

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.useAgent)
        || window.innerWidth <= 900;
}

function loadPreference() {
    try {
        return localStorage.getItem(STORAGE_KEY) ?? "vertical";
    } catch (_) {
        return "vertical";
    }
}

function savePreference(v) {
    try {
        localStorage.setItem(STORAGE_KEY, v);
    } catch (_) {}
}

// Calcula dimensões do canvas para letterbox 16:9
function calcLetterbox(winW, winH) {
    const byWidth = { w: winW, h: Math.round(winW / ASPECT) };
    const byHeight = { w: Math.round(winH * ASPECT), h: winH };
    return byWidth.h <= winH ? byWidth : byHeight;
}

export function useLayout() {
    const mobile = isMobile();
    const [orientation, setOrientation] = useState(loadPreference);
    const [winSize, setWinSize] = useState({
        w: window.innerWidth,
        h: window.innerHeight,
    });

    useEffect(() => {
        const onResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const setOrientationAndSave = useCallback((v) => {
        savePreference(v);
        setOrientation(v);
    }, []);

    // No PC sempre usa letterbox independente da preferência
    const isLandscape = !mobile || orientation === "horizontal";

    const CANVAS_W = 800;
    const CANVAS_H = 560;

    // Tamanho visual do canvas na tela
    let displayW, displayH, offsetX, offsetY;

    if (!mobile) {
        // PC: letterbox centralizado
        const lb = calcLetterbox(winSize.w, winSize.h);
        displayW = lb.w;
        displayH = lb.h;
        offsetX = Math.round((winSize.w - lb.w) / 2);
        offsetY = Math.round((winSize.h - lb.h) / 2);
    } else if (orientation === "horizontal") {
        // Mobile landscape: ocupa toda a tela
        displayW = winSize.w;
        displayH = winSize.h;
        offsetX = 0;
        offsetY = 0;
    } else {
        // Mobile portrait: ocupa largura total, altura proporcional
        displayW = winSize.w;
        displayH = Math.round(winSize.w / ASPECT);
        offsetX = 0;
        offsetY = 0;
    }

    return {
        mobile,
        orientation,
        setOrientation: setOrientationAndSave,
        isLandscape,
        canvas: { logicalW: CANVAS_W, logicalH: CANVAS_H, displayW, displayH, offsetX, offsetY },
    };
}