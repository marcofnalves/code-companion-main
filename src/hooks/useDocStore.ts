import { useState, useEffect, useCallback } from "react";
import { defaultPages, type DocPage, type ContentBlock } from "@/data/documentation";

const STORAGE_KEY = "devdocs-pages";

function loadPages(): Record<string, DocPage> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load pages from localStorage:", e);
  }
  return { ...defaultPages };
}

function savePages(pages: Record<string, DocPage>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error("Failed to save pages:", e);
  }
}

export function useDocStore() {
  const [pages, setPages] = useState<Record<string, DocPage>>(loadPages);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    savePages(pages);
  }, [pages]);

  const updateBlock = useCallback((pageId: string, blockId: string, updates: Partial<ContentBlock>) => {
    setPages((prev) => {
      const page = prev[pageId];
      if (!page) return prev;
      return {
        ...prev,
        [pageId]: {
          ...page,
          blocks: page.blocks.map((b) =>
            b.id === blockId ? { ...b, ...updates } : b
          ),
        },
      };
    });
  }, []);

  const updatePageMeta = useCallback((pageId: string, updates: Partial<Pick<DocPage, "title" | "description">>) => {
    setPages((prev) => {
      const page = prev[pageId];
      if (!page) return prev;
      return {
        ...prev,
        [pageId]: { ...page, ...updates },
      };
    });
  }, []);

  const addBlock = useCallback((pageId: string, afterBlockId: string, block: ContentBlock) => {
    setPages((prev) => {
      const page = prev[pageId];
      if (!page) return prev;
      const idx = page.blocks.findIndex((b) => b.id === afterBlockId);
      const newBlocks = [...page.blocks];
      newBlocks.splice(idx + 1, 0, block);
      return { ...prev, [pageId]: { ...page, blocks: newBlocks } };
    });
  }, []);

  const removeBlock = useCallback((pageId: string, blockId: string) => {
    setPages((prev) => {
      const page = prev[pageId];
      if (!page) return prev;
      return {
        ...prev,
        [pageId]: {
          ...page,
          blocks: page.blocks.filter((b) => b.id !== blockId),
        },
      };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setPages({ ...defaultPages });
  }, []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(pages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devdocs-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [pages]);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setPages(data);
      } catch (err) {
        console.error("Invalid JSON file:", err);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    pages,
    editMode,
    setEditMode,
    updateBlock,
    updatePageMeta,
    addBlock,
    removeBlock,
    resetToDefaults,
    exportJSON,
    importJSON,
  };
}
