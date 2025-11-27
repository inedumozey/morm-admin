"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useDocs } from "@/hooks/useDocs";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";

const imgInput = `p-[4px] block w-full rounded-md outline-none focus:border-pri focus:border-[2px] border-border border-[1px]`;

export default function DocEditor() {
  const [content, set_content] = useState("");
  const [title, set_title] = useState("Introduction");
  const [sending, set_sending] = useState(false);
  const { createDoc, docs } = useDocs();

  // --- Image toolbar states ---
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgWidth, setImgWidth] = useState("");
  const [imgHeight, setImgHeight] = useState("");

  const save = async () => {
    set_sending(true);
    try {
      await createDoc(title, content);
      set_title("");
      set_content("");
      setImgUrl("");
      setImgAlt("");
      setImgWidth("");
      setImgHeight("");
    } finally {
      set_sending(false);
    }
  };

  // Insert image into editor content
  const insertImage = () => {
    if (!imgUrl) return;

    // Decide Markdown or HTML based on width/height
    const imgMarkdown =
      imgWidth || imgHeight
        ? `<img src="${imgUrl}" alt="${imgAlt}"${
            imgWidth ? ` width="${imgWidth}"` : ""
          }${imgHeight ? ` height="${imgHeight}"` : ""} />`
        : `![${imgAlt}](${imgUrl})`;

    // Insert at the current cursor or end of content
    set_content((prev) => prev + "\n" + imgMarkdown + "\n");

    // Reset inputs
    setImgUrl("");
    setImgAlt("");
    setImgWidth("");
    setImgHeight("");
  };
  return (
    <div className="flex h-screen min-w-[600px] bg-bg">
      {/* Editor */}
      <div className="w-1/2 h-full border-r border-border">
        {/* header */}
        <div className="p-2 h-[165px] border-b border-border shadow-xlg">
          <label>Title</label>
          <input
            type="text"
            value={title || ""}
            onChange={(e) => set_title(e.target.value)}
            className="p-[8px] block w-full rounded-md outline-none focus:border-pri focus:border-[2px] border-border border-[1px]"
          />

          {/* --- Image Toolbar --- */}
          <div className="pt-2">
            <div className="items-end flex gap-2 justify-between">
              <input
                type="text"
                placeholder="Image URL"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                className={`${imgInput} `}
              />
              <input
                type="text"
                placeholder="Alt text"
                value={imgAlt}
                onChange={(e) => setImgAlt(e.target.value)}
                className={`${imgInput} w-[85px]`}
              />
            </div>

            <div>
              <div className="items-end flex gap-2 justify-end">
                <input
                  type="text"
                  placeholder="Width (px)"
                  value={imgWidth}
                  onChange={(e) => setImgWidth(e.target.value)}
                  className={`${imgInput} w-[90px]`}
                />
                <input
                  type="text"
                  placeholder="Height (px)"
                  value={imgHeight}
                  onChange={(e) => setImgHeight(e.target.value)}
                  className={`${imgInput} w-[90px]`}
                />
                <button
                  type="button"
                  onClick={insertImage}
                  className="bg-pri text-white px-3 py-1 rounded w-[90px]"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* editor proper */}
        <div className="border-r h-[calc(100%-165px-40px)]">
          <Editor
            language="markdown"
            value={content}
            onChange={(v) => set_content(v || "")}
          />
        </div>

        {/* button */}
        <div className="h-[40px]">
          <button
            onClick={() => (sending ? () => {} : save())}
            className="bg-pri p-2 w-full text-white"
          >
            {sending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-1/2 p-6 overflow-auto bg-card">
        <div className="title">{title || "Page Title"}</div>
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
