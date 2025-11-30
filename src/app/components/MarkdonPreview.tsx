"use client";

import { FiClipboard, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import React, { useState } from "react";
import "highlight.js/styles/github.css";

export default function MarkdonPreview({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code: MarkdownCodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function MarkdownCodeBlock({ inline, className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const item = String(children).replace(/\n$/, "");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (inline)
    return (
      <code className="px-1 rounded bg-gray-200 text-gray-900">{children}</code>
    );

  return (
    <div className="relative group">
      {/* COPY BUTTON */}
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-black/60 text-white p-2 rounded"
      >
        {copied ? <FiCheck size={16} /> : <FiClipboard size={16} />}
      </button>

      <pre className={`rounded-lg overflow-auto p-3 ${className || ""}`}>
        <code {...props} className={`${className || ""}`}>
          {children}
        </code>
      </pre>
    </div>
  );
}
