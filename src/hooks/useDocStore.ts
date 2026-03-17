import { useState, useEffect, useCallback, useRef } from "react";
import { type DocPage, type ContentBlock, type DocSection } from "@/data/documentation";

const API_URL = "/api/pages";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface DbSchema {
  navigation: DocSection[];
  pages: Record<string, DocPage>;
}

const EMPTY_DB: DbSchema = { navigation: [], pages: {} };

// ─── API ─────────────────────────────────────────────────────────────────────

async function loadFromApi(): Promise<DbSchema | null> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return null;
    const data: DbSchema = await res.json();
    if (!data?.navigation || !data?.pages) return null;
    return data;
  } catch {
    return null;
  }
}

async function saveToApi(db: DbSchema): Promise<void> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(db),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueId(base: string, existing: string[]): string {
  let id = slugify(base) || "page";
  let n = 1;
  while (existing.includes(id)) id = `${slugify(base)}-${n++}`;
  return id;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDocStore() {
  const [db, setDb] = useState<DbSchema>(EMPTY_DB);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quando true, o próximo disparo do useEffect de save é ignorado
  const skipNextSave = useRef(true);

  // ── Carregar do JSON no arranque ────────────────────────────────────────────
  useEffect(() => {
    loadFromApi().then((data) => {
      if (data) {
        skipNextSave.current = true;
        setDb(data);
      } else {
        skipNextSave.current = false;
      }
      setLoading(false);
    });
  }, []);

  // ── Guardar sempre que db muda ──────────────────────────────────────────────
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    saveToApi(db).catch((e) =>
      console.warn("[useDocStore] Falha ao guardar:", e)
    );
  }, [db]);

  // ══════════════════════════════════════════════════════════════════════════
  // Operações CMS — Secções
  // ══════════════════════════════════════════════════════════════════════════

  const addSection = useCallback((title: string, icon = "") => {
    setDb((prev) => {
      const existingIds = prev.navigation.map((s) => s.id);
      const id = uniqueId(title, existingIds);
      return {
        ...prev,
        navigation: [...prev.navigation, { id, title, icon, children: [] }],
      };
    });
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setDb((prev) => {
      const section = prev.navigation.find((s) => s.id === sectionId);
      const childIds = section?.children?.map((c) => c.id) ?? [];
      const newPages = { ...prev.pages };
      childIds.forEach((id) => delete newPages[id]);
      return {
        navigation: prev.navigation.filter((s) => s.id !== sectionId),
        pages: newPages,
      };
    });
  }, []);

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<Pick<DocSection, "title" | "icon">>) => {
      setDb((prev) => ({
        ...prev,
        navigation: prev.navigation.map((s) =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
      }));
    },
    []
  );

  // ══════════════════════════════════════════════════════════════════════════
  // Operações CMS — Páginas
  // ══════════════════════════════════════════════════════════════════════════

  const addPage = useCallback((sectionId: string, title: string) => {
    setDb((prev) => {
      const existingIds = Object.keys(prev.pages);
      const id = uniqueId(title, existingIds);
      const newPage: DocPage = { id, title, description: "", blocks: [] };
      return {
        navigation: prev.navigation.map((s) =>
          s.id === sectionId
            ? { ...s, children: [...(s.children ?? []), { id, title }] }
            : s
        ),
        pages: { ...prev.pages, [id]: newPage },
      };
    });
  }, []);

  const removePage = useCallback((sectionId: string, pageId: string) => {
    setDb((prev) => {
      const newPages = { ...prev.pages };
      delete newPages[pageId];
      return {
        navigation: prev.navigation.map((s) =>
          s.id === sectionId
            ? { ...s, children: (s.children ?? []).filter((c) => c.id !== pageId) }
            : s
        ),
        pages: newPages,
      };
    });
  }, []);

  const updatePageTitle = useCallback(
    (sectionId: string, pageId: string, title: string) => {
      setDb((prev) => ({
        navigation: prev.navigation.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                children: (s.children ?? []).map((c) =>
                  c.id === pageId ? { ...c, title } : c
                ),
              }
            : s
        ),
        pages: prev.pages[pageId]
          ? { ...prev.pages, [pageId]: { ...prev.pages[pageId], title } }
          : prev.pages,
      }));
    },
    []
  );

  // ══════════════════════════════════════════════════════════════════════════
  // Operações de conteúdo
  // ══════════════════════════════════════════════════════════════════════════

  const updateBlock = useCallback(
    (pageId: string, blockId: string, updates: Partial<ContentBlock>) => {
      setDb((prev) => {
        const page = prev.pages[pageId];
        if (!page) return prev;
        return {
          ...prev,
          pages: {
            ...prev.pages,
            [pageId]: {
              ...page,
              blocks: page.blocks.map((b) =>
                b.id === blockId ? { ...b, ...updates } : b
              ),
            },
          },
        };
      });
    },
    []
  );

  const updatePageMeta = useCallback(
    (pageId: string, updates: Partial<Pick<DocPage, "title" | "description">>) => {
      setDb((prev) => {
        const page = prev.pages[pageId];
        if (!page) return prev;
        return {
          ...prev,
          pages: { ...prev.pages, [pageId]: { ...page, ...updates } },
        };
      });
    },
    []
  );

  const addBlock = useCallback(
    (pageId: string, afterBlockId: string, block: ContentBlock) => {
      setDb((prev) => {
        const page = prev.pages[pageId];
        if (!page) return prev;
        const idx = page.blocks.findIndex((b) => b.id === afterBlockId);
        const newBlocks = [...page.blocks];
        newBlocks.splice(idx + 1, 0, block);
        return {
          ...prev,
          pages: { ...prev.pages, [pageId]: { ...page, blocks: newBlocks } },
        };
      });
    },
    []
  );

  const removeBlock = useCallback((pageId: string, blockId: string) => {
    setDb((prev) => {
      const page = prev.pages[pageId];
      if (!page) return prev;
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [pageId]: {
            ...page,
            blocks: page.blocks.filter((b) => b.id !== blockId),
          },
        },
      };
    });
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // Import / Export
  // ══════════════════════════════════════════════════════════════════════════

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(db, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devdocs-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [db]);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: DbSchema = JSON.parse(e.target?.result as string);
        setDb({ navigation: data.navigation ?? [], pages: data.pages ?? {} });
      } catch (err) {
        console.error("Ficheiro JSON inválido:", err);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    navigation: db.navigation,
    pages: db.pages,
    loading,
    editMode,
    setEditMode,
    // CMS
    addSection,
    removeSection,
    updateSection,
    addPage,
    removePage,
    updatePageTitle,
    // Conteúdo
    updateBlock,
    updatePageMeta,
    addBlock,
    removeBlock,
    // Import/Export
    exportJSON,
    importJSON,
  };
}
