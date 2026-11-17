// Horizontal ₹100 note, drawn in the colours and layout of the current lavender
// Mahatma Gandhi (New) Series note, as an illustration for the animation.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {canvasTexture, roundRect} from '../three/util';

export const NOTE_W = 2.15; // real note is 142 x 66 mm
export const NOTE_H = 1.0;
const FONT = 'Poppins, sans-serif';

export const rupeeNoteTexture = () =>
  canvasTexture(1376, 640, (g, w, h) => {
    // base lavender with soft vignette
    const base = g.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, '#cdb9e8');
    base.addColorStop(0.45, '#d9cbef');
    base.addColorStop(1, '#bba6de');
    g.fillStyle = base;
    roundRect(g, 0, 0, w, h, 18);
    g.fill();

    // fine guilloche waves
    g.lineWidth = 1.4;
    for (let i = 0; i < 46; i++) {
      g.strokeStyle = `rgba(110,80,170,${0.08 + (i % 3) * 0.03})`;
      g.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = (i / 46) * h + Math.sin(x / 38 + i * 0.7) * 9 + Math.sin(x / 91 + i) * 6;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }

    // stepwell (Rani ki Vav) motif band behind centre-right
    g.strokeStyle = 'rgba(95,65,150,0.35)';
    g.lineWidth = 3;
    for (let r = 0; r < 5; r++) {
      const y = h * 0.32 + r * 42;
      g.strokeRect(w * 0.58 + r * 14, y, w * 0.24 - r * 28, 30);
      for (let k = 0; k < 6; k++) {
        const x = w * 0.6 + r * 14 + k * ((w * 0.22 - r * 28) / 6);
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x, y + 30);
        g.stroke();
      }
    }

    // watermark window on the left
    g.fillStyle = 'rgba(255,255,255,0.45)';
    g.beginPath();
    g.ellipse(w * 0.17, h * 0.5, 110, 150, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(120,95,170,0.18)';
    g.font = `800 120px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('100', w * 0.17, h * 0.53);

    // security thread
    g.fillStyle = 'rgba(70,120,140,0.75)';
    for (let y = 0; y < h; y += 28) g.fillRect(w * 0.33, y, 9, 18);

    // portrait medallion (illustrated)
    const cx = w * 0.46;
    const cy = h * 0.55;
    const rg = g.createRadialGradient(cx, cy, 10, cx, cy, 170);
    rg.addColorStop(0, 'rgba(255,255,255,0.55)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg;
    g.beginPath();
    g.arc(cx, cy, 170, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#4a3480';
    g.fillStyle = 'rgba(74,52,128,0.18)';
    g.lineWidth = 6;
    // shoulders
    g.beginPath();
    g.moveTo(cx - 130, cy + 170);
    g.quadraticCurveTo(cx - 120, cy + 60, cx, cy + 55);
    g.quadraticCurveTo(cx + 120, cy + 60, cx + 130, cy + 170);
    g.fill();
    g.stroke();
    // head
    g.beginPath();
    g.ellipse(cx, cy - 25, 62, 76, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    // ears
    [-1, 1].forEach((s) => {
      g.beginPath();
      g.ellipse(cx + s * 64, cy - 18, 13, 22, 0, 0, Math.PI * 2);
      g.stroke();
    });
    // round glasses
    g.lineWidth = 5;
    [-1, 1].forEach((s) => {
      g.beginPath();
      g.arc(cx + s * 26, cy - 30, 19, 0, Math.PI * 2);
      g.stroke();
    });
    g.beginPath();
    g.moveTo(cx - 7, cy - 30);
    g.lineTo(cx + 7, cy - 30);
    g.stroke();
    // smile
    g.beginPath();
    g.arc(cx, cy + 8, 22, 0.2 * Math.PI, 0.8 * Math.PI);
    g.stroke();

    // header text
    g.fillStyle = '#3d2a78';
    g.textAlign = 'center';
    g.font = `700 46px ${FONT}`;
    g.fillText('भारतीय रिज़र्व बैंक', w * 0.5, 62);
    g.font = `800 40px ${FONT}`;
    g.fillText('RESERVE BANK OF INDIA', w * 0.5, 112);
    g.font = `600 22px ${FONT}`;
    g.fillText('मैं धारक को सौ रुपये अदा करने का वचन देता हूँ', w * 0.5, h - 40);

    // denominations
    g.font = `800 92px ${FONT}`;
    g.textAlign = 'left';
    g.fillText('100', 36, 100);
    g.font = `800 70px ${FONT}`;
    g.fillText('१००', 40, h - 40);
    g.textAlign = 'right';
    // colour-shift ₹100
    const cs = g.createLinearGradient(w - 330, 0, w - 30, 0);
    cs.addColorStop(0, '#2e7d6b');
    cs.addColorStop(1, '#2a4f9e');
    g.fillStyle = cs;
    g.font = `800 130px ${FONT}`;
    g.fillText('₹100', w - 40, h - 60);

    // serial number
    g.fillStyle = '#b3261e';
    g.font = `700 34px ${FONT}`;
    g.fillText('4CK 527913', w - 40, 64);

    // Ashoka emblem (simplified)
    const ex = w * 0.9;
    const ey = h * 0.42;
    g.fillStyle = '#3d2a78';
    g.fillRect(ex - 34, ey + 40, 68, 14);
    g.fillRect(ex - 26, ey + 10, 52, 30);
    for (let k = -1; k <= 1; k++) {
      g.beginPath();
      g.arc(ex + k * 22, ey - 6, 16, 0, Math.PI * 2);
      g.fill();
    }
    g.strokeStyle = '#3d2a78';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(ex, ey + 25, 9, 0, Math.PI * 2);
    g.stroke();

    // border
    g.strokeStyle = '#6c52b0';
    g.lineWidth = 8;
    roundRect(g, 10, 10, w - 20, h - 20, 14);
    g.stroke();
  });

/** One vertical strip of the note, u0..u1 across the width. */
export const NoteStrip: React.FC<{tex: THREE.Texture; u0: number; u1: number}> = ({tex, u0, u1}) => {
  const geo = useMemo(() => {
    const gm = new THREE.PlaneGeometry(NOTE_W * (u1 - u0), NOTE_H);
    const uv = gm.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) === 0 ? u0 : u1);
    uv.needsUpdate = true;
    return gm;
  }, [u0, u1]);
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial map={tex} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geo} position={[0, 0, -0.01]} scale={[1 + 0.03 / (u1 - u0), 1.04, 1]}>
        <meshBasicMaterial color="#1d1238" />
      </mesh>
    </group>
  );
};
