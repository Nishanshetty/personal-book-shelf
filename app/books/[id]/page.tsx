import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllBooks, getBookById } from '@/lib/books';
import { BUY_PRICE } from '@/types/book';
import RequestForm from '@/components/RequestForm';
import Footer from '@/components/Footer';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllBooks().map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const book = getBookById(params.id);
  if (!book) return {};
  return {
    title: `${book.title} — Nishan's Book Shelf`,
    description: book.description ?? `Borrow "${book.title}" by ${book.author} from Nishan's personal book lending library in Bangkok.`,
  };
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-xl">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-gold' : 'text-border-mid'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function BookPage({ params }: PageProps) {
  const book = getBookById(params.id);
  if (!book) notFound();


  return (
    <main className="min-h-screen bg-cream">
      {/* Nav bar */}
      <div className="bg-white border-b border-border-light px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brown-mid hover:text-brown-dark transition-colors text-sm font-medium"
          >
            ← Back to catalog
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          {/* Cover / Spine */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ height: 380 }}>
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                  sizes="280px"
                />
              ) : (
                <div
                  className="book-spine w-full h-full flex items-center justify-center p-8"
                  style={{ backgroundColor: book.color }}
                >
                  <p className="font-serif text-center text-white text-2xl font-bold leading-snug z-10 relative">
                    {book.title}
                  </p>
                </div>
              )}
            </div>

            {/* Availability */}
            <div
              className={`rounded-xl p-4 text-center font-medium ${
                book.available
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}
            >
              {book.available ? (
                <>
                  <span className="text-green-500 text-lg mr-1">●</span> Available to borrow
                </>
              ) : (
                <>
                  <span className="text-amber-500 text-lg mr-1">●</span> Back around{' '}
                  {book.returnDate}
                </>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-border-light p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brown-mid">Security deposit</span>
                <span className="font-semibold text-brown-dark">฿{book.deposit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brown-mid">Maintenance fee</span>
                <span className="font-semibold text-brown-dark">฿{book.fee} / month</span>
              </div>
              {book.forSale && (
                <>
                  <div className="border-t border-border-light pt-2 flex justify-between text-sm">
                    <span className="text-brown-mid">Buy outright</span>
                    <span className="font-semibold text-brown-dark">฿{BUY_PRICE}</span>
                  </div>
                </>
              )}
              <div className="border-t border-border-light pt-2 text-xs text-brown-muted">
                Deposit fully refunded on return
              </div>
            </div>

            {/* Request buttons */}
            {book.available && (
              <RequestForm bookTitle={book.title} bookAuthor={book.author} type="borrow" />
            )}
            {book.forSale && (
              <RequestForm bookTitle={book.title} bookAuthor={book.author} type="buy" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-border-light text-brown-mid text-xs font-medium px-3 py-1 rounded-full mb-3">
                {book.genre}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-brown-dark leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-brown-mid text-xl">{book.author}</p>
            </div>

            {/* Ratings */}
            <div className="flex flex-wrap gap-6">
              {book.goodreadsRating && (
                <div>
                  <p className="text-xs text-brown-muted uppercase tracking-wide mb-1">
                    Goodreads Rating
                  </p>
                  <p className="text-2xl font-bold text-brown-dark">
                    ⭐ {book.goodreadsRating.toFixed(2)}
                  </p>
                </div>
              )}
              {book.myRating && book.myRating > 0 && (
                <div>
                  <p className="text-xs text-brown-muted uppercase tracking-wide mb-1">
                    My Rating
                  </p>
                  <StarRating rating={book.myRating} />
                </div>
              )}
            </div>

            {/* Condition warnings */}
            {(book.hasNotes || book.poorPrint) && (
              <div className="flex flex-wrap gap-2">
                {book.hasNotes && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    <span className="text-lg leading-none">✏️</span>
                    <div>
                      <p className="font-semibold">Contains notes &amp; highlights</p>
                      <p className="text-amber-700 text-xs mt-0.5">
                        I've marked passages and written notes while reading this copy.
                      </p>
                    </div>
                  </div>
                )}
                {book.poorPrint && (
                  <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
                    <span className="text-lg leading-none">🔤</span>
                    <div>
                      <p className="font-semibold">Font quality may vary</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        This edition's print quality isn't the best — text may appear faint or small.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pages', value: book.pages },
                { label: 'ISBN', value: book.isbn ?? '—' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-white border border-border-light rounded-xl p-3"
                >
                  <p className="text-xs text-brown-muted mb-0.5">{m.label}</p>
                  <p className="font-semibold text-brown-dark">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h2 className="font-serif text-xl font-semibold text-brown-dark mb-2">
                  About this book
                </h2>
                <p className="text-brown-mid leading-relaxed">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
