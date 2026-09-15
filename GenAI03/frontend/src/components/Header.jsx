import { Bot, CheckCircle2, Radio, Sparkles, Trash2 } from 'lucide-react';
import React from 'react';

export function Header({ onClear, messageCount, isStreaming }) {
  return (
    <header className="border-b border-[#222632] bg-[#11141a]/95 backdrop-blur-md px-4 py-3 sm:px-6 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Engine */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161a22] border border-[#2a2f3d] flex items-center justify-center text-emerald-400 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
              <span>Spring</span>
              <span className="text-emerald-400">AI</span>
            </h1>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-medium">
              Stream Studio
            </span>
          </div>
        </div>

        {/* Center / Endpoint badge */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 bg-[#161a22] border border-[#242834] px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-gray-300">/api/chat/stream</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 font-mono">gpt-4o-mini</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {messageCount > 0 && (
            <button
              onClick={onClear}
              disabled={isStreaming}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161a22] border border-[#262b37] text-xs">
            {isStreaming ? (
              <>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-medium">Streaming...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-gray-300 font-medium">Online</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
