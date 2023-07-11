import { beforeEach, describe, it, expect } from 'vitest';
import { useGlobalState } from '../hooks/GlobalState';
import userEvent from '@testing-library/user-event';
import { waitFor, render, screen } from '@testing-library/react';
import EcsTable from './EcsTable';

const docExample = [
  {
    field2: '_value1',
    parentfield: { childfield: '_value1' },
    message: 'ecsmessage',
    foo: 'bar',
  },
  {
    field2: '_value1',
    parentfield: { childfield: '_value1' },
    tag: 'ecsmessage',
    foo: 'bar',
  },
];

describe('EcsTable Tests', () => {
  beforeEach(() => {
    useGlobalState.getState().setPipelineRunResults(docExample);
  });
  describe('Rendering', () => {
    it('with ECS fields', async () => {
      await waitFor(() => {
        useGlobalState.getState().pipelineRunResults.length === 2;
      });
      render(<EcsTable />);
      expect(screen.getAllByText('message').length).toBe(1);
      expect(screen.getAllByText('Yes').length).toBe(1);
      expect(screen.getAllByText('No').length).toBe(4);
    });
    it('check columns exists', async () => {
      await waitFor(() => {
        useGlobalState.getState().pipelineRunResults.length === 2;
      });
      render(<EcsTable />);
      expect(screen.getAllByText('Field').length).toBe(6);
      expect(screen.getAllByText('Is ECS?').length).toBe(6);
      expect(screen.getAllByText('Documentation').length).toBe(6);
    });
    it('without results', async () => {
      await useGlobalState.getState().setPipelineRunResults([]);
      await waitFor(() => {
        useGlobalState.getState().pipelineRunResults.length === 0;
      });
      render(<EcsTable />);
      expect(screen.getAllByText('No items found').length).toBe(1);
    });
  });
  describe('User Interaction', () => {
    it('Click popover', async () => {
      await waitFor(() => {
        useGlobalState.getState().pipelineRunResults.length === 2;
      });
      render(<EcsTable />);
      const popup = screen.getAllByRole('button', { name: 'View Documentation' });
      await userEvent.click(popup[0]);

      expect(useGlobalState.getState().ecsTablePopover).toBeDefined();
    });
  });
});
