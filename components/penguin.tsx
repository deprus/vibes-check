export default function Penguin({ color }: { color: string }) {
  const svgColor = color === "colorless" ? "gray" : color;
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="size-10"
    >
      <ellipse cx="100" cy="120" rx="50" ry="70" fill={svgColor} />
      <ellipse cx="100" cy="130" rx="35" ry="55" fill={svgColor} />
      <circle cx="100" cy="60" r="30" fill={svgColor} />
      <circle cx="90" cy="50" r="5" fill={svgColor} />
      <circle cx="110" cy="50" r="5" fill={svgColor} />
      <polygon points="95,65 105,65 100,75" fill={svgColor} />
      <ellipse cx="85" cy="185" rx="12" ry="7" fill={svgColor} />
      <ellipse cx="115" cy="185" rx="12" ry="7" fill={svgColor} />
      <ellipse cx="50" cy="120" rx="15" ry="40" fill={svgColor} />
      <ellipse cx="150" cy="120" rx="15" ry="40" fill={svgColor} />
    </svg>
  );
}
