export default function Footer() {
  const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || 'Your Name';
  const siteCity = process.env.NEXT_PUBLIC_SITE_CITY || 'Your City';

  return (
    <footer className="bg-white border-t border-border-light py-8 px-4 text-center">
      <div className="max-w-7xl mx-auto">
        <p className="font-serif text-xl font-semibold text-brown-dark mb-1">
          {ownerName}&apos;s Book Shelf
        </p>
        <p className="text-brown-muted text-sm">
          A personal book lending collection in {siteCity}.
        </p>
        <p className="text-brown-muted/60 text-xs mt-4">
          © {new Date().getFullYear()} · Powered by a love of reading
        </p>
      </div>
    </footer>
  );
}
