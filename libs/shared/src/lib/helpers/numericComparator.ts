export function numericComparator(a, b) {
  const valA = parseInt(a, 10);
  const valB = parseInt(b, 10);

  if (valA === valB) return 0;

  return valA > valB ? 1 : -1;
}
