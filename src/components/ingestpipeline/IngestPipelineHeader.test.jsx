import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import IngestPipelineHeader from './IngestPipelineHeader';

describe('IngestPipelineHeader Tests', () => {
  beforeEach(() => {
    render(<IngestPipelineHeader />);
  });
  describe('Rendering', () => {
    it('Success', async () => {
      expect(screen.getByLabelText('success-text')).toBeDefined();
      expect(screen.getByLabelText('success-badge')).toBeDefined();
    });
    it('Errors', async () => {
      expect(screen.getByLabelText('errors-text')).toBeDefined();
      expect(screen.getByLabelText('errors-badge')).toBeDefined();
    });
    it('Duration', async () => {
      expect(screen.getByLabelText('duration-text')).toBeDefined();
    });
  });
});
