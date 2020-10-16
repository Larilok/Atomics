const worker = require('worker_threads')

const {
  workerData: {
    array,
    atomicMaxBuffer,
    regularMaxBuffer,
    atomicMinBuffer,
    regularMinBuffer,
    workerIndex,
    partPerThread
  }
} = worker
// console.log(`StartingPart: ${partPerThread*workerIndex}. Length: ${array.length}`)
const atomicMax = new Int32Array(atomicMaxBuffer)
const regularMax = new Int32Array(regularMaxBuffer)
const atomicMin = new Int32Array(atomicMinBuffer)
const regularMin = new Int32Array(regularMinBuffer)
for (let i = 0; i < array.length; i++) {
  const el = array[i]
  do {
    const max = Atomics.load(atomicMax, 0)
    const index = Atomics.load(atomicMax, 1)+partPerThread*workerIndex
    if (max < el){
    // guarantees that no other write happens until the modified value is written back
      Atomics.compareExchange(atomicMax, 0, max, el)
      Atomics.compareExchange(atomicMax, 1, index, i+partPerThread*workerIndex)
    }

  } while (atomicMax[0] < el)
  if(regularMax[0] < el) {
    regularMax[0] = el
    regularMax[1] = i+partPerThread*workerIndex
  }

  do {
    const min = Atomics.load(atomicMin, 0)
    const index = Atomics.load(atomicMin, 1)+partPerThread*workerIndex
    if (min > el){
      Atomics.compareExchange(atomicMin, 0, min, el)
      Atomics.compareExchange(atomicMax, 1, index, i+partPerThread*workerIndex)
    }
  } while (atomicMin[0] > el)
  if(regularMin[0] > el) {
    regularMin[0] = el
    regularMin[1] = i+partPerThread*workerIndex
  }
  
}
// array.forEach((el) => {
//   // should do a loop, cos buffer could be modified after load op is done in another thread by value that is lower that current element or greater that current
 
// })