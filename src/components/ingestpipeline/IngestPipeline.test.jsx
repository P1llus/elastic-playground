import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import IngestPipeline from './IngestPipeline';

let stats = {};
let skippedSteps = {};
let errors = {};
let pipelineSteps = {};
const successStats = {
  status: 'success',
  duration: 100,
};
stats['tag1'] = [];
stats['tag1'].push(successStats);

skippedSteps['tag1'] = [];
skippedSteps['tag1'].push(successStats);

errors['tag1'] = [];
errors['tag1'].push(successStats);

pipelineSteps['tag1'] = [];
pipelineSteps['tag1'].push(successStats);

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
const pipelineItem3 = {
  key: 'tag3',
  newProcessor: 'remove',
  content: { test: 'testvalue' },
  status: '',
  error: '',
  duration: 100,
  percentage: 0,
};

beforeEach(() => {
  useGlobalState.getState().addPipelineItem(pipelineItem1);
  useGlobalState.getState().addPipelineItem(pipelineItem2);
  useGlobalState.getState().addPipelineItem(pipelineItem3);
  useGlobalState.getState().setPipelineStats(stats);
  useGlobalState.getState().setPipelineSkippedSteps(skippedSteps);
  useGlobalState.getState().setPipelineErrors(errors);
  useGlobalState.getState().setPipelineSteps(pipelineSteps);
  render(<IngestPipeline />);
});

describe('IngestPipeline Tests', () => {
  describe('Rendering', () => {
    describe('IngestPipelineHeader', () => {
      it('Success', async () => {
        expect(screen.getByLabelText('success-text')).toBeDefined();
        expect(screen.getByLabelText('success-badge')).toBeDefined();
      });
      it('Errors', async () => {
        expect(screen.getByLabelText('errors-text')).toBeDefined();
        expect(screen.getByLabelText('errors-badge')).toBeDefined();
      });
      it('Duration', async () => {
        expect(screen.getByLabelText('duration-text')).toBeDefined();
      });
    });
    describe('ProcessorBadges', () => {
      it('All Badges', async () => {
        expect(screen.getAllByLabelText('Duration')).toHaveLength(3);
        expect(screen.getAllByLabelText('Skipped')).toHaveLength(3);
        expect(screen.getAllByLabelText('Error')).toHaveLength(3);
        expect(screen.getAllByLabelText('Success')).toHaveLength(3);
      });
    });
    describe('ProcessorPanel', () => {
      it('All Panels', async () => {
        expect(screen.getAllByText('remove')).toHaveLength(2);
        expect(screen.getAllByText('append')).toHaveLength(1);
        await expect(useGlobalState.getState().ingestPipeline.length).toEqual(3);
      });
    });
  });
});
