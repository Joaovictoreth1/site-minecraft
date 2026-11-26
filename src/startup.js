export function formatGameError(message, line) {
  return `\n[ERRO] ${message}${line ? ` (Linha ${line})` : ''}`;
}
