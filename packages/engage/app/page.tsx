import {TestInner} from "@/app/inner";
import {AuthSessionProvider} from "@/modules/auth/components/provider";
import React from "react";

export default async function Home() {
  return (
    <main>
      <AuthSessionProvider>
        <TestInner />
      </AuthSessionProvider>
    </main>
  );
}
