import { useCallback, useRef, useState } from 'react';
import { streamChatResponse } from '../services/chatService';

export function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      )
    );
  }, []);

  const clearMessages = useCallback(() => {
    stopStream();
    setMessages([]);
    setError(null);
  }, [stopStream]);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText?.trim();
      if (!text || isStreaming) return;

      setError(null);
      const userMessageId = `user-${Date.now()}`;
      const assistantMessageId = `assistant-${Date.now() + 1}`;

      const userMessage = {
        id: userMessageId,
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await streamChatResponse({
          message: text,
          signal: controller.signal,
          onChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          },
        });

        // Mark as completed
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      } catch (err) {
        if (err.name === 'AbortError') {
          // User aborted the stream intentionally
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: msg.content ? msg.content + ' *(Generation stopped)*' : '*(Generation stopped)*',
                    isStreaming: false,
                  }
                : msg
            )
          );
        } else {
          const errorMessage = err.message || 'Failed to get response from server.';
          setError(errorMessage);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: msg.content
                      ? `${msg.content}\n\n⚠️ **Error:** ${errorMessage}`
                      : `⚠️ **Error:** ${errorMessage}`,
                    isStreaming: false,
                    isError: true,
                  }
                : msg
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming]
  );

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStream,
    clearMessages,
  };
}
