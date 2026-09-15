import { AlertCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
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

  const handleSelectPrompt = (promptText) => {
    sendMessage(promptText);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0b0f17] text-gray-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Header
        onClear={clearMessages}
        messageCount={messages.length}
        isStreaming={isStreaming}
      />

      {/* Error Banner if any */}
      {error && !dismissedError && (
        <div className="bg-rose-950/80 border-b border-rose-800/80 px-4 py-2 text-xs sm:text-sm text-rose-200 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setDismissedError(true)}
            className="text-rose-400 hover:text-rose-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Messages / Prompt Suggestions area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* Subtle background glow decorative elements */}
        <div className="pointer-events-none absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          onSelectPrompt={handleSelectPrompt}
        />
      </main>

      {/* Input Area */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStream}
        isStreaming={isStreaming}
        disabled={false}
      />
    </div>
  );
}
