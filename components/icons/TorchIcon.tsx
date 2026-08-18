import type { SVGProps } from "react";

type TorchIconProps = SVGProps<SVGSVGElement> & { lit?: boolean };

// Matches the stroke weight/style of the skill icon set. The flame path
// only renders when lit, so muted/playing reads clearly at a glance.
export function TorchIcon({ lit = false, ...props }: TorchIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 21v-9.5" />
      <path d="M14 21v-9.5" />
      <path d="M9 11.5h6l-1.2-3.2H10.2Z" />
      {lit ? (
        <path d="M12 2c-1.7 1.7-2.3 3.2-1.7 4.4.35.65.95.9 1.7.9s1.35-.25 1.7-.9C14.3 5.2 13.7 3.7 12 2Z" />
      ) : null}
    </svg>
  );
}
