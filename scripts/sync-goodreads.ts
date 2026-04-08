import { XMLParser } from 'fast-xml-parser';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { Book } from '../types/book';

const PALETTE = [
  '#2D6A4F', '#BC6C25', '#264653', '#6A040F', '#3A0CA3',
  '#1B4332', '#023E8A', '#774936', '#495057', '#582F0E',
  '#7B2D26', '#2B4141', '#5A189A', '#99582A', '#1B3A4B',
  '#6B4226', '#2C3E50', '#8B1A1A', '#2E4057', '#704214',
];

function hashColor(title: string): string {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = ((h << 5) - h) + title.charCodeAt(i);
    h |= 0;
  }
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function guessGenre(title: string, author: string, shelves: string): string {
  if (shelves) {
    const s = shelves.toLowerCase();
    if (/self-improvement|self-help/.test(s)) return 'Self-Help';
    if (/business|finance|entrepreneur/.test(s)) return 'Business';
    if (/science|physics|biology/.test(s)) return 'Science';
    if (/history/.test(s)) return 'History';
    if (/fiction|novel/.test(s)) return 'Fiction';
    if (/philosoph/.test(s)) return 'Philosophy';
    if (/biograph|memoir/.test(s)) return 'Biography';
    if (/health|fitness|nutrition/.test(s)) return 'Health';
    if (/tech|programming|software/.test(s)) return 'Technology';
    if (/travel/.test(s)) return 'Travel';
    if (/psychology/.test(s)) return 'Psychology';
    if (/politics|geopolitics/.test(s)) return 'Politics';
    if (/economics|economy/.test(s)) return 'Economics';
  }

  const t = (title + ' ' + author).toLowerCase();
  if (/\b(war|battle|empire|history|historical|revolution|civilization)\b/.test(t)) return 'History';
  if (/\b(money|wealth|invest|finance|stock|market|capital|rich|billion)\b/.test(t)) return 'Finance';
  if (/\b(habit|atomic|think|mind|brain|psychology|behav|emotional|social|influence|persuasion)\b/.test(t)) return 'Psychology';
  if (/\b(startup|business|company|leader|management|product|strateg|entrepren)\b/.test(t)) return 'Business';
  if (/\b(health|diet|food|nutrition|exercise|longevity|ageing|fasting|body|sleep)\b/.test(t)) return 'Health';
  if (/\b(science|physics|quantum|biology|evolution|universe|cosmos|space|planet)\b/.test(t)) return 'Science';
  if (/\b(philosoph|stoic|meditat|virtue|ethics|moral|wisdom|meaning|plato|aristotle|marcus)\b/.test(t)) return 'Philosophy';
  if (/\b(biograph|memoir|autobiography)\b/.test(t)) return 'Biography';
  if (/\b(novel|fiction|fantasy|mystery|crime|detective|thriller)\b/.test(t)) return 'Fiction';
  if (/\b(energy|oil|gas|climate|geopolit|nation|world|global)\b/.test(t)) return 'Politics';
  if (/\b(tech|software|code|algorithm|internet|digital|computer|ai|data)\b/.test(t)) return 'Technology';
  if (/\b(travel|adventure|journey|explore|expedition)\b/.test(t)) return 'Travel';
  return 'Non-Fiction';
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const rssUrl =
    process.env.GOODREADS_RSS_URL ||
    'https://www.goodreads.com/review/list_rss/180131573?key=lH96kbvjUbweQU2CqWUPG7Zfj9D8Zvlzmu9Kjx_heKEbL_Hb&shelf=read';

  console.log('Fetching Goodreads RSS…');
  const res = await fetch(rssUrl);
  if (!res.ok) throw new Error(`Failed to fetch RSS: ${res.status} ${res.statusText}`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
    isArray: (name) => name === 'item',
  });

  const parsed = parser.parse(xml);
  const items: Record<string, unknown>[] = parsed?.rss?.channel?.item ?? [];

  const books: Book[] = items.map((item) => {
    const str = (v: unknown): string => {
      if (typeof v === 'string') return v.trim();
      if (v && typeof v === 'object' && '__cdata' in v) return String((v as Record<string, unknown>)['__cdata']).trim();
      return String(v ?? '').trim();
    };
    const num = (v: unknown): number => {
      const n = parseFloat(String(v ?? '0'));
      return isNaN(n) ? 0 : n;
    };

    const id = str(item.book_id);
    const title = str(item.title);
    const author = str(item.author_name);
    const userShelves = str(item.user_shelves);

    const bookObj = item.book as Record<string, unknown> | undefined;
    const pages = bookObj ? parseInt(str(bookObj.num_pages)) || 0 : 0;

    const myRating = parseInt(str(item.user_rating)) || 0;
    const goodreadsRating = num(item.average_rating);
    const isbn = str(item.isbn);

    const largeImg = str(item.book_large_image_url);
    const smallImg = str(item.book_image_url);
    const coverUrl = largeImg || smallImg || undefined;

    const rawDesc = str(item.book_description);
    const description = rawDesc ? stripHtml(rawDesc).substring(0, 600) : undefined;

    const fee = 10;

    const book: Book = {
      id,
      title,
      author,
      genre: guessGenre(title, author, userShelves),
      pages,
      color: hashColor(title),
      available: true,
      deposit: 100,
      fee,
    };

    if (coverUrl) book.coverUrl = coverUrl;
    if (description) book.description = description;
    if (isbn) book.isbn = isbn;
    if (goodreadsRating) book.goodreadsRating = goodreadsRating;
    if (myRating > 0) book.myRating = myRating;

    return book;
  });

  const outPath = join(process.cwd(), 'data', 'books.json');
  writeFileSync(outPath, JSON.stringify(books, null, 2));
  console.log(`Synced ${books.length} books from Goodreads → ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
