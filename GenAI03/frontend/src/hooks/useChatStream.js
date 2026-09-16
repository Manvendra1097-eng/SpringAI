import { useCallback, useRef, useState } from 'react';
import { streamChatResponse } from '../services/chatService';

/**
 * @typedef {Object} Message
 * @property {string} id - Unique identifier (e.g. "user-1726458000000" | "assistant-1726458000001")
 * @property {'user' | 'assistant'} role - Author role ('user' for prompt, 'assistant' for AI response)
 * @property {string} content - Message text/markdown (progressively appended token chunks for assistant)
 * @property {string} timestamp - Formatted time string (e.g. "09:54 AM")
 * @property {boolean} [isStreaming] - (Assistant only) True while chunks are actively streaming, false when done/aborted
 * @property {boolean} [isError] - (Assistant only) Optional flag indicating generation failed
 *
 * @example
 * // Example: User Message
 * {
 *   id: "user-1726458123456",
 *   role: "user",
 *   content: "Explain Reactive Streams in Spring WebFlux",
 *   timestamp: "09:54 AM"
 * }
 *
 * @example
 * // Example: Assistant Message (during streaming)
 * {
 *   id: "assistant-1726458123457",
 *   role: "assistant",
 *   content: "Reactive Streams provide a standard for asynchronous stream processing...",
 *   isStreaming: true,
 *   timestamp: "09:54 AM"
 * }
 *
 * @example
 * // Example: messages array state (Message[])
 * [
 *   { id: "user-1", role: "user", content: "Hello", timestamp: "09:50 AM" },
 *   { id: "assistant-1", role: "assistant", content: "Hi! How can I help you?", isStreaming: false, timestamp: "09:50 AM" }
 * ]
 */

export function useChatStream() {
  /** @type {[Message[], React.Dispatch<React.SetStateAction<Message[]>>]} */
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const isStreamingRef = useRef(false); // <-- Tracks streaming state without closures

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isStreamingRef.current = false;
    setIsStreaming(false);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const lastMsg = prev[prev.length - 1];

      if (!lastMsg.isStreaming) return prev; // Nothing to change

      // Only clone and modify the last message:
      const updated = [...prev];
      updated[updated.length - 1] = { ...lastMsg, isStreaming: false };
      return updated;
    });

  }, []);

  const clearMessages = useCallback(() => {
    stopStream();
    setMessages([]);
    setError(null);
  }, [stopStream]);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText?.trim();
      if (!text || isStreamingRef.current) return;

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
      isStreamingRef.current = true;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await streamChatResponse({
          message: text,
          signal: controller.signal,
          onChunk: (chunk) => {
            setMessages((prev) => {
              if (prev.length === 0) return prev;
              const lastIndex = prev.length - 1;
              const lastMsg = prev[lastIndex];

              // Guard: only append if the last message is actually the streaming assistant message
              if (lastMsg.role !== 'assistant' || !lastMsg.isStreaming) {
                return prev;
              }

              const updated = [...prev];
              updated[lastIndex] = { ...lastMsg, content: lastMsg.content + chunk };
              return updated;
            });
          },
        });

        // Mark as completed
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const lastIndex = prev.length - 1;
          const updated = [...prev];
          updated[lastIndex] = { ...updated[lastIndex], isStreaming: false };
          return updated;
        });

      } catch (err) {
        if (err.name === 'AbortError') {
          // User aborted the stream intentionally
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const lastIndex = prev.length - 1;
            const lastMsg = prev[lastIndex];
            const updated = [...prev];
            updated[lastIndex] = {
              ...lastMsg,
              content: lastMsg.content
                ? `${lastMsg.content} *(Generation stopped)*`
                : '*(Generation stopped)*',
              isStreaming: false,
            };
            return updated;
          });
        } else {
          const errorMessage = err.message || 'Failed to get response from server.';
          setError(errorMessage);
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const lastIndex = prev.length - 1;
            const lastMsg = prev[lastIndex];
            const updated = [...prev];
            updated[lastIndex] = {
              ...lastMsg,
              content: lastMsg.content
                ? `${lastMsg.content}\n\n⚠️ **Error:** ${errorMessage}`
                : `⚠️ **Error:** ${errorMessage}`,
              isStreaming: false,
              isError: true,
            };
            return updated;
          });
        }
      } finally {
        isStreamingRef.current = false;
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    []
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
