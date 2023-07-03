import { create } from 'zustand';
import { formState, logSamplesState, tokenState, gptState } from './InputFormState';
import {
  pipelineErrors,
  pipelineState,
  pipelineRunResults,
  pipelineStats,
  pipelineSteps,
  pipelineSkippedSteps,
  pipelineStatsTotal,
} from './IngestPipelineState';

export const useGlobalState = create((...a) => ({
  ...formState(...a),
  ...logSamplesState(...a),
  ...tokenState(...a),
  ...pipelineErrors(...a),
  ...pipelineRunResults(...a),
  ...pipelineStats(...a),
  ...pipelineSteps(...a),
  ...pipelineSkippedSteps(...a),
  ...pipelineStatsTotal(...a),
  ...pipelineState(...a),
  ...gptState(...a),
}));
