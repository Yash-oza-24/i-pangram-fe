import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { tasksApi } from '../api/tasks.js';
import {
  getPendingMutations,
  clearMutation,
  queueMutation,
} from '../lib/offlineDb.js';
import { confirmOptimistic, setSyncStatus } from '../store/tasksSlice.js';
import { v4 as uuid } from 'uuid';

export { queueMutation };

export function useOfflineSync(socketRef) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function flush() {
      if (!navigator.onLine) return;

      const pending = await getPendingMutations();
      if (!pending.length) return;

      dispatch(setSyncStatus('syncing'));
      const socketId = socketRef.current?.id;

      for (const item of pending) {
        try {
          const eventId = item.eventId || uuid();
          let result;

          if (item.type === 'create') {
            result = await tasksApi.create({ ...item.payload, eventId }, socketId);
          } else if (item.type === 'update') {
            result = await tasksApi.update(item.taskId, { ...item.payload, eventId }, socketId);
          } else if (item.type === 'delete') {
            result = await tasksApi.remove(item.taskId, eventId, socketId);
          }

          if (result?.task) dispatch(confirmOptimistic(result.task));
          await clearMutation(item.id);
        } catch {
          break;
        }
      }

      dispatch(setSyncStatus('idle'));
    }

    window.addEventListener('online', flush);
    flush();

    return () => window.removeEventListener('online', flush);
  }, [dispatch, socketRef]);
}
