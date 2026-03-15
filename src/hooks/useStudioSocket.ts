/**
 * WebSocket hook for Crafting Studio collaboration.
 * Connects to Socket.io, joins design room, syncs updates.
 */

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

export function useStudioSocket(designId: string | null, onDesignUpdated?: (delta: unknown) => void) {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const roomId = designId || `studio-${Date.now()}`;
    const socket = io(SOCKET_URL, { path: '/socket.io', transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('studio:join', roomId);
    });

    if (onDesignUpdated) {
      socket.on('design:updated', onDesignUpdated);
    }

    return () => {
      socket.emit('studio:leave', roomId);
      if (onDesignUpdated) socket.off('design:updated');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [designId, onDesignUpdated]);

  const emitUpdate = (delta: unknown) => {
    const roomId = designId || `studio-${Date.now()}`;
    socketRef.current?.emit('studio:update', roomId, delta);
  };

  return { emitUpdate };
}
