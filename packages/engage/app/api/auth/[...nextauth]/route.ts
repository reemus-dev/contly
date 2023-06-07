import NextAuth from "next-auth";
import {authOpts} from "@/modules/auth/options";

const handler = NextAuth(authOpts);

const GET = handler;
const POST = handler;

export {GET, POST};
