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
  profile_data,
  children,
}: {
  profile_data: any;
  children: ReactNode;
}) {
  const [profile, set_profile] = useState(profile_data?.data);
  const [error, set_error] = useState(profile_data?.error);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const data = { profile };

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
        <Layout profile={profile}>{children}</Layout>
      </AppContext.Provider>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="animate-bounce bg-red-faded text-red rounded-md px-[10px] text-xl">
        {msg || "Unknown error occurred"}
      </div>
      <div className="text-center my-[10px]">
        <div className="text-xl"> Reload the browser</div>
      </div>
    </div>
  );
}

function Layout({ children }: { profile: any; children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAppContext() {
  return useContext(AppContext);
}
