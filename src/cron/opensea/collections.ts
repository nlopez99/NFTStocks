import axios from 'axios'
import { batchPromises } from '../../common/helpers'

const BASE_URL = `https://api.opensea.io/api/v1/collections`

const fetchUrl = async (url: string): Promise<string> => {
  const response = await axios.get(url as string)
  console.log(response.data)
  return response.data
}

export const getCollections = async (): Promise<unknown[]> => {
  let limit = 100
  let offset = 0

  const urls = []

  for (let i = 0; i < 50; i++) {
    urls.push(`${BASE_URL}?offset=${offset}&limit=${limit}&autoparse=true`)
    offset += 100
    limit += 100
  }

  const results = await batchPromises(
    urls,
    async (url) => await fetchUrl(url),
    {
      size: 25,
      delay: 30000,
    }
  )
  return results
}
