import { AlertCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { Sidebar } from './components/Sidebar';
import { useChatStream } from './hooks/useChatStream';

export default function App() {
  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStream,
    clearMessages,
  } = useChatStream();

  const [dismissedError, setDismissedError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSelectPrompt = (promptText) => {
    sendMessage(promptText);
  };

  const handleNewChat = () => {
    clearMessages();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0d0f12] text-[#e2e8f0] selection:bg-emerald-500/20 selection:text-emerald-300 overflow-hidden">
      {/* Top Navigation */}
      <Header
        onClear={clearMessages}
        messageCount={messages.length}
        isStreaming={isStreaming}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout: Sidebar + Chat Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Left Sidebar (History & Documents) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNewChat={handleNewChat}
          isStreaming={isStreaming}
        />

        {/* Right Chat Column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0d0f12] relative">
          {/* Error Banner if any */}
          {error && !dismissedError && (
            <div className="bg-rose-950/70 border-b border-rose-900/60 px-4 py-2 text-xs sm:text-sm text-rose-300 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
                <button
                  onClick={() => setDismissedError(true)}
                  className="ml-auto text-rose-400 hover:text-rose-200 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main Chat / Suggestions scrollable area */}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <MessageList
              messages={messages}
              isStreaming={isStreaming}
              onSelectPrompt={handleSelectPrompt}
            />
          </main>

          {/* Bottom Input Area pinned at the bottom */}
          <ChatInput
            onSend={sendMessage}
            onStop={stopStream}
            isStreaming={isStreaming}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
