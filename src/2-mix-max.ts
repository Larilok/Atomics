import { Worker } from 'worker_threads'

const THREADS_COUNT = 7
const ELEMENTS_COUNT = 100500
const UPPER_BOUND = 340000

const partPerThread = Math.ceil(ELEMENTS_COUNT/ THREADS_COUNT)
const atomicMaxBuffer = new SharedArrayBuffer(8)
const regularMaxBuffer = new SharedArrayBuffer(8)
const atomicMinBuffer = new SharedArrayBuffer(8)
const regularMinBuffer = new SharedArrayBuffer(8)
const atomicMax = new Int32Array(atomicMaxBuffer)
const regularMax = new Int32Array(regularMaxBuffer)
const atomicMin = new Int32Array(atomicMinBuffer)
const regularMin = new Int32Array(regularMinBuffer)
const data = Array.from({ length:ELEMENTS_COUNT }, () => Math.floor(Math.random() * UPPER_BOUND))
atomicMax[0] = data[0]
atomicMax[1] = 0

regularMax[0] = data[0]
regularMax[1] = 0

atomicMin[0] = data[0]
atomicMin[1] = 0

regularMin[0] = data[0]
regularMin[1] = 0

const workers:Worker[] = []
for (let i = 0; i < THREADS_COUNT; i++) {
  workers[i] = new Worker('./src/2-worker.js', {
    workerData: {
        array: data.slice(partPerThread * i, partPerThread * (i + 1)),
        atomicMaxBuffer:  atomicMaxBuffer,
        regularMaxBuffer: regularMaxBuffer,
        atomicMinBuffer:  atomicMinBuffer,
        regularMinBuffer: regularMinBuffer,
        workerIndex: (i),
        partPerThread: partPerThread
    }
  })
}
Promise.all(workers.map(worker => new Promise(res => worker.on('exit', res))))
  .then(() => {
    console.log(`Atomic max: ${atomicMax[0]}, at index ${atomicMax[1]}`)
    console.log(`Regular max: ${regularMax [0]}, at index ${regularMax[1]}`)
    console.log(`Atomic min: ${atomicMin[0]}, at index ${atomicMin[1]}`)
    console.log(`Regular min: ${regularMin[0]}, at index ${regularMin[1]}`)
  })
