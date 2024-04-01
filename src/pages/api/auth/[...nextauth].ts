import { JWTSession } from "@/models/auth/session";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  events: {
    async signOut({ token }) {
      await fetch(
        `https://accounts.google.com/o/oauth2/revoke?token=${token.access_token}`,
        {
          method: "POST",
        }
      ).then(async () => {
        return;
      });
    },
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      let jwt_session: JWTSession = {
        user: session.user,
        expires: session.expires,
      };
      if (jwt_session.user) {
        jwt_session.user.id = token.id as string;
        jwt_session.user.access_token = token.access_token as string;
        return jwt_session;
      } else {
        return {
          user: undefined,
          expires: new Date(Date.now()).toISOString(),
        } as JWTSession;
      }
    },
  },
});
