/**
 * Type definitions and reference structures for the chat streaming system.
 *
 * @typedef {Object} Message
 * @property {string} id - Unique identifier (e.g. "user-1726458000000" or "assistant-1726458000001")
 * @property {'user' | 'assistant'} role - Sender role ('user' for prompt, 'assistant' for streaming AI response)
 * @property {string} content - Markdown text content (progressively appended token chunks for assistant)
 * @property {string} timestamp - Formatted time string (e.g. "09:54 AM")
 * @property {boolean} [isStreaming] - (Assistant only) True while chunks are actively being received, false when complete or stopped
 * @property {boolean} [isError] - (Assistant only) True if an error occurred during stream generation
 *
 * @typedef {Message[]} MessageList
 */

/**
  * Example of a user prompt message object
  * @type {Message}
  */
export const USER_MESSAGE_EXAMPLE = {
  id: 'user-1726458123456',
  role: 'user',
  content: 'Explain Reactive Streams in Spring WebFlux',
  timestamp: '09:54 AM',
};

/**
  * Example of an assistant streaming message object (in-progress)
  * @type {Message}
  */
export const ASSISTANT_STREAMING_MESSAGE_EXAMPLE = {
  id: 'assistant-1726458123457',
  role: 'assistant',
  content: 'Reactive Streams provide a standard for asynchronous stream processing with non-blocking backpressure...',
  isStreaming: true,
  timestamp: '09:54 AM',
};

/**
  * Example of the full messages array state: `messages` (Message[])
  * @type {Message[]}
  */
export const MESSAGES_ARRAY_EXAMPLE = [
  {
    id: 'user-1726458123456',
    role: 'user',
    content: 'Explain Reactive Streams in Spring WebFlux',
    timestamp: '09:54 AM',
  },
  {
    id: 'assistant-1726458123457',
    role: 'assistant',
    content: 'Reactive Streams provide a standard for asynchronous stream processing with non-blocking backpressure...',
    isStreaming: false,
    timestamp: '09:54 AM',
  },
];
