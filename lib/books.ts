import type { Book } from '@/types/book';
import booksData from '@/data/books.json';

const books = booksData as Book[];

export function getAllBooks(): Book[] {
  return books;
}

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getAllGenres(): string[] {
  const genres = books.map((b) => b.genre);
  return ['All', ...Array.from(new Set(genres)).sort()];
}

export function getFeaturedBook(): Book | undefined {
  return books.find((b) => b.featured);
}

export function getStats() {
  const total = books.length;
  const available = books.filter((b) => b.available).length;
  return { total, available };
}
