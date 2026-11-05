'use server';

import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Message from '@/lib/models/Message';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(100),
  email: z.email('Please enter a valid email'),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(5, 'Message is too short').max(5000),
  website: z.string().max(0).optional(), // honeypot – real users leave it empty
});

export async function sendMessage(_prevState, formData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { name, email, subject, message } = parsed.data;
  try {
    await connectDB();
    await Message.create({ name, email, message, subject: subject || 'Portfolio contact' });
    return { ok: true };
  } catch (err) {
    console.error('Contact form failed:', err.message);
    return { ok: false, error: 'Could not send your message right now. Please email me directly.' };
  }
}
