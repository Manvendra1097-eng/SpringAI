import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

/**
 * Single Code Block with copy-to-clipboard functionality and language tag
 */
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-gray-800 bg-gray-950/80 shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900/90 border-b border-gray-800/80 text-xs font-mono text-gray-400">
        <span className="uppercase tracking-wider font-semibold text-indigo-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-200/90 leading-relaxed">
        <pre className="m-0 whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}

/**
 * Formats inline text with bold, italic, and inline code tags
 */
function renderInline(text) {
  if (!text) return null;

  // Split by inline code: `code`
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 text-xs sm:text-sm font-mono rounded bg-gray-800 text-indigo-300 border border-gray-700/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Process bold (**bold**) and italics (*italic*)
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIndex) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return (
          <strong key={`${index}-${bIndex}`} className="font-semibold text-white">
            {bPart.slice(2, -2)}
          </strong>
        );
      }
      return bPart;
    });
  });
}

/**
 * Lightweight and robust markdown renderer
 */
export function MarkdownContent({ content, isStreaming }) {
  if (!content && isStreaming) {
    return (
      <div className="flex items-center gap-2 text-indigo-400 py-1">
        <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span className="text-sm italic text-gray-400">Thinking...</span>
      </div>
    );
  }

  if (!content) return null;

  // Split content by code fences: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.slice(lastIndex, match.index);
    if (textBefore) {
      elements.push({ type: 'text', value: textBefore });
    }
    elements.push({
      type: 'code',
      language: match[1] || 'plaintext',
      value: match[2],
    });
    lastIndex = match.index + match[0].length;
  }

  const remainingText = content.slice(lastIndex);
  if (remainingText) {
    // Check if there's an open unclosed code block at the end (during streaming)
    const openFenceIndex = remainingText.indexOf('```');
    if (openFenceIndex !== -1) {
      const beforeOpenFence = remainingText.slice(0, openFenceIndex);
      if (beforeOpenFence) {
        elements.push({ type: 'text', value: beforeOpenFence });
      }
      const rawAfter = remainingText.slice(openFenceIndex + 3);
      const firstNewline = rawAfter.indexOf('\n');
      const lang = firstNewline !== -1 ? rawAfter.slice(0, firstNewline) : '';
      const code = firstNewline !== -1 ? rawAfter.slice(firstNewline + 1) : rawAfter;
      elements.push({ type: 'code', language: lang, value: code });
    } else {
      elements.push({ type: 'text', value: remainingText });
    }
  }

  return (
    <div className="markdown-content text-sm sm:text-base leading-relaxed text-gray-200">
      {elements.map((el, i) => {
        if (el.type === 'code') {
          return <CodeBlock key={i} language={el.language} code={el.value} />;
        }

        // Render standard text lines (headings, bullets, paragraphs)
        const lines = el.value.split('\n');
        return (
          <div key={i} className="space-y-1.5 my-1">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-2" />;
              }

              // Headings
              if (line.startsWith('### ')) {
                return (
                  <h3 key={lineIdx} className="text-base font-semibold text-indigo-300 mt-3 mb-1">
                    {renderInline(line.replace('### ', ''))}
                  </h3>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={lineIdx} className="text-lg font-bold text-white mt-4 mb-2 pb-1 border-b border-gray-800">
                    {renderInline(line.replace('## ', ''))}
                  </h2>
                );
              }
              if (line.startsWith('# ')) {
                return (
                  <h1 key={lineIdx} className="text-xl font-extrabold text-white mt-4 mb-2 pb-1 border-b border-gray-800">
                    {renderInline(line.replace('# ', ''))}
                  </h1>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-indigo-400 mt-1 select-none">•</span>
                    <span>{renderInline(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-indigo-400 font-mono text-xs mt-1 select-none">
                      {numMatch[1]}.
                    </span>
                    <span>{renderInline(numMatch[2])}</span>
                  </div>
                );
              }

              // Regular paragraph
              return (
                <p key={lineIdx} className="m-0">
                  {renderInline(line)}
                </p>
              );
            })}
          </div>
        );
      })}

      {isStreaming && <span className="cursor-blink" />}
    </div>
  );
}
