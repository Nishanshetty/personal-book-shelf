'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/types/book';
import { BUY_PRICE } from '@/types/book';

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-gold' : 'text-border-mid'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`} className="block">
      <article className="bg-white rounded-xl border border-border-light card-hover overflow-hidden h-full flex flex-col">
        {/* Cover / Spine */}
        <div className="relative h-56 w-full flex-shrink-0">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

          {/* Availability badge */}
          <div className="absolute top-2 right-2 z-20">
            {book.available ? (
              <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Back ~{book.returnDate}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div>
            <span className="text-xs font-medium text-brown-muted uppercase tracking-wide">
              {book.genre}
            </span>
            <h3 className="font-serif text-brown-dark font-semibold text-base leading-snug mt-0.5 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-brown-mid text-sm mt-0.5">{book.author}</p>
          </div>

          {/* Ratings */}
          <div className="flex flex-col gap-1 text-xs text-brown-mid">
            {book.goodreadsRating && (
              <span>⭐ {book.goodreadsRating.toFixed(1)} Goodreads</span>
            )}
            {book.myRating && book.myRating > 0 && (
              <span className="flex items-center gap-1">
                My rating: <StarRating rating={book.myRating} />
              </span>
            )}
          </div>

          {/* Condition warnings */}
          {(book.hasNotes || book.poorPrint) && (
            <div className="flex flex-wrap gap-1.5">
              {book.hasNotes && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                  ✏️ Has notes
                </span>
              )}
              {book.poorPrint && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                  🔤 Font quality varies
                </span>
              )}
            </div>
          )}

          {/* Fee info */}
          <div className="mt-auto pt-2 border-t border-border-light flex items-center justify-between">
            <div className="text-xs text-brown-mid">
              <span className="font-medium text-brown-dark">฿{book.deposit}</span> deposit
              <span className="mx-1.5 text-border-mid">·</span>
              <span className="font-medium text-brown-dark">฿{book.fee}</span> / mo
            </div>
            {book.forSale ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FEF3E2] border border-gold text-brown-mid font-medium whitespace-nowrap">
                Buy ฿{BUY_PRICE}
              </span>
            ) : (
              <span className="text-xs text-brown-muted">{book.pages}p</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
