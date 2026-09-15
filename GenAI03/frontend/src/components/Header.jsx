import { Activity, Bot, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import React from 'react';

export function Header({ onClear, messageCount, isStreaming }) {
  return (
    <header className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl px-4 py-3 sm:px-6 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Model */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                Spring AI
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Stream Engine
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>/api/chat/stream</span>
              </span>
              <span>•</span>
              <span className="text-gray-400 font-mono text-[11px]">gpt-4o-mini</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {messageCount > 0 && (
            <button
              onClick={onClear}
              disabled={isStreaming}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-800/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}

          {/* Activity status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-400">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-gray-300 font-medium">
              {isStreaming ? (
                <span className="text-emerald-400">Receiving...</span>
              ) : (
                <span>Ready</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
