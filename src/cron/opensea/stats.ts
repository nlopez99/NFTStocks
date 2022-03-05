import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Page } from 'puppeteer'

interface CollectionStats {
  socials: string[]
  collectionImage: string
  priceStats: string[]
  traits: string[]
  description: string
}

export const getStats = async (slug: string): Promise<CollectionStats> => {
  puppeteer.use(StealthPlugin())

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  })
  const page = await browser.newPage()
  await page.goto(`https://opensea.io/collection/${slug}`, {
    waitUntil: 'networkidle2',
  })

  const socials = await page.evaluate(() => {
    const ariaLabels = [
      'Website-link',
      'Discord-link',
      'Twitter-link',
      'Medium-link',
      'Instagram-link',
    ]

    // to make dynamic object with correct key, use for loop that tests
    // each item against its index in the ariaLabels array to check if null
    // if != null, assign item to correct key

    return ariaLabels.map((label) => {
      const linkElement = document.querySelector(`a[aria-label=${label}]`)
        ? (document.querySelector(
            `a[aria-label=${label}]`
          ) as HTMLAnchorElement)
        : null

      if (linkElement) return linkElement.href
    })
  })

  const collectionStats = await fetchStatElements(page)

  const stats: CollectionStats = {
    socials,
    ...collectionStats,
  }

  await browser.close()
  return stats
}

const fetchStatElements = async (
  page: Page
): Promise<
  Pick<
    CollectionStats,
    'collectionImage' | 'description' | 'priceStats' | 'traits'
  >
> => {
  const [collectionImage, priceStats, traits, description] = await Promise.all([
    page.evaluate(() => {
      const srcs = Array.from(document.querySelectorAll('.Image--image')).map(
        (image) => image.getAttribute('src')
      )
      return srcs[1]
    }),
    page.evaluate(() => {
      const textValues = Array.from(
        document.querySelectorAll('div[tabindex="-1"]')
      ).map((element: HTMLAnchorElement) => element.innerText)
      const stats = textValues.slice(1, 5)
      return stats
    }),
    page.evaluate(() => {
      const textValues = Array.from(
        document.querySelectorAll('.Blockreact__Block-sc-1xf18x6-0 .cICWtp')
      ).map((element: HTMLAnchorElement) => element.innerText)
      return textValues
    }),
    page.evaluate(() => {
      const descriptionElement = document.querySelector(
        '.CollectionHeader--description'
      ) as HTMLAnchorElement
      return descriptionElement.innerText
    }),
  ])

  return { collectionImage, priceStats, traits, description }
}
