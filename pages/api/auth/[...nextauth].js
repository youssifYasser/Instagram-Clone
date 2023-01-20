import NextAuth from 'next-auth';
import InstagramProvider from 'next-auth/providers/instagram';

export const authOptions = {
  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
  ],
  // callbacks: {
  //   async redirect() {
  //     return '/';
  //   },
  // },
  // pages: {
  //   signIn: '/sign-in',
  // },
};

export default NextAuth(authOptions);
