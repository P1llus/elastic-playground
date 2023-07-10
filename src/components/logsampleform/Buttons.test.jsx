import { beforeEach, beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import { calculateTokenCount, openAIRequest } from '../helpers/Helpers';
import Buttons from './Buttons';

vi.mock('../helpers/Helpers', async () => {
  const actual = await vi.importActual('../helpers/Helpers');
  return {
    ...actual,
    openAIRequest: vi.fn(),
    calculateTokenCount: vi.fn(),
  };
});

beforeAll(() => {
  vi.useFakeTimers();
});

beforeEach(() => {
  vi.resetAllMocks();
  useGlobalState.setState({ samples: [], tokenCount: 0 });
  render(<Buttons />);
});

afterAll(() => {
  vi.useRealTimers();
});

describe('Buttons Tests', () => {
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
      expect(useGlobalState.getState().samples.length).toBe(0);
      const input = screen.getByLabelText('Add Log Sample');
      await fireEvent.click(input);
      expect(useGlobalState.getState().samples.length).toBe(1);
    });
    it('Click Remove button', async () => {
      useGlobalState.setState({ samples: ['test1', 'test2'] });
      expect(useGlobalState.getState().samples.length).toBe(2);
      const input = screen.getByLabelText('Remove Log Sample');
      await fireEvent.click(input);
      expect(useGlobalState.getState().samples.length).toBe(1);
    });
    it('Click ChatGPT button', async () => {
      expect(useGlobalState.getState().isLoadingGPT).toBe(false);
      const input = screen.getByLabelText('Analyze with ChatGPT');
      await fireEvent.click(input);
      expect(openAIRequest).toHaveBeenCalledTimes(1);
      expect(useGlobalState.getState().isLoadingGPT).toBe(false);
    });
    it('Buttons UseEffect With Sample', async () => {
      calculateTokenCount.mockReturnValue(10);
      const input = screen.getByLabelText('Add Log Sample');
      await fireEvent.click(input);

      vi.runAllTimers();
      expect(calculateTokenCount).toHaveBeenCalledTimes(1);
      expect(useGlobalState.getState().samples).toHaveLength(1);
      expect(useGlobalState.getState().tokenCount).toBe(10);
    });
    it('Buttons UseEffect No Sample', async () => {
      calculateTokenCount.mockReturnValue(10);
      const input = screen.getByLabelText('Remove Log Sample');
      await fireEvent.click(input);

      vi.runAllTimers();
      expect(calculateTokenCount).toHaveBeenCalledTimes(0);
      expect(useGlobalState.getState().samples).toHaveLength(0);
      expect(useGlobalState.getState().tokenCount).toBe(0);
    });
  });
});
