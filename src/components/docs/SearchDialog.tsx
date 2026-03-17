import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { navigation, type DocPage } from "@/data/documentation";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (pageId: string) => void;
  pages: Record<string, DocPage>;
}

const SearchDialog = ({ open, onOpenChange, onNavigate, pages }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const allPages = useMemo(() => Object.values(pages), [pages]);

  const results = useMemo(() => {
    if (!query.trim()) return allPages.slice(0, 8);
    const q = query.toLowerCase();
    return allPages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.blocks.some((b) => b.content.toLowerCase().includes(q))
    );
  }, [query, allPages]);

  const getCategory = (pageId: string) => {
    for (const section of navigation) {
      if (section.children?.some((c) => c.id === pageId)) return section.title;
    }
    return "";
  };

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-card border-border">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar documentação..."
            className="flex-1 bg-transparent py-3 px-3 text-sm outline-none placeholder:text-muted-foreground text-foreground"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-secondary px-1.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem resultados.</p>
          ) : (
            results.map((page) => (
              <button
                key={page.id}
                onClick={() => { onNavigate(page.id); onOpenChange(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm",
                  "hover:bg-accent transition-colors duration-150",
                  "flex flex-col gap-0.5"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-accent-foreground">{page.title}</span>
                  <span className="text-[10px] text-muted-foreground">{getCategory(page.id)}</span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">{page.description}</span>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
