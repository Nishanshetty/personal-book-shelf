import { getAllBooks, getAllGenres, getStats } from '@/lib/books';
import BookGrid from '@/components/BookGrid';
import Hero from '@/components/Hero';
import FeaturedBook from '@/components/FeaturedBook';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const books = getAllBooks();
  const genres = getAllGenres();
  const { total, available } = getStats();

  return (
    <main>
      <Hero total={total} available={available} />
      <FeaturedBook />
      <BookGrid books={books} genres={genres} />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
