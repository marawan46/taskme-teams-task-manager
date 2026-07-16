/**
 * Dependency-free icon set. Line icons share a 24x24 stroke grid (Feather/Lucide
 * style) so they read as one family; `size` sets both width and height.
 */
import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Line({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Check = (p: IconProps) => (
  <Line {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Line>
);

export const X = (p: IconProps) => (
  <Line {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Line>
);

export const Plus = (p: IconProps) => (
  <Line {...p}>
    <path d="M12 5v14M5 12h14" />
  </Line>
);

export const ChevronDown = (p: IconProps) => (
  <Line {...p}>
    <path d="m6 9 6 6 6-6" />
  </Line>
);

export const ChevronRight = (p: IconProps) => (
  <Line {...p}>
    <path d="m9 18 6-6-6-6" />
  </Line>
);

export const ChevronLeft = (p: IconProps) => (
  <Line {...p}>
    <path d="m15 18-6-6 6-6" />
  </Line>
);

export const Search = (p: IconProps) => (
  <Line {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Line>
);

export const Bell = (p: IconProps) => (
  <Line {...p}>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
  </Line>
);

export const Settings = (p: IconProps) => (
  <Line {...p}>
    <path d="M12.2 2h-.4a2 2 0 0 0-2 2 1.7 1.7 0 0 1-1 1.5 1.7 1.7 0 0 1-1.9-.3 2 2 0 0 0-2.8 0l-.3.3a2 2 0 0 0 0 2.8 1.7 1.7 0 0 1 .3 1.9 1.7 1.7 0 0 1-1.5 1 2 2 0 0 0-2 2v.4a2 2 0 0 0 2 2 1.7 1.7 0 0 1 1.5 1 1.7 1.7 0 0 1-.3 1.9 2 2 0 0 0 0 2.8l.3.3a2 2 0 0 0 2.8 0 1.7 1.7 0 0 1 1.9-.3 1.7 1.7 0 0 1 1 1.5 2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2 1.7 1.7 0 0 1 1-1.5 1.7 1.7 0 0 1 1.9.3 2 2 0 0 0 2.8 0l.3-.3a2 2 0 0 0 0-2.8 1.7 1.7 0 0 1-.3-1.9 1.7 1.7 0 0 1 1.5-1 2 2 0 0 0 2-2v-.4a2 2 0 0 0-2-2 1.7 1.7 0 0 1-1.5-1 1.7 1.7 0 0 1 .3-1.9 2 2 0 0 0 0-2.8l-.3-.3a2 2 0 0 0-2.8 0 1.7 1.7 0 0 1-1.9.3 1.7 1.7 0 0 1-1-1.5 2 2 0 0 0-2-2Z" />
    <circle cx="12" cy="12" r="3" />
  </Line>
);

export const Inbox = (p: IconProps) => (
  <Line {...p}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </Line>
);

export const Board = (p: IconProps) => (
  <Line {...p}>
    <rect width="7" height="18" x="3" y="3" rx="1.5" />
    <rect width="7" height="12" x="14" y="3" rx="1.5" />
  </Line>
);

export const ListIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </Line>
);

export const Calendar = (p: IconProps) => (
  <Line {...p}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18M8 2v4M16 2v4" />
  </Line>
);

export const Folder = (p: IconProps) => (
  <Line {...p}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </Line>
);

export const MoreHorizontal = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </Line>
);

export const MoreVertical = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Line>
);

export const Flag = (p: IconProps) => (
  <Line {...p}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z" />
    <path d="M4 22v-7" />
  </Line>
);

export const Sun = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Line>
);

export const Moon = (p: IconProps) => (
  <Line {...p}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Line>
);

export const LogOut = (p: IconProps) => (
  <Line {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Line>
);

export const User = (p: IconProps) => (
  <Line {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Line>
);

export const Users = (p: IconProps) => (
  <Line {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Line>
);

export const Clock = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Line>
);

export const ArrowRight = (p: IconProps) => (
  <Line {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </Line>
);

export const Filter = (p: IconProps) => (
  <Line {...p}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54Z" />
  </Line>
);

export const Trash = (p: IconProps) => (
  <Line {...p}>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </Line>
);

export const Tag = (p: IconProps) => (
  <Line {...p}>
    <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8Z" />
    <circle cx="7.5" cy="7.5" r="0.5" fill="currentColor" />
  </Line>
);

export const AlertCircle = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </Line>
);

export const CheckCircle = (p: IconProps) => (
  <Line {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </Line>
);

export const Menu = (p: IconProps) => (
  <Line {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Line>
);

export const Sparkles = (p: IconProps) => (
  <Line {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" />
  </Line>
);

export const Layers = (p: IconProps) => (
  <Line {...p}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
  </Line>
);

export const Loader = ({ size = 20, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className={`animate-spin ${className ?? ""}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.2-8.6" />
  </svg>
);

/** Google's multi-color "G" mark (fill-based, brand colors). */
export const GoogleLogo = ({ size = 18, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
    />
  </svg>
);
