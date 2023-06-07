import {NextAuthOptions} from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOpts: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn(params) {
      console.log("signIn", params);
      return true;
    },
    async redirect(params) {
      console.log("redirect", params);
      return params.baseUrl;
    },
    async session(params) {
      console.log("session", params);
      return params.session;
    },
    async jwt(params) {
      console.log("jwt", params);
      return params.token;
    },
  },
};
