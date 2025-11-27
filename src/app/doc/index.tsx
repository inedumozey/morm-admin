"use client";

import { use, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useDocs } from "@/hooks/useDocs";
import remarkBreaks from "remark-breaks";
import { FaSearch } from "react-icons/fa";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
import { MdDelete, MdAddBox } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";

const imgInput = `p-[4px] block w-full rounded-md outline-none focus:border-pri focus:border-[2px] border-border border-[1px]`;

export default function DocEditor() {
  const [content, set_content] = useState("");
  const [title, set_title] = useState("");
  const [sending, set_sending] = useState(false);
  const [deleting, set_deleting] = useState(false);
  const [action_title, set_action_title] = useState("new");
  const { createDoc, docs, updateDoc, softDeleteDoc, deleteDoc } = useDocs();
  const [selected_doc, set_selected_doc] = useState<any>(null);

  const actionsTabs = [
    {
      id: "new",
      Icon: MdAddBox,
    },
    {
      id: "update",
      Icon: FiEdit3,
    },
    {
      id: "hide",
      Icon: BiHide,
    },
    {
      id: "delete",
      Icon: MdDelete,
    },
  ];

  // --- Image toolbar states ---
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgWidth, setImgWidth] = useState("");
  const [imgHeight, setImgHeight] = useState("");

  const save = async () => {
    set_sending(true);
    try {
      if (!selected_doc && action_title == "new") {
        await createDoc(title, content);
        set_title("");
        set_content("");
        setImgUrl("");
        setImgAlt("");
        setImgWidth("");
        setImgHeight("");
      } else if (selected_doc && action_title == "update") {
        await updateDoc(selected_doc.id, title, content);
      }
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

  useEffect(() => {
    if (action_title != "update") {
      set_content("");
      set_selected_doc(null);
    }
  }, [action_title]);

  useEffect(() => {
    if (selected_doc && action_title == "update") {
      set_content(selected_doc?.content);
      set_title(selected_doc?.title);
    }
  }, [selected_doc, action_title]);

  return (
    <div className="flex h-screen min-w-[750px] bg-bg">
      {/* Editor */}
      <div className="w-1/2 h-full border-r border-border">
        {/* header */}
        <div className="p-2 h-[200px] border-b border-border shadow-xlg">
          <div className="flex gap-4 items-center border-b border-border bg-border p-2">
            {actionsTabs?.map((tab: any, i: number) => {
              return (
                <tab.Icon
                  onClick={
                    sending || deleting
                      ? () => {}
                      : () => {
                          set_action_title(tab.id);
                          if (action_title == "new") {
                            set_selected_doc(null);
                          }
                        }
                  }
                  size={25}
                  className={`cursor-pointer hover:opacity-[.3] ${
                    tab.id == action_title ? "text-pri" : "text-black"
                  }`}
                />
              );
            })}
          </div>
          {action_title != "new" ? (
            <div>
              <select
                className="p-[1px] text-sm bg-pri text-white rounded-md outline-none focus:border-pri focus:border-[2px] border-border border-[1px]"
                name="doc"
                onChange={
                  sending || deleting
                    ? () => {}
                    : async (e) => {
                        const title = e.target.value;
                        const doc: any = docs.find((doc: any) => {
                          return doc.title == title;
                        });
                        if (action_title == "update") {
                          set_selected_doc(doc);
                        } else if (action_title == "hide") {
                          set_deleting(true);
                          await softDeleteDoc(doc.id);
                          set_deleting(false);
                          set_action_title("new");
                        } else if (action_title == "delete") {
                          set_deleting(true);
                          await deleteDoc(doc.id);
                          set_deleting(false);
                          set_action_title("new");
                        }
                      }
                }
              >
                <option value="">--Select--</option>
                {docs?.map((docs: any, i: number) => {
                  return (
                    <option
                      key={i}
                      selected={docs?.title == selected_doc?.title}
                      value={
                        action_title == "update"
                          ? docs?.title
                          : deleting
                          ? ""
                          : docs?.title
                      }
                    >
                      {action_title == "update"
                        ? docs?.is_deleted
                          ? `${docs.title}-(hidden)`
                          : docs.title
                        : deleting
                        ? "waiting..."
                        : docs?.is_deleted
                        ? `${docs.title}-(hidden)`
                        : docs?.title}
                    </option>
                  );
                })}
              </select>

              {selected_doc ? (
                <input
                  type="text"
                  placeholder="Enter page title"
                  value={title || ""}
                  onChange={(e) => set_title(e.target.value)}
                  className="p-[8px] block w-full rounded-md outline-none focus:border-pri focus:border-[2px] border-border border-[1px]"
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <div>
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter page title"
                value={title || ""}
                onChange={(e) => set_title(e.target.value)}
                className="p-[8px] block w-full rounded-md outline-none focus:border-pri focus:border-[2px] border-border border-[1px]"
              />
            </div>
          )}

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
        <div className="border-r h-[calc(100%-200px-40px)]">
          <Editor
            language="markdown"
            value={content ? content : ""}
            onChange={(v) => set_content(v || "")}
          />
        </div>

        {/* button */}
        <div className="h-[40px]">
          <button
            onClick={() => (sending ? () => {} : save())}
            className="bg-pri p-2 w-full text-white"
          >
            {sending
              ? selected_doc
                ? "Updating..."
                : "Saving..."
              : selected_doc
              ? "Update"
              : "Save"}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-1/2 overflow-auto bg-card">
        <div className="title p-4">{title || "Page Title"}</div>
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
