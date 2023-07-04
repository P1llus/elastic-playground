import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LogSampleForm from './LogSampleForm';

describe('LogSampleForm Tests', () => {
  beforeEach(() => {
    render(<LogSampleForm />);
  });
  describe('Rendering Samples', () => {
    it('Checking Log sample has 1 entry', async () => {
      expect(screen.getByText(/Log Sample 1/i)).toBeDefined();
    });
    it('Checking Log sample does not have 2 entries', async () => {
      expect(screen.queryByText(/Log Sample 2/i)).toBeNull();
    });
  });
  describe('Rendering Buttons', () => {
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
  describe('Rendering Forms', () => {
    it('Checking vendor field renders', () => {
      expect(screen.getByLabelText('vendor-input')).toBeDefined();
    });
    it('Checking description field renders', () => {
      expect(screen.getByLabelText('description-input')).toBeDefined();
    });
    it('Checking product field renders', () => {
      expect(screen.getByLabelText('product-input')).toBeDefined();
    });
  });
});
