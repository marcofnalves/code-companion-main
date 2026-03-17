import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type ContentBlock } from "@/data/documentation";

interface TableOfContentsProps {
  blocks: ContentBlock[];
}

const TableOfContents = ({ blocks }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");

  const headings = blocks.filter((b) => b.type === "heading");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-60px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="w-52 shrink-0 h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto py-5 px-3 hidden xl:block">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Nesta página
      </p>
      <nav className="space-y-0.5">
        {headings.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block text-[13px] py-1 transition-colors duration-150 border-l",
              item.level === 3 ? "pl-5" : "pl-3",
              activeId === item.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.content}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default TableOfContents;
