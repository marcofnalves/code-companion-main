import { Search, Book, Menu, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onSearchOpen: () => void;
  onMobileMenuToggle: () => void;
  editMode: boolean;
  onToggleEdit: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  // Projetos
  projectName?: string;
  onSwitchProject?: () => void;
}

const Header = ({
  onSearchOpen,
  onMobileMenuToggle,
  editMode,
  onToggleEdit,
  onExport,
  onImport,
  onReset,
  projectName,
  onSwitchProject,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  return (
    <header className="h-12 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center h-full px-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden mr-3 p-1 rounded-md hover:bg-accent transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mr-4">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <Book className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-accent-foreground hidden sm:inline">
            DOCS System
          </span>
        </div>

        {/* Separador + nome do projeto */}
        {projectName && onSwitchProject && (
          <>
            <span className="text-border text-lg font-light mx-2 hidden sm:inline">/</span>
            <button
              onClick={onSwitchProject}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-accent transition-colors text-sm font-medium text-foreground"
              title="Mudar de projeto"
            >
              {projectName}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </>
        )}

        {/* Pesquisa */}
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 h-7 px-2.5 rounded-md border border-border bg-secondary/50 hover:bg-accent text-xs text-muted-foreground transition-colors duration-150 max-w-xs ml-3"
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

          {/* Utilizador + logout */}
          {user && (
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
              <span className="hidden sm:inline text-xs text-muted-foreground max-w-[120px] truncate">
                {user.name}
              </span>
              <button
                onClick={logout}
                title="Terminar sessão"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
