import { useCallback } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { tasksApi } from '../api/tasks.js';
import {
  applyOptimistic,
  revertOptimistic,
  confirmOptimistic,
  removeTask,
} from '../store/tasksSlice.js';
import { queueMutation } from '../lib/offlineDb.js';

export function useTaskMutations(socketRef) {
  const dispatch = useDispatch();
  const store = useStore();

  const socketId = () => socketRef.current?.id;

  const createTask = useCallback(
    async (payload) => {
      const tempId = `temp-${uuid()}`;
      const eventId = uuid();
      const optimistic = {
        id: tempId,
        ...payload,
        status: payload.status || 'todo',
        priority: payload.priority || 'medium',
        comments: [],
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(applyOptimistic({ id: tempId, changes: optimistic, temp: true }));

      if (!navigator.onLine) {
        await queueMutation({ type: 'create', payload, eventId });
        return optimistic;
      }

      try {
        const { task } = await tasksApi.create({ ...payload, eventId }, socketId());
        dispatch(removeTask(tempId));
        dispatch(confirmOptimistic(task));
        return task;
      } catch (err) {
        dispatch(revertOptimistic({ id: tempId }));
        throw err;
      }
    },
    [dispatch, socketRef]
  );

  const updateTask = useCallback(
    async (id, changes) => {
      const eventId = uuid();
      const entity = store.getState().tasks.entities[id];
      const snapshot = entity ? { ...entity } : null;

      dispatch(applyOptimistic({ id, changes }));

      if (!navigator.onLine) {
        await queueMutation({ type: 'update', taskId: id, payload: changes, eventId });
        return;
      }

      try {
        const { task } = await tasksApi.update(id, { ...changes, eventId }, socketId());
        dispatch(confirmOptimistic(task));
        return task;
      } catch (err) {
        dispatch(revertOptimistic({ id, snapshot }));
        throw err;
      }
    },
    [dispatch, socketRef, store]
  );

  const deleteTask = useCallback(
    async (id, snapshot) => {
      const eventId = uuid();
      dispatch(removeTask(id));

      if (!navigator.onLine) {
        await queueMutation({ type: 'delete', taskId: id, eventId });
        return;
      }

      try {
        await tasksApi.remove(id, eventId, socketId());
      } catch (err) {
        if (snapshot) dispatch(confirmOptimistic(snapshot));
        throw err;
      }
    },
    [dispatch, socketRef]
  );

  const addComment = useCallback(
    async (id, body) => {
      const eventId = uuid();
      const { task } = await tasksApi.comment(id, { body, eventId }, socketId());
      dispatch(confirmOptimistic(task));
      return task;
    },
    [dispatch, socketRef]
  );

  return { createTask, updateTask, deleteTask, addComment };
}
