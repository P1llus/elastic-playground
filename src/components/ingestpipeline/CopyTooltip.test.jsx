import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import CopyTooltip from './CopyTooltip';

beforeAll(() => {
  vi.useFakeTimers();
  document.execCommand = vi.fn();
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  useGlobalState.getState().setCopyPipeline('');
  useGlobalState.getState().setIngestPipelineState([]);
  render(<CopyTooltip />);
});

describe('CopyTooltip Tests', () => {
  let addPipelineItem;
  let processor = {
    key: 'test-key',
    newProcessor: 'append',
    content: { test: 'testvalue' },
    status: 'unknown',
    error: '',
    duration: 0,
    percentage: 0,
  };
  describe('Rendering', () => {
    it('Copy Button', async () => {
      expect(screen.getByLabelText('Copy Pipeline to clipboard')).toBeDefined();
    });
  });
  describe('User Interactions', () => {
    it('Copy Clipboard OnBlur Button', async () => {
      const copyButton = screen.getByLabelText('Copy Pipeline to clipboard');
      await fireEvent.click(copyButton);
      expect(useGlobalState.getState().isTextCopied).toBe(true);
      await fireEvent.focus(copyButton);
      await fireEvent.blur(copyButton);
      expect(useGlobalState.getState().isTextCopied).toBe(false);
    });
    it('Copy Clipboard Click Button', async () => {
      vi.spyOn(useGlobalState.getState(), 'setIsTextCopied');
      expect(useGlobalState.getState().isTextCopied).toBe(false);
      expect(useGlobalState.getState().setIsTextCopied).toHaveBeenCalledTimes(0);
      addPipelineItem = useGlobalState.getState().addPipelineItem;
      await addPipelineItem(processor);
      expect(useGlobalState.getState().ingestPipeline.length).toBe(1);

      const copyButton = screen.getByLabelText('Copy Pipeline to clipboard');
      await fireEvent.click(copyButton);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(useGlobalState.getState().setIsTextCopied).toHaveBeenCalledTimes(1);
      expect(useGlobalState.getState().isTextCopied).toBe(true);
      expect(useGlobalState.getState().copyPipeline.length).toBeGreaterThan(0);
    });
  });
  describe('States Copy Clipboard UseEffect', () => {
    it('Success', async () => {
      addPipelineItem = useGlobalState.getState().addPipelineItem;
      await addPipelineItem(processor);
      expect(useGlobalState.getState().ingestPipeline.length).toBe(1);
      render(<CopyTooltip />);
      expect(useGlobalState.getState().copyPipeline.length).toBeGreaterThan(0);
    });
    it('Failure', async () => {
      expect(useGlobalState.getState().copyPipeline.length).toBe(0);
      processor = {
        key: 'test-key',
        newProcessor: 'append',
        content: '{ "test: "testvalue" }',
        status: 'unknown',
        error: '',
        duration: 0,
        percentage: 0,
      };
      addPipelineItem = useGlobalState.getState().addPipelineItem;
      addPipelineItem(processor);
      render(<CopyTooltip />);
      expect(useGlobalState.getState().copyPipeline.length).toBe(0);
    });
  });
});
