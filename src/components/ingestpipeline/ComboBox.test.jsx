import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGlobalState } from '../hooks/GlobalState';
import ComboBox from './ComboBox';

describe('ComboBox Tests', () => {
  beforeEach(() => {
    render(<ComboBox />);
  });
  describe('Rendering', () => {
    it('Processor ComboBox', async () => {
      expect(screen.getByLabelText('processor-combobox')).toBeDefined();
    });
  });
  describe('ComboBox onChange trigger', () => {
    it('Processor ComboBox Select', async () => {
      expect(useGlobalState.getState().ingestPipeline.length).toBe(0);
      const combobox = screen.getByRole('combobox');
      await fireEvent.change(combobox, {
        target: { value: 'append' },
      });
      const append = screen.getByTitle('append');
      await fireEvent.click(append);
      expect(useGlobalState.getState().ingestPipeline.length).toBe(1);
    });
  });
});
