import React, { useEffect, useMemo, useRef } from "react";
import EditorJS, { OutputBlockData, OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import "./editor.css";

export const editorInitialValues = (val) => {
  if (!val)
    return {
      blocks: [{ type: "paragraph", data: { text: "" } }],
    };
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return parsed && Array.isArray(parsed.blocks)
        ? parsed
        : {
            blocks: [{ type: "paragraph", data: { text: "" } }],
          };
    } catch {
      return {
        blocks: [{ type: "paragraph", data: { text: "" } }],
      };
    }
  }
  return val && Array.isArray(val.blocks)
    ? val
    : {
        blocks: [{ type: "paragraph", data: { text: "" } }],
      };
};

type Props = {
  data?: OutputData | string;
  onChange?: (data: OutputData) => void;
  holderId?: string;
};

const DEFAULT_DATA: OutputData = {
  time: Date.now(),
  blocks: [{ type: "paragraph", data: { text: "" } }],
  version: "2.0.0",
};

const isValidData = (d: any): d is OutputData =>
  d && typeof d === "object" && Array.isArray(d.blocks);

// Small helper: wait for an element to appear in the DOM (used to avoid "missing holder" errors)
async function waitForElement(id: string, timeout = 2000, interval = 100) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.getElementById(id);
    if (el) return el;
    await new Promise((r) => setTimeout(r, interval));
  }
  return null;
}

const EditorJsEditor: React.FC<Props> = ({
  data,
  onChange,
  holderId = "editorjs",
}) => {
  const instanceRef = useRef<EditorJS | null>(null);
  const lastEmittedJsonRef = useRef<string>("");

  // Normalize incoming data (accepts string or object)
  const incomingData = useMemo<OutputData>(() => {
    if (!data) return DEFAULT_DATA;
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return isValidData(parsed) ? parsed : DEFAULT_DATA;
      } catch {
        return DEFAULT_DATA;
      }
    }
    return isValidData(data) ? data : DEFAULT_DATA;
  }, [data]);

  // Initialize editor (one instance per holderId). StrictMode-safe.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // wait for the holder element to exist to avoid EditorJS "missing holder" error
      const holder = await waitForElement(holderId, 2000, 100);
      if (!holder || cancelled) {
        // If no holder, bail out (will silently render nothing).
        // This prevents the "element with ID is missing" runtime error.
        // Caller should ensure the div with that id is rendered.
        console.warn(`EditorJS holder "${holderId}" not found in DOM.`);
        return;
      }

      // If an instance already exists (from previous mount), destroy it safely
      if (instanceRef.current) {
        try {
          await instanceRef.current.isReady;
        } catch {
          // ignore
        }
        if (typeof instanceRef.current.destroy === "function") {
          try {
            instanceRef.current.destroy();
          } catch {
            // ignore
          }
        }
        instanceRef.current = null;
      }

      if (cancelled) return;

      // create the EditorJS instance
      const editor = new EditorJS({
        holder: holderId,
        autofocus: true,
        placeholder: "Start writing your content...",
        tools: {
          header: { class: Header, inlineToolbar: ["link"] },
          list: { class: List, inlineToolbar: true },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // TODO: replace with your upload API logic
                  return {
                    success: 1,
                    file: { url: "https://placehold.co/600x400" },
                  };
                },
              },
            },
          },
          embed: Embed,
          quote: Quote,
          table: Table,
        },
        data: incomingData,
        async onChange(api) {
          try {
            const saved = await api.saver.save();
            lastEmittedJsonRef.current = JSON.stringify(saved);
            onChange?.(saved);
          } catch {
            // ignore save errors (typing etc)
          }
        },
      });

      instanceRef.current = editor;

      try {
        await editor.isReady;
      } catch (err) {
        console.error("EditorJS failed to initialize", err);
      }
    })();

    return () => {
      cancelled = true;
      // safe destroy on unmount
      if (instanceRef.current) {
        const inst = instanceRef.current;
        // call destroy after isReady to avoid internal errors
        inst.isReady
          .then(() => {
            if (typeof inst.destroy === "function") inst.destroy();
          })
          .catch(() => {
            try {
              if (typeof inst.destroy === "function") inst.destroy();
            } catch {
              /* ignore */
            }
          });
        instanceRef.current = null;
      }
    };
    // We deliberately only depend on holderId. incomingData handled by separate effect.
  }, [holderId]);

  // Apply external data updates (e.g., when the form is loaded for editing).
  // This effect runs when incomingData changes.
  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;

    (async () => {
      try {
        await inst.isReady;

        const incomingJson = JSON.stringify(incomingData);

        // skip if the incoming data is exactly what was just emitted by the editor itself
        if (incomingJson === lastEmittedJsonRef.current) return;

        const safeData: OutputData = {
          time: incomingData?.time || Date.now(),
          blocks: Array.isArray(incomingData?.blocks)
            ? incomingData.blocks
            : [],
          version: incomingData?.version || "2.28.0",
        };

        const anyInst = inst as any;
        if (typeof anyInst.render === "function") {
          // some editor versions expose render()
          await anyInst.render(safeData);
        } else if (inst.blocks && typeof inst.blocks.render === "function") {
          // older approach: clear + render blocks
          await inst.clear();
          // render expects OutputData or { blocks: [] } depending on version - pass safeData
          // @ts-ignore
          await inst.blocks.render(safeData);
        } else {
          // as a last resort, destroy and recreate with new data
          try {
            if (typeof inst.destroy === "function") inst.destroy();
          } catch {
            /* ignore */
          }
          instanceRef.current = null;
          // recreation will be handled by the init effect next tick if needed
        }
      } catch (err) {
        console.error("Error rendering EditorJS data", err);
      }
    })();
  }, [incomingData]);

  return (
    <div
      id={holderId}
      className="border rounded-md p-4 bg-white min-h-[300px]"
    />
  );
};

export default EditorJsEditor;
