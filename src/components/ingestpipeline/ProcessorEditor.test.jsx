import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import ProcessorEditor from './ProcessorEditor';

const processors = {
  key: 'test-key',
  newProcessor: 'append',
  content: { test: 'testvalue' },
  status: 'unknown',
  error: '',
  duration: 0,
  percentage: 0,
};

// TODO: Add support for monaco after its finished loading

describe('ProcessorEditor Tests', () => {
  beforeEach(() => {
    useGlobalState.getState().addPipelineItem(processors);
    render(<ProcessorEditor data={processors.content} tag="someuniquetesttag" processor={'append'} />);
  });
  describe('Rendering', () => {
    it('Editor with label', async () => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
  describe('Hooks', () => {
    it('updatePipelineItem', async () => {
      useGlobalState.getState().updatePipelineItem('someuniquetesttag', '{ "test": "testvalue" }', 'append');
      expect(useGlobalState.getState().ingestPipeline[0].content).toEqual({ test: 'testvalue' });
    });
  });
});
