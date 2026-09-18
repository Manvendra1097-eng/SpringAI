import {
  FileText,
  FolderOpen,
  MessageSquare,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar({ isOpen, onClose, onNewChat, isStreaming }) {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'documents'

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-[#101319] border-r border-[#1f2430] flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
          }`}
      >
        {/* Top Action / New Chat */}
        <div className="p-3 border-b border-[#1f2430] flex items-center gap-2">
          <button
            onClick={onNewChat}
            disabled={isStreaming}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:border-emerald-500/50"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Close button on mobile / collapsible */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#191d26] transition-colors md:hidden cursor-pointer"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (History vs Documents) */}
        <div className="flex items-center px-3 pt-3 gap-1 border-b border-[#1b202c]">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'history'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'documents'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents</span>
          </button>
        </div>

        {/* Content Area (kept empty with sleek placeholder) */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center items-center text-center">
          {activeTab === 'history' ? (
            <div className="flex flex-col items-center max-w-50 text-gray-400 py-8">
              <div className="w-10 h-10 rounded-xl bg-[#171b24] border border-[#232938] flex items-center justify-center text-gray-400 mb-3">
                <MessageSquare className="w-5 h-5 text-emerald-500/70" />
              </div>
              <p className="text-xs font-medium text-gray-300 mb-1">No Chat History</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Your past conversations will be saved and listed here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center max-w-50] text-gray-400 py-8">
              <div className="w-10 h-10 rounded-xl bg-[#171b24] border border-[#232938] flex items-center justify-center text-gray-400 mb-3">
                <FolderOpen className="w-5 h-5 text-emerald-500/70" />
              </div>
              <p className="text-xs font-medium text-gray-300 mb-1">No Documents</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Uploaded PDFs, docs, and knowledge files will show up here.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#1b202c] bg-[#0c0e12] flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spring AI v0.3</span>
          </div>
          <span className="text-gray-400 font-mono text-[10px]">SSE Ready</span>
        </div>
      </aside>
    </>
  );
}
