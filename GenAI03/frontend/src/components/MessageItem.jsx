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
      className={`group flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl transition-colors ${
        isUser
          ? 'bg-[#151821] border border-[#262b3a] ml-4 sm:ml-12'
          : 'bg-[#12141a] border border-[#202430] mr-4 sm:mr-12'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-lg bg-[#1e2330] border border-[#2e3547] flex items-center justify-center text-gray-300">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
              message.isStreaming
                ? 'bg-[#0f241a] border-emerald-500/50 text-emerald-400 animate-pulse'
                : 'bg-[#161a22] border-[#292f3e] text-emerald-400'
            }`}
          >
            <Bot className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs sm:text-sm text-white">
              {isUser ? 'You' : 'Spring AI'}
            </span>
            {message.timestamp && (
              <span className="text-[11px] text-gray-500 font-mono">
                {message.timestamp}
              </span>
            )}
            {message.isStreaming && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Streaming
              </span>
            )}
            {message.isError && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-950/40 text-rose-400 border border-rose-800/40">
                <AlertTriangle className="w-3 h-3" />
                Error
              </span>
            )}
          </div>

          {/* Quick copy whole message */}
          {message.content && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded hover:bg-[#1d222e] text-gray-400 hover:text-gray-200 cursor-pointer"
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
          <p className="text-sm sm:text-[15px] text-[#e2e8f0] whitespace-pre-wrap leading-relaxed m-0 font-normal">
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
