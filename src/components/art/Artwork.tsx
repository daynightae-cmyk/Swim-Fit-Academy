import { useId } from 'react';

/**
 * Original vector art system.
 *
 * Direction strategy: every composition is authored for LTR, with the focal
 * subject on the right so the editorial copy has clear negative space on the
 * left. In RTL the whole layer is mirrored with `scaleX(-1)`, which moves the
 * subject to the left and keeps it opposite the Arabic copy. The scrim in
 * `WidePoster` flips with the same axis.
 *
 * Art rules: real value range (deep silhouette through bright cyan light),
 * defined lane geometry, one non-identifiable swimmer mark, visible caustic
 * ribbons, and a deep foreground band that guarantees text contrast.
 * No baked text, no collages, no stock imagery.
 */

export interface ArtProps {
  readonly className?: string;
}

/** Stable per-instance id prefix so multiple SVGs never collide on gradient ids. */
function useId2(prefix: string) {
  const reactId = useId();
  return `${prefix}${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
}

/* -------------------------------------------------------------------------- */
/* Swimmer mark — non-identifiable, top-down freestyle                        */
/* -------------------------------------------------------------------------- */

/**
 * A single anonymous swimmer drawn as limbs rather than a filled blob, so the
 * silhouette stays readable at every size.
 *
 * Anatomy, travelling toward -X: head at the leading end, one arm extended
 * forward under the surface, the other bent at the elbow and recovering out to
 * the side, hips tapering into a narrow flutter kick. The near-parallel legs are
 * what separate a swimmer from a fish.
 */
export function SwimmerMark({
  stroke,
  scale = 1,
  opacity = 1,
}: {
  readonly stroke: string;
  readonly scale?: number;
  readonly opacity?: number;
}) {
  return (
    <g
      transform={`scale(${scale})`}
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    >
      {/* flutter kick: narrow, near-parallel legs with a slight scissor */}
      <path d="M126 2 L182 -7" strokeWidth={9} />
      <path d="M126 -2 L182 7" strokeWidth={9} />
      {/* feet */}
      <path d="M182 -7 L196 -12" strokeWidth={6} />
      <path d="M182 7 L196 12" strokeWidth={6} />

      {/* hips and torso, widest at the shoulders */}
      <path d="M76 0 H128" strokeWidth={21} />
      <path d="M12 0 H80" strokeWidth={29} />

      {/* lead arm: extended forward, aligned with the body under the surface */}
      <path d="M40 -9 L8 -16 L-24 -14" strokeWidth={10} opacity={0.92} />

      {/* recovering arm: elbow out to the near side, forearm sweeping back */}
      <path d="M46 11 L62 32 L104 30" strokeWidth={8} opacity={0.66} />

      {/* head */}
      <circle cx="-4" cy="-1" r="12.5" fill={stroke} stroke="none" />
    </g>
  );
}

/**
 * Underwater wake trailing *behind* a swimmer travelling toward -X, so it
 * extends along +X.
 */
export function Wake({
  color,
  scale = 1,
  opacity = 0.5,
}: {
  readonly color: string;
  readonly scale?: number;
  readonly opacity?: number;
}) {
  return (
    <g fill="none" stroke={color} strokeLinecap="round" opacity={opacity} transform={`scale(${scale})`}>
      <path d="M196 16 C250 26 302 30 356 24" strokeWidth={3.6} />
      <path d="M192 32 C254 48 314 54 376 44" strokeWidth={2.4} opacity={0.6} />
      <path d="M188 2 C242 -6 296 -4 344 6" strokeWidth={2} opacity={0.38} />
    </g>
  );
}

/** Controlled entry splash: loose rings plus droplets, never a bullseye. */
export function Splash({
  cx,
  cy,
  color,
  rings = 3,
  scale = 1,
  opacity = 0.55,
}: {
  readonly cx: number;
  readonly cy: number;
  readonly color: string;
  readonly rings?: number;
  readonly scale?: number;
  readonly opacity?: number;
}) {
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${scale})`}
      fill="none"
      stroke={color}
      opacity={opacity}
    >
      {Array.from({ length: rings }).map((_, i) => (
        <ellipse key={i} cx={0} cy={0} rx={52 + i * 74} ry={13 + i * 19} strokeWidth={2 - i * 0.4} opacity={0.8 - i * 0.26} />
      ))}
      {[
        [-64, -46, 7],
        [-18, -62, 5],
        [26, -58, 4],
        [70, -40, 3],
        [-92, -28, 4],
        [104, -22, 2.6],
      ].map(([dx, dy, r], i) => (
        <circle key={i} cx={dx} cy={dy} r={r} fill={color} stroke="none" opacity={0.8 - i * 0.09} />
      ))}
    </g>
  );
}

/** Caustic ribbons: the signature water-light motif. */
export function Caustics({
  color,
  width,
  height,
  rows = 9,
  opacity = 0.3,
  seed = 1,
}: {
  readonly color: string;
  readonly width: number;
  readonly height: number;
  readonly rows?: number;
  readonly opacity?: number;
  readonly seed?: number;
}) {
  return (
    <g fill="none" stroke={color} opacity={opacity}>
      {Array.from({ length: rows }).map((_, i) => {
        const y = (height / (rows + 1)) * (i + 1);
        const amp = 12 + ((i * 7 + seed * 13) % 22);
        return (
          <path
            key={i}
            d={`M-40 ${y} C${width * 0.18} ${y - amp} ${width * 0.34} ${y + amp} ${width * 0.52} ${y - amp * 0.4}
                C${width * 0.7} ${y - amp * 1.2} ${width * 0.86} ${y + amp * 0.8} ${width + 40} ${y - amp * 0.2}`}
            strokeWidth={1.4 + (i % 3) * 0.9}
            opacity={0.5 + ((i + seed) % 3) * 0.16}
          />
        );
      })}
    </g>
  );
}

/** Lane rope with float discs, receding in perspective. */
export function LaneRope({
  topX,
  topY,
  bottomX,
  bottomY,
  color,
  floatColor,
  floats = 9,
  width = 3,
  opacity = 1,
}: {
  readonly topX: number;
  readonly topY: number;
  readonly bottomX: number;
  readonly bottomY: number;
  readonly color: string;
  readonly floatColor: string;
  readonly floats?: number;
  readonly width?: number;
  readonly opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <line x1={topX} y1={topY} x2={bottomX} y2={bottomY} stroke={color} strokeWidth={width} />
      {Array.from({ length: floats }).map((_, i) => {
        const t = (i + 1) / (floats + 1);
        return (
          <circle
            key={i}
            cx={topX + (bottomX - topX) * t}
            cy={topY + (bottomY - topY) * t}
            r={width * 0.9 + t * width * 2.1}
            fill={floatColor}
            opacity={0.3 + t * 0.5}
          />
        );
      })}
    </g>
  );
}

/** Volumetric light shafts from the surface. */
export function Shafts({
  width,
  color,
  count = 3,
  opacity = 0.2,
}: {
  readonly width: number;
  readonly color: string;
  readonly count?: number;
  readonly opacity?: number;
}) {
  const positions = [0.18, 0.44, 0.72];
  return (
    <g opacity={opacity}>
      {positions.slice(0, count).map((p, i) => {
        const x = width * p;
        const spread = width * (0.06 + i * 0.012);
        const drift = width * 0.1;
        return (
          <path
            key={i}
            d={`M${x} 0 L${x + spread} 0 L${x + spread + drift} 760 L${x - spread + drift} 760 Z`}
            fill={`url(#shaft-${i})`}
            style={{ color }}
          />
        );
      })}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared palette                                                             */
/* -------------------------------------------------------------------------- */

export const WATER = {
  abyss: '#02101a',
  deep: '#03131f',
  dark: '#05202f',
  mid: '#083246',
  lift: '#0e4b66',
  bright: '#156d8c',
  pool: '#15b8d6',
  cyan: '#35c8e4',
  ice: '#78dcef',
  foam: '#b3ecf8',
  white: '#eafdff',
} as const;

/** Standard gradient defs. `g` is the unique per-instance id prefix. */
function WaterDefs({ g, from, via, to, lightX = 0.72, lightY = 0.1 }: {
  readonly g: string;
  readonly from: string;
  readonly via: string;
  readonly to: string;
  readonly lightX?: number;
  readonly lightY?: number;
}) {
  return (
    <defs>
      <linearGradient id={`${g}-depth`} x1="0.15" y1="0" x2="0.55" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="45%" stopColor={via} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
      <radialGradient id={`${g}-light`} cx={`${lightX * 100}%`} cy={`${lightY * 100}%`} r="72%">
        <stop offset="0%" stopColor={WATER.white} stopOpacity="0.5" />
        <stop offset="18%" stopColor={WATER.foam} stopOpacity="0.28" />
        <stop offset="46%" stopColor={WATER.pool} stopOpacity="0.12" />
        <stop offset="100%" stopColor={WATER.pool} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${g}-floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={WATER.deep} stopOpacity="0" />
        <stop offset="100%" stopColor={WATER.deep} stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id={`${g}-shaft`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={WATER.foam} stopOpacity="0.34" />
        <stop offset="100%" stopColor={WATER.foam} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${g}-rim`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={WATER.ice} stopOpacity="0.55" />
        <stop offset="100%" stopColor={WATER.pool} stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero — underwater lane atmosphere at dawn                                   */
/* -------------------------------------------------------------------------- */

export function HeroArt({ className }: ArtProps) {
  const g = useId2('hero-');
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.lift} via={WATER.mid} to={WATER.deep} lightX={0.68} lightY={0.04} />

      <rect width="1600" height="900" fill={`url(#${g}-depth)`} />

      {/* surface light band */}
      <g>
        {Array.from({ length: 14 }).map((_, i) => (
          <rect
            key={i}
            x={0}
            y={i * 9}
            width="1600"
            height={2.2 + (i % 3)}
            fill={WATER.foam}
            opacity={0.2 - i * 0.013}
          />
        ))}
      </g>
      <rect width="1600" height="330" fill={`url(#${g}-light)`} />

      {/* shafts */}
      <g opacity="0.55">
        {[0.2, 0.46, 0.72].map((p, i) => (
          <path
            key={i}
            d={`M${1600 * p} 0 L${1600 * p + 96} 0 L${1600 * p + 300} 640 L${1600 * p - 40} 640 Z`}
            fill={`url(#${g}-shaft)`}
            opacity={0.9 - i * 0.22}
          />
        ))}
      </g>

      {/* surface ripples */}
      <g fill="none" stroke={WATER.ice} opacity="0.2">
        <path d="M0 54 C260 32 460 74 700 52 C940 30 1180 76 1400 54 C1480 46 1550 54 1600 48" strokeWidth={2} />
        <path d="M0 92 C280 70 500 112 740 92 C980 72 1220 114 1480 94 C1540 89 1575 94 1600 90" strokeWidth={1.5} />
      </g>

      {/* receding lanes, converging on the dawn light */}
      {[0.55, 0.65, 0.75, 0.85].map((p, i) => (
        <LaneRope
          key={i}
          topX={1600 * p}
          topY={226}
          bottomX={1600 * (-0.08 + i * 0.34)}
          bottomY={900}
          color={WATER.ice}
          floatColor={WATER.foam}
          floats={7}
          width={2.6 + i * 0.7}
          opacity={0.2 + i * 0.07}
        />
      ))}

      {/* floor grid */}
      <g stroke={WATER.cyan} strokeOpacity="0.09" strokeWidth="1.4">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={i * 230 - 60} y1="900" x2={i * 230 + 460} y2="646" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={712 + i * 48} x2="1600" y2={700 + i * 48} />
        ))}
      </g>

      {/* hero swimmer — subject on the right, opposite the LTR copy */}
      <g transform="translate(1062 582)">
        <Wake color={WATER.foam} scale={1.65} opacity={0.38} />
        <Splash cx={50} cy={60} color={WATER.foam} scale={0.82} rings={3} opacity={0.4} />
        <SwimmerMark stroke={WATER.abyss} scale={1.92} />
        {/* rim light along the leading edge of the body */}
        <g transform="translate(1062 582) scale(1.92)" fill="none" stroke={WATER.ice} strokeLinecap="round" opacity={0.46}>
          <path d="M14 -13 H78" strokeWidth={2.8} />
          <path d="M80 -9 H126" strokeWidth={2.2} />
          <path d="M40 -9 L8 -16 L-24 -14" strokeWidth={2} opacity={0.5} />
        </g>
      </g>

      {/* drifting microbubbles */}
      <g fill={WATER.foam}>
        {[
          [1322, 470, 6], [1372, 424, 4], [1414, 486, 3], [1296, 534, 3.4],
          [1436, 452, 2.4], [1362, 552, 2], [1244, 470, 4], [1466, 512, 2.2],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.36 - i * 0.03} />
        ))}
      </g>

      <rect width="1600" height="900" fill={`url(#${g}-floor)`} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* POSTER 01 — BRAND: pool lane at dawn                                        */
/* -------------------------------------------------------------------------- */

function DawnLaneArt({ className }: ArtProps) {
  const g = useId2('p1-');
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.bright} via={WATER.mid} to={WATER.deep} lightX={0.78} lightY={0.02} />

      <rect width="1600" height="700" fill={`url(#${g}-depth)`} />
      <rect width="1600" height="380" fill={`url(#${g}-light)`} />
      <Caustics color={WATER.foam} width={1600} height={700} rows={5} opacity={0.14} seed={2} />

      {/* three lane ropes converging on the dawn vanishing point */}
      {[0.66, 0.775, 0.89].map((p, i) => (
        <LaneRope
          key={i}
          topX={1600 * p}
          topY={134}
          bottomX={1600 * (-0.04 + i * 0.42)}
          bottomY={700}
          color={WATER.ice}
          floatColor={WATER.foam}
          floats={7}
          width={3.4 + i * 1.1}
          opacity={0.24 + i * 0.08}
        />
      ))}

      {/* dawn horizon glow line */}
      <rect x="0" y="130" width="1600" height="3" fill={WATER.foam} opacity="0.4" />

      {/* subject: one anonymous swimmer, large, right of centre */}
      <g transform="translate(1076 452)">
        <Wake color={WATER.foam} scale={1.75} opacity={0.4} />
        {/* the entry splash sits behind the body, at the recovering hand */}
        <Splash cx={54} cy={62} color={WATER.foam} scale={0.86} rings={3} opacity={0.42} />
        <SwimmerMark stroke={WATER.abyss} scale={2.05} />
        <g transform="translate(1076 452) scale(2.05)" fill="none" stroke={WATER.ice} strokeLinecap="round" opacity={0.5}>
          <path d="M14 -13 H78" strokeWidth={2.6} />
          <path d="M80 -9 H126" strokeWidth={2} />
          <path d="M40 -9 L8 -16 L-24 -14" strokeWidth={1.8} opacity={0.5} />
        </g>
      </g>

      <rect y="470" width="1600" height="230" fill={`url(#${g}-floor)`} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* POSTER 02 — TECHNIQUE: macro water trail                                    */
/* -------------------------------------------------------------------------- */

function WaterTrailArt({ className }: ArtProps) {
  const g = useId2('p2-');
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.mid} via={WATER.dark} to={WATER.abyss} lightX={0.76} lightY={0.3} />
      <rect width="1600" height="700" fill={`url(#${g}-depth)`} />
      <rect width="1600" height="700" fill={`url(#${g}-light)`} opacity={0.7} />

      {/* refraction grid */}
      <g stroke={WATER.cyan} strokeOpacity="0.07" strokeWidth="1">
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 52} x2="1600" y2={i * 52 + 20} />
        ))}
      </g>

      {/* concentric entry rings */}
      <g fill="none" stroke={WATER.ice}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="1180"
            cy="392"
            rx={72 + i * 92}
            ry={22 + i * 42}
            strokeOpacity={0.32 - i * 0.036}
            strokeWidth={2.4 - i * 0.2}
          />
        ))}
      </g>

      {/* freestyle arm entering from the top right — no identifiable face */}
      <g>
        <path
          d="M1620 60 C1480 96 1352 166 1258 250 C1190 308 1136 366 1096 420
             C1072 452 1094 476 1130 466 C1196 448 1268 406 1334 350
             C1430 264 1526 196 1620 152 Z"
          fill={WATER.abyss}
        />
        <path
          d="M1620 60 C1480 96 1352 166 1258 250 C1190 308 1136 366 1096 420"
          fill="none"
          stroke={WATER.ice}
          strokeOpacity={0.4}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <ellipse cx="1104" cy="446" rx="30" ry="22" fill={WATER.abyss} />
        <ellipse cx="1104" cy="446" rx="30" ry="22" fill="none" stroke={WATER.ice} strokeOpacity="0.22" strokeWidth="2" />
      </g>

      {/* water trail */}
      <g fill="none" stroke={WATER.foam} strokeLinecap="round">
        <path d="M1040 486 C936 516 828 534 700 528" strokeWidth={3.4} strokeOpacity={0.36} />
        <path d="M960 534 C848 566 722 580 570 566" strokeWidth={2.2} strokeOpacity={0.22} />
        <path d="M876 584 C768 614 640 622 500 604" strokeWidth={1.6} strokeOpacity={0.14} />
      </g>

      <g fill={WATER.foam}>
        {[
          [1080, 508, 6], [1010, 552, 4], [946, 486, 3], [1124, 578, 2.6],
          [892, 552, 3.4], [1348, 232, 4], [1420, 282, 3], [1290, 178, 2.4],
          [1470, 232, 3.4], [1226, 296, 2.6], [1520, 168, 2.2],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.4 - i * 0.028} />
        ))}
      </g>

      <rect width="1600" height="700" fill={`url(#${g}-floor)`} opacity={0.7} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* POSTER 03 — PROGRESS: lane markings and rhythm                              */
/* -------------------------------------------------------------------------- */

function LaneRhythmArt({ className }: ArtProps) {
  const g = useId2('p3-');
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.lift} via={WATER.mid} to={WATER.deep} lightX={0.26} lightY={0.46} />
      <rect width="1600" height="700" fill={`url(#${g}-depth)`} />
      <rect width="1600" height="700" fill={`url(#${g}-light)`} opacity={0.8} />

      {/* lane markings, editorial rhythm */}
      <g fill="none">
        {Array.from({ length: 6 }).map((_, i) => {
          const y = 150 + i * 80;
          return (
            <path
              key={i}
              d={`M-40 ${y} C300 ${y - 30} 700 ${y + 34} 1100 ${y - 16} C1300 ${y - 36} 1480 ${y + 14} 1660 ${y - 8}`}
              stroke={WATER.ice}
              strokeOpacity={0.2 + (i % 3) * 0.1}
              strokeWidth={1.8 + (i % 2) * 1.6}
            />
          );
        })}
      </g>

      {/* performance rhythm ticks */}
      <g>
        {Array.from({ length: 28 }).map((_, i) => {
          const x = 30 + i * 58;
          const h = 18 + ((i * 37) % 46);
          return (
            <rect key={i} x={x} y={500 - h} width="6" height={h} rx="3" fill={WATER.ice} opacity={0.12 + ((i % 5) * 0.09)} />
          );
        })}
      </g>

      {/* controlled splash, right of centre */}
      <Splash cx={1090} cy={430} color={WATER.foam} scale={1.35} rings={5} opacity={0.5} />
      <g fill="none" stroke={WATER.foam} strokeLinecap="round">
        <path d="M900 300 C970 254 1054 240 1148 256" strokeOpacity={0.34} strokeWidth={2.6} />
        <path d="M856 356 C940 306 1036 296 1146 318" strokeOpacity={0.2} strokeWidth={1.8} />
      </g>
      <g fill={WATER.foam}>
        {[
          [1240, 258, 7], [1300, 224, 5], [1352, 276, 4], [1196, 214, 3.4],
          [1404, 236, 3], [1132, 208, 3.6],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.4 - i * 0.045} />
        ))}
      </g>

      {/* editorial corner marks */}
      <g stroke={WATER.ice} strokeOpacity={0.28}>
        <path d="M120 60 V170 M120 60 H250" fill="none" strokeWidth="1.6" />
        <path d="M1480 640 V530 M1480 640 H1350" fill="none" strokeWidth="1.6" />
      </g>

      <rect y="520" width="1600" height="180" fill={`url(#${g}-floor)`} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* POSTER 04 — ALL LEVELS: three abstract lane depths                          */
/* -------------------------------------------------------------------------- */

function LevelDepthsArt({ className }: ArtProps) {
  const g = useId2('p4-');
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.bright} via={WATER.mid} to={WATER.abyss} lightX={0.5} lightY={0} />
      <rect width="1600" height="700" fill={`url(#${g}-depth)`} />
      <rect width="1600" height="300" fill={`url(#${g}-light)`} opacity={0.85} />

      {/* surface */}
      <g fill="none" stroke={WATER.ice} opacity={0.3}>
        <path d="M0 46 C240 26 420 62 640 44 C860 26 1040 64 1260 46 C1380 36 1500 46 1600 40" strokeWidth={2} />
        <path d="M0 82 C260 62 460 98 680 80 C900 62 1120 100 1340 82 C1450 72 1540 82 1600 76" strokeWidth={1.4} />
      </g>

      {/* three depth columns: shallow / developing / advanced */}
      {[
        { x: 1180, depth: 190, op: 0.5, lanes: 2 },
        { x: 800, depth: 330, op: 0.66, lanes: 3 },
        { x: 420, depth: 500, op: 0.82, lanes: 4 },
      ].map((col, index) => (
        <g key={index}>
          <rect x={col.x - 200} y={64} width="400" height={col.depth} fill={WATER.abyss} opacity={0.22 + index * 0.16} />
          <line x1={col.x - 200} y1={64 + col.depth} x2={col.x + 200} y2={64 + col.depth} stroke={WATER.ice} strokeOpacity={col.op} strokeWidth={2.8} />
          {Array.from({ length: col.lanes }).map((_, i) => (
            <line
              key={i}
              x1={col.x - 200}
              y1={64 + (col.depth / (col.lanes + 1)) * (i + 1)}
              x2={col.x + 200}
              y2={64 + (col.depth / (col.lanes + 1)) * (i + 1)}
              stroke={WATER.ice}
              strokeOpacity={col.op * 0.42}
              strokeWidth={1.5}
            />
          ))}
          <circle cx={col.x} cy={64 + col.depth} r={7} fill={WATER.foam} opacity={col.op} />
          <line x1={col.x} y1="64" x2={col.x} y2={64 + col.depth} stroke={WATER.ice} strokeOpacity={col.op * 0.5} strokeWidth={1.3} strokeDasharray="7 12" />
        </g>
      ))}

      {/* depth connectors */}
      <g stroke={WATER.ice} strokeOpacity={0.24} strokeWidth={1.5} strokeDasharray="5 10" fill="none">
        <path d="M980 300 C900 320 860 356 820 400" />
        <path d="M600 420 C520 452 480 496 442 560" />
      </g>

      <Caustics color={WATER.foam} width={1600} height={200} rows={5} opacity={0.18} seed={4} />
      <rect y="420" width="1600" height="280" fill={`url(#${g}-floor)`} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* POSTER 05 — ABU DHABI: abstract horizon reflected in pool water             */
/* -------------------------------------------------------------------------- */

function CityHorizonArt({ className }: ArtProps) {
  const g = useId2('p5-');
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.bright} via={WATER.mid} to={WATER.abyss} lightX={0.62} lightY={0.12} />
      <rect width="1600" height="330" fill={`url(#${g}-depth)`} />
      <rect width="1600" height="330" fill={`url(#${g}-light)`} opacity={0.9} />
      <rect y="330" width="1600" height="370" fill={WATER.deep} />

      {/* abstract skyline: towers, dome, arch. Deliberately generic, unlabelled. */}
      <g fill={WATER.abyss} opacity={0.9}>
        <rect x="980" y="212" width="52" height="118" />
        <rect x="1052" y="252" width="34" height="78" />
        <path d="M1104 330 L1104 206 L1132 176 L1160 206 L1160 330 Z" />
        <rect x="1180" y="236" width="66" height="94" />
        <rect x="1264" y="200" width="26" height="130" />
        <rect x="1308" y="226" width="58" height="104" />
        <path d="M1392 330 L1392 264 A46 46 0 0 1 1484 264 L1484 330 Z" />
        <rect x="1506" y="222" width="54" height="108" />
        <rect x="880" y="248" width="44" height="82" />
      </g>

      {/* lit windows */}
      <g fill={WATER.foam} opacity={0.22}>
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 17 }).map((__, col) => (
            <rect key={`${row}-${col}`} x={884 + col * 42} y={218 + row * 17} width="7" height="5" rx="1.5" />
          )),
        )}
      </g>

      {/* waterline */}
      <rect y="326" width="1600" height="6" fill={WATER.foam} opacity="0.44" />
      <rect y="332" width="1600" height="10" fill={WATER.ice} opacity="0.12" />

      {/* pool-grid reflection */}
      <g stroke={WATER.ice} fill="none">
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={i} x1={i * 136} y1="340" x2={i * 136 - 300} y2="700" strokeOpacity={0.1 - (i % 3) * 0.016} strokeWidth="1.5" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`r${i}`} x1="0" y1={364 + i * 44} x2="1600" y2={364 + i * 44} strokeOpacity={0.12} strokeWidth="1.3" strokeDasharray="28 34" />
        ))}
      </g>

      {/* tower reflections */}
      <g fill={WATER.ice} opacity={0.12}>
        {[
          [1104, 348, 56, 108], [1392, 342, 92, 86], [1180, 352, 66, 96],
          [1264, 340, 26, 124], [1506, 350, 54, 100],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="5" />
        ))}
      </g>

      <Caustics color={WATER.foam} width={1600} height={700} rows={7} opacity={0.12} seed={5} />
      <rect y="470" width="1600" height="230" fill={`url(#${g}-floor)`} opacity={0.8} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* POSTER 06 — CONVERSION: dark water opening into bright lane light           */
/* -------------------------------------------------------------------------- */

function LightLaneArt({ className }: ArtProps) {
  const g = useId2('p6-');
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.mid} via={WATER.dark} to={WATER.abyss} lightX={0.72} lightY={0.06} />

      <defs>
        <radialGradient id={`${g}-opening`} cx="72%" cy="8%" r="64%">
          <stop offset="0%" stopColor={WATER.white} stopOpacity="0.72" />
          <stop offset="14%" stopColor={WATER.foam} stopOpacity="0.44" />
          <stop offset="34%" stopColor={WATER.ice} stopOpacity="0.2" />
          <stop offset="64%" stopColor={WATER.pool} stopOpacity="0.07" />
          <stop offset="100%" stopColor={WATER.pool} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}-descent`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={WATER.ice} stopOpacity="0.3" />
          <stop offset="100%" stopColor={WATER.ice} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1600" height="700" fill={`url(#${g}-depth)`} />

      {/* the surface opening: bright cyan light at the end of the lane */}
      <rect width="1600" height="700" fill={`url(#${g}-opening)`} />

      {/* surface, broken by ripple lines */}
      <g fill="none" stroke={WATER.foam}>
        <path d="M-40 34 C280 14 520 54 800 32 C1080 10 1320 52 1660 28" strokeOpacity="0.3" strokeWidth="2.2" />
        <path d="M-40 74 C300 54 560 92 840 72 C1120 52 1360 94 1660 70" strokeOpacity="0.2" strokeWidth="1.6" />
        <path d="M-40 118 C320 98 580 136 860 116 C1140 96 1380 138 1660 114" strokeOpacity="0.12" strokeWidth="1.2" />
      </g>

      {/* light descending from the surface */}
      <g>
        {[0.56, 0.68, 0.8, 0.92].map((p, i) => (
          <path
            key={i}
            d={`M${1600 * (p - 0.035)} 0 L${1600 * (p + 0.035)} 0 L${1600 * (p + 0.13)} 560 L${1600 * (p - 0.09)} 560 Z`}
            fill={`url(#${g}-descent)`}
            opacity={0.9 - i * 0.16}
          />
        ))}
      </g>

      {/* lane ropes converging on the light at the end of the lane */}
      {[0.36, 0.48, 0.6, 0.72, 0.84, 0.96].map((p, i) => (
        <LaneRope
          key={i}
          topX={1150 + (1600 * p - 1150) * 0.14}
          topY={150}
          bottomX={1600 * p - 120}
          bottomY={700}
          color={WATER.ice}
          floatColor={WATER.foam}
          floats={8}
          width={2.6}
          opacity={0.34 - Math.abs(i - 2.5) * 0.04}
        />
      ))}

      {/* microbubbles rising toward the light */}
      <g fill={WATER.foam}>
        {[
          [1080, 430, 5], [1176, 380, 3.4], [1268, 448, 2.6], [1020, 486, 3.4],
          [1330, 404, 2.2], [988, 392, 2.6], [1392, 470, 3], [1216, 520, 2.4],
          [1122, 560, 2], [1420, 410, 2.2], [1300, 340, 2],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.38 - i * 0.028} />
        ))}
      </g>

      <Caustics color={WATER.foam} width={1600} height={260} rows={4} opacity={0.13} seed={6} />
      <rect y="470" width="1600" height="230" fill={`url(#${g}-floor)`} opacity={0.95} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Poster dispatcher                                                          */
/* -------------------------------------------------------------------------- */

export type PosterArtId =
  | 'dawn-lane'
  | 'water-trail'
  | 'lane-rhythm'
  | 'level-depths'
  | 'city-horizon'
  | 'light-lane';

const POSTER_ART: Record<PosterArtId, (props: ArtProps) => React.JSX.Element> = {
  'dawn-lane': DawnLaneArt,
  'water-trail': WaterTrailArt,
  'lane-rhythm': LaneRhythmArt,
  'level-depths': LevelDepthsArt,
  'city-horizon': CityHorizonArt,
  'light-lane': LightLaneArt,
};

export function PosterArtwork({ art, className }: ArtProps & { readonly art: PosterArtId }) {
  const Component = POSTER_ART[art];
  return Component ? <Component className={className} /> : null;
}

/* -------------------------------------------------------------------------- */
/* Panel art                                                                  */
/* -------------------------------------------------------------------------- */

/** Abu Dhabi location panel: skyline reflected in pool water. */
export function CityWaterPanelArt({ className }: ArtProps) {
  const g = useId2('loc-');
  return (
    <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.bright} via={WATER.mid} to={WATER.abyss} lightX={0.6} lightY={0.1} />
      <rect width="1200" height="320" fill={`url(#${g}-depth)`} />
      <rect width="1200" height="320" fill={`url(#${g}-light)`} opacity={0.9} />
      <rect y="320" width="1200" height="300" fill={WATER.deep} />

      <g fill={WATER.abyss} opacity={0.9}>
        <rect x="712" y="200" width="44" height="120" />
        <path d="M776 320 L776 176 L804 146 L832 176 L832 320 Z" />
        <rect x="852" y="222" width="58" height="98" />
        <rect x="928" y="196" width="24" height="124" />
        <rect x="972" y="228" width="52" height="92" />
        <path d="M1044 320 L1044 254 A40 40 0 0 1 1124 254 L1124 320 Z" />
        <rect x="640" y="234" width="40" height="86" />
        <rect x="562" y="206" width="22" height="114" />
        <rect x="500" y="230" width="48" height="90" />
      </g>
      <g fill={WATER.foam} opacity={0.22}>
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 15 }).map((__, col) => (
            <rect key={`${row}-${col}`} x={504 + col * 40} y={206 + row * 18} width="6" height="5" rx="1.4" />
          )),
        )}
      </g>

      <rect y="316" width="1200" height="6" fill={WATER.foam} opacity="0.44" />
      <g stroke={WATER.ice} fill="none">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={i} x1={i * 118} y1="326" x2={i * 118 - 220} y2="620" strokeOpacity={0.1} strokeWidth="1.4" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={350 + i * 42} x2="1200" y2={350 + i * 42} strokeOpacity={0.12} strokeWidth="1.2" strokeDasharray="24 30" />
        ))}
      </g>
      <g fill={WATER.ice} opacity={0.13}>
        {[[776, 330, 56, 96], [1044, 326, 80, 80], [852, 336, 58, 86], [972, 328, 52, 88]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="5" />
        ))}
      </g>
      <Caustics color={WATER.foam} width={1200} height={620} rows={6} opacity={0.1} seed={7} />
    </svg>
  );
}

/** Coaching scene: hands-only coaching moment, non-identifiable. */
export function CoachingSceneArt({ className }: ArtProps) {
  const g = useId2('coach-');
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.bright} via={WATER.mid} to={WATER.abyss} lightX={0.32} lightY={0.04} />
      <rect width="1200" height="800" fill={`url(#${g}-depth)`} />
      <rect width="1200" height="420" fill={`url(#${g}-light)`} opacity={0.8} />
      <g opacity="0.5">
        {[0.22, 0.48].map((p, i) => (
          <path key={i} d={`M${1200 * (p - 0.03)} 0 L${1200 * (p + 0.03)} 0 L${1200 * (p + 0.12)} 560 L${1200 * (p - 0.05)} 560 Z`} fill={`url(#${g}-shaft)`} opacity={0.9 - i * 0.3} />
        ))}
      </g>

      {/* receding lanes */}
      {[0.44, 0.54, 0.64, 0.74, 0.84].map((p, i) => (
        <LaneRope key={i} topX={1200 * p} topY={170} bottomX={1200 * (0.02 + i * 0.22)} bottomY={800} color={WATER.ice} floatColor={WATER.foam} floats={8} width={2.2 + i * 0.5} opacity={0.14 + i * 0.07} />
      ))}

      {/* two hands meeting across the water: a coaching moment, not a portrait */}
      <g>
        <path d="M1220 470 C1112 486 1010 522 934 570 C872 608 818 648 772 686 C748 708 758 728 786 720 C846 694 916 652 976 600 C1058 530 1136 494 1220 480 Z" fill={WATER.abyss} />
        <path d="M1220 470 C1112 486 1010 522 934 570" fill="none" stroke={WATER.ice} strokeOpacity={0.3} strokeWidth={2.6} strokeLinecap="round" />
        <path d="M-20 622 C104 606 200 578 284 540 C352 510 406 476 464 452 C490 442 500 458 482 476 C426 528 362 574 292 612 C204 662 104 690 -20 700 Z" fill={WATER.dark} />
        <path d="M-20 622 C104 606 200 578 284 540" fill="none" stroke={WATER.ice} strokeOpacity={0.24} strokeWidth={2.2} strokeLinecap="round" />
      </g>

      <Splash cx={600} cy={590} color={WATER.foam} scale={1.05} rings={4} opacity={0.5} />
      <g fill={WATER.foam}>
        {[
          [540, 520, 6], [640, 484, 4], [700, 540, 3], [500, 566, 3.4],
          [740, 498, 2.4], [584, 654, 2.8],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.4 - i * 0.045} />
        ))}
      </g>

      <rect y="600" width="1200" height="200" fill={`url(#${g}-floor)`} />
    </svg>
  );
}

/** Contact page water surface. */
export function ContactWaterArt({ className }: ArtProps) {
  const g = useId2('contact-');
  return (
    <svg viewBox="0 0 1600 620" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <WaterDefs g={g} from={WATER.bright} via={WATER.mid} to={WATER.abyss} lightX={0.5} lightY={0} />
      <rect width="1600" height="620" fill={`url(#${g}-depth)`} />
      <rect width="1600" height="620" fill={`url(#${g}-light)`} opacity={0.85} />
      <Caustics color={WATER.foam} width={1600} height={620} rows={13} opacity={0.24} seed={8} />
      <g fill="none" stroke={WATER.foam} strokeLinecap="round">
        <path d="M-40 480 C280 452 520 512 800 476 C1080 440 1320 504 1660 470" strokeOpacity={0.16} strokeWidth={2} />
        <path d="M-40 552 C300 522 560 584 840 548 C1120 512 1360 576 1660 542" strokeOpacity={0.1} strokeWidth={1.6} />
      </g>
      <g fill={WATER.foam}>
        {[
          [420, 200, 6], [520, 268, 4], [1180, 176, 5], [1092, 252, 3.4],
          [860, 320, 2.8], [240, 296, 3.4], [700, 180, 2.6],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.36 - i * 0.04} />
        ))}
      </g>
      <rect y="440" width="1600" height="180" fill={`url(#${g}-floor)`} opacity={0.75} />
    </svg>
  );
}
