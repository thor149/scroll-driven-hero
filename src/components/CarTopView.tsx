import { useId, type CSSProperties } from "react";

export default function CarTopView({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  // Keep paint servers independent when more than one car is rendered.
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;

  return (
    <svg
      viewBox="0 0 400 180"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Overhead view of an orange sports coupe facing right"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b64009" />
          <stop offset="0.18" stopColor="#ff9c38" />
          <stop offset="0.46" stopColor="#ff8620" />
          <stop offset="0.76" stopColor="#ef6b10" />
          <stop offset="1" stopColor="#9b3107" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#526672" />
          <stop offset="0.4" stopColor="#26353e" />
          <stop offset="1" stopColor="#080e13" />
        </linearGradient>
        <linearGradient id={`${id}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb45b" />
          <stop offset="0.45" stopColor="#ff8b26" />
          <stop offset="1" stopColor="#d9570b" />
        </linearGradient>
        <linearGradient id={`${id}-highlight`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0d5" stopOpacity="0.65" />
          <stop offset="1" stopColor="#fff0d5" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-15%" y="-30%" width="130%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Tires sit under the fenders, rather than outside the body like an open-wheel car. */}
      <path
        d="M45 42 Q65 22 108 24 L284 24 Q341 23 362 47 L373 73 L373 116 Q350 155 303 156 L94 156 Q53 156 35 127 L30 63 Z"
        fill="#000" opacity="0.38" filter={paint("shadow")}
      />
      <g fill="#111317" stroke="#2e3236" strokeWidth="1">
        <rect x="72" y="18" width="48" height="19" rx="6" />
        <rect x="72" y="143" width="48" height="19" rx="6" />
        <rect x="280" y="18" width="48" height="19" rx="6" />
        <rect x="280" y="143" width="48" height="19" rx="6" />
      </g>

      {/* A short rear deck, pinched waist, wide wheel arches and a longer front hood. */}
      <path
        d="M34 55 Q36 40 55 31 Q76 21 104 22 Q130 23 150 29
           L243 29 Q274 21 306 23 Q340 25 358 42 Q369 55 372 75
           L372 105 Q369 125 358 138 Q340 155 306 157
           Q274 159 243 151 L150 151 Q130 157 104 158
           Q76 159 55 149 Q36 140 34 125 Q29 90 34 55 Z"
        fill={paint("body")} stroke="#792706" strokeWidth="1.5"
      />
      <g fill="none" strokeLinecap="round">
        <path d="M47 48 Q72 28 110 29 L147 35 M255 35 Q322 19 350 46" stroke="#ffce89" strokeWidth="2" opacity="0.75" />
        <path d="M47 132 Q72 152 110 151 L147 145 M255 145 Q322 161 350 134" stroke="#762506" strokeWidth="2" opacity="0.7" />
        <path d="M122 36 Q158 42 244 37 M122 144 Q158 138 244 143" stroke="#a74009" strokeWidth="1.4" />
      </g>

      {/* Rear bumper, diffuser, lamps and subtle exhaust tips. */}
      <path d="M35 58 L42 61 Q38 90 42 119 L35 122 Q29 90 35 58 Z" fill="#171b1e" />
      <path d="M43 42 Q65 34 83 35 L80 42 L45 51 Z" fill="#581512" />
      <path d="M43 138 Q65 146 83 145 L80 138 L45 129 Z" fill="#581512" />
      <path d="M45 44 L76 38 M45 136 L76 142" stroke="#ff5147" strokeWidth="3" strokeLinecap="round" />
      <g fill="#525b61" stroke="#101416" strokeWidth="2">
        <ellipse cx="38" cy="67" rx="3" ry="6" />
        <ellipse cx="38" cy="113" rx="3" ry="6" />
      </g>
      <path d="M54 57 Q82 46 109 49 L126 60 L126 120 L109 131 Q82 134 54 123" fill="none" stroke="#a4420c" strokeWidth="1.2" />
      <path d="M61 54 Q82 48 108 51" fill="none" stroke="#ffcb7d" strokeWidth="1.5" opacity="0.7" />

      {/* Glass follows the tapered cabin; painted pillars separate each window. */}
      <path
        d="M124 53 Q140 40 169 39 L220 39 Q244 41 262 57
           Q270 90 262 123 Q244 139 220 141 L169 141
           Q140 140 124 127 Q113 90 124 53 Z"
        fill="#11191f" stroke="#b14a10" strokeWidth="2"
      />
      <path d="M126 57 Q138 47 158 46 L150 60 Q145 90 150 120 L158 134 Q138 133 126 123 Q117 90 126 57 Z" fill={paint("glass")} />
      <path d="M223 46 Q244 48 257 60 Q264 90 257 120 Q244 132 223 134 L232 118 Q238 90 232 62 Z" fill={paint("glass")} />
      <path d="M157 45 L220 45 L228 59 L153 59 Z" fill={paint("glass")} />
      <path d="M157 135 L220 135 L228 121 L153 121 Z" fill={paint("glass")} />
      <path d="M185 44 L185 59 M185 121 L185 136" stroke="#0c1115" strokeWidth="4" />
      <path
        d="M160 59 Q193 55 222 60 Q232 90 222 120 Q193 125 160 121 Q152 90 160 59 Z"
        fill={paint("roof")} stroke="#d16014" strokeWidth="1"
      />
      <path d="M162 63 Q191 59 219 63 L221 69 Q191 65 160 70 Z" fill={paint("highlight")} />
      <path d="M239 57 Q250 61 253 70 L256 101" fill="none" stroke="#b9d1de" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
      <path d="M129 60 Q124 81 126 102" fill="none" stroke="#b9d1de" strokeWidth="1.5" opacity="0.3" />
      <path d="M232 66 L237 81 M232 114 L237 99" stroke="#10171d" strokeWidth="1.5" strokeLinecap="round" />

      {/* Door seams, recessed handles and body-colored mirrors. */}
      <g fill="none" stroke="#a4400b" strokeWidth="1.2">
        <path d="M149 37 L143 48 L140 57 M149 143 L143 132 L140 123" />
        <path d="M251 42 L265 40 Q276 43 277 51 M251 138 L265 140 Q276 137 277 129" />
      </g>
      <g fill="#783009">
        <rect x="156" y="32" width="15" height="3" rx="1.5" />
        <rect x="156" y="145" width="15" height="3" rx="1.5" />
      </g>
      <g stroke="#7e300a" strokeWidth="1">
        <path d="M247 42 L241 34 Q240 30 245 29 L258 31 Q262 34 258 38 L252 43 Z" fill={paint("body")} />
        <path d="M247 138 L241 146 Q240 150 245 151 L258 149 Q262 146 258 142 L252 137 Z" fill={paint("body")} />
      </g>
      <path d="M243 33 L256 35 M243 147 L256 145" stroke="#141b20" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hood creases and wheel-arch vents give the nose a clear direction. */}
      <path d="M267 53 Q309 43 346 59 Q357 90 346 121 Q309 137 267 127" fill="none" stroke="#b84a0c" strokeWidth="1.2" />
      <path d="M270 61 Q310 54 342 66 M270 119 Q310 126 342 114" fill="none" stroke="#ffca81" strokeWidth="1.8" opacity="0.65" />
      <path d="M285 36 L315 36 L319 42 L281 43 Z M285 144 L315 144 L319 138 L281 137 Z" fill="#2a211b" />
      <path d="M289 38 L312 38 M289 142 L312 142" stroke="#785335" strokeWidth="1" />
      <path d="M355 51 Q363 60 365 73 L353 69 L347 53 Z M355 129 Q363 120 365 107 L353 111 L347 127 Z" fill="#19232b" stroke="#b84a0c" strokeWidth="1" />
      <path d="M351 55 L358 59 L362 70 M351 125 L358 121 L362 110" fill="none" stroke="#e9f7ff" strokeWidth="3" strokeLinecap="round" />
      <path d="M366 76 Q369 90 366 104 L360 101 L360 79 Z" fill="#192024" />
      <path d="M368 77 Q371 90 368 103" fill="none" stroke="#ffb458" strokeWidth="1.5" />
    </svg>
  );
}
