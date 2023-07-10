import { beforeEach, describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import ProcessorPanel from './ProcessorPanel';

let stats = {};
const successStats = {
  status: 'success',
  duration: 100,
};
stats['tag1'] = [];
stats['tag1'].push(successStats);

const errorStats = {
  status: 'error',
  duration: 150,
};
stats['tag2'] = [];
stats['tag2'].push(errorStats);

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
});

describe('ProcessorPanel Tests', () => {
  describe('Rendering', () => {
    it('Processor objects', async () => {
      render(<ProcessorPanel name="append" tag="tag1" idx={0} />);
      render(<ProcessorPanel name="remove" tag="tag2" idx={1} />);
      expect(screen.getByText('remove')).toBeInTheDocument();
      expect(screen.getByText('append')).toBeInTheDocument();
      await expect(useGlobalState.getState().ingestPipeline.length).toEqual(3);
    });
    it('Processor badges', async () => {
      render(<ProcessorPanel name="append" tag="tag1" idx={0} />);
      expect(screen.getByLabelText('Duration')).toBeInTheDocument();
      expect(screen.getByLabelText('Error')).toBeInTheDocument();
      expect(screen.getByLabelText('Success')).toBeInTheDocument();
      expect(screen.getByLabelText('Skipped')).toBeInTheDocument();
      await expect(useGlobalState.getState().ingestPipeline.length).toEqual(3);
    });
    it('Panel Colors', async () => {
      render(<ProcessorPanel name="append" tag="tag1" idx={0} />);
      render(<ProcessorPanel name="remove" tag="tag2" idx={1} />);
      render(<ProcessorPanel name="remove" tag="tag3" idx={2} />);
      const panels = screen.getAllByLabelText('processor-panel');
      expect(panels[0]).toHaveClass('euiPanel--success');
      expect(panels[1]).toHaveClass('euiPanel--danger');
      expect(panels[2]).toHaveClass('euiPanel--primary');
    });
  });
  describe('User Interactions', () => {
    it('Click Remove button', async () => {
      render(<ProcessorPanel name="append" tag="tag1" idx={0} />);
      render(<ProcessorPanel name="remove" tag="tag2" idx={1} />);
      expect(screen.getByText('remove')).toBeInTheDocument();
      expect(screen.getByText('append')).toBeInTheDocument();
      await expect(useGlobalState.getState().ingestPipeline.length).toEqual(3);
      const input = screen.getByLabelText('remove-1');
      fireEvent.click(input);
      await expect(useGlobalState.getState().ingestPipeline.length).toEqual(2);
    });
  });
});
