import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import Samples from './Samples';
import { runPipeline } from '../helpers/Helpers';

describe('Samples Tests', () => {
  describe('Rendering', () => {
    beforeEach(() => {
      useGlobalState.setState({ samples: [''], ingestPipeline: JSON.stringify('{"result": true, "count": 42}') });
      render(<Samples />);
    });
    it('Checking Log sample has 1 entry', async () => {
      expect(screen.getByText(/Log Sample 1/i)).toBeDefined();
    });
    it('Checking Log sample does not have 2 entries', async () => {
      expect(screen.queryByText(/Log Sample 2/i)).toBeNull();
    });
  });
  describe('Test user input', () => {
    vi.mock('../helpers/Helpers', async () => {
      const actual = await vi.importActual('../helpers/Helpers');
      return {
        ...actual,
        runPipeline: vi.fn(),
      };
    });
    beforeEach(() => {
      vi.resetAllMocks();
      vi.useFakeTimers();
      render(<Samples />);
    });
    it('Set value for first entry', async () => {
      vi.runAllTimers();
      expect(runPipeline).toHaveBeenCalledTimes(1);
      const input = screen.getByLabelText('log-1');
      expect(input.value).toBe('');
      await fireEvent.change(input, { target: { value: 'test1' } });
      expect(input.value).toBe('test1');
      vi.runAllTimers();
      expect(runPipeline).toHaveBeenCalledTimes(2);
    });
    it('Add a second Log Field and set value', async () => {
      vi.runAllTimers();
      expect(runPipeline).toHaveBeenCalledTimes(1);
      const increaseSample = useGlobalState.getState().increaseSample;
      increaseSample();
      const input = screen.getByLabelText('log-2');
      expect(input.value).toBe('');
      await fireEvent.change(input, { target: { value: 'test2' } });
      expect(input.value).toBe('test2');
      vi.runAllTimers();
      expect(runPipeline).toHaveBeenCalledTimes(2);
    });
  });
  describe('Test UseEffect', () => {
    vi.mock('../helpers/Helpers', async () => {
      const actual = await vi.importActual('../helpers/Helpers');
      return {
        ...actual,
        runPipeline: vi.fn(),
      };
    });
    beforeEach(() => {
      vi.resetAllMocks();
      vi.useFakeTimers();
      useGlobalState.setState({ samples: [] });
      render(<Samples />);
    });
    it('Set value to nothing', async () => {
      let logSamples;
      vi.runAllTimers();
      expect(runPipeline).toHaveBeenCalledTimes(0);
      logSamples = useGlobalState.getState().samples;
      expect(logSamples).toHaveLength(0);

      await useGlobalState.setState({ samples: ['test3'] });
      const input = screen.getByLabelText('log-1');
      expect(input.value).toBe('test3');

      logSamples = useGlobalState.getState().samples;
      expect(logSamples).toHaveLength(1);
      vi.runAllTimers();
      expect(runPipeline).toHaveBeenCalledTimes(1);
    });
    it('Test error pipeline', async () => {
      useGlobalState.setState({ ingestPipeline: 'testtest3' });
      useGlobalState.setState({ samples: ['test3'] });

      vi.runAllTimers();
      expect(runPipeline).toHaveBeenCalledTimes(0);
    });
  });
});
