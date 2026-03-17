import { Sheet, SheetContent } from "@/components/ui/sheet";
import { navigation, type DocSection } from "@/data/documentation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePageId: string;
  onNavigate: (pageId: string) => void;
}

const MobileSection = ({
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
        className="flex items-center w-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <ChevronRight className={cn("h-3 w-3 mr-1.5 transition-transform duration-150", open && "rotate-90")} />
        {section.icon && <span className="mr-1.5">{section.icon}</span>}
        {section.title}
      </button>
      {open && section.children && (
        <div className="ml-3 space-y-px border-l border-border/50 pl-3">
          {section.children.map((child) => (
            <button
              key={child.id}
              onClick={() => onNavigate(child.id)}
              className={cn(
                "block w-full text-left px-3 py-1.5 text-sm rounded-md",
                activePageId === child.id
                  ? "text-primary font-medium bg-primary/8"
                  : "text-muted-foreground hover:text-foreground"
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

const MobileSidebar = ({ open, onOpenChange, activePageId, onNavigate }: MobileSidebarProps) => {
  const handleNavigate = (id: string) => {
    onNavigate(id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-4 bg-sidebar">
        <nav className="mt-6 space-y-1">
          {navigation.map((section) => (
            <MobileSection
              key={section.id}
              section={section}
              activePageId={activePageId}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
