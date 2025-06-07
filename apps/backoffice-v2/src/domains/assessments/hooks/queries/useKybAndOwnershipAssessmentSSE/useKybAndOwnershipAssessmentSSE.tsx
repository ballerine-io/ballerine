import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { env } from '@/common/env/env';
import { kybAndOwnershipAssessmentsQueryKey } from '@/domains/assessments/query-keys';
import { TKybAndOwnershipAssessment } from '@/domains/assessments/fetchers';

interface SSEMessage {
  type: 'connected' | 'assessment-update' | 'error';
  data?: TKybAndOwnershipAssessment;
  error?: string;
}

// Custom EventSource that supports headers
class EventSourceWithHeaders extends EventTarget {
  private url: string;
  private headers: Record<string, string>;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private abortController: AbortController | null = null;
  
  readyState: number = 0; // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
  
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  constructor(url: string, options?: { headers?: Record<string, string> }) {
    super();
    this.url = url;
    this.headers = options?.headers || {};
    this.connect();
  }

  private async connect() {
    try {
      this.abortController = new AbortController();
      
      const response = await fetch(this.url, {
        headers: {
          ...this.headers,
          'Accept': 'text/event-stream',
        },
        signal: this.abortController.signal,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      this.readyState = EventSourceWithHeaders.OPEN;
      this.dispatchEvent(new Event('open'));

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            const event = new MessageEvent('message', { data });
            this.dispatchEvent(event);
          }
        }
      }
    } catch (error) {
      this.readyState = EventSourceWithHeaders.CLOSED;
      const errorEvent = new Event('error');
      this.dispatchEvent(errorEvent);
    }
  }

  close() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.readyState = EventSourceWithHeaders.CLOSED;
  }

  set onopen(handler: ((event: Event) => void) | null) {
    if (handler) {
      this.addEventListener('open', handler);
    }
  }

  set onmessage(handler: ((event: MessageEvent) => void) | null) {
    if (handler) {
      this.addEventListener('message', handler);
    }
  }

  set onerror(handler: ((event: Event) => void) | null) {
    if (handler) {
      this.addEventListener('error', handler);
    }
  }
}

export const useKybAndOwnershipAssessmentSSE = (assessmentId: string | undefined) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const eventSourceRef = useRef<EventSourceWithHeaders | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const queryClient = useQueryClient();
  const { data: authenticatedUser } = useAuthenticatedUserQuery();

  const cleanupEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!assessmentId || !authenticatedUser?.accessToken) {
      return;
    }

    cleanupEventSource();

    const baseUrl = env.VITE_API_URL || '';
    const sseUrl = `${baseUrl}/api/v1/external/assessments/kyb_and_ownership/${assessmentId}/sse`;
    
    const eventSource = new EventSourceWithHeaders(sseUrl, {
      headers: {
        'Authorization': `Bearer ${authenticatedUser.accessToken}`,
      },
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log('SSE connection established for assessment:', assessmentId);
    };

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'connected':
            console.log('SSE connected successfully');
            break;
            
          case 'assessment-update':
            if (message.data) {
              // Update React Query cache with the new data
              queryClient.setQueryData(
                kybAndOwnershipAssessmentsQueryKey.findById({ id: assessmentId }).queryKey,
                message.data
              );
              setLastUpdate(new Date());
              console.log('Assessment updated via SSE:', message.data);
            }
            break;
            
          case 'error':
            console.error('SSE error:', message.error);
            setError(message.error || 'Unknown error');
            break;
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      setError('Connection lost');
      setIsConnected(false);
      cleanupEventSource();
      
      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect SSE...');
        connect();
      }, 5000);
    };
  }, [assessmentId, authenticatedUser?.accessToken, cleanupEventSource, queryClient]);

  useEffect(() => {
    connect();
    
    return () => {
      cleanupEventSource();
    };
  }, [connect]);

  return {
    isConnected,
    error,
    lastUpdate,
    reconnect: connect,
    disconnect: cleanupEventSource,
  };
};