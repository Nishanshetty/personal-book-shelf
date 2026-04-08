export const BUY_PRICE = 200;

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  color: string;
  coverUrl?: string;
  available: boolean;
  returnDate?: string;
  deposit: number;
  fee: number;
  description?: string;
  isbn?: string;
  goodreadsRating?: number;
  myRating?: number;
  hasNotes?: boolean;       // book has handwritten notes or highlights
  poorPrint?: boolean;      // text/font quality may not be ideal
  forSale?: boolean;        // book is available to buy outright
  featured?: boolean;       // show in "Just Finished Reading" section
  featuredNote?: string;    // personal mini-review shown in featured section
}
