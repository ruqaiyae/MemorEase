export function HeroImg() {
  return (
    <div className="w-[85%] mx-auto">
      <img
        src="/mobile-hero.png"
        alt="MemorEase hero image"
        className="md:hidden"
      />
      <img
        src="/desktop-hero.png"
        alt="MemorEase hero image"
        className="hidden md:block"
      />
    </div>
  );
}
