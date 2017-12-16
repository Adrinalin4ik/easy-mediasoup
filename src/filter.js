export function filter([ head, ...tail ], fn) {
  const newHead = fn(head) ? [ head ] : [];
  return tail.length ? [ ...newHead, ...(filter(tail, fn)) ] : newHead;
}
