import { euiDragDropReorder } from "@elastic/eui";
export const pipelineErrors = (set) => ({
  errors: {},
  setPipelineErrors: (newErrors) => set({ errors: newErrors }),
});

export const pipelineState = (set) => ({
  ingestPipeline: [],
  setIngestPipelineState: (items) => set(() => ({ ingestPipeline: items })),
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
  reorderPipelineItems: (sourceIndex, destinationIndex) =>
    set((state) => {
      const reorderedList = euiDragDropReorder(
        state.ingestPipeline,
        sourceIndex,
        destinationIndex
      );
      return { ingestPipeline: reorderedList };
    }),
  removePipelineItem: (index) =>
    set((state) => {
      const currentList = [...state.ingestPipeline];
      currentList.splice(index, 1);
      return { ingestPipeline: currentList };
    }),
});

export const pipelineRunResults = (set) => ({
  pipelineRunResults: null,
  setPipelineRunResults: (results) => set({ pipelineRunResults: results }),
});

export const pipelineStats = (set) => ({
  pipelineStats: {},
  setPipelineStats: (newStats) => set({ pipelineStats: newStats }),
});

export const pipelineSteps = (set) => ({
  pipelineSteps: {},
  setPipelineSteps: (newSteps) => set({ pipelineSteps: newSteps }),
});

export const pipelineSkippedSteps = (set) => ({
  pipelineSkippedSteps: {},
  setPipelineSkippedSteps: (newSkippedSteps) =>
    set({ pipelineSkippedSteps: newSkippedSteps }),
});

export const pipelineStatsTotal = (set) => ({
  totalDuration: 0,
  successCount: 0,
  errorCount: 0,
  errorDocIndices: [],
  setPipelineStatsTotalSuccessCount: (value) => set({ successCount: value }),
  setPipelineStatsTotalErrorCount: (value) => set({ errorCount: value }),
  setPipelineStatsTotalDuration: (value) => set({ totalDuration: value }),
  setPipelineStatsTotalErrorDocIndices: (indices) =>
    set({ errorDocIndices: indices }),
});
