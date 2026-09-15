import { AlertTriangle, Bot, Check, Copy, User } from 'lucide-react';
import React, { useState } from 'react';
import { MarkdownContent } from './MarkdownContent';

export function MessageItem({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-200 ${
        isUser
          ? 'bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-gray-900/40 border border-indigo-900/30 ml-4 sm:ml-12'
          : 'bg-gray-900/60 border border-gray-800/80 mr-4 sm:mr-12 backdrop-blur-sm'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        ) : (
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shadow-lg ${
              message.isStreaming
                ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-emerald-500/20 animate-pulse'
                : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-purple-500/20'
            }`}
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs sm:text-sm text-gray-200">
              {isUser ? 'You' : 'Spring AI Assistant'}
            </span>
            {message.timestamp && (
              <span className="text-[11px] text-gray-500 font-mono">
                {message.timestamp}
              </span>
            )}
            {message.isStreaming && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Streaming
              </span>
            )}
            {message.isError && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-3 h-3" />
                Failed
              </span>
            )}
          </div>

          {/* Quick copy entire message */}
          {message.content && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        {isUser ? (
          <p className="text-sm sm:text-base text-gray-100 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        ) : (
          <MarkdownContent
            content={message.content}
            isStreaming={message.isStreaming}
          />
        )}
      </div>
    </div>
  );
}
