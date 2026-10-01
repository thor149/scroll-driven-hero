export default function CarTopView({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 400 180"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Top view of a sports car"
    >
      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#454a53" />
          <stop offset="0.42" stopColor="#272a31" />
          <stop offset="1" stopColor="#141519" />
        </linearGradient>
        <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1014" />
          <stop offset="0.5" stopColor="#243642" />
          <stop offset="1" stopColor="#0b1014" />
        </linearGradient>
        <linearGradient id="carRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3f46" />
          <stop offset="0.5" stopColor="#202329" />
          <stop offset="1" stopColor="#101114" />
        </linearGradient>
        <filter id="carShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <ellipse
        cx="204"
        cy="92"
        rx="168"
        ry="74"
        fill="#000000"
        opacity="0.45"
        filter="url(#carShadow)"
      />

      <g fill="#0a0b0d" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5">
        <rect x="66" y="6" width="58" height="26" rx="12" />
        <rect x="66" y="148" width="58" height="26" rx="12" />
        <rect x="266" y="6" width="58" height="26" rx="12" />
        <rect x="266" y="148" width="58" height="26" rx="12" />
      </g>

      <rect
        x="26"
        y="34"
        width="18"
        height="112"
        rx="9"
        fill="#1b1d22"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />

      <path
        d="M 372 90 C 372 64 352 44 316 36 C 282 28 230 24 176 24 C 122 24 84 30 64 42 C 46 53 36 70 36 90 C 36 110 46 127 64 138 C 84 150 122 156 176 156 C 230 156 282 152 316 144 C 352 136 372 116 372 90 Z"
        fill="url(#carBody)"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1.5"
      />

      <rect x="136" y="38" width="154" height="104" rx="30" fill="url(#carGlass)" />
      <rect
        x="168"
        y="38"
        width="78"
        height="104"
        rx="10"
        fill="url(#carRoof)"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />

      <rect x="350" y="52" width="17" height="10" rx="5" fill="#eaffc4" opacity="0.92" />
      <rect x="350" y="118" width="17" height="10" rx="5" fill="#eaffc4" opacity="0.92" />

      <rect x="34" y="52" width="12" height="13" rx="5" fill="#ff5f57" opacity="0.95" />
      <rect x="34" y="115" width="12" height="13" rx="5" fill="#ff5f57" opacity="0.95" />

      <rect
        x="242"
        y="22"
        width="18"
        height="11"
        rx="5"
        fill="#22252b"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />
      <rect
        x="242"
        y="147"
        width="18"
        height="11"
        rx="5"
        fill="#22252b"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />

      <path d="M 120 34 l 30 7 -3 9 -30 -6 Z" fill="#0f1013" opacity="0.85" />
      <path d="M 120 146 l 30 -7 -3 -9 -30 6 Z" fill="#0f1013" opacity="0.85" />
    </svg>
  );
}
