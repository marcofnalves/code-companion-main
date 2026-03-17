import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { navigation, type DocSection } from "@/data/documentation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activePageId: string;
  onNavigate: (pageId: string) => void;
}

const SidebarSection = ({
  section,
  activePageId,
  onNavigate,
}: {
  section: DocSection;
  activePageId: string;
  onNavigate: (pageId: string) => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        <ChevronRight
          className={cn(
            "h-3 w-3 mr-1.5 shrink-0 transition-transform duration-150",
            open && "rotate-90"
          )}
        />
        {section.icon && <span className="mr-1.5">{section.icon}</span>}
        {section.title}
      </button>
      {open && section.children && (
        <div className="ml-3 mt-0.5 space-y-px border-l border-border/50 pl-3">
          {section.children.map((child) => (
            <button
              key={child.id}
              onClick={() => onNavigate(child.id)}
              className={cn(
                "block w-full text-left px-3 py-1.5 text-[13px] rounded-md transition-all duration-150",
                activePageId === child.id
                  ? "text-primary bg-primary/8 font-medium"
                  : "text-sidebar-foreground hover:text-accent-foreground hover:bg-accent/50"
              )}
            >
              {child.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ activePageId, onNavigate }: SidebarProps) => {
  return (
    <aside className="w-60 shrink-0 h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto bg-sidebar border-r border-border py-5 px-2 hidden lg:block">
      <nav className="space-y-1">
        {navigation.map((section) => (
          <SidebarSection
            key={section.id}
            section={section}
            activePageId={activePageId}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
