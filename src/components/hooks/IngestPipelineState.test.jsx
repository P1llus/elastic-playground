import { create } from 'zustand';
import { describe, expect, it } from 'vitest';
import {
  pipelineErrors,
  pipelineState,
  pipelineRunResults,
  pipelineStats,
  pipelineSteps,
  pipelineSkippedSteps,
  pipelineStatsTotal,
  pipelineCopy,
  pipelineBadgePopover,
} from './IngestPipelineState';

const useIngestPipelineState = create()((...a) => ({
  ...pipelineErrors(...a),
  ...pipelineRunResults(...a),
  ...pipelineStats(...a),
  ...pipelineSteps(...a),
  ...pipelineSkippedSteps(...a),
  ...pipelineStatsTotal(...a),
  ...pipelineState(...a),
  ...pipelineCopy(...a),
  ...pipelineBadgePopover(...a),
}));

const pipelineItem1 = {
  key: 'tag1',
  newProcessor: 'append',
  content: { test: 'testvalue' },
  status: 'success',
  error: '',
  duration: 200,
  percentage: 0,
};

const pipelineItem2 = {
  key: 'tag2',
  newProcessor: 'remove',
  content: { test: 'testvalue' },
  status: 'error',
  error: '',
  duration: 100,
  percentage: 0,
};

describe('IngestPipelineState Tests', () => {
  describe('Testing each state', () => {
    it('Errors', async () => {
      let pipelineErrors = {};
      pipelineErrors['tag1'] = [];
      pipelineErrors['tag1'].push('test');
      expect(useIngestPipelineState.getState().errors).toEqual({});
      useIngestPipelineState.getState().setPipelineErrors(pipelineErrors);
      expect(useIngestPipelineState.getState().errors).toEqual(pipelineErrors);
    });
    describe('PipelineState', () => {
      it('SetIngestPipelineState', async () => {
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([]);
        useIngestPipelineState.getState().setIngestPipelineState([pipelineItem1]);
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([pipelineItem1]);
      });
      it('AddPipelineItem', async () => {
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([]);
        useIngestPipelineState.getState().addPipelineItem(pipelineItem1);
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([pipelineItem1]);
      });
      it('UpdatePipelineItem', async () => {
        const newContent = { test: 'newtestvalue' };
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([]);
        useIngestPipelineState.getState().addPipelineItem(pipelineItem1);
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([pipelineItem1]);
        useIngestPipelineState.getState().updatePipelineItem('tag1', newContent, 'append');
        expect(useIngestPipelineState.getState().ingestPipeline[0].content).toEqual(newContent);
      });
      it('ReorderPipelineItems', async () => {
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([]);
        useIngestPipelineState.getState().addPipelineItem(pipelineItem1);
        useIngestPipelineState.getState().addPipelineItem(pipelineItem2);
        expect(useIngestPipelineState.getState().ingestPipeline).toHaveLength(2);
        useIngestPipelineState.getState().reorderPipelineItems(0, 1);
        expect(useIngestPipelineState.getState().ingestPipeline[0].key).toEqual('tag2');
      });
      it('RemovePipelineItem', async () => {
        expect(useIngestPipelineState.getState().ingestPipeline).toEqual([]);
        useIngestPipelineState.getState().addPipelineItem(pipelineItem1);
        useIngestPipelineState.getState().addPipelineItem(pipelineItem2);
        expect(useIngestPipelineState.getState().ingestPipeline).toHaveLength(2);
        useIngestPipelineState.getState().removePipelineItem(0);
        expect(useIngestPipelineState.getState().ingestPipeline).toHaveLength(1);
      });
    });
    describe('PipelineRunResults', () => {
      it('SetPipelineRunResults', async () => {
        const results = { test: 'test' };
        expect(useIngestPipelineState.getState().pipelineRunResults).toEqual(null);
        useIngestPipelineState.getState().setPipelineRunResults(results);
        expect(useIngestPipelineState.getState().pipelineRunResults).toEqual(results);
      });
    });
    describe('PipelineStats', () => {
      it('setPipelineStats', async () => {
        let stats = {};
        const successStats = {
          status: 'success',
          duration: 100,
        };
        stats['tag1'] = [];
        stats['tag1'].push(successStats);
        expect(useIngestPipelineState.getState().pipelineStats).toEqual({});
        useIngestPipelineState.getState().setPipelineStats(stats);
        expect(useIngestPipelineState.getState().pipelineStats).toEqual(stats);
      });
    });
    describe('PipelineSteps', () => {
      it('SetPipelineSteps', async () => {
        let steps = {};
        const doc = { test: 'test' };
        steps['tag1'] = [];
        steps['tag1'].push(doc);
        expect(useIngestPipelineState.getState().pipelineSteps).toEqual({});
        useIngestPipelineState.getState().setPipelineSteps(steps);
        expect(useIngestPipelineState.getState().pipelineSteps).toEqual(steps);
      });
    });
    describe('PipelineSkippedSteps', () => {
      it('SetPipelineSkippedSteps', async () => {
        let skippedSteps = {};
        const doc = { test: 'test' };
        skippedSteps['tag1'] = [];
        skippedSteps['tag1'].push(doc);
        expect(useIngestPipelineState.getState().pipelineSkippedSteps).toEqual({});
        useIngestPipelineState.getState().setPipelineSkippedSteps(skippedSteps);
        expect(useIngestPipelineState.getState().pipelineSkippedSteps).toEqual(skippedSteps);
      });
    });
    describe('PipelineStatsTotal', () => {
      it('SetPipelineStatsTotalSuccessCount', async () => {
        const sCount = 1;
        expect(useIngestPipelineState.getState().successCount).toEqual(0);
        useIngestPipelineState.getState().setPipelineStatsTotalSuccessCount(sCount);
        expect(useIngestPipelineState.getState().successCount).toEqual(sCount);
      });
      it('SetPipelineStatsTotalErrorCount', async () => {
        const eCount = 1;
        expect(useIngestPipelineState.getState().errorCount).toEqual(0);
        useIngestPipelineState.getState().setPipelineStatsTotalErrorCount(eCount);
        expect(useIngestPipelineState.getState().errorCount).toEqual(eCount);
      });
      it('SetPipelineStatsTotalDuration', async () => {
        const dur = 10;
        expect(useIngestPipelineState.getState().totalDuration).toEqual(0);
        useIngestPipelineState.getState().setPipelineStatsTotalDuration(dur);
        expect(useIngestPipelineState.getState().totalDuration).toEqual(dur);
      });
      it('SetPipelineStatsTotalErrorDocIndices', async () => {
        const eDocIndicies = [2];
        expect(useIngestPipelineState.getState().errorDocIndices).toEqual([]);
        useIngestPipelineState.getState().setPipelineStatsTotalErrorDocIndices(eDocIndicies);
        expect(useIngestPipelineState.getState().errorDocIndices).toEqual(eDocIndicies);
      });
    });
    describe('PipelineCopy', () => {
      it('CopyPipeline', async () => {
        const pipeline = { test: 'test' };
        expect(useIngestPipelineState.getState().copyPipeline).toEqual(null);
        useIngestPipelineState.getState().setCopyPipeline(pipeline);
        expect(useIngestPipelineState.getState().copyPipeline).toEqual(pipeline);
      });
      it('IsTextCopied', async () => {
        expect(useIngestPipelineState.getState().isTextCopied).toEqual(false);
        useIngestPipelineState.getState().setIsTextCopied(true);
        expect(useIngestPipelineState.getState().isTextCopied).toEqual(true);
      });
    });
    describe('PipelineCopy', () => {
      it('ToggleBadgePopover', async () => {
        const identifier = 'test';
        expect(useIngestPipelineState.getState().isBadgePopoverOpen).toEqual({});
        useIngestPipelineState.getState().toggleBadgePopover(identifier);
        expect(useIngestPipelineState.getState().isBadgePopoverOpen[identifier]).toEqual(true);
      });
      it('CloseBadgePopover', async () => {
        const identifier = 'test';
        expect(useIngestPipelineState.getState().isBadgePopoverOpen).toEqual({});
        useIngestPipelineState.getState().closeBadgePopover(identifier);
        expect(useIngestPipelineState.getState().isBadgePopoverOpen[identifier]).toEqual(false);
      });
    });
  });
});
