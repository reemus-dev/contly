import React from "react";
import {inter} from "@/components/fonts";


export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
