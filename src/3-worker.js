const worker = require('worker_threads')
const {
  workerData: { array, atomicBuffer, regularBuffer }
} = worker

const atomicXOR = new Int32Array(atomicBuffer)
const regularXOR = new Int32Array(regularBuffer)

array.forEach(el => {
  Atomics.xor(atomicXOR, 0, el);
  regularXOR[0] ^= el;
})