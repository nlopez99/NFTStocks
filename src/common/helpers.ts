const batchPromises = async (
  entries: unknown[],
  handler: (entry: any) => any,
  { size = 25, delay = 0 }
) => {
  let batch = []
  let results: unknown[] = []
  for (const entry of entries) {
    if (batch.length >= size) {
      const batchResults = await Promise.allSettled(batch)
      if (delay > 0) await sleep(delay)
      results = results.concat(batchResults)
      batch = []
    }
    batch.push(handler(entry))
  }
  const lastBatchResults = await Promise.allSettled(batch)

  results = results.concat(lastBatchResults)
  return results
}

const sleep = async (ms: number): Promise<void> => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export { batchPromises, sleep }
