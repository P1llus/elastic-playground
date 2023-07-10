import { describe, expect, it } from 'vitest';
import { ECS_FIELDS } from './Ecs';

describe('ECS_FIELDS Test', () => {
  it('Ensure unchanged', async () => {
    expect(Object.keys(ECS_FIELDS).length).toBe(1644);
  });
});
