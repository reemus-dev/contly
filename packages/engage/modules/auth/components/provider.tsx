"use client";

import React from "react";
import {ReactCP} from "@/components/types";
import {SessionProvider} from "next-auth/react";

type Props = ReactCP;

export const AuthSessionProvider = (props: Props) => {
  return (
    <SessionProvider>
      {props.children}
    </SessionProvider>
  )
}