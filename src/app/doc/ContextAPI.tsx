"use client";

import { FiMenu, FiX } from "react-icons/fi";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext<any>({});

export default function ContextAPI({
  doc_data,
  children,
}: {
  doc_data: any;
  children: ReactNode;
}) {
  const [all_docs, set_all_docs] = useState(doc_data?.data);
  const [error, set_error] = useState(doc_data?.error);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const data = { all_docs };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevents mismatch between SSR and client
    return null;
  }

  return error ? (
    <ErrorMsg msg={error} />
  ) : (
    <div>
      <AppContext.Provider value={data}>
        <Layout all_docs={all_docs}>{children}</Layout>
      </AppContext.Provider>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="animate-bounce text-center bg-red-faded text-red rounded-md px-[10px] text-xl">
        {msg || "Unknown error occurred"}
      </div>
      <div className="text-center my-[10px]">
        <div className="text-xl"> Reload the browser</div>
      </div>
    </div>
  );
}

function Layout({ children }: { all_docs: any; children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAppContext() {
  return useContext(AppContext);
}
