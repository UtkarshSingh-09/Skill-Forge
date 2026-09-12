/**
 * Wokwi Breadboard Web Component.
 * Implements a high-fidelity 400-tie-point solderless half-size breadboard
 * with top/bottom dual power rails, center divider trough, and 30x10 tie-point grid.
 */

export function generateBreadboardSvg(width = 540, height = 310): string {
  const colStart = 45;
  const colPitch = 15;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="display:block;filter:drop-shadow(0 6px 12px rgba(0,0,0,0.35));">
    <defs>
      <rect id="bb-hole" width="7" height="7" rx="1.5" fill="#1C1F24" stroke="#D1D5DB" stroke-width="0.6"/>
      <rect id="bb-pin" width="3" height="3" fill="#8E9399" x="2" y="2"/>
    </defs>
    <!-- Breadboard Body -->
    <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="12" fill="#F4F1EA" stroke="#CFCABF" stroke-width="2"/>
    
    <!-- Top Positive Rail (+) -->
    <line x1="35" y1="23" x2="${width - 35}" y2="23" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
    <text x="20" y="28" font-family="monospace, sans-serif" font-size="15" font-weight="bold" fill="#EF4444">+</text>
    <text x="${width - 25}" y="28" font-family="monospace, sans-serif" font-size="15" font-weight="bold" fill="#EF4444">+</text>
    
    <!-- Top Negative Rail (-) -->
    <line x1="35" y1="62" x2="${width - 35}" y2="62" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
    <text x="20" y="66" font-family="monospace, sans-serif" font-size="18" font-weight="bold" fill="#2563EB">-</text>
    <text x="${width - 25}" y="66" font-family="monospace, sans-serif" font-size="18" font-weight="bold" fill="#2563EB">-</text>

    <!-- Bottom Negative Rail (-) -->
    <line x1="35" y1="258" x2="${width - 35}" y2="258" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
    <text x="20" y="262" font-family="monospace, sans-serif" font-size="18" font-weight="bold" fill="#2563EB">-</text>
    <text x="${width - 25}" y="262" font-family="monospace, sans-serif" font-size="18" font-weight="bold" fill="#2563EB">-</text>

    <!-- Bottom Positive Rail (+) -->
    <line x1="35" y1="297" x2="${width - 35}" y2="297" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
    <text x="20" y="302" font-family="monospace, sans-serif" font-size="15" font-weight="bold" fill="#EF4444">+</text>
    <text x="${width - 25}" y="302" font-family="monospace, sans-serif" font-size="15" font-weight="bold" fill="#EF4444">+</text>

    <!-- Center Divider Trough -->
    <rect x="8" y="156" width="${width - 16}" height="15" rx="3" fill="#DFDAD0" stroke="#CBC5B8" stroke-width="1"/>
    <text x="${width / 2}" y="167" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="800" fill="#9CA3AF" text-anchor="middle" letter-spacing="3">SKILLFORGE LAB BREADBOARD</text>
  `;

  // Column numbers (1, 5, 10, 15, 20, 25, 30)
  const colNums = [1, 5, 10, 15, 20, 25, 30];
  for (let c = 1; c <= 30; c++) {
    const x = colStart + (c - 1) * colPitch;
    if (colNums.includes(c)) {
      svg += `<text x="${x + 3.5}" y="76" font-family="monospace, sans-serif" font-size="9" font-weight="bold" fill="#6B7280" text-anchor="middle">${c}</text>`;
      svg += `<text x="${x + 3.5}" y="252" font-family="monospace, sans-serif" font-size="9" font-weight="bold" fill="#6B7280" text-anchor="middle">${c}</text>`;
    }
  }

  // Row letters
  const rowsTop = ["A", "B", "C", "D", "E"];
  const yTop = [88, 103, 118, 133, 148];
  rowsTop.forEach((r, idx) => {
    svg += `<text x="24" y="${yTop[idx] + 6}" font-family="monospace, sans-serif" font-size="9" font-weight="bold" fill="#6B7280" text-anchor="middle">${r}</text>`;
    svg += `<text x="${width - 24}" y="${yTop[idx] + 6}" font-family="monospace, sans-serif" font-size="9" font-weight="bold" fill="#6B7280" text-anchor="middle">${r}</text>`;
  });

  const rowsBottom = ["F", "G", "H", "I", "J"];
  const yBottom = [181, 196, 211, 226, 241];
  rowsBottom.forEach((r, idx) => {
    svg += `<text x="24" y="${yBottom[idx] + 6}" font-family="monospace, sans-serif" font-size="9" font-weight="bold" fill="#6B7280" text-anchor="middle">${r}</text>`;
    svg += `<text x="${width - 24}" y="${yBottom[idx] + 6}" font-family="monospace, sans-serif" font-size="9" font-weight="bold" fill="#6B7280" text-anchor="middle">${r}</text>`;
  });

  // Power Rail Holes (30 columns)
  for (let c = 1; c <= 30; c++) {
    const x = colStart + (c - 1) * colPitch;
    svg += `<use href="#bb-hole" x="${x}" y="32"/><use href="#bb-pin" x="${x}" y="32"/>`;
    svg += `<use href="#bb-hole" x="${x}" y="46"/><use href="#bb-pin" x="${x}" y="46"/>`;
    svg += `<use href="#bb-hole" x="${x}" y="267"/><use href="#bb-pin" x="${x}" y="267"/>`;
    svg += `<use href="#bb-hole" x="${x}" y="281"/><use href="#bb-pin" x="${x}" y="281"/>`;
  }

  // Terminal Strip Holes (30 columns x 5 rows top + 5 rows bottom)
  for (let c = 1; c <= 30; c++) {
    const x = colStart + (c - 1) * colPitch;
    for (let r = 0; r < 5; r++) {
      svg += `<use href="#bb-hole" x="${x}" y="${yTop[r]}"/><use href="#bb-pin" x="${x}" y="${yTop[r]}"/>`;
      svg += `<use href="#bb-hole" x="${x}" y="${yBottom[r]}"/><use href="#bb-pin" x="${x}" y="${yBottom[r]}"/>`;
    }
  }

  svg += `</svg>`;
  return svg;
}

export class WokwiBreadboard extends HTMLElement {
  connectedCallback() {
    this.style.display = 'inline-block';
    this.innerHTML = generateBreadboardSvg();
  }
}

export class WokwiBreadboardHalf extends WokwiBreadboard {}

export function registerBreadboard(): void {
  if (typeof customElements !== 'undefined') {
    try {
      if (!customElements.get('wokwi-breadboard')) {
        customElements.define('wokwi-breadboard', WokwiBreadboard);
      }
    } catch (e) { /* ignore if already registered */ }
    try {
      if (!customElements.get('wokwi-breadboard-half')) {
        customElements.define('wokwi-breadboard-half', WokwiBreadboardHalf);
      }
    } catch (e) { /* ignore if already registered */ }
  }
}
