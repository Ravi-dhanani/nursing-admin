import type { SVGProps } from "react";

export function English(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <text
        x="50%"
        y="80%"
        textAnchor="middle"
        fontSize="20"
        fontFamily="Arial, sans-serif"
      >
        En
      </text>
    </svg>
  );
}

export function Gujrati(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <text
        x="50%"
        y="80%"
        textAnchor="middle"
        fontSize="20"
        fontFamily="Arial, sans-serif"
      >
        અ
      </text>
    </svg>
  );
}
