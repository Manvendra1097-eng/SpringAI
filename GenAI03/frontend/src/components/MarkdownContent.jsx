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
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Language normalization map for PrismJS
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

  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * AlgoMaster-styled Code Block with line numbers, language tag, and copy action
 */
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = useMemo(() => {
    const rawLines = code ? String(code).split('\n') : [];
    if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
      rawLines.pop();
    }
    return rawLines;
  }, [code]);

  const highlightedLines = useMemo(() => {
    return lines.map((line) => highlightCode(line, language));
  }, [lines, language]);

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[#242835] bg-[#12151b] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161922] border-b border-[#242835] text-xs">
        <div className="flex items-center gap-2 text-gray-300 font-mono font-medium">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-gray-200 uppercase tracking-wider text-[11px] font-semibold">
            {language || 'code'}
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

      {/* Code Editor Body with Line Numbers */}
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
 * Production-ready Markdown Renderer using react-markdown & remark-gfm
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

  return (
    <div className="markdown-content text-sm sm:text-[15px] leading-relaxed text-[#c7cbd2]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom Code component: separates block code vs inline chips
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const rawText = String(children).replace(/\n$/, '');

            if (!inline && (match || String(children).includes('\n'))) {
              return (
                <CodeBlock
                  language={match ? match[1] : ''}
                  code={rawText}
                />
              );
            }

            // Inline code chip (AlgoMaster style)
            return (
              <code
                className="px-1.5 py-0.5 mx-0.5 text-xs font-mono rounded bg-[#0d281e]/90 text-[#34d399] border border-[#065f46]/60 font-medium select-text"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Headings with precise AlgoMaster hierarchy
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-6 mb-3 pb-1.5 border-b border-[#222633]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-white mt-5 mb-2.5 pb-1 border-b border-[#222633]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-white mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm sm:text-base font-bold text-emerald-400 mt-3.5 mb-1.5">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-xs sm:text-sm font-semibold text-gray-300 mt-2.5 mb-1 uppercase tracking-wider">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-semibold text-gray-400 mt-2 mb-1 uppercase">
              {children}
            </h6>
          ),

          // Paragraphs & Text
          p: ({ children }) => (
            <p className="m-0 leading-relaxed text-[#c7cbd2] mb-2.5">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),

          // Lists (ordered & unordered)
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2.5 pl-5 list-disc marker:text-emerald-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2.5 pl-5 list-decimal marker:text-emerald-400 marker:font-mono marker:text-xs marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-[#c7cbd2] pl-1">
              {children}
            </li>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-emerald-500/70 pl-3.5 py-1 my-3 bg-[#12161f] text-gray-300 italic rounded-r">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => <hr className="border-t border-[#222633] my-4" />,

          // Tables (GFM)
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-[#222633]">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#141820] text-emerald-300 font-semibold border-b border-[#222633]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#222633] bg-[#0f1217]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="p-3 border-r border-[#222633] last:border-r-0 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border-r border-[#222633] last:border-r-0 text-gray-300">
              {children}
            </td>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {isStreaming && <span className="cursor-blink" />}
    </div>
  );
}
