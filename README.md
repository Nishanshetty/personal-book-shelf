# 📚 Personal Book Shelf

A minimal, self-hosted book lending site for sharing your personal library with friends. People can browse your collection, request to borrow or buy, and you coordinate over LINE.

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](../../generate)

**Built with:** Next.js · Tailwind CSS · Resend · Vercel

---

## What it does

- Browse a catalog of books with cover images, ratings, and availability
- Highlights one "Just Finished Reading" book at the top with a personal note
- Borrow or buy requests are submitted via a form and sent to you by email
- Visitors can also message you directly on LINE

---

## Quick start

### 1. Use this template

Click **"Use this template"** above → name your repo → create it.

Then clone it locally:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every value — see the comments in the file for where to get each one.

### 3. Add your books

Edit `data/books.json`. Each book is one object in the array:

```json
{
  "id": "GOODREADS_BOOK_ID",
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Genre",
  "pages": 300,
  "color": "#1A5276",
  "coverUrl": "https://...",
  "available": true,
  "deposit": 100,
  "fee": 10,
  "description": "Short description...",
  "goodreadsRating": 4.2,
  "myRating": 4
}
```

**All fields:**

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Any unique string — Goodreads book ID works well |
| `title` | Yes | Book title |
| `author` | Yes | Author name |
| `genre` | Yes | Used for filtering (e.g. "History", "Fiction") |
| `pages` | Yes | Page count |
| `color` | Yes | Hex color shown if no cover image |
| `available` | Yes | `true` or `false` |
| `deposit` | Yes | Refundable deposit amount |
| `fee` | Yes | Monthly maintenance fee |
| `coverUrl` | No | Image URL (Goodreads image URLs work well) |
| `returnDate` | No | Shown when unavailable, e.g. `"May"` |
| `description` | No | Shown on the book detail page |
| `goodreadsRating` | No | Displayed as a reference rating |
| `myRating` | No | Your personal rating out of 5 |
| `forSale` | No | Set `true` to show a buy option |
| `hasNotes` | No | Set `true` if you've written notes in the book |
| `poorPrint` | No | Set `true` to warn about print quality |
| `featured` | No | Set `true` on one book to feature it at the top |
| `featuredNote` | No | Your mini-review, shown in the featured section |

### 4. Feature a book

To highlight a book in the "Just Finished Reading" section, add two fields to it in `books.json`:

```json
"featured": true,
"featuredNote": "Your short personal take on the book."
```

Only one book should have `featured: true` at a time.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Syncing books from Goodreads

Instead of manually writing every book in `books.json`, you can pull your entire "read" shelf directly from Goodreads.

### 1. Get your Goodreads RSS URL

1. Go to your Goodreads profile → **My Books** → **read** shelf
2. Scroll to the bottom of the page — you'll see an RSS icon. Click it and copy the URL
3. It looks like: `https://www.goodreads.com/review/list_rss/YOUR_ID?key=...&shelf=read`
4. Add it to `.env.local` as `GOODREADS_RSS_URL`

> Your RSS URL contains a private key — don't commit it. It stays safely in `.env.local`.

### 2. Run the sync

```bash
npm run sync
```

This fetches every book from your read shelf and overwrites `data/books.json` with:
- Title, author, page count, cover image, ISBN
- Your Goodreads rating and your personal rating
- Auto-detected genre (from shelf tags or title keywords)
- A generated spine color (used if no cover image)

### 3. After syncing

A few things to tidy up manually after each sync:

- **Availability** — the sync sets all books to `available: true`. Set `available: false` (and optionally `returnDate`) on any currently lent out
- **For sale** — add `"forSale": true` to any books you're willing to sell
- **Featured book** — add `"featured": true` and `"featuredNote": "..."` to whichever book you just finished
- **Condition flags** — add `"hasNotes": true` or `"poorPrint": true` where relevant

---

## Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. In **Environment Variables**, add all the values from your `.env.local`
4. Deploy — done

---

## Getting a Resend API key

1. Sign up at [resend.com](https://resend.com) (free tier is enough)
2. Go to **API Keys** → **Create API Key**
3. For `RESEND_FROM_EMAIL`: use `onboarding@resend.dev` while testing, or add and verify your own domain for production

---

## Getting your LINE contact URL

1. Open LINE → your **Profile**
2. Tap **Share** → **Copy Link**
3. It looks like `https://line.me/ti/p/~your_id` — paste that as `NEXT_PUBLIC_LINE_CONTACT_URL`

---

## Finding cover images

The easiest source is Goodreads. Open any book on Goodreads, right-click the cover → **Copy image address**. Paste it as `coverUrl`. If you skip it, the book spine fallback (using `color`) is shown instead.

---

## License

MIT — do whatever you want with it.
