import { ArrowUp, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function ChatInput({ onSend, onStop, isStreaming, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[#202430] bg-[#0f1217] px-4 py-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-[#14171f] border border-[#262b3a] focus-within:border-emerald-500/70 focus-within:ring-1 focus-within:ring-emerald-500/40 rounded-xl p-2 sm:p-2.5 transition-all"
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? 'AI is writing... Click Stop to interrupt'
                : 'Ask anything or paste code... (Enter to send, Shift+Enter for newline)'
            }
            disabled={disabled}
            className="w-full bg-transparent text-[#f1f5f9] placeholder-gray-500 text-sm sm:text-base resize-none focus:outline-none px-3 py-1.5 min-h-10.5 max-h-45 leading-relaxed"
          />

          {/* Action Button */}
          <div className="flex items-center gap-1 pb-0.5">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-800/50 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#1e2330] text-gray-950 disabled:text-gray-500 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-sm"
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </form>

        {/* Footer subtle info */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Endpoint: <code className="text-gray-400 font-mono">POST /api/chat/stream</code></span>
          </span>
          <span className="hidden sm:inline">Press Enter ↵ to send</span>
        </div>
      </div>
    </div>
  );
}
