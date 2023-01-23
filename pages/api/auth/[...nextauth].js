import NextAuth from 'next-auth';
import InstagramProvider from 'next-auth/providers/instagram';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session.user.name
        .replaceAll(' ', '')
        .toLowerCase();
      session.user.uid = token.sub;

      return session;
    },
  },
};

export default NextAuth(authOptions);
