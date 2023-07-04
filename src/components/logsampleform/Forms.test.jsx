import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Forms from './Forms';

describe('Forms Tests', () => {
  beforeEach(() => {
    render(<Forms />);
  });
  describe('Rendering', () => {
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
  describe('Test user input', () => {
    it('Set value for vendor', async () => {
      const input = screen.getByLabelText('vendor-input');
      await fireEvent.change(input, { target: { value: 'test' } });
      expect(input.value).toBe('test');
    });
    it('Set value for product', async () => {
      const input = screen.getByLabelText('product-input');
      await fireEvent.change(input, { target: { value: 'test' } });
      expect(input.value).toBe('test');
    });
    it('Set value for description', async () => {
      const input = screen.getByLabelText('description-input');
      await fireEvent.change(input, { target: { value: 'test' } });
      expect(input.value).toBe('test');
    });
  });
});
