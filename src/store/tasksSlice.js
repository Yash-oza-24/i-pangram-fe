import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const adapter = createEntityAdapter({
  selectId: (task) => task.id,
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
});

const initialState = adapter.getInitialState({
  filters: {
    search: '',
    status: '',
    priority: '',
    assignee: '',
  },
  selectedId: null,
  syncStatus: 'idle',
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: adapter.setAll,
    upsertTask: adapter.upsertOne,
    removeTask: adapter.removeOne,
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    selectTask(state, action) {
      state.selectedId = action.payload;
    },
    clearTaskSelection(state) {
      state.selectedId = null;
    },
    applyOptimistic(state, action) {
      const { id, changes, temp } = action.payload;
      if (temp) {
        adapter.addOne(state, { ...changes, id, _optimistic: true });
        return;
      }
      const existing = state.entities[id];
      if (existing) {
        adapter.updateOne(state, { id, changes: { ...changes, _pending: true } });
      }
    },
    revertOptimistic(state, action) {
      const { id, snapshot } = action.payload;
      if (snapshot) {
        adapter.upsertOne(state, snapshot);
      } else {
        adapter.removeOne(state, id);
      }
    },
    confirmOptimistic(state, action) {
      const task = action.payload;
      adapter.upsertOne(state, { ...task, _pending: false, _optimistic: false });
    },
    setSyncStatus(state, action) {
      state.syncStatus = action.payload;
    },
  },
});

export const {
  setTasks,
  upsertTask,
  removeTask,
  setFilters,
  selectTask,
  clearTaskSelection,
  applyOptimistic,
  revertOptimistic,
  confirmOptimistic,
  setSyncStatus,
} = tasksSlice.actions;

export const tasksSelectors = adapter.getSelectors((state) => state.tasks);
export default tasksSlice.reducer;
