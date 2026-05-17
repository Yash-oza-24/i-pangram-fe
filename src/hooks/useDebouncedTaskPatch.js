import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedTaskPatch(onUpdate, delay = 450) {
  const timerRef = useRef(null);
  const pendingRef = useRef({});

  const flush = useCallback(
    (taskId) => {
      if (!taskId) return;
      const changes = pendingRef.current;
      pendingRef.current = {};
      if (Object.keys(changes).length > 0) {
        onUpdate(taskId, changes);
      }
    },
    [onUpdate]
  );

  const patch = useCallback(
    (taskId, partial) => {
      pendingRef.current = { ...pendingRef.current, ...partial };
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => flush(taskId), delay);
    },
    [flush, delay]
  );

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return { patch, flush };
}
