// Fixed, decorative page background: dot grid + slowly drifting glow blobs.
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="dot-bg absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black_30%,transparent_100%)]" />
      <div className="animate-drift absolute -left-40 top-[10%] h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[130px] dark:bg-accent/15" />
      <div
        className="animate-drift absolute -right-40 top-[45%] h-[30rem] w-[30rem] rounded-full bg-sky-400/10 blur-[130px] dark:bg-sky-500/10"
        style={{ animationDelay: '-8s', animationDirection: 'reverse' }}
      />
      <div
        className="animate-drift absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-indigo-400/10 blur-[130px] dark:bg-indigo-500/10"
        style={{ animationDelay: '-15s' }}
      />
    </div>
  );
}
