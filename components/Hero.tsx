
interface HeroProps {
  total: number;
  available: number;
}

export default function Hero({ total, available }: HeroProps) {
  const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || 'Your Name';
  const siteCity = process.env.NEXT_PUBLIC_SITE_CITY || 'Your City';

  return (
    <header
      className="relative overflow-hidden text-cream"
      style={{ background: 'linear-gradient(135deg, #2C1810 0%, #3d2418 50%, #2C1810 100%)' }}
    >
      {/* Cross pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 24px,
            rgba(255,255,255,0.4) 24px,
            rgba(255,255,255,0.4) 25px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 24px,
            rgba(255,255,255,0.4) 24px,
            rgba(255,255,255,0.4) 25px
          )`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-gold text-sm font-medium uppercase tracking-widest mb-4">
            {siteCity} · Personal Library
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">
            {ownerName}&apos;s
            <br />
            <span className="text-gold">Book Shelf</span>
          </h1>
          <p className="text-cream/75 text-lg leading-relaxed mb-8 max-w-lg">
            Borrow books from my personal collection. Pay a small refundable deposit and a
            tiny maintenance fee.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 bg-gold text-brown-dark font-semibold px-6 py-3 rounded-lg hover:bg-[#c4945f] transition-colors"
            >
              Browse Catalog
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-lg hover:bg-cream/10 transition-colors"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-wrap gap-6 md:gap-12">
          {[
            { value: total, label: 'Books in catalog' },
            { value: available, label: 'Available now' },
            { value: '฿100', label: 'Refundable deposit' },
            { value: '1 month', label: 'Lending period' },
          ].map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="font-serif text-3xl font-bold text-gold">{s.value}</p>
              <p className="text-cream/60 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
