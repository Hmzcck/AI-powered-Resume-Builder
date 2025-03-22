"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-muted animate-pulse rounded-md" />
  ),
});

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false, // Preserve list formatting
  },
};

// Add custom formats for proper list rendering
const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "header",
  "list",
  "script",
];

export const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="rounded-lg overflow-hidden bg-background text-foreground [&_.ql-toolbar]:border-border [&_.ql-container]:border-border [&_.ql-toolbar]:bg-card [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg"
        preserveWhitespace={true}
      />
    </div>
  );
};