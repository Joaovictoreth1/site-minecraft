import { describe, expect, it } from 'vitest';
import { formatGameError } from '../src/startup.js';

describe('formatGameError', () => {
  it('includes the available source line', () => {
    expect(formatGameError('Falha inesperada', 23)).toBe(
      '\n[ERRO] Falha inesperada (Linha 23)',
    );
  });

  it('omits an unavailable line and preserves the message as text', () => {
    expect(formatGameError('<b>Falha</b>', 0)).toBe('\n[ERRO] <b>Falha</b>');
  });
});
