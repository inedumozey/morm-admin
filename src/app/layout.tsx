import "./globals.css";
import type { Metadata } from "next";
import ProgressProvider from "./ProgressProvider";
import { Toaster } from "sonner";
import { api } from "@/services/api";
import ContextAPI from "./doc/layout";

export const metadata: Metadata = {
  title: `Morm`,
  description: `Morm is an ORM for SQL (Postgressql)`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile_data = { error: "", data: [] };
  try {
    // const { data } = await api.get("/");
    // profile_data.data = data.data;
  } catch (err: any) {
    // if (err.response) {
    //   profile_data.error = err.response.data.message;
    // } else {
    //   profile_data.error = err.message;
    // }
  }

  return (
    <html lang="en">
      <head></head>
      <body className="font-sans">
        <Toaster closeButton duration={8000} richColors />
        <ProgressProvider />
        <ContextAPI profile_data={profile_data}>{children}</ContextAPI>
      </body>
    </html>
  );
}
