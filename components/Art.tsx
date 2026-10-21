// Original line illustrations. They are drawn with `pathLength="1"` so the
// motion layer can draw each stroke by animating stroke-dashoffset 1 → 0.
const line = { className: "bp-line", pathLength: 1 } as const;

export function Blueprint() {
  return (
    <svg
      data-draw
      viewBox="0 0 640 540"
      role="img"
      aria-labelledby="bp-title"
      className="blueprint"
    >
      <title id="bp-title">
        Blueprint-style line drawing of a two-storey home with a garage
      </title>
      <defs>
        <pattern
          id="bp-grid"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path d="M32 0H0V32" fill="none" className="bp-grid" />
        </pattern>
      </defs>
      <rect width="640" height="540" fill="url(#bp-grid)" opacity="0.5" />
      {/* ground and site */}
      <path {...line} d="M24 452H616" />
      {/* main house body and roof */}
      <path {...line} d="M150 452V246H372V452" />
      <path {...line} d="M128 262L261 150L394 262" />
      <path {...line} d="M318 196V150H346V219" />
      {/* garage wing */}
      <path {...line} d="M372 452V318H530V452" />
      <path {...line} d="M360 328L451 270L542 328" />
      <path {...line} d="M396 452V364H506V452" />
      <path {...line} d="M396 386H506M396 408H506M396 430H506" />
      {/* door and porch */}
      <path {...line} d="M236 452V368H286V452" />
      <path {...line} d="M220 368L261 344L302 368" />
      <path {...line} d="M276 412H280" />
      {/* window frames */}
      <path {...line} d="M174 292H226V340H174ZM200 292V340" />
      <path {...line} d="M296 292H348V340H296ZM322 292V340" />
      <path {...line} d="M174 384H214V430H174Z" />
      <path {...line} d="M308 384H348V430H308Z" />
      <path {...line} d="M243 214a18 18 0 1 0 36 0a18 18 0 1 0 -36 0" />
      {/* dimension lines */}
      <path {...line} d="M150 498H372M150 490V506M372 490V506" />
      <path {...line} d="M586 246V452M578 246H594M578 452H594" />
      <path {...line} d="M372 498H530M530 490V506" />
      {/* tree */}
      <path {...line} d="M86 452V372" />
      <path
        {...line}
        d="M86 380c-34 0-46-30-30-52c-8-26 18-44 32-34c12-18 44-8 40 16c22 10 16 46-8 52c-6 14-22 18-34 18"
      />
      {/* lit windows, revealed on scroll */}
      <g className="bp-windows">
        <rect className="bp-window" x="176" y="294" width="48" height="44" />
        <rect className="bp-window" x="298" y="294" width="48" height="44" />
        <rect className="bp-window" x="176" y="386" width="36" height="42" />
        <rect className="bp-window" x="310" y="386" width="36" height="42" />
        <circle className="bp-window" cx="261" cy="214" r="16" />
      </g>
      <g className="bp-labels" aria-hidden="true">
        <text x="232" y="524">
          22&apos;-0&quot;
        </text>
        <text x="430" y="524">
          16&apos;-0&quot;
        </text>
        <text x="600" y="330" transform="rotate(90 600 330)">
          20&apos;-6&quot;
        </text>
        <text x="32" y="44">
          SHEET A-1 · THE NEXT CHAPTER
        </text>
      </g>
    </svg>
  );
}

export function DumpsterArt() {
  return (
    <svg
      data-draw
      viewBox="0 0 320 220"
      aria-hidden="true"
      className="door-art"
    >
      <path {...line} d="M30 168H290" />
      <path {...line} d="M52 168L68 82H262L278 168" />
      <path {...line} d="M60 124H270" />
      <path {...line} d="M98 82V168M148 82V168M198 82V168M240 82V168" />
      <path {...line} d="M68 82L60 64H270L262 82" />
      <path {...line} d="M88 168a14 14 0 1 0 28 0M216 168a14 14 0 1 0 28 0" />
      <path {...line} d="M110 64l18-26l26 10l20-22l22 30l30-8l12 16" />
    </svg>
  );
}

export function KeyArt() {
  return (
    <svg
      data-draw
      viewBox="0 0 320 220"
      aria-hidden="true"
      className="door-art"
    >
      <path {...line} d="M40 176H280" />
      <path {...line} d="M70 176V100L140 48L210 100V176" />
      <path {...line} d="M118 176V128H162V176" />
      <path {...line} d="M222 116a30 30 0 1 0 60 0a30 30 0 1 0 -60 0" />
      <path {...line} d="M240 116a12 12 0 1 0 24 0a12 12 0 1 0 -24 0" />
      <path {...line} d="M252 146V196M252 170H266M252 186H262" />
    </svg>
  );
}

export function TalkArt() {
  return (
    <svg
      data-draw
      viewBox="0 0 320 220"
      aria-hidden="true"
      className="door-art"
    >
      <path
        {...line}
        d="M44 52H188a16 16 0 0 1 16 16V122a16 16 0 0 1 -16 16H104L72 166V138H44a16 16 0 0 1 -16 -16V68a16 16 0 0 1 16 -16Z"
      />
      <path {...line} d="M64 84H168M64 106H140" />
      <path
        {...line}
        d="M226 96H276a16 16 0 0 1 16 16V160a16 16 0 0 1 -16 16H266V200L238 176H180a16 16 0 0 1 -16 -16V154"
      />
      <path {...line} d="M196 136H260M216 156H260" />
    </svg>
  );
}
