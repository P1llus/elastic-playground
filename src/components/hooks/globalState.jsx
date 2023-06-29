import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { formState, logSamplesState, tokenState } from "./inputFormState";
import {
  pipelineErrors,
  pipelineRunResults,
  pipelineStats,
  pipelineSteps,
  pipelineSkippedSteps,
  pipelineStatsTotal,
  pipelineState,
} from "./IngestPipelineState";
import { otherStates } from "./otherState";

export const useGlobalState = create(
  subscribeWithSelector((...a) => ({
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
    ...otherStates(...a),
  }))
);
