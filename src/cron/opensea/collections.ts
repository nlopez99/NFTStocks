import axios from 'axios'
import { Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { batchPromises } from '../../common/helpers'

const BASE_URL = `https://opensea.io/assets`

// const fetchUrl = async (url: string): Promise<string> => {
//   const response = await axios.get(url as string)
//   console.log(response.data)
//   return response.data
// }

// export const getCollections = async (): Promise<unknown[]> => {
//   let limit = 100
//   let offset = 0

//   const urls = []

//   for (let i = 0; i < 50; i++) {
//     urls.push(`${BASE_URL}?offset=${offset}&limit=${limit}&autoparse=true`)
//     offset += 100
//     limit += 100
//   }

//   const results = await batchPromises(
//     urls,
//     async (url) => await fetchUrl(url),
//     {
//       size: 25,
//       delay: 30000,
//     }
//   )
//   return results
// }

const getCollections = async (): Promise<void> => {
  puppeteer.use(StealthPlugin())

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()
  await page.goto(BASE_URL, {
    waitUntil: 'networkidle2',
  })
  await page.setViewport({
    width: 1200,
    height: 800,
  })

  await autoScroll(page)

  // await browser.close()
}

const autoScroll = async (page: Page): Promise<void> => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0
      const distance = 100
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve(undefined)
        }
      }, 100)
    })
  })
}

getCollections()
