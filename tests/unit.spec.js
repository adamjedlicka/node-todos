import test from 'ava'

test('true is true', (t) => {
  t.is(true, true)
  t.assert([].length === 0, 'Prazdne pole nema delku 0')
  t.deepEqual({ a: 1 }, { a: 1 })
})
