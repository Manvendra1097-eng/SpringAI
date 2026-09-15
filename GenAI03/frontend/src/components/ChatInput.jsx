import { Send, Square } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
    <div className="border-t border-gray-800/80 bg-gray-950/70 backdrop-blur-xl px-4 py-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-gray-900/90 border border-gray-800 focus-within:border-indigo-500/70 focus-within:ring-1 focus-within:ring-indigo-500/40 rounded-2xl p-2 sm:p-2.5 transition-all shadow-lg shadow-black/40"
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
                ? 'AI is responding... (Press Stop to interrupt)'
                : 'Type your message here... (Enter to send, Shift+Enter for newline)'
            }
            disabled={disabled}
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-sm sm:text-base resize-none focus:outline-none px-3 py-1.5 min-h-[42px] max-h-[180px] leading-relaxed"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1 pb-0.5">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/40 text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:hover:from-indigo-600 disabled:hover:to-violet-600 text-white transition-all duration-200 shadow-md shadow-indigo-600/20 cursor-pointer disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 px-2">
          <span>Streaming endpoint: <code className="text-gray-400 font-mono">POST /api/chat/stream</code></span>
          <span className="hidden sm:inline">Press Enter ↵ to send</span>
        </div>
      </div>
    </div>
  );
}
