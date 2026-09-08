/**
 * WhatsApp is the shop's order and support channel: the cart hands the order
 * off to it, and the contact form does the same for messages.
 */

const FALLBACK_NUMBER = '22960000000';

/** International format, digits only — what wa.me expects. */
export function getWhatsappNumber(): string {
  const configured = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
  return (configured || FALLBACK_NUMBER).replace(/[^0-9]/g, '');
}

/** Builds a wa.me link with the message pre-filled. */
export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(message)}`;
}
