import {getToken} from "next-auth/jwt";
import {getServerSession} from "next-auth/next";
import {headers} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession();
  // const token = await getToken({req: req});
  // getToken
  // const token = getCsrfToken();
  // const headersList = headers();
  // const referer = headersList.get("referer");
  // return new Response("Hello, Next.js!", {
  //   status: 200,
  //   headers: {referer: referer} as HeadersInit,
  // });

  return NextResponse.json({session});
}
