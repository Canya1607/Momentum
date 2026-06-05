/**
 * Generates app icon (1024×1024) and splash screen (1284×2778) for Momentum.
 * Run once: node scripts/generate-assets.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';

const PRIMARY   = '#6366f1';
const DARK      = '#4f46e5';

// ─── Icon SVG (1024×1024) ────────────────────────────────────────────────────
// Indigo gradient background, rounded white check inside a circle,
// subtle ✦ mark bottom-right.
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
    <linearGradient id="circleFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.08)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>

  <!-- Soft inner circle -->
  <circle cx="512" cy="490" r="280" fill="url(#circleFill)"/>

  <!-- Checkmark — bold, white -->
  <polyline
    points="340,500 450,620 690,370"
    fill="none"
    stroke="white"
    stroke-width="72"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- ✦ brand mark, bottom-right -->
  <text
    x="820" y="910"
    font-family="Georgia, serif"
    font-size="96"
    fill="rgba(255,255,255,0.45)"
    text-anchor="middle"
  >✦</text>
</svg>
`.trim();

// ─── Splash SVG (1284×2778 — iPhone 14 Pro Max logical) ──────────────────────
const splashSvg = `
<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sbg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <linearGradient id="sc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.2)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.06)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1284" height="2778" fill="url(#sbg)"/>

  <!-- Decorative circle behind icon -->
  <circle cx="642" cy="1280" r="320" fill="url(#sc)"/>

  <!-- Icon circle -->
  <circle cx="642" cy="1280" r="210" fill="rgba(255,255,255,0.15)"/>

  <!-- Checkmark -->
  <polyline
    points="510,1285 600,1385 780,1185"
    fill="none"
    stroke="white"
    stroke-width="56"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Wordmark -->
  <text
    x="642" y="1570"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="96"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    letter-spacing="4"
  >Momentum</text>

  <!-- Tagline -->
  <text
    x="642" y="1660"
    font-family="-apple-system, Helvetica, sans-serif"
    font-size="48"
    fill="rgba(255,255,255,0.65)"
    text-anchor="middle"
    letter-spacing="2"
  >build habits that stick</text>
</svg>
`.trim();

// ─── Write files ─────────────────────────────────────────────────────────────

const OUT_ICON   = 'assets/images/icon.png';
const OUT_SPLASH = 'assets/images/splash-icon.png';
const OUT_FAVICON = 'assets/images/favicon.png';

await sharp(Buffer.from(iconSvg))
  .png()
  .toFile(OUT_ICON);
console.log(`✓ ${OUT_ICON}`);

await sharp(Buffer.from(splashSvg))
  .png()
  .toFile(OUT_SPLASH);
console.log(`✓ ${OUT_SPLASH}`);

// Favicon — 48×48 version of the icon
await sharp(Buffer.from(iconSvg))
  .resize(48, 48)
  .png()
  .toFile(OUT_FAVICON);
console.log(`✓ ${OUT_FAVICON}`);

// Android adaptive icon — foreground (transparent bg, centered mark)
const androidFgSvg = `
<svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
  <polyline
    points="116,216 186,296 320,152"
    fill="none"
    stroke="white"
    stroke-width="36"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`.trim();

await sharp(Buffer.from(androidFgSvg))
  .resize(432, 432)
  .png()
  .toFile('assets/images/android-icon-foreground.png');
console.log('✓ assets/images/android-icon-foreground.png');

console.log('\nAll assets generated.');
