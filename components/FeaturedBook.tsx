import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedBook } from '@/lib/books';
import { BUY_PRICE } from '@/types/book';
import RequestForm from '@/components/RequestForm';

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

export default function FeaturedBook() {
  const book = getFeaturedBook();
  if (!book) return null;

  const isBorrow = !book.forSale;

  return (
    <section className="px-4 py-12" style={{ background: '#F5EFE6' }}>
      <div className="max-w-4xl mx-auto">
        {/* Section label */}
        <p className="text-gold text-xs uppercase tracking-widest font-medium mb-6 text-center">
          Just Finished Reading
        </p>

        {/* Card */}
        <div
          className="bg-white rounded-2xl overflow-hidden border border-border-mid shadow-sm"
          style={{ boxShadow: '0 4px 24px rgba(44,24,16,0.08)' }}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Cover */}
            <Link
              href={`/books/${book.id}`}
              className="relative flex-shrink-0 sm:w-56 h-64 sm:h-auto block"
            >
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="224px"
                />
              ) : (
                <div
                  className="book-spine w-full h-full flex items-center justify-center px-6"
                  style={{ backgroundColor: book.color }}
                >
                  <p className="font-serif text-center text-white text-lg font-semibold leading-tight z-10 relative">
                    {book.title}
                  </p>
                </div>
              )}
            </Link>

            {/* Content */}
            <div className="flex flex-col justify-between p-6 sm:p-8 flex-1 gap-4">
              {/* Top: badge + meta */}
              <div className="flex flex-col gap-3">
                {/* Availability badge */}
                {isBorrow ? (
                  <span className="self-start inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Available to Borrow
                  </span>
                ) : (
                  <span className="self-start inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#FEF3E2] border border-gold text-brown-mid">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    For Sale – ฿{BUY_PRICE}
                  </span>
                )}

                {/* Title & author */}
                <div>
                  <Link href={`/books/${book.id}`}>
                    <h2 className="font-serif text-brown-dark font-bold text-xl sm:text-2xl leading-snug hover:text-brown-mid transition-colors">
                      {book.title}
                    </h2>
                  </Link>
                  <p className="text-brown-mid text-sm mt-1">{book.author}</p>
                </div>

                {/* My rating */}
                {book.myRating && book.myRating > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={book.myRating} />
                    <span className="text-xs text-brown-muted">my rating</span>
                  </div>
                )}

                {/* Personal note */}
                <blockquote className="border-l-2 border-gold pl-4 text-brown-mid text-sm sm:text-base italic font-serif leading-relaxed">
                  {book.featuredNote}
                </blockquote>
              </div>

              {/* Bottom: request form — same flow as book detail page */}
              <div className="pt-2 border-t border-border-light w-fit">
                <RequestForm
                  bookTitle={book.title}
                  bookAuthor={book.author}
                  type={isBorrow ? 'borrow' : 'buy'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
