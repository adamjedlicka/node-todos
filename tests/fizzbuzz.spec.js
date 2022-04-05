import test from 'ava'
import { fizzbuzz } from '../src/fizzbuzz.js'

test('when calling fizzbuzz it doesnt crash', (t) => {
  fizzbuzz()
  t.pass()
})

test('it returns 1 with input of 1', (t) => {
  t.is(fizzbuzz(1), 1)
})

test('it returns 2 with input of 2', (t) => {
  t.is(fizzbuzz(2), 2)
})

test('it returns fizz with input of 3', (t) => {
  t.is(fizzbuzz(3), 'fizz')
})

test('it returns buzz with input of 5', (t) => {
  t.is(fizzbuzz(5), 'buzz')
})

test('it returns fizz with input of 6', (t) => {
  t.is(fizzbuzz(6), 'fizz')
})

test('it returns buzz with input of 10', (t) => {
  t.is(fizzbuzz(10), 'buzz')
})

test('it returns fizzbuzz with input of 15', (t) => {
  t.is(fizzbuzz(15), 'fizzbuzz')
})

test('it returns fizzbuzz with input of 30', (t) => {
  t.is(fizzbuzz(30), 'fizzbuzz')
})
