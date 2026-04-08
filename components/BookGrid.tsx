'use client';

import { useState, useMemo } from 'react';
import type { Book } from '@/types/book';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  genres: string[];
}

export default function BookGrid({ books, genres }: BookGridProps) {
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = activeGenre === 'All' || b.genre === activeGenre;
      const matchesAvailability = !showAvailableOnly || b.available;
      return matchesSearch && matchesGenre && matchesAvailability;
    });
  }, [books, search, activeGenre, showAvailableOnly]);

  return (
    <section id="catalog" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-muted text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search titles or authors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border-mid rounded-lg bg-white text-brown-dark placeholder:text-brown-muted focus:outline-none focus:border-brown-dark transition-colors text-sm"
            />
          </div>

          {/* Available only toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setShowAvailableOnly((v) => !v)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                showAvailableOnly ? 'bg-brown-dark' : 'bg-border-mid'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  showAvailableOnly ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-sm text-brown-mid font-medium">Available only</span>
          </label>
        </div>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`genre-pill ${
                activeGenre === g ? 'genre-pill-active' : 'genre-pill-inactive'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-brown-mid text-sm">
          Showing <span className="font-semibold text-brown-dark">{filtered.length}</span> of{' '}
          {books.length} books
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-brown-muted">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-serif text-xl text-brown-mid">No books found</p>
          <p className="text-sm mt-1">Try a different search or genre filter</p>
        </div>
      )}
    </section>
  );
}
