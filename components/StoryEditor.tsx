"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

type Labels = { bold: string; italic: string; heading: string; bullets: string; numbers: string; quote: string; link: string; linkPrompt: string; undo: string; redo: string };
const toHtml = (v: string) => (/^\s*</.test(v) ? v : v.split(/\n{2,}/).filter(Boolean).map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`).join(""));

/** A full story editor: headings, emphasis, lists, quotes and links, with a word count. */
export default function StoryEditor({ value, onChange, placeholder, labels, invalid, describedBy, id }: { value: string; onChange: (html: string, text: string) => void; placeholder: string; labels: Labels; invalid?: boolean; describedBy?: string; id: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, code: false, codeBlock: false, horizontalRule: false, strike: false, underline: false, link: { openOnClick: false, autolink: true, protocols: ["https"], HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" } } }),
      Placeholder.configure({ placeholder }),
    ],
    content: toHtml(value),
    editorProps: { attributes: { class: "story-editor-body story", id, role: "textbox", "aria-multiline": "true", ...(describedBy ? { "aria-describedby": describedBy } : {}), ...(invalid ? { "aria-invalid": "true" } : {}) } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML(), editor.getText()),
  });
  useEffect(() => {
    if (!editor) return;
    editor.setOptions({ editorProps: { attributes: { class: "story-editor-body story", id, role: "textbox", "aria-multiline": "true", ...(describedBy ? { "aria-describedby": describedBy } : {}), ...(invalid ? { "aria-invalid": "true" } : {}) } } });
  }, [editor, invalid, describedBy, id]);
  const e = editor;
  const s = e ? {
    bold: e.isActive("bold"), italic: e.isActive("italic"), h2: e.isActive("heading", { level: 2 }), ul: e.isActive("bulletList"), ol: e.isActive("orderedList"),
    quote: e.isActive("blockquote"), link: e.isActive("link"), undo: e.can().undo(), redo: e.can().redo(), words: e.getText().trim().split(/\s+/).filter(Boolean).length, chars: e.getText().trim().length,
  } : null;
  if (!editor || !s) return <div className="story-editor"><div className="story-editor-body story sk" style={{ minHeight: 320 }} /></div>;
  const btn = (on: boolean, label: string, run: () => void, glyph: React.ReactNode, disabled = false) => (
    <button type="button" className="tool" aria-pressed={on} aria-label={label} title={label} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={run}>{glyph}</button>
  );
  const c = () => editor.chain().focus();
  return (
    <div className={`story-editor ${invalid ? "invalid" : ""}`}>
      <div className="story-toolbar" role="toolbar" aria-label="Formatting" aria-controls={id}>
        {btn(s.h2, labels.heading, () => c().toggleHeading({ level: 2 }).run(), <strong>H</strong>)}
        {btn(s.bold, labels.bold, () => c().toggleBold().run(), <strong>B</strong>)}
        {btn(s.italic, labels.italic, () => c().toggleItalic().run(), <em style={{ fontFamily: "Georgia, serif" }}>I</em>)}
        <span className="sep" aria-hidden="true" />
        {btn(s.ul, labels.bullets, () => c().toggleBulletList().run(), <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="3" cy="4.5" r="1.4" fill="currentColor" /><circle cx="3" cy="9" r="1.4" fill="currentColor" /><circle cx="3" cy="13.5" r="1.4" fill="currentColor" /><path d="M7 4.5h9M7 9h9M7 13.5h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>)}
        {btn(s.ol, labels.numbers, () => c().toggleOrderedList().run(), <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><text x="0" y="6.5" fontSize="6" fill="currentColor" fontWeight="700">1</text><text x="0" y="11" fontSize="6" fill="currentColor" fontWeight="700">2</text><text x="0" y="15.5" fontSize="6" fill="currentColor" fontWeight="700">3</text><path d="M7 4.5h9M7 9h9M7 13.5h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>)}
        {btn(s.quote, labels.quote, () => c().toggleBlockquote().run(), <span style={{ fontSize: 22, lineHeight: 1, fontFamily: "Georgia, serif" }}>“</span>)}
        {btn(s.link, labels.link, () => {
          if (s.link) { c().unsetLink().run(); return; }
          const url = window.prompt(labels.linkPrompt, "https://");
          if (url && /^https:\/\/\S+$/.test(url)) c().extendMarkRange("link").setLink({ href: url }).run();
        }, <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M7.5 10.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.9.9M10.5 7.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l.9-.9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>)}
        <span className="sep" aria-hidden="true" />
        {btn(false, labels.undo, () => c().undo().run(), <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M6 4 2.5 7.5 6 11M3 7.5h8a4 4 0 0 1 0 8H9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>, !s.undo)}
        {btn(false, labels.redo, () => c().redo().run(), <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M12 4l3.5 3.5L12 11M15 7.5H7a4 4 0 0 0 0 8h2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>, !s.redo)}
        <span className="count-words" aria-live="off">{s.words} · {s.chars}/8000</span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
