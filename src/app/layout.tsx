import "./globals.css";
import type { Metadata } from "next";
import ProgressProvider from "./ProgressProvider";
import { Toaster } from "sonner";
import { api } from "@/services/api";
import ContextAPI from "./doc/ContextAPI";

export const metadata: Metadata = {
  title: `Morm`,
  description: `Morm is an ORM for SQL (Postgressql)`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const doc_data = { error: "", data: [] };
  try {
    const { data } = await api.get("/");
    doc_data.data = data.data;
  } catch (err: any) {
    if (err.response) {
      doc_data.error = err.response.data.message;
    } else {
      doc_data.error = err.message;
    }
  }

  return (
    <html lang="en">
      <head></head>
      <body className="font-sans">
        <Toaster closeButton duration={8000} richColors />
        <ProgressProvider />
        <ContextAPI doc_data={doc_data}>{children}</ContextAPI>
      </body>
    </html>
  );
}
