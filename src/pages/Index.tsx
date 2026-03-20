import { useState, useCallback, useMemo } from "react";
import Header from "@/components/docs/Header";
import Sidebar from "@/components/docs/Sidebar";
import DocContent from "@/components/docs/DocContent";
import TableOfContents from "@/components/docs/TableOfContents";
import SearchDialog from "@/components/docs/SearchDialog";
import MobileSidebar from "@/components/docs/MobileSidebar";
import ProjectSelector from "@/components/docs/ProjectSelector";
import { useDocStore } from "@/hooks/useDocStore";
import { useProjects, type Project } from "@/hooks/useProjects";

const Index = () => {
  // ── Projetos ────────────────────────────────────────────────────────────────
  const { projects, loading: projectsLoading, createProject, renameProject, deleteProject } =
    useProjects();

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  // ── Docs do projeto activo ──────────────────────────────────────────────────
  const {
    navigation,
    pages,
    loading,
    editMode,
    setEditMode,
    addSection,
    removeSection,
    updateSection,
    addPage,
    removePage,
    updatePageTitle,
    updateBlock,
    updatePageMeta,
    addBlock,
    removeBlock,
    exportJSON,
    importJSON,
  } = useDocStore(activeProject?.id ?? null);

  // IDs de todas as páginas por ordem da navegação
  const allPageIds = useMemo(
    () => navigation.flatMap((s) => s.children?.map((c) => c.id) ?? []),
    [navigation]
  );

  const firstPageId = allPageIds[0] ?? null;
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reset página activa quando o projeto muda
  const handleSelectProject = useCallback((project: Project) => {
    setActiveProject(project);
    setActivePageId(null);
    setShowProjectSelector(false);
  }, []);

  const handleDeleteProject = useCallback(async (id: string) => {
    await deleteProject(id);
    // Se era o projecto activo, voltar ao selector
    if (activeProject?.id === id) {
      setActiveProject(null);
      setActivePageId(null);
    }
  }, [deleteProject, activeProject]);

  const currentId = activePageId ?? firstPageId;
  const currentPage = currentId ? (pages[currentId] ?? null) : null;

  const navigate = useCallback((pageId: string) => {
    setActivePageId(pageId);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const currentIndex = currentId ? allPageIds.indexOf(currentId) : -1;

  const prevPage = useMemo(() => {
    if (currentIndex <= 0) return null;
    const id = allPageIds[currentIndex - 1];
    const p = pages[id];
    return p ? { id, title: p.title } : null;
  }, [currentIndex, allPageIds, pages]);

  const nextPage = useMemo(() => {
    if (currentIndex < 0 || currentIndex >= allPageIds.length - 1) return null;
    const id = allPageIds[currentIndex + 1];
    const p = pages[id];
    return p ? { id, title: p.title } : null;
  }, [currentIndex, allPageIds, pages]);

  const handleRemovePage = useCallback(
    (sectionId: string, pageId: string) => {
      removePage(sectionId, pageId);
      if (currentId === pageId) {
        const idx = allPageIds.indexOf(pageId);
        const next = allPageIds[idx - 1] ?? allPageIds[idx + 1] ?? null;
        setActivePageId(next);
      }
    },
    [removePage, currentId, allPageIds]
  );

  // ── Ecrã de seleção de projetos ─────────────────────────────────────────────
  if (!activeProject || showProjectSelector) {
    return (
      <ProjectSelector
        projects={projects}
        loading={projectsLoading}
        onSelect={handleSelectProject}
        onCreate={createProject}
        onRename={renameProject}
        onDelete={handleDeleteProject}
      />
    );
  }

  // ── Ecrã de documentação ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onMobileMenuToggle={() => setMobileMenuOpen(true)}
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
        onExport={exportJSON}
        onImport={importJSON}
        onReset={() => {}}
        projectName={activeProject.name}
        onSwitchProject={() => setShowProjectSelector(true)}
      />
      <div className="flex">
        <Sidebar
          navigation={navigation}
          activePageId={currentId ?? ""}
          editMode={editMode}
          onNavigate={navigate}
          onAddSection={addSection}
          onRemoveSection={removeSection}
          onUpdateSection={updateSection}
          onAddPage={addPage}
          onRemovePage={handleRemovePage}
          onUpdatePageTitle={updatePageTitle}
        />

        {loading ? (
          <main className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            A carregar...
          </main>
        ) : currentPage ? (
          <DocContent
            page={currentPage}
            editMode={editMode}
            onNavigate={navigate}
            onUpdateBlock={(blockId, updates) =>
              updateBlock(currentId!, blockId, updates)
            }
            onUpdateMeta={(updates) => updatePageMeta(currentId!, updates)}
            onAddBlock={(afterId, block) => addBlock(currentId!, afterId, block)}
            onRemoveBlock={(blockId) => removeBlock(currentId!, blockId)}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        ) : (
          <main className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            {allPageIds.length === 0
              ? "Activa o modo de edição e cria a primeira secção."
              : "Seleciona uma página na sidebar."}
          </main>
        )}

        {currentPage && <TableOfContents blocks={currentPage.blocks} />}
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
        activePageId={currentId ?? ""}
        onNavigate={navigate}
      />
    </div>
  );
};

export default Index;
