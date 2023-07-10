import { create } from 'zustand';
import { describe, expect, it } from 'vitest';
import { formState, logSamplesState, tokenState, gptState } from './InputFormState';

export const useInputFormState = create()((...a) => ({
  ...formState(...a),
  ...logSamplesState(...a),
  ...tokenState(...a),
  ...gptState(...a),
}));

describe('InputFormState Tests', () => {
  describe('Testing each state', () => {
    it('Vendor/Product/Description', async () => {
      expect(useInputFormState.getState().vendor).toBe('');
      expect(useInputFormState.getState().product).toBe('');
      expect(useInputFormState.getState().description).toBe('');
      useInputFormState.getState().setFormState('vendor', 'elastic');
      useInputFormState.getState().setFormState('product', 'enterprise search');
      useInputFormState.getState().setFormState('description', 'enterprise search');
      expect(useInputFormState.getState().vendor).toBe('elastic');
      expect(useInputFormState.getState().product).toBe('enterprise search');
      expect(useInputFormState.getState().description).toBe('enterprise search');
    });
    it('Token Count', async () => {
      expect(useInputFormState.getState().tokenCount).toBe(0);
      useInputFormState.getState().setTokenCount(1);
      expect(useInputFormState.getState().tokenCount).toBe(1);
    });
    it('GPT State', async () => {
      expect(useInputFormState.getState().isLoadingGPT).toBe(false);
      useInputFormState.getState().setIsLoadingGPT(true);
      expect(useInputFormState.getState().isLoadingGPT).toBe(true);
    });
    it('Log Sample State', async () => {
      expect(useInputFormState.getState().samples).toEqual(['']);
      useInputFormState.getState().increaseSample();
      expect(useInputFormState.getState().samples).toEqual(['', '']);
      useInputFormState.getState().decreaseSample();
      expect(useInputFormState.getState().samples).toEqual(['']);
      useInputFormState.getState().setSample(0, 'test');
      expect(useInputFormState.getState().samples).toEqual(['test']);
      useInputFormState.getState().addSample('test2');
      expect(useInputFormState.getState().samples).toEqual(['test', 'test2']);
    });
  });
});
