export const ecsTablePopoverState = (set) => ({
  ecsTablePopover: {},

  setEcsTablePopoverState: (identifier) =>
    set((state) => ({
      ecsTablePopover: {
        ...state.ecsTablePopover,
        [identifier]: !state.ecsTablePopover[identifier],
      },
    })),
});

export const ecsTableFields = (set) => ({
  ecsFields: [],
  setEcsFields: (value) => set({ ecsFields: value }),
});
