import { Code, Cpu, Sparkles, Zap } from 'lucide-react';
import React from 'react';
import { SUGGESTED_PROMPTS } from '../constants/prompts';

const ICONS = {
  code: Code,
  server: Cpu,
  sparkles: Sparkles,
  zap: Zap,
};

export function PromptSuggestions({ onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center my-auto py-10 px-4 max-w-3xl mx-auto text-center">
      {/* Hero Badge & Title */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-indigo-300 text-xs font-medium mb-4 shadow-sm backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        Spring AI Streaming Engine
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-indigo-300 tracking-tight mb-3">
        Experience Real-Time AI Generation
      </h1>

      <p className="text-sm sm:text-base text-gray-400 max-w-lg mb-8 leading-relaxed">
        Connected to <code className="text-indigo-300 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">/api/chat/stream</code>.
        Select a sample prompt below or start typing to stream tokens instantly.
      </p>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {SUGGESTED_PROMPTS.map((item) => {
          const IconComponent = ICONS[item.icon] || Sparkles;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group p-4 rounded-xl bg-gray-900/50 hover:bg-gray-800/80 border border-gray-800 hover:border-indigo-500/50 transition-all duration-200 shadow-sm hover:shadow-indigo-500/10 flex items-start gap-3 text-left cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-800/40 text-indigo-400 group-hover:text-indigo-300 group-hover:border-indigo-600 transition-colors flex-shrink-0">
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
