// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function asyncPool(poolLimit: number, array: any[], iteratorFn: (item: any) => Promise<any>) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const ret: any[] = []
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const executing: Promise<any>[] = []

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)

    if (poolLimit <= array.length) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const e: Promise<any> = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}
