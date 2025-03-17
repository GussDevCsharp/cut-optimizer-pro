
// Test setup file for Vitest
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Run cleanup after each test
afterEach(() => {
  cleanup();
});
