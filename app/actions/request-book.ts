'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type RequestType = 'borrow' | 'buy';

export interface RequestData {
  name: string;
  lineId: string;
  bookTitle: string;
  bookAuthor: string;
  type: RequestType;
  startDate?: string;
  message?: string;
}

export async function submitBookRequest(
  data: RequestData
): Promise<{ success: boolean; error?: string }> {
  try {
    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) throw new Error('CONTACT_EMAIL not configured');

    const isBorrow = data.type === 'borrow';

    const subject = isBorrow
      ? `Borrow Request: "${data.bookTitle}"`
      : `Buy Request: "${data.bookTitle}"`;

    const rows = [
      `<tr><td style="padding:6px 12px 6px 0;color:#6B5744;white-space:nowrap">Book</td><td style="padding:6px 0;font-weight:600">${data.bookTitle} <span style="font-weight:400;color:#6B5744">by ${data.bookAuthor}</span></td></tr>`,
      `<tr><td style="padding:6px 12px 6px 0;color:#6B5744">Name</td><td style="padding:6px 0;font-weight:600">${data.name}</td></tr>`,
      `<tr><td style="padding:6px 12px 6px 0;color:#6B5744">LINE ID</td><td style="padding:6px 0;font-weight:600">${data.lineId}</td></tr>`,
      ...(isBorrow && data.startDate
        ? [`<tr><td style="padding:6px 12px 6px 0;color:#6B5744">Wanted from</td><td style="padding:6px 0;font-weight:600">${data.startDate}</td></tr>`]
        : []),
      ...(!isBorrow
        ? [`<tr><td style="padding:6px 12px 6px 0;color:#6B5744">Buy price</td><td style="padding:6px 0;font-weight:600">฿200</td></tr>`]
        : []),
      ...(data.message
        ? [`<tr><td style="padding:6px 12px 6px 0;color:#6B5744;vertical-align:top">Message</td><td style="padding:6px 0">${data.message}</td></tr>`]
        : []),
    ].join('');

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FAF6F1;border-radius:12px">
        <h2 style="margin:0 0 24px;font-size:20px;color:#2C1810">
          ${isBorrow ? '📚 New Borrow Request' : '🛍️ New Buy Request'}
        </h2>
        <table style="border-collapse:collapse;width:100%">
          ${rows}
        </table>
      </div>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: contactEmail,
      subject,
      html,
    });

    return { success: true };
  } catch (err) {
    console.error('Failed to send request email:', err);
    return { success: false, error: 'Failed to send request. Please try again.' };
  }
}
