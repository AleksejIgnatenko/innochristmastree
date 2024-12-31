"use client";

import client from "../GraphQL/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import "./globals.css";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
