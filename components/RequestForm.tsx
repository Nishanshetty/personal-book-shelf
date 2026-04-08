'use client';

import { useState, type FormEvent } from 'react';
import { submitBookRequest, type RequestType } from '@/app/actions/request-book';
import { BUY_PRICE } from '@/types/book';

const LINE_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

interface Props {
  bookTitle: string;
  bookAuthor: string;
  type: RequestType;
}

const today = new Date().toISOString().split('T')[0];

export default function RequestForm({ bookTitle, bookAuthor, type }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBorrow = type === 'borrow';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = e.currentTarget;
    const result = await submitBookRequest({
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      lineId: (form.elements.namedItem('lineId') as HTMLInputElement).value.trim(),
      bookTitle,
      bookAuthor,
      type,
      startDate: isBorrow
        ? (form.elements.namedItem('startDate') as HTMLInputElement).value
        : undefined,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim() || undefined,
    });

    setPending(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error ?? 'Something went wrong.');
    }
  }

  function handleClose() {
    setOpen(false);
    setSuccess(false);
    setError(null);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={
          isBorrow
            ? 'flex items-center justify-center gap-3 w-full bg-[#06C755] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#05a848] transition-colors'
            : 'flex items-center justify-center gap-3 w-full bg-gold text-brown-dark font-semibold py-3 px-6 rounded-xl hover:bg-[#c49560] transition-colors'
        }
      >
        {LINE_ICON}
        {isBorrow ? 'Borrow this book' : `Buy for ฿${BUY_PRICE}`}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-dark/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-cream w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="font-serif text-lg font-semibold text-brown-dark">
                  {isBorrow ? 'Borrow request' : 'Buy request'}
                </h2>
                <p className="text-xs text-brown-muted mt-0.5 line-clamp-1">
                  {bookTitle} · {bookAuthor}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-brown-muted hover:text-brown-dark transition-colors text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {success ? (
              <div className="px-6 py-10 text-center">
                <p className="text-4xl mb-3">✅</p>
                <p className="font-serif text-xl font-semibold text-brown-dark mb-1">Request sent!</p>
                <p className="text-brown-mid text-sm">
                  I'll reach out to you on LINE soon.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2 rounded-xl bg-brown-dark text-white text-sm font-medium hover:bg-brown-mid transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1" htmlFor="name">
                    Your name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. John"
                    className="w-full border border-border-mid rounded-xl px-4 py-2.5 text-sm text-brown-dark bg-white placeholder:text-brown-muted focus:outline-none focus:border-brown-mid transition-colors"
                  />
                </div>

                {/* LINE ID */}
                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1" htmlFor="lineId">
                    LINE ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="lineId"
                    name="lineId"
                    type="text"
                    required
                    placeholder="e.g. @john"
                    className="w-full border border-border-mid rounded-xl px-4 py-2.5 text-sm text-brown-dark bg-white placeholder:text-brown-muted focus:outline-none focus:border-brown-mid transition-colors"
                  />
                </div>

                {/* Start date — borrow only */}
                {isBorrow && (
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1" htmlFor="startDate">
                      Wanted from <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      required
                      min={today}
                      className="w-full border border-border-mid rounded-xl px-4 py-2.5 text-sm text-brown-dark bg-white focus:outline-none focus:border-brown-mid transition-colors"
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1" htmlFor="message">
                    Message <span className="text-brown-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Anything else you'd like to say…"
                    className="w-full border border-border-mid rounded-xl px-4 py-2.5 text-sm text-brown-dark bg-white placeholder:text-brown-muted focus:outline-none focus:border-brown-mid transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                    isBorrow
                      ? 'bg-[#06C755] text-white hover:bg-[#05a848]'
                      : 'bg-gold text-brown-dark hover:bg-[#c49560]'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {pending ? 'Sending…' : 'Send request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
