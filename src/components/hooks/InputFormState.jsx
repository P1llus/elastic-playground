export const formState = (set) => ({
  vendor: '',
  product: '',
  description: '',
  setFormState: (key, value) => set({ [key]: value }),
});
export const tokenState = (set) => ({
  tokenCount: 0,
  setTokenCount: (value) => set({ tokenCount: value }),
});

export const gptState = (set) => ({
  isLoadingGPT: false,
  setIsLoadingGPT: (value) => set({ isLoadingGPT: value }),
});

export const logSamplesState = (set) => ({
  samples: [''],
  increaseSample: () => set((state) => ({ samples: [...state.samples, ''] })),
  decreaseSample: () =>
    set((state) => {
      if (state.samples.length > 1) {
        return { samples: state.samples.slice(0, -1) };
      } else {
        return state;
      }
    }),
  setSample: (index, value) =>
    set((state) => ({
      samples: state.samples.map((s, i) => (i === index ? value : s)),
    })),
});
