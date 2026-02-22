import { Resend } from 'resend';

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}
