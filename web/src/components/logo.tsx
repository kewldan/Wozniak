export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1254 1254"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="oklch(0.591 0.221 258.2)"
        d="M627 0C1242 0 1254 12 1254 627S1242 1254 627 1254 0 1242 0 627 12 0 627 0Z"
      />
      <path
        fill="oklch(1 0 0)"
        d="M211 381H354C354 642 474 728 555 750L552 381H688C688 693 848 746 922 753L918 381H1045L1044 885H930C826 885 736 840 664 754V885H580C436 885 211 750 211 381Z"
      />
    </svg>
  );
}
