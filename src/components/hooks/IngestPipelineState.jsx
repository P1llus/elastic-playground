import { euiDragDropReorder } from "@elastic/eui";
export const pipelineErrors = (set) => ({
  errors: {},
  addPipelineError: (tag, error) =>
    set((state) => {
      let newState = { ...state.errors };
      if (!newState[tag]) {
        newState[tag] = [];
      }
      newState[tag].push(error);
      return { errors: newState };
    }),
});

export const pipelineState = (set) => ({
  ingestPipeline: [],
  addPipelineItem: (newItem) =>
    set((state) => ({ ingestPipeline: [...state.ingestPipeline, newItem] })),
  updatePipelineItem: (key, newContent, newProcessor) =>
    set((state) => {
      const currentList = [...state.ingestPipeline];
      const index = currentList.findIndex((item) => item.key === key);
      currentList[index] = {
        ...currentList[index],
        content: newContent,
        newProcessor: newProcessor,
      };
      return { ingestPipeline: currentList };
    }),
  reorderIngestPipelineItems: (sourceIndex, destinationIndex) =>
    set((state) => {
      const reorderedList = euiDragDropReorder(
        state.ingestPipeline,
        sourceIndex,
        destinationIndex
      );
      return { ingestPipeline: reorderedList };
    }),
});

export const pipelineRunResults = (set) => ({
  lastSuccessfulResult: null,
  setLastSuccessfulResult: (result) => set({ lastSuccessfulResult: result }),
});

export const pipelineStats = (set) => ({
  pipelineStats: {},
  addPipelineStats: (tag, stats) =>
    set((state) => {
      let newState = { ...state.pipelineStats };
      if (!newState[tag]) {
        newState[tag] = [];
      }
      newState[tag].push(stats);
      return { pipelineStats: newState };
    }),
});

export const pipelineSteps = (set) => ({
  ingestPipelineSteps: {},
  addPipelineStep: (tag, source) =>
    set((state) => {
      let newState = { ...state.ingestPipelineSteps };
      if (!newState[tag]) {
        newState[tag] = [];
      }
      newState[tag].push(source);
      return { ingestPipelineSteps: newState };
    }),
});

export const pipelineSkippedSteps = (set) => ({
  ingestPipelineSkippedSteps: {},
  addPipelineSkippedStep: (tag, skippedStep) =>
    set((state) => {
      let newState = { ...state.ingestPipelineSkippedSteps };
      if (!newState[tag]) {
        newState[tag] = [];
      }
      newState[tag].push(skippedStep);
      return { ingestPipelineSkippedSteps: newState };
    }),
});

export const pipelineStatsTotal = (set) => ({
  totalDuration: 0,
  successCount: 0,
  errorCount: 0,
  addPipelineStatsTotalSuccessCount: () =>
    set((state) => ({ successCount: state.successCount + 1 })),
  addPipelineStatsTotalErrorCount: () =>
    set((state) => ({ errorCount: state.errorCount + 1 })),
  addPipelineStatsTotalTotalDuration: (value) =>
    set((state) => ({ totalDuration: state.totalDuration + value })),
});
