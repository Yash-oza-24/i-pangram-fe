import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { hasSeenEvent } from '../lib/eventDedup.js';
import { upsertTask, removeTask } from '../store/tasksSlice.js';
import { addNotification } from '../store/notificationsSlice.js';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useSocket() {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    const onTaskCreated = (payload) => {
      if (hasSeenEvent(payload.eventId)) return;
      dispatch(upsertTask(payload.task));
    };

    const onTaskUpdated = (payload) => {
      if (hasSeenEvent(payload.eventId)) return;
      dispatch(upsertTask(payload.task));
    };

    const onTaskDeleted = (payload) => {
      if (hasSeenEvent(payload.eventId)) return;
      dispatch(removeTask(payload.taskId));
    };

    const onNotification = (payload) => {
      if (hasSeenEvent(payload.eventId)) return;
      dispatch(addNotification(payload.notification));
    };

    socket.on('task:created', onTaskCreated);
    socket.on('task:updated', onTaskUpdated);
    socket.on('task:deleted', onTaskDeleted);
    socket.on('notification:new', onNotification);

    socket.on('connect', () => {
      socket.emit('ping', () => {});
    });

    return () => {
      socket.off('task:created', onTaskCreated);
      socket.off('task:updated', onTaskUpdated);
      socket.off('task:deleted', onTaskDeleted);
      socket.off('notification:new', onNotification);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, dispatch]);

  return socketRef;
}
