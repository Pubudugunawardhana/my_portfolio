import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

const adminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email) => !!email && adminEmails().includes(email.toLowerCase());

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: '/login', error: '/login' },
  providers: [
    Google,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize({ email, password }) {
        if (typeof email !== 'string' || typeof password !== 'string') return null;
        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await user.matchPassword(password))) return null;
        return { id: String(user._id), email: user.email };
      },
    }),
  ],
  callbacks: {
    // Only whitelisted emails may sign in, whichever provider they use.
    signIn({ user }) {
      return isAdminEmail(user?.email);
    },
  },
});

// Guard for Server Actions and Route Handlers.
export async function requireAdmin() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) throw new Error('Unauthorized');
  return session;
}
