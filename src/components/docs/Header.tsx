import { Search, Book, Menu } from "lucide-react";

interface HeaderProps {
  onSearchOpen: () => void;
  onMobileMenuToggle: () => void;
  editMode: boolean;
  onToggleEdit: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

const Header = ({
  onSearchOpen,
  onMobileMenuToggle,
  editMode,
  onToggleEdit,
  onExport,
  onImport,
  onReset,
}: HeaderProps) => {
  return (
    <header className="h-12 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center h-full px-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden mr-3 p-1 rounded-md hover:bg-accent transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mr-6">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <Book className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-accent-foreground">DevDocs</span>
          <span className="text-[10px] font-mono bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
            v2.0
          </span>
        </div>

        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 h-7 px-2.5 rounded-md border border-border bg-secondary/50 hover:bg-accent text-xs text-muted-foreground transition-colors duration-150 max-w-xs"
        >
          <Search className="h-3 w-3" />
          <span className="hidden sm:inline">Pesquisar...</span>
          <kbd className="hidden sm:inline ml-2 text-[10px] font-mono opacity-50">⌘K</kbd>
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onToggleEdit}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
              editMode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {editMode ? "✏️ Editando" : "Editar"}
          </button>

          {editMode && (
            <>
              <button
                onClick={onExport}
                className="px-2.5 py-1 rounded-md text-xs bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Exportar
              </button>
              <label className="px-2.5 py-1 rounded-md text-xs bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                Importar
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImport(file);
                  }}
                />
              </label>
              <button
                onClick={onReset}
                className="px-2.5 py-1 rounded-md text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
