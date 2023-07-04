import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import { calculateTokenCount, openAIRequest } from '../helpers/Helpers';
import Buttons from './Buttons';

let samples;
let tokenCount;
let isLoadingGPT;

vi.mock('../helpers/Helpers', async () => {
  const actual = await vi.importActual('../helpers/Helpers');
  return {
    ...actual,
    openAIRequest: vi.fn(),
    calculateTokenCount: vi.fn(),
  };
});

describe('Buttons Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    useGlobalState.setState({ samples: [], tokenCount: 0 });
    render(<Buttons />);
  });
  describe('Rendering', () => {
    it('Checking for Add Log Sample Button', async () => {
      expect(screen.getByLabelText('Add Log Sample')).toBeDefined();
    });
    it('Checking for Remove Log Sample Button', async () => {
      expect(screen.getByLabelText('Remove Log Sample')).toBeDefined();
    });
    it('Checking for ChatGPT button', async () => {
      expect(screen.getByLabelText('Analyze with ChatGPT')).toBeDefined();
    });
  });
  describe('Test user input', () => {
    it('Click Add button', async () => {
      samples = useGlobalState.getState().samples;
      expect(samples.length).toBe(0);
      const input = screen.getByLabelText('Add Log Sample');
      await fireEvent.click(input);
      samples = useGlobalState.getState().samples;
      expect(samples.length).toBe(1);
    });
    it('Click Remove button', async () => {
      useGlobalState.setState({ samples: ['test1', 'test2'] });
      samples = useGlobalState.getState().samples;
      expect(samples.length).toBe(2);
      const input = screen.getByLabelText('Remove Log Sample');
      await fireEvent.click(input);
      samples = useGlobalState.getState().samples;
      expect(samples.length).toBe(1);
    });
    it('Click ChatGPT button', async () => {
      isLoadingGPT = useGlobalState.getState().isLoadingGPT;
      expect(isLoadingGPT).toBe(false);
      const input = screen.getByLabelText('Analyze with ChatGPT');
      await fireEvent.click(input);
      expect(openAIRequest).toHaveBeenCalledTimes(1);
      isLoadingGPT = useGlobalState.getState().isLoadingGPT;
      expect(isLoadingGPT).toBe(false);
    });
    it('Buttons UseEffect With Sample', async () => {
      calculateTokenCount.mockReturnValue(10);
      const input = screen.getByLabelText('Add Log Sample');
      await fireEvent.click(input);

      samples = useGlobalState.getState().samples;
      tokenCount = useGlobalState.getState().tokenCount;

      vi.runAllTimers();
      expect(calculateTokenCount).toHaveBeenCalledTimes(1);
      expect(samples).toHaveLength(1);
      expect(tokenCount).toBe(10);
    });
    it('Buttons UseEffect No Sample', async () => {
      calculateTokenCount.mockReturnValue(10);
      const input = screen.getByLabelText('Remove Log Sample');
      await fireEvent.click(input);

      samples = useGlobalState.getState().samples;
      tokenCount = useGlobalState.getState().tokenCount;

      vi.runAllTimers();
      expect(calculateTokenCount).toHaveBeenCalledTimes(0);
      expect(samples).toHaveLength(0);
      expect(tokenCount).toBe(0);
    });
  });
});
