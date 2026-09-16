import { Code, Cpu, Sparkles, Zap } from 'lucide-react';
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
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        Spring AI Streaming Engine
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Real-Time Streaming Chat
      </h1>

      <p className="text-sm sm:text-base text-gray-400 max-w-md mb-8 leading-relaxed">
        Streaming tokens live via <code className="text-emerald-400 bg-[#151922] px-1.5 py-0.5 rounded border border-[#262c3b] font-mono text-xs">/api/chat/stream</code>.
        Choose a prompt below or start typing.
      </p>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {SUGGESTED_PROMPTS.map((item) => {
          const IconComponent = ICONS[item.icon] || Sparkles;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group p-4 rounded-xl bg-[#14171e] hover:bg-[#191d26] border border-[#222633] hover:border-emerald-500/40 transition-all duration-150 flex items-start gap-3.5 text-left cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-[#1a1f2c] border border-[#272e40] text-emerald-400 group-hover:bg-[#0f241a] group-hover:border-emerald-700/50 group-hover:text-emerald-300 transition-colors shrink-0 mt-0.5">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
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
