import { Check, Code2, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup'; // HTML / XML
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import React, { useMemo, useState } from 'react';

/**
 * Language normalization map
 */
const LANG_MAP = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  java: 'java',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  html: 'markup',
  xml: 'markup',
  sql: 'sql',
  json: 'json',
  css: 'css',
  c: 'c',
  cpp: 'cpp',
};

/**
 * Highlight a single code snippet using PrismJS
 */
function highlightCode(code, rawLang) {
  const lang = (rawLang || '').toLowerCase().trim();
  const normalizedLang = LANG_MAP[lang] || lang;
  const grammar = Prism.languages[normalizedLang] || Prism.languages.clike;

  if (grammar) {
    try {
      return Prism.highlight(code, grammar, normalizedLang);
    } catch {
      // Fall back to escaped plain text
    }
  }

  // Safe fallback: HTML escape
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * AlgoMaster-styled Code Block with syntax highlighting and line numbers
 */
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = useMemo(() => {
    const rawLines = code ? code.split('\n') : [];
    // Remove last trailing blank line
    if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
      rawLines.pop();
    }
    return rawLines;
  }, [code]);

  // Syntax highlight each line separately so line numbers align perfectly
  const highlightedLines = useMemo(() => {
    return lines.map((line) => highlightCode(line, language));
  }, [lines, language]);

  const displayLang = language || 'code';

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[#242835] bg-[#12151b] shadow-xl">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161922] border-b border-[#242835] text-xs">
        <div className="flex items-center gap-2 text-gray-300 font-mono font-medium">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-gray-200 uppercase tracking-wider text-[11px] font-semibold">
            {displayLang}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1d222e] hover:bg-[#262c3b] border border-[#2c3242] text-gray-300 hover:text-white transition-colors cursor-pointer text-[11px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed py-3 bg-[#0f1217] prism-code">
        {/* Line Numbers Column */}
        <div className="select-none text-right pr-3.5 pl-3 text-[#4b5568] border-r border-[#1f232d] min-w-[2.5rem]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content Column */}
        <div className="pl-4 pr-4 flex-1">
          {highlightedLines.map((htmlLine, i) => (
            <div
              key={i}
              className="whitespace-pre"
              dangerouslySetInnerHTML={{ __html: htmlLine || '&nbsp;' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Format inline text: bold, italic, code, links
 */
function renderInline(text) {
  if (!text) return null;

  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={`code-${index}`}
          className="px-1.5 py-0.5 mx-0.5 text-xs font-mono rounded bg-[#0d281e]/90 text-[#34d399] border border-[#065f46]/60 font-medium select-text"
        >
          {codeContent}
        </code>
      );
    }

    // Split bold: **bold** or __bold__
    const boldParts = part.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);

    return boldParts.map((bPart, bIndex) => {
      if (
        (bPart.startsWith('**') && bPart.endsWith('**')) ||
        (bPart.startsWith('__') && bPart.endsWith('__'))
      ) {
        return (
          <strong
            key={`bold-${index}-${bIndex}`}
            className="font-semibold text-white"
          >
            {bPart.slice(2, -2)}
          </strong>
        );
      }

      // Split italics: *italic* or _italic_
      const italicParts = bPart.split(/(\*[^*]+\*|_[^_]+_)/g);
      return italicParts.map((iPart, iIndex) => {
        if (
          (iPart.startsWith('*') && iPart.endsWith('*')) ||
          (iPart.startsWith('_') && iPart.endsWith('_'))
        ) {
          return (
            <em
              key={`italic-${index}-${bIndex}-${iIndex}`}
              className="italic text-gray-200"
            >
              {iPart.slice(1, -1)}
            </em>
          );
        }
        return iPart;
      });
    });
  });
}

/**
 * Main Markdown Parser & Renderer
 */
export function MarkdownContent({ content, isStreaming }) {
  if (!content && isStreaming) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 py-1">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-xs sm:text-sm text-gray-400">Generating response...</span>
      </div>
    );
  }

  if (!content) return null;

  // Split content by code blocks: ```lang ... ```
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
      language: match[1] || 'code',
      value: match[2],
    });
    lastIndex = match.index + match[0].length;
  }

  const remainingText = content.slice(lastIndex);
  if (remainingText) {
    // Check if there is an unclosed code block during active streaming
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
    <div className="text-sm sm:text-[15px] leading-relaxed text-[#c7cbd2]">
      {elements.map((el, i) => {
        if (el.type === 'code') {
          return <CodeBlock key={i} language={el.language} code={el.value} />;
        }

        const lines = el.value.split('\n');
        return (
          <div key={i} className="space-y-2 my-1">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              // Headings: matches #, ##, ###, ####, #####, ###### (with or without space)
              const headingMatch = trimmed.match(/^(#{1,6})\s*(.*)$/);
              if (headingMatch) {
                const level = headingMatch[1].length;
                const headingText = headingMatch[2];

                switch (level) {
                  case 1:
                    return (
                      <h1
                        key={lineIdx}
                        className="text-xl sm:text-2xl font-extrabold text-white mt-6 mb-3 pb-1.5 border-b border-[#222633]"
                      >
                        {renderInline(headingText)}
                      </h1>
                    );
                  case 2:
                    return (
                      <h2
                        key={lineIdx}
                        className="text-lg sm:text-xl font-bold text-white mt-5 mb-2.5 pb-1 border-b border-[#222633]"
                      >
                        {renderInline(headingText)}
                      </h2>
                    );
                  case 3:
                    return (
                      <h3
                        key={lineIdx}
                        className="text-base sm:text-lg font-bold text-white mt-4 mb-2"
                      >
                        {renderInline(headingText)}
                      </h3>
                    );
                  case 4:
                    return (
                      <h4
                        key={lineIdx}
                        className="text-sm sm:text-base font-bold text-emerald-400 mt-3.5 mb-1.5"
                      >
                        {renderInline(headingText)}
                      </h4>
                    );
                  case 5:
                  case 6:
                    return (
                      <h5
                        key={lineIdx}
                        className="text-xs sm:text-sm font-semibold text-gray-300 mt-2.5 mb-1 uppercase tracking-wider"
                      >
                        {renderInline(headingText)}
                      </h5>
                    );
                  default:
                    break;
                }
              }

              // Divider: --- or ***
              if (/^(\*\*\*|---|___)$/.test(trimmed)) {
                return <hr key={lineIdx} className="border-t border-[#222633] my-4" />;
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-1">
                    <span className="text-emerald-400 select-none text-xs mt-1.5">●</span>
                    <div className="flex-1 leading-relaxed">
                      {renderInline(trimmed.slice(2))}
                    </div>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-1">
                    <span className="text-emerald-400 font-mono text-xs font-semibold select-none mt-1 min-w-[1.2rem]">
                      {numMatch[1]}.
                    </span>
                    <div className="flex-1 leading-relaxed">
                      {renderInline(numMatch[2])}
                    </div>
                  </div>
                );
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={lineIdx}
                    className="border-l-2 border-emerald-500/70 pl-3 py-1 my-2 bg-[#12161f] text-gray-300 italic rounded-r"
                  >
                    {renderInline(trimmed.slice(2))}
                  </blockquote>
                );
              }

              // Paragraph
              return (
                <p key={lineIdx} className="m-0 leading-relaxed text-[#c7cbd2]">
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
