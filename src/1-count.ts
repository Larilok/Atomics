import { Worker } from 'worker_threads'

const THREADS_COUNT = 7
const ELEMENTS_COUNT = 100500
const UPPER_BOUND = 340000

const partPerThread = Math.ceil(ELEMENTS_COUNT/ THREADS_COUNT)
const atomicBuffer = new SharedArrayBuffer(4)
const regularBuffer = new SharedArrayBuffer(4)
const atomicCount = new Int32Array(atomicBuffer)
const regularCount = new Int32Array(regularBuffer)
const data = Array.from({ length:ELEMENTS_COUNT }, () => Math.floor(Math.random() * UPPER_BOUND))

const workers:Worker[] = []
for (let i = 0; i < THREADS_COUNT; i++) {
  workers[i] = new Worker('./src/1-worker.js', {
    workerData: {
        array: data.slice(partPerThread * i, partPerThread * (i + 1)),
        atomicBuffer: atomicBuffer,
        regularBuffer: regularBuffer
    }
  })
}
Promise.all(workers.map(worker => new Promise(res => worker.on('exit', res))))
  .then(() => {
    console.log(`Atomic count: ${atomicCount[0]}`)
    console.log(`Regular count: ${regularCount[0]}`)
  })
