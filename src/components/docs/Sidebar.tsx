import { useState, useRef, useEffect } from "react";
import { ChevronRight, Plus, Trash2, Check, X, FolderPlus } from "lucide-react";
import { type DocSection } from "@/data/documentation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  navigation: DocSection[];
  activePageId: string;
  editMode: boolean;
  onNavigate: (pageId: string) => void;
  onAddSection: (title: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onUpdateSection: (sectionId: string, updates: { title?: string; icon?: string }) => void;
  onAddPage: (sectionId: string, title: string) => void;
  onRemovePage: (sectionId: string, pageId: string) => void;
  onUpdatePageTitle: (sectionId: string, pageId: string, title: string) => void;
}

// ─── Inline editable text ────────────────────────────────────────────────────

function InlineEdit({
  value,
  onSave,
  className,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // Manter o draft sincronizado se o valor externo mudar
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const commit = () => {
    if (draft.trim()) onSave(draft.trim());
    setEditing(false);
  };

  if (!editing) {
    return (
      <span
        className={cn("cursor-text", className)}
        onDoubleClick={() => { setDraft(value); setEditing(true); }}
        title="Duplo clique para editar"
      >
        {value}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") setEditing(false);
        }}
        className="flex-1 min-w-0 bg-accent text-foreground text-xs px-1 py-0.5 rounded outline-none border border-primary/50"
      />
      <button onMouseDown={(e) => { e.preventDefault(); commit(); }} className="shrink-0 text-green-500 hover:text-green-400">
        <Check className="h-3 w-3" />
      </button>
      <button onMouseDown={(e) => { e.preventDefault(); setEditing(false); }} className="shrink-0 text-muted-foreground hover:text-foreground">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Secção ──────────────────────────────────────────────────────────────────

const SidebarSection = ({
  section,
  activePageId,
  editMode,
  onNavigate,
  onRemoveSection,
  onUpdateSection,
  onAddPage,
  onRemovePage,
  onUpdatePageTitle,
}: {
  section: DocSection;
  activePageId: string;
  editMode: boolean;
  onNavigate: (pageId: string) => void;
  onRemoveSection: (id: string) => void;
  onUpdateSection: (id: string, u: { title?: string; icon?: string }) => void;
  onAddPage: (sectionId: string, title: string) => void;
  onRemovePage: (sectionId: string, pageId: string) => void;
  onUpdatePageTitle: (sectionId: string, pageId: string, title: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  const [addingPage, setAddingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const newPageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingPage) newPageRef.current?.focus();
  }, [addingPage]);

  const commitNewPage = () => {
    if (newPageTitle.trim()) {
      onAddPage(section.id, newPageTitle.trim());
      setNewPageTitle("");
      setAddingPage(false);
    }
  };

  return (
    <div className="mb-2">
      {/* Cabeçalho da secção */}
      <div className="flex items-center w-full">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center flex-1 min-w-0 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <ChevronRight
            className={cn(
              "h-3 w-3 mr-1.5 shrink-0 transition-transform duration-150",
              open && "rotate-90"
            )}
          />
          {section.icon && <span className="mr-1.5">{section.icon}</span>}
          {editMode ? (
            <InlineEdit
              value={section.title}
              onSave={(v) => onUpdateSection(section.id, { title: v })}
              className="truncate"
            />
          ) : (
            <span className="truncate">{section.title}</span>
          )}
        </button>

        {/* Botões de secção — sempre visíveis em modo edição */}
        {editMode && (
          <div className="flex items-center gap-0.5 pr-1 shrink-0">
            <button
              onClick={() => setAddingPage(true)}
              title="Nova página"
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              onClick={() => onRemoveSection(section.id)}
              title="Remover secção"
              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Itens da secção */}
      {open && (
        <div className="ml-3 mt-0.5 space-y-px border-l border-border/50 pl-3">
          {section.children?.map((child) => (
            <div key={child.id} className="flex items-center">
              <button
                onClick={() => onNavigate(child.id)}
                className={cn(
                  "flex-1 min-w-0 text-left px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 truncate",
                  activePageId === child.id
                    ? "text-primary bg-primary/8 font-medium"
                    : "text-sidebar-foreground hover:text-accent-foreground hover:bg-accent/50"
                )}
              >
                {editMode ? (
                  <InlineEdit
                    value={child.title}
                    onSave={(v) => onUpdatePageTitle(section.id, child.id, v)}
                  />
                ) : (
                  child.title
                )}
              </button>

              {/* Botão delete da página — sempre visível em modo edição */}
              {editMode && (
                <button
                  onClick={() => onRemovePage(section.id, child.id)}
                  title="Remover página"
                  className="shrink-0 p-1 mr-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}

          {/* Input para nova página */}
          {addingPage && (
            <div className="flex items-center gap-1 px-2 py-1">
              <input
                ref={newPageRef}
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitNewPage();
                  if (e.key === "Escape") { setAddingPage(false); setNewPageTitle(""); }
                }}
                placeholder="Nome da página..."
                className="flex-1 min-w-0 bg-accent text-foreground text-xs px-2 py-1 rounded outline-none border border-primary/50"
              />
              <button onMouseDown={(e) => { e.preventDefault(); commitNewPage(); }} className="shrink-0 text-green-500 hover:text-green-400">
                <Check className="h-3 w-3" />
              </button>
              <button onMouseDown={(e) => { e.preventDefault(); setAddingPage(false); setNewPageTitle(""); }} className="shrink-0 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Sidebar principal ───────────────────────────────────────────────────────

const Sidebar = ({
  navigation,
  activePageId,
  editMode,
  onNavigate,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  onAddPage,
  onRemovePage,
  onUpdatePageTitle,
}: SidebarProps) => {
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const newSectionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingSection) newSectionRef.current?.focus();
  }, [addingSection]);

  const commitNewSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection(newSectionTitle.trim());
      setNewSectionTitle("");
      setAddingSection(false);
    }
  };

  return (
    <aside className="w-60 shrink-0 h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto bg-sidebar border-r border-border py-5 px-2 hidden lg:flex lg:flex-col">
      <nav className="flex-1 space-y-1">
        {navigation.map((section) => (
          <SidebarSection
            key={section.id}
            section={section}
            activePageId={activePageId}
            editMode={editMode}
            onNavigate={onNavigate}
            onRemoveSection={onRemoveSection}
            onUpdateSection={onUpdateSection}
            onAddPage={onAddPage}
            onRemovePage={onRemovePage}
            onUpdatePageTitle={onUpdatePageTitle}
          />
        ))}

        {/* Input para nova secção */}
        {addingSection && (
          <div className="flex items-center gap-1 px-2 py-1 mt-2">
            <input
              ref={newSectionRef}
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitNewSection();
                if (e.key === "Escape") { setAddingSection(false); setNewSectionTitle(""); }
              }}
              placeholder="Nome da secção..."
              className="flex-1 min-w-0 bg-accent text-foreground text-xs px-2 py-1 rounded outline-none border border-primary/50"
            />
            <button onMouseDown={(e) => { e.preventDefault(); commitNewSection(); }} className="shrink-0 text-green-500 hover:text-green-400">
              <Check className="h-3 w-3" />
            </button>
            <button onMouseDown={(e) => { e.preventDefault(); setAddingSection(false); setNewSectionTitle(""); }} className="shrink-0 text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </nav>

      {/* Botão nova secção — só em modo edição */}
      {editMode && !addingSection && (
        <button
          onClick={() => setAddingSection(true)}
          className="mt-4 mx-2 flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-dashed border-border"
        >
          <FolderPlus className="h-3 w-3" />
          Nova secção
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
