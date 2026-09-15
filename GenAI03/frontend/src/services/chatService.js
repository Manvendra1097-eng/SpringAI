/**
 * Service to handle streaming chat communication with Spring AI backend.
 */
export async function streamChatResponse({ message, onChunk, signal }) {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
    },
    body: message,
    signal,
  });

  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
    } catch {
      // Ignore text extraction error
    }
    throw new Error(
      errorText || `Server responded with status ${response.status} (${response.statusText})`
    );
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported by this browser or empty response body.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        onChunk(chunk);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
