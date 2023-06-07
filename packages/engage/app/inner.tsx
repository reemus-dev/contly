"use client";
import {signIn, signOut, useSession} from "next-auth/react";
import React from "react";

// prompt: "login"
// prompt: "consent"
// prompt: "select_account"

export const TestInner = () => {
  const session = useSession();
  console.log(session);
  return (
    <main>
      <a href="/register">Register</a>
      <button onClick={(e) => signIn("github", {}, {scope: "user:email"})}>Sign In</button>
      <button onClick={(e) => signOut()}>Sign Out</button>
      <h1>test</h1>
    </main>
  );
};
