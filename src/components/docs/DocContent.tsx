import { type ContentBlock, type DocPage } from "@/data/documentation";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface DocContentProps {
  page: DocPage;
  editMode: boolean;
  onNavigate: (pageId: string) => void;
  onUpdateBlock: (blockId: string, updates: Partial<ContentBlock>) => void;
  onUpdateMeta: (updates: Partial<Pick<DocPage, "title" | "description">>) => void;
  onAddBlock: (afterBlockId: string, block: ContentBlock) => void;
  onRemoveBlock: (blockId: string) => void;
  prevPage?: { id: string; title: string } | null;
  nextPage?: { id: string; title: string } | null;
}

const generateId = () => `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const BlockRenderer = ({
  block,
  editMode,
  onUpdate,
  onAdd,
  onRemove,
}: {
  block: ContentBlock;
  editMode: boolean;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onAdd: (type: ContentBlock["type"]) => void;
  onRemove: () => void;
}) => {
  const wrapper = (children: React.ReactNode) => {
    if (!editMode) return <div>{children}</div>;

    return (
      <div className="group/block relative border border-transparent hover:border-border rounded-md transition-colors duration-150 mb-1">
        {/* Toolbar — dentro do container, sempre acessível */}
        <div className="absolute top-1 right-1 z-10 flex items-center gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity duration-150">
          <button
            onMouseDown={(e) => { e.preventDefault(); onRemove(); }}
            className="p-1 rounded bg-background border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10 transition-colors"
            title="Remover bloco"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Conteúdo do bloco */}
        <div className="px-2 pt-1">
          {children}
        </div>

        {/* Barra "adicionar depois" — dentro do container, na base */}
        <div className="flex items-center gap-1 px-2 pb-1.5 opacity-0 group-hover/block:opacity-100 transition-opacity duration-150">
          <span className="text-[10px] text-muted-foreground mr-1">Inserir:</span>
          <button onMouseDown={(e) => { e.preventDefault(); onAdd("paragraph"); }} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground hover:bg-accent transition-colors">Texto</button>
          <button onMouseDown={(e) => { e.preventDefault(); onAdd("heading"); }} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground hover:bg-accent transition-colors">Título</button>
          <button onMouseDown={(e) => { e.preventDefault(); onAdd("code"); }} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground hover:bg-accent transition-colors">Código</button>
          <button onMouseDown={(e) => { e.preventDefault(); onAdd("list"); }} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground hover:bg-accent transition-colors">Lista</button>
        </div>
      </div>
    );
  };

  switch (block.type) {
    case "heading": {
      const Tag = block.level === 3 ? "h3" : "h2";
      return wrapper(
        editMode ? (
          <input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="editable-block bg-transparent outline-none w-full text-xl font-semibold mt-10 mb-3 pb-2 border-b border-border text-accent-foreground"
            id={block.id}
          />
        ) : (
          <Tag id={block.id}>{block.content}</Tag>
        )
      );
    }
    case "paragraph":
      return wrapper(
        editMode ? (
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="editable-block bg-transparent outline-none w-full leading-7 mb-4 text-foreground resize-none min-h-[2rem]"
            rows={Math.max(1, block.content.split("\n").length)}
          />
        ) : (
          <p>{block.content}</p>
        )
      );
    case "code":
      return wrapper(
        <CodeBlock block={block} editMode={editMode} onUpdate={onUpdate} />
      );
    case "list":
      return wrapper(
        editMode ? (
          <textarea
            value={(block.items || []).join("\n")}
            onChange={(e) => onUpdate({ items: e.target.value.split("\n") })}
            className="editable-block bg-transparent outline-none w-full leading-7 mb-4 resize-none pl-6"
            rows={(block.items || []).length + 1}
            placeholder="Um item por linha"
          />
        ) : (
          <ul>
            {(block.items || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      );
    case "blockquote":
      return wrapper(
        editMode ? (
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="editable-block bg-transparent outline-none w-full border-l-2 border-primary/40 pl-4 my-4 text-muted-foreground italic resize-none"
            rows={2}
          />
        ) : (
          <blockquote>{block.content}</blockquote>
        )
      );
    case "divider":
      return wrapper(<hr className="my-8 border-border" />);
    default:
      return null;
  }
};

const DocContent = ({
  page,
  editMode,
  onNavigate,
  onUpdateBlock,
  onUpdateMeta,
  onAddBlock,
  onRemoveBlock,
  prevPage,
  nextPage,
}: DocContentProps) => {
  const handleAdd = (afterBlockId: string, type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: type === "heading" ? "Novo Título" : type === "code" ? "// novo código" : type === "list" ? "" : "Novo parágrafo...",
      ...(type === "heading" && { level: 2 }),
      ...(type === "code" && { language: "typescript", filename: "example.ts" }),
      ...(type === "list" && { items: ["Item 1", "Item 2"] }),
    };
    onAddBlock(afterBlockId, newBlock);
  };

  return (
    <article className="flex-1 min-w-0 max-w-3xl mx-auto py-8 px-6 lg:px-12">
      <div className="docs-prose">
        {/* Page header */}
        <div className="mb-8">
          {editMode ? (
            <>
              <input
                value={page.title}
                onChange={(e) => onUpdateMeta({ title: e.target.value })}
                className="editable-block bg-transparent outline-none w-full text-3xl font-bold mb-2 text-accent-foreground"
              />
              <textarea
                value={page.description}
                onChange={(e) => onUpdateMeta({ description: e.target.value })}
                className="editable-block bg-transparent outline-none w-full text-lg text-muted-foreground resize-none"
                rows={1}
              />
            </>
          ) : (
            <>
              <h1>{page.title}</h1>
              <p className="text-base text-muted-foreground mt-1">{page.description}</p>
            </>
          )}
        </div>

        {/* Content blocks */}
        <div>
          {page.blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              editMode={editMode}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
              onAdd={(type) => handleAdd(block.id, type)}
              onRemove={() => onRemoveBlock(block.id)}
            />
          ))}
        </div>

        {/* Add first block */}
        {editMode && page.blocks.length === 0 && (
          <div className="flex items-center gap-2 py-8">
            <button
              onClick={() =>
                onAddBlock("", {
                  id: generateId(),
                  type: "paragraph",
                  content: "Comece a escrever...",
                })
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-secondary text-muted-foreground hover:bg-accent transition-colors"
            >
              <Plus className="h-3 w-3" /> Adicionar conteúdo
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-16 pt-6 border-t border-border">
          {prevPage ? (
            <button
              onClick={() => onNavigate(prevPage.id)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Anterior</div>
                <div className="font-medium text-foreground text-[13px]">{prevPage.title}</div>
              </div>
            </button>
          ) : (
            <div />
          )}
          {nextPage ? (
            <button
              onClick={() => onNavigate(nextPage.id)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Próximo</div>
                <div className="font-medium text-foreground text-[13px]">{nextPage.title}</div>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </article>
  );
};

export default DocContent;
