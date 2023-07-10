import { describe, expect, it } from 'vitest';
import { useGlobalState } from '../hooks/GlobalState';

describe('GlobalState Test', () => {
  it('Ensure global tests also work', async () => {
    let pipelineErrors = {};
    pipelineErrors['tag1'] = [];
    pipelineErrors['tag1'].push('test');
    expect(useGlobalState.getState().errors).toEqual({});
    useGlobalState.getState().setPipelineErrors(pipelineErrors);
    expect(useGlobalState.getState().errors).toEqual(pipelineErrors);
  });
});
