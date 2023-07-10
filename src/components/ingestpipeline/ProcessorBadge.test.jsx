import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGlobalState } from '../hooks/GlobalState';
import ProcessorBadge from './ProcessorBadge';

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

beforeEach(() => {
  useGlobalState.getState().addPipelineItem(pipelineItem1);
  useGlobalState.getState().setPipelineStats(stats);
  useGlobalState.getState().setPipelineSkippedSteps(skippedSteps);
  useGlobalState.getState().setPipelineErrors(errors);
  useGlobalState.getState().setPipelineSteps(pipelineSteps);
});

describe('ProcessorBadge Tests', () => {
  describe('Rendering', () => {
    it('Badge Types', async () => {
      render(<ProcessorBadge type="duration" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="error" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="skipped" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="success" tag="tag1" idx={0} />);
      expect(screen.getByLabelText('Duration')).toBeInTheDocument();
      expect(screen.getByLabelText('Skipped')).toBeInTheDocument();
      expect(screen.getByLabelText('Error')).toBeInTheDocument();
      expect(screen.getByLabelText('Success')).toBeInTheDocument();
    });
    it('All badge numbers show counts', async () => {
      render(<ProcessorBadge type="duration" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="error" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="skipped" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="success" tag="tag1" idx={0} />);
      expect(screen.getAllByText('1')).toHaveLength(3);
    });
    it('JSON Code blocks', async () => {
      render(<ProcessorBadge type="duration" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="error" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="skipped" tag="tag1" idx={0} />);
      render(<ProcessorBadge type="success" tag="tag1" idx={0} />);
    });
  });
  describe('User Interactions', () => {
    it('Click Success/Error/Skipped Badge Popover', async () => {
      render(<ProcessorBadge type="success" tag="tag1" idx={0} />);
      const badge = screen.getByLabelText('Success');
      expect(useGlobalState.getState().isBadgePopoverOpen?.['success-0']).toBe(undefined);
      await userEvent.click(badge);
      expect(useGlobalState.getState().isBadgePopoverOpen?.['success-0']).toBe(true);
    });
    it('Click Duration Badge Popover', async () => {
      render(<ProcessorBadge type="duration" tag="tag1" idx={0} />);
      let popoverMock = vi.spyOn(useGlobalState.getState(), 'closeBadgePopover');
      const badge = screen.getByLabelText('Duration');
      expect(useGlobalState.getState().isBadgePopoverOpen?.['duration-0']).toBe(undefined);
      await userEvent.click(badge);
      expect(useGlobalState.getState().isBadgePopoverOpen?.['duration-0']).toBe(true);
      const popup = screen.getByRole('dialog');
      expect(popup).not.toBeNull();
      await userEvent.keyboard('{esc}');
      useGlobalState.getState().closeBadgePopover('duration-0');
      expect(useGlobalState.getState().isBadgePopoverOpen?.['duration-0']).toBe(false);
      await expect(screen.queryByText('Document: 1')).toBeNull();
      expect(popoverMock).toHaveBeenCalledTimes(1);
    });
  });
});
