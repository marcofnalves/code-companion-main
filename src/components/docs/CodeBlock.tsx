import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { type ContentBlock } from "@/data/documentation";

interface CodeBlockProps {
  block: ContentBlock;
  editMode: boolean;
  onUpdate: (updates: Partial<ContentBlock>) => void;
}

const CodeBlock = ({ block, editMode, onUpdate }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden mb-5 border border-border/50">
      {block.filename && (
        <div className="code-block px-4 py-2 text-xs font-mono text-muted-foreground border-b border-border/50 flex items-center justify-between">
          {editMode ? (
            <input
              value={block.filename}
              onChange={(e) => onUpdate({ filename: e.target.value })}
              className="bg-transparent outline-none text-xs font-mono"
            />
          ) : (
            <span>{block.filename}</span>
          )}
          <span className="text-xs opacity-50">{block.language}</span>
        </div>
      )}
      <div className="relative group">
        {editMode ? (
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="code-block w-full p-4 text-sm leading-relaxed font-mono resize-y min-h-[80px] outline-none"
            rows={block.content.split("\n").length + 1}
          />
        ) : (
          <pre className="code-block p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="font-mono">{block.content}</code>
          </pre>
        )}
        {!editMode && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-muted/20"
            aria-label="Copiar código"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
