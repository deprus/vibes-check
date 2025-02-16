export default function Background() {
  return (
    <div className="absolute inset-0 -z-50 bg-sidebar">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(closest-corner at 180px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))",
        }}
      ></div>
      <div className="absolute inset-0 bg-noise"></div>
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
}
