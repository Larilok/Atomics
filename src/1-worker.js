const worker = require('worker_threads')
const condition = (x) => x < 100000

const {
  workerData: { array, atomicBuffer, regularBuffer }
} = worker
const atomicCount = new Int32Array(atomicBuffer)
const regularCount = new Int32Array(regularBuffer)
array.forEach((el) => {
  if(condition(el)) {
    Atomics.add(atomicCount, 0, 1)
    regularCount[0]++
  }
})