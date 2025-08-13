import "./TiptapTextEditor.css";

import { TextStyleKit } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

// Import icons from the tiptap-icons folder
import { Undo2Icon } from "../../components/tiptap-icons/undo2-icon";
import { Redo2Icon } from "../../components/tiptap-icons/redo2-icon";
import { HeadingIcon } from "../../components/tiptap-icons/heading-icon";
import { ChevronDownIcon } from "../../components/tiptap-icons/chevron-down-icon";
import { ListIcon } from "../../components/tiptap-icons/list-icon";
import { ListOrderedIcon } from "../../components/tiptap-icons/list-ordered-icon";
import { ListTodoIcon } from "../../components/tiptap-icons/list-todo-icon";
import { BlockquoteIcon } from "../../components/tiptap-icons/blockquote-icon";
import { BoldIcon } from "../../components/tiptap-icons/bold-icon";
import { ItalicIcon } from "../../components/tiptap-icons/italic-icon";
import { StrikeIcon } from "../../components/tiptap-icons/strike-icon";
import { Code2Icon } from "../../components/tiptap-icons/code2-icon";
import { UnderlineIcon } from "../../components/tiptap-icons/underline-icon";
import { LinkIcon } from "../../components/tiptap-icons/link-icon";
import { SuperscriptIcon } from "../../components/tiptap-icons/superscript-icon";
import { SubscriptIcon } from "../../components/tiptap-icons/subscript-icon";
import { AlignLeftIcon } from "../../components/tiptap-icons/align-left-icon";
import { AlignCenterIcon } from "../../components/tiptap-icons/align-center-icon";
import { AlignRightIcon } from "../../components/tiptap-icons/align-right-icon";
import { AlignJustifyIcon } from "../../components/tiptap-icons/align-justify-icon";
import { ImagePlusIcon } from "../../components/tiptap-icons/image-plus-icon";
import { SunIcon } from "../../components/tiptap-icons/sun-icon";

const extensions = [
  TextStyleKit,
  StarterKit,
  Underline,
  Subscript,
  Superscript,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    openOnClick: false,
  }),
];

function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
        isSuperscript: ctx.editor.isActive("superscript") ?? false,
        canSuperscript:
          ctx.editor.can().chain().toggleSuperscript().run() ?? false,
        isSubscript: ctx.editor.isActive("subscript") ?? false,
        canSubscript: ctx.editor.can().chain().toggleSubscript().run() ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        canLink: ctx.editor.can().chain().setLink({ href: "" }).run() ?? false,
        textAlign: ctx.editor.isActive({ textAlign: "left" })
          ? "left"
          : ctx.editor.isActive({ textAlign: "center" })
          ? "center"
          : ctx.editor.isActive({ textAlign: "right" })
          ? "right"
          : ctx.editor.isActive({ textAlign: "justify" })
          ? "justify"
          : "left",
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="modern-menubar">
      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className="menubar-button"
          title="Undo"
        >
          <Undo2Icon />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className="menubar-button"
          title="Redo"
        >
          <Redo2Icon />
        </button>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <div className="heading-dropdown">
          <button className="menubar-button heading-button" title="Heading">
            <HeadingIcon />
            <span>H</span>
            <ChevronDownIcon />
          </button>
          <div className="heading-menu">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={editorState.isHeading1 ? "is-active" : ""}
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={editorState.isHeading2 ? "is-active" : ""}
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={editorState.isHeading3 ? "is-active" : ""}
            >
              H3
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={editorState.isHeading4 ? "is-active" : ""}
            >
              H4
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              className={editorState.isHeading5 ? "is-active" : ""}
            >
              H5
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
              className={editorState.isHeading6 ? "is-active" : ""}
            >
              H6
            </button>
          </div>
        </div>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`menubar-button ${
            editorState.isBulletList ? "is-active" : ""
          }`}
          title="Bullet List"
        >
          <ListIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`menubar-button ${
            editorState.isOrderedList ? "is-active" : ""
          }`}
          title="Numbered List"
        >
          <ListOrderedIcon />
        </button>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`menubar-button ${
            editorState.isBlockquote ? "is-active" : ""
          }`}
          title="Blockquote"
        >
          <BlockquoteIcon />
        </button>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`menubar-button ${editorState.isBold ? "is-active" : ""}`}
          title="Bold"
        >
          <BoldIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`menubar-button ${
            editorState.isItalic ? "is-active" : ""
          }`}
          title="Italic"
        >
          <ItalicIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`menubar-button ${
            editorState.isStrike ? "is-active" : ""
          }`}
          title="Strikethrough"
        >
          <StrikeIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`menubar-button ${editorState.isCode ? "is-active" : ""}`}
          title="Code"
        >
          <Code2Icon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`menubar-button ${
            editorState.isUnderline ? "is-active" : ""
          }`}
          title="Underline"
        >
          <UnderlineIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`menubar-button ${
            editorState.isSuperscript ? "is-active" : ""
          }`}
          title="Superscript"
        >
          <SuperscriptIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`menubar-button ${
            editorState.isSubscript ? "is-active" : ""
          }`}
          title="Subscript"
        >
          <SubscriptIcon />
        </button>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().setLink({ href: "" }).run()}
          className={`menubar-button ${editorState.isLink ? "is-active" : ""}`}
          title="Link"
        >
          <LinkIcon />
        </button>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`menubar-button ${
            editorState.isCodeBlock ? "is-active" : ""
          }`}
          title="Code Block"
        >
          <Code2Icon />
        </button>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <button className="menubar-button add-button" title="Add">
          <ImagePlusIcon />
          <span>Add</span>
        </button>
      </div>

      <div className="menubar-separator"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`menubar-button ${
            editorState.textAlign === "left" ? "is-active" : ""
          }`}
          title="Align Left"
        >
          <AlignLeftIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`menubar-button ${
            editorState.textAlign === "center" ? "is-active" : ""
          }`}
          title="Align Center"
        >
          <AlignCenterIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`menubar-button ${
            editorState.textAlign === "right" ? "is-active" : ""
          }`}
          title="Align Right"
        >
          <AlignRightIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`menubar-button ${
            editorState.textAlign === "justify" ? "is-active" : ""
          }`}
          title="Justify"
        >
          <AlignJustifyIcon />
        </button>
      </div>
    </div>
  );
}

interface Props {
  name: string;
  value?: string;
  setFieldValue?: (field: string, value: string) => void;
}

const TiptapTextEditor = ({ name, value = "", setFieldValue }: Props) => {
  const editor = useEditor({
    extensions,
    content: value, // initial API/form value
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFieldValue?.(name, html); // push updates to form
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor]);

  return (
    <div className="tiptap-editor-container">
      {editor && <MenuBar editor={editor} />}
      <div className="border border-input rounded-md px-3 py-2 min-h-[150px] w-full">
        <EditorContent
          editor={editor}
          className="outline-none focus:outline-none focus:ring-0 focus-within:ring-0 focus-visible:outline-none w-full"
        />
      </div>
    </div>
  );
};

export default TiptapTextEditor;
