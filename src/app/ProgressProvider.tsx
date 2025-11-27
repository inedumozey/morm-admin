"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: true, speed: 400, minimum: 0.25 });

export default function ProgressProvider({
  color = "red",
}: {
  color?: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300); // smooth transition

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]); // triggers every route change

  return (
    <>
      <style jsx global>{`
        #nprogress .bar {
          background: ${color};
          height: 3px;
        }
        #nprogress .spinner {
          display: block;
          position: fixed;
          z-index: 1031;
          top: 0px;
          right: 0px;
        }
        #nprogress .spinner-icon {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          border: solid 2px transparent;
          border-top-color: ${color};
          border-left-color: ${color};
          border-radius: 50%;
          animation: nprogress-spinner 400ms linear infinite;
        }
        #nprogress .peg {
          display: none;
        }
        @keyframes nprogress-spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
