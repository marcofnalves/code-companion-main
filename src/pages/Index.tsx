import { useState, useCallback, useMemo } from "react";
import Header from "@/components/docs/Header";
import Sidebar from "@/components/docs/Sidebar";
import DocContent from "@/components/docs/DocContent";
import TableOfContents from "@/components/docs/TableOfContents";
import SearchDialog from "@/components/docs/SearchDialog";
import MobileSidebar from "@/components/docs/MobileSidebar";
import { useDocStore } from "@/hooks/useDocStore";
import { allPageIds, defaultPages } from "@/data/documentation";

const Index = () => {
  const {
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
  } = useDocStore();

  const [activePageId, setActivePageId] = useState("installation");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage = pages[activePageId] ?? defaultPages["installation"];

  const navigate = useCallback((pageId: string) => {
    setActivePageId(pageId);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const currentIndex = allPageIds.indexOf(activePageId);

  const prevPage = useMemo(() => {
    if (currentIndex <= 0) return null;
    const id = allPageIds[currentIndex - 1];
    const p = pages[id] ?? defaultPages[id];
    return p ? { id, title: p.title } : null;
  }, [currentIndex, pages]);

  const nextPage = useMemo(() => {
    if (currentIndex >= allPageIds.length - 1) return null;
    const id = allPageIds[currentIndex + 1];
    const p = pages[id] ?? defaultPages[id];
    return p ? { id, title: p.title } : null;
  }, [currentIndex, pages]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onMobileMenuToggle={() => setMobileMenuOpen(true)}
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
        onExport={exportJSON}
        onImport={importJSON}
        onReset={resetToDefaults}
      />
      <div className="flex">
        <Sidebar activePageId={activePageId} onNavigate={navigate} />
        <DocContent
          page={currentPage}
          editMode={editMode}
          onNavigate={navigate}
          onUpdateBlock={(blockId, updates) => updateBlock(activePageId, blockId, updates)}
          onUpdateMeta={(updates) => updatePageMeta(activePageId, updates)}
          onAddBlock={(afterId, block) => addBlock(activePageId, afterId, block)}
          onRemoveBlock={(blockId) => removeBlock(activePageId, blockId)}
          prevPage={prevPage}
          nextPage={nextPage}
        />
        <TableOfContents blocks={currentPage.blocks} />
      </div>
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigate={navigate}
        pages={pages}
      />
      <MobileSidebar
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        activePageId={activePageId}
        onNavigate={navigate}
      />
    </div>
  );
};

export default Index;
