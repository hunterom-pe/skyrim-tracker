import type { SVGProps } from "react";

// Original, minimal single-color line icons — one per skill. Same stroke
// weight and corner treatment throughout so the set reads as one family,
// not seven mismatched styles. Not traced from any existing artwork.
type IconProps = SVGProps<SVGSVGElement>;

const ICON_DEFAULTS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SmithingIcon(props: IconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <rect x="12.5" y="3" width="8" height="4.5" rx="1" transform="rotate(45 16.5 5.25)" />
      <line x1="13" y1="9" x2="5" y2="20" />
    </svg>
  );
}

export function SpeechIcon(props: IconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 3.5v-3.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
      <line x1="7" y1="9.5" x2="17" y2="9.5" />
      <line x1="7" y1="13" x2="14" y2="13" />
    </svg>
  );
}

export function RestorationIcon(props: IconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <circle cx="12" cy="13.5" r="4.2" />
      <line x1="12" y1="4" x2="12" y2="6.3" />
      <line x1="5.6" y1="7.1" x2="7.3" y2="8.8" />
      <line x1="18.4" y1="7.1" x2="16.7" y2="8.8" />
      <line x1="3" y1="13.5" x2="5.3" y2="13.5" />
      <line x1="18.7" y1="13.5" x2="21" y2="13.5" />
      <line x1="2.5" y1="19" x2="21.5" y2="19" />
    </svg>
  );
}

export function AlchemyIcon(props: IconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M5 12.5a7 7 0 0 0 14 0" />
      <line x1="4" y1="12.5" x2="20" y2="12.5" />
      <line x1="9" y1="19" x2="15" y2="19" />
      <line x1="12" y1="16" x2="12" y2="19" />
      <line x1="9.2" y1="6" x2="14.5" y2="11.3" />
      <circle cx="8.3" cy="5.1" r="1.2" />
    </svg>
  );
}

export function EnchantingIcon(props: IconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M3 6.5c2.5-1.3 5-1.3 9 0v12c-4-1.3-6.5-1.3-9 0Z" />
      <path d="M21 6.5c-2.5-1.3-5-1.3-9 0v12c4-1.3 6.5-1.3 9 0Z" />
      <path d="M18 2.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z" />
    </svg>
  );
}

export function SneakIcon(props: IconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M12 3c-4.2 0-7.5 3.6-7.5 8.2v7.3c2.3-1.6 5-2.1 7.5-2.1s5.2.5 7.5 2.1v-7.3C19.5 6.6 16.2 3 12 3Z" />
      <path d="M8.5 11c0-2 1.5-3.2 3.5-3.2s3.5 1.2 3.5 3.2" />
    </svg>
  );
}

export function FortitudeIcon(props: IconProps) {
  return (
    <svg {...ICON_DEFAULTS} {...props}>
      <path d="M12 3l7 2.5v6c0 5-3 8.5-7 9.5-4-1-7-4.5-7-9.5v-6Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export const SKILL_ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  smithing: SmithingIcon,
  speech: SpeechIcon,
  restoration: RestorationIcon,
  alchemy: AlchemyIcon,
  enchanting: EnchantingIcon,
  sneak: SneakIcon,
  fortitude: FortitudeIcon,
};
