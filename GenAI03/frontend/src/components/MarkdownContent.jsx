import { AlertCircle, Check, Code2, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Language normalization map for PrismJS with dedicated JSX and TSX support
 */
const LANG_MAP = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
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
 * Safely highlight full code string with PrismJS, falling back gracefully
 */
function highlightCode(code, rawLang) {
  const lang = (rawLang || '').toLowerCase().trim();
  const normalizedLang = LANG_MAP[lang] || lang;

  let grammar = Prism.languages[normalizedLang];
  if (!grammar && normalizedLang === 'tsx') {
    grammar = Prism.languages.jsx || Prism.languages.typescript;
  }
  if (!grammar && normalizedLang === 'jsx') {
    grammar = Prism.languages.javascript;
  }
  if (!grammar) {
    grammar = Prism.languages.clike;
  }

  if (grammar) {
    try {
      return Prism.highlight(code, grammar, normalizedLang);
    } catch {
      // Fall through to safe escaping
    }
  }

  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Split highlighted HTML into lines while keeping span tags properly balanced across lines.
 * This ensures multi-line tokens (block comments, multi-line strings) don't break HTML structure.
 */
function splitHtmlIntoLines(html) {
  if (!html) return [];
  const rawLines = html.split('\n');
  const result = [];
  const openTagsStack = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    // Re-open any active tags from previous lines
    const prefix = openTagsStack.map((tag) => tag.html).join('');

    // Scan tags in current line
    const tagRegex = /(<\/?span(?:\s+[^>]*)?>)/gi;
    let match;
    while ((match = tagRegex.exec(line)) !== null) {
      const tagStr = match[1];
      if (tagStr.startsWith('</')) {
        openTagsStack.pop();
      } else {
        openTagsStack.push({ html: tagStr });
      }
    }

    // Close any tags left open at the end of this line
    const suffix = openTagsStack
      .slice()
      .reverse()
      .map(() => '</span>')
      .join('');

    result.push(prefix + line + suffix);
  }

  return result;
}

/**
 * AlgoMaster-styled Code Block with line numbers, language tag, copy action, and memoization
 */
const CodeBlock = React.memo(function CodeBlock({ language, code }) {
  const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'copied' | 'error'

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) throw new Error('execCommand copy unsuccessful');
      }
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2500);
    }
  };

  // Full-string Prism highlighting then line-split to preserve multi-line tokens
  const highlightedLines = useMemo(() => {
    const trimmed = typeof code === 'string' ? code.replace(/\n$/, '') : '';
    const fullHtml = highlightCode(trimmed, language);
    return splitHtmlIntoLines(fullHtml);
  }, [code, language]);

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
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
            copyStatus === 'error'
              ? 'bg-rose-950/40 border-rose-800/50 text-rose-400'
              : 'bg-[#1d222e] hover:bg-[#262c3b] border-[#2c3242] text-gray-300 hover:text-white'
          }`}
          title={copyStatus === 'error' ? 'Copy failed' : 'Copy code'}
        >
          {copyStatus === 'copied' && (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          )}
          {copyStatus === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-medium">Failed</span>
            </>
          )}
          {copyStatus === 'idle' && (
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
          {highlightedLines.map((_, i) => (
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
});

/**
 * Pre-processes markdown during active streaming:
 * Detects if content ends with an unclosed code fence and temporarily closes it
 * to prevent flickering/broken CommonMark document trees mid-stream.
 */
function completeStreamingFences(text) {
  if (!text || typeof text !== 'string') return text;

  const lines = text.split('\n');
  let inCodeBlock = false;
  let fenceLength = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();
    const match = trimmed.match(/^(`{3,}|~{3,})/);
    if (match) {
      const len = match[1].length;
      if (!inCodeBlock) {
        inCodeBlock = true;
        fenceLength = len;
      } else if (len >= fenceLength) {
        inCodeBlock = false;
        fenceLength = 0;
      }
    }
  }

  if (inCodeBlock) {
    return text + '\n```';
  }
  return text;
}

/**
 * Production-ready Markdown Renderer using react-markdown & remark-gfm
 */
export function MarkdownContent({ content, isStreaming }) {
  // Temporarily close unclosed trailing code blocks during active streaming
  const processedContent = useMemo(() => {
    if (!content) return '';
    return isStreaming ? completeStreamingFences(content) : content;
  }, [content, isStreaming]);

  // Memoized components map to keep renderers referentially stable
  const components = useMemo(
    () => ({
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

        return (
          <code
            className="px-1.5 py-0.5 mx-0.5 text-xs font-mono rounded bg-[#0d281e]/90 text-[#34d399] border border-[#065f46]/60 font-medium select-text"
            {...props}
          >
            {children}
          </code>
        );
      },

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

      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-emerald-500/70 pl-3.5 py-1 my-3 bg-[#12161f] text-gray-300 italic rounded-r">
          {children}
        </blockquote>
      ),

      hr: () => <hr className="border-t border-[#222633] my-4" />,

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
    }),
    []
  );

  // Early returns placed AFTER all hooks have executed unconditionally
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
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {processedContent}
      </ReactMarkdown>

      {isStreaming && <span className="cursor-blink" />}
    </div>
  );
}
