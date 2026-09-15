import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { PromptSuggestions } from './PromptSuggestions';

export function MessageList({ messages, isStreaming, onSelectPrompt }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (!messages || messages.length === 0) {
    return <PromptSuggestions onSelectPrompt={onSelectPrompt} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 max-w-4xl w-full mx-auto">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
