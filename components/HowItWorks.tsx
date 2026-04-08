'use client';

import { useState } from 'react';

const steps = [
  {
    num: '01',
    title: 'Browse & Pick',
    icon: '📚',
    body: "Browse the catalog and find a book you'd like to read. Check availability — a green badge means it's ready to go.",
  },
  {
    num: '02',
    title: 'Request the Book',
    icon: '💬',
    body: "Fill in a quick request form with your name, LINE ID, and when you'd like to pick it up. I'll confirm and arrange a convenient handover time.",
  },
  {
    num: '03',
    title: 'Pay & Read',
    icon: '📖',
    body: 'Pay the ฿100 refundable security deposit plus the ฿10 maintenance fee. You have 1 month to enjoy it.',
  },
  {
    num: '04',
    title: 'Return & Repeat',
    icon: '🔄',
    body: "Return the book in good condition and get your ฿100 deposit back in full. Then pick your next read!",
  },
];

export default function HowItWorks() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="how-it-works"
      className="py-16 px-4 max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl font-bold text-brown-dark">How it works</h2>
        <p className="text-brown-mid mt-2">Four simple steps to borrow a book</p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={step.num}
              className="border border-border-light rounded-xl bg-white overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream transition-colors"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-2xl">{step.icon}</span>
                <div className="flex-1">
                  <span className="text-xs font-medium text-brown-muted mr-2">Step {step.num}</span>
                  <span className="font-serif text-lg font-semibold text-brown-dark">
                    {step.title}
                  </span>
                </div>
                <span
                  className={`text-brown-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 border-t border-border-light">
                  <p className="text-brown-mid leading-relaxed">{step.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
