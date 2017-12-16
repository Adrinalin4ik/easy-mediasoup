export function reduce([ head, ...tail ], fn, initial) {
  if(head === undefined && tail.length === 0) return initial;
  if(!initial) {
    const [ newHead, ...newTail] = tail;
    return reduce(newTail, fn, fn(head, newHead));
  }
  return tail.length ? reduce(tail, fn, fn(initial, head)) : [ fn(initial, head) ];
}
