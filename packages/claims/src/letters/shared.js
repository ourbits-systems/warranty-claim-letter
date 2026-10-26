// " (Google, model X)" + " (order 42)" -> " (Google, model X, order 42)"
export function mergeParens(...parts) {
  const inner = parts.filter(Boolean).map(part => part.trim().slice(1, -1))
  return inner.length ? ` (${inner.join(', ')})` : ''
}
