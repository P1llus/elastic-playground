import { calculateTokenCount, runPipeline, extractFields, extractPipeline } from './Helpers';
import { beforeAll, beforeEach, afterEach, afterAll, describe, expect, it } from 'vitest';
import { useGlobalState } from '../hooks/GlobalState';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { waitFor } from '@testing-library/react';

const normalDoc = {
  docs: [
    {
      doc: {
        _id: 'id',
        _index: 'index',
        _version: '-3',
        _source: {
          field: '_value1',
          parentfield: { childfield: '_value1' },
          message: 'ecsmessage',
          foo: 'bar',
        },
        _ingest: {
          timestamp: '2017-05-04T22:30:03.187Z',
        },
      },
    },
    {
      doc: {
        _id: 'id',
        _index: 'index',
        _version: '-3',
        _source: {
          field: '_value2',
          message: 'ecsmessage',
          foo: 'rab',
        },
        _ingest: {
          timestamp: '2017-05-04T22:30:03.188Z',
        },
      },
    },
  ],
};

const verboseDoc = {
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

const pipelineItem1 = {
  key: 'tag1',
  newProcessor: 'append',
  content: { append: { test: 'testvalue' } },
  status: 'success',
  error: '',
  duration: 200,
  percentage: 0,
};
const pipelineItem2 = {
  key: 'tag2',
  newProcessor: 'remove',
  content: { remove: { test: 'testvalue' } },
  status: 'error',
  error: '',
  duration: 100,
  percentage: 0,
};

const restHandlers = [
  rest.post('http://localhost:9200/_ingest/pipeline/_simulate', (req, res, ctx) => {
    const verbose = req.url.searchParams.get('verbose');
    if (verbose) {
      return res(ctx.status(200), ctx.json(verboseDoc));
    }
    return res(ctx.status(200), ctx.json(normalDoc));
  }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('Helpers Tests', () => {
  beforeEach(() => {
    useGlobalState.getState().setIngestPipelineState([]);
  });
  describe('Token Count', () => {
    it('Calculate Token Count', async () => {
      const tokenCount = calculateTokenCount(['test']);
      expect(tokenCount).toEqual(1200);
    });
  });
  describe('Simulate API', () => {
    it('Checking verbose responses', async () => {
      useGlobalState.getState().addPipelineItem(pipelineItem1);
      useGlobalState.getState().addPipelineItem(pipelineItem2);
      await runPipeline(useGlobalState.getState().ingestPipeline, ['test']);
      await waitFor(() => {
        useGlobalState.getState().ingestPipeline.length === 2;
      });

      expect(useGlobalState.getState().pipelineStats['tag1'][0].duration).toEqual(12);
      expect(useGlobalState.getState().pipelineStats['tag1'][0].status).toEqual('success');
      expect(useGlobalState.getState().pipelineStats['tag2'][1].duration).toEqual(150);
      expect(useGlobalState.getState().pipelineStats['tag2'][1].status).toEqual('success');
      expect(useGlobalState.getState().pipelineSteps['tag1']).toBeDefined();
      expect(useGlobalState.getState().pipelineSkippedSteps['tag4']).toBeDefined();
      expect(useGlobalState.getState().errors['tag3']).toBeDefined();
    });
  });
  it('Checking non verbose response', async () => {
    await useGlobalState.getState().setIngestPipelineState([]);
    await runPipeline(useGlobalState.getState().ingestPipeline, ['test']);
    await waitFor(() => {
      useGlobalState.getState().pipelineRunResults.length === 2;
    });
    expect(useGlobalState.getState().pipelineRunResults[0].field).toEqual('_value1');
    expect(useGlobalState.getState().pipelineRunResults[1].field).toEqual('_value2');
  });
  describe('ExtractFields', () => {
    it('Checking verbose responses', async () => {
      useGlobalState.getState().addPipelineItem(pipelineItem1);
      useGlobalState.getState().addPipelineItem(pipelineItem2);
      await runPipeline(useGlobalState.getState().ingestPipeline, ['test']);
      await waitFor(() => {
        useGlobalState.getState().ingestPipeline.length === 2;
      });

      const fields = extractFields(useGlobalState.getState().pipelineRunResults[0]);
      expect(fields[0].field).toEqual('field3');
      expect(fields[0].description.length).toEqual(0);
      expect(fields[2].field).toEqual('message');
      expect(fields[2].description.length).toBeGreaterThan(0);
    });

    it('Checking non verbose response', async () => {
      await useGlobalState.getState().setIngestPipelineState([]);
      await runPipeline(useGlobalState.getState().ingestPipeline, ['test']);
      await waitFor(() => {
        useGlobalState.getState().pipelineRunResults.length === 2;
      });
      const fields = extractFields(useGlobalState.getState().pipelineRunResults[0]);
      expect(fields[0].field).toEqual('field');
      expect(fields[0].description.length).toEqual(0);
      expect(fields[2].field).toEqual('message');
      expect(fields[2].description.length).toBeGreaterThan(0);
    });
  });
  describe('Extract Pipeline', () => {
    it('Success Regex extraction', async () => {
      const testString = '```' + 'testValue' + '```';
      const match = extractPipeline(testString);
      expect(match).toEqual('testValue');
    });
  });
});
