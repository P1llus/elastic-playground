import { beforeEach, describe, expect, it } from 'vitest';
import { useGlobalState } from '../hooks/GlobalState';
import { waitFor, render, screen } from '@testing-library/react';
import Results from './Results';

const docExample = {
  docs: [
    {
      processor_results: [
        {
          processor_type: 'append',
          tag: 'tag1',
          status: 'success',
          doc: {
            _index: 'index',
            _id: 'id',
            _version: '-3',
            _source: {
              field2: '_value1',
              parentfield: { childfield: '_value1' },
              message: 'ecsmessage',
              foo: 'bar',
            },
            _ingest: {
              duration: 12,
              pipeline: '_simulate_pipeline',
              timestamp: '2020-07-30T01:21:24.251836Z',
            },
          },
        },
        {
          processor_type: 'remove',
          tag: 'tag2',
          status: 'success',
          doc: {
            _index: 'index',
            _id: 'id',
            _version: '-3',
            _source: {
              field3: '_value3',
              field2: '_value2',
              message: 'ecsmessage',
              foo: 'bar',
            },
            _ingest: {
              pipeline: '_simulate_pipeline',
              duration: 50,
              timestamp: '2020-07-30T01:21:24.251836Z',
            },
          },
        },
      ],
    },
    {
      processor_results: [
        {
          processor_type: 'append',
          tag: 'tag1',
          status: 'success',
          doc: {
            _index: 'index',
            _id: 'id',
            _version: '-3',
            _source: {
              field2: '_value2',
              foo: 'rab',
            },
            _ingest: {
              pipeline: '_simulate_pipeline',
              duration: 200,
              timestamp: '2020-07-30T01:21:24.251863Z',
            },
          },
        },
        {
          processor_type: 'remove',
          tag: 'tag2',
          status: 'success',
          doc: {
            _index: 'index',
            _id: 'id',
            _version: '-3',
            _source: {
              field3: '_value3',
              field2: '_value2',
              foo: 'rab',
            },
            _ingest: {
              pipeline: '_simulate_pipeline',
              duration: 150,
              timestamp: '2020-07-30T01:21:24.251863Z',
            },
          },
        },
        {
          processor_type: 'remove',
          tag: 'tag3',
          status: 'error',
          doc: {
            _index: 'index',
            _id: 'id',
            _version: '-3',
            _source: {
              field3: '_value3',
              field2: '_value2',
              foo: 'rab',
            },
            _ingest: {
              pipeline: '_simulate_pipeline',
              duration: 150,
              timestamp: '2020-07-30T01:21:24.251863Z',
            },
          },
        },
        {
          processor_type: 'remove',
          tag: 'tag4',
          status: 'skipped',
          doc: {
            _index: 'index',
            _id: 'id',
            _version: '-3',
            _source: {
              field3: '_value3',
              field2: '_value2',
              foo: 'rab',
            },
            _ingest: {
              pipeline: '_simulate_pipeline',
              duration: 150,
              timestamp: '2020-07-30T01:21:24.251863Z',
            },
          },
        },
      ],
    },
  ],
};

describe('Results Tests', () => {
  beforeEach(() => {
    useGlobalState.getState().setIngestPipelineState([]);
    useGlobalState.getState().setPipelineRunResults([]);
  });
  describe('Rendering', () => {
    it('with results', async () => {
      useGlobalState.getState().setPipelineRunResults([docExample]);
      await waitFor(() => {
        useGlobalState.getState().pipelineRunResults.length === 2;
      });
      render(<Results />);
      expect(screen.getAllByText(/^Output Results - Document:/i).length).toBe(1);
      expect(screen.getAllByText('"processor_type"').length).toBe(6);
    });
    it('without results', async () => {
      render(<Results />);
      expect(screen.getAllByText('No results available.').length).toBe(1);
    });
    it('with error results', async () => {
      useGlobalState.getState().setPipelineRunResults([docExample]);
      useGlobalState.getState().setPipelineStatsTotalErrorDocIndices([0]);
      render(<Results />);
      expect(screen.getAllByText('Document: 1 - State before Error').length).toBe(1);
    });
  });
});
