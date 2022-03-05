import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import express from 'express'

puppeteer.use(StealthPlugin())

async function getStats(collectionSlug) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
  })
  const page = await browser.newPage()
  await page.goto(`https://opensea.io/collection/${collectionSlug}`, {
    waitUntil: 'networkidle2',
  })

  const socials = await page.evaluate(() => {
    const links = []
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

    ariaLabels.forEach((item) => {
      if (document.querySelector(`a[aria-label=${item}]`) != null) {
        const presentLinks = document.querySelector(
          `a[aria-label=${item}]`
        ).href
        links.push(presentLinks)
      }
    })
    return links
  })

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
      ).map((element) => element.innerText)
      const stats = textValues.slice(1, 5)
      return stats
    }),
    page.evaluate(() => {
      const textValues = Array.from(
        document.querySelectorAll('.Blockreact__Block-sc-1xf18x6-0 .cICWtp')
      ).map((element) => element.innerText)
      return textValues
    }),
    page.evaluate(() => {
      const text = document.querySelector(
        '.CollectionHeader--description'
      ).innerText
      return text
    }),
  ])

  const stats = {
    socials: socials,
    collectionImage: collectionImage,
    priceStats: priceStats,
    traits: traits,
    description: description,
  }

  await browser.close()
  return statsArr
}

const app = express()

app.get('/nft-stats/:collection', async (req, res) => {
  try {
    const collectionName = req.params.collection
    const nftStats = await getStats(collectionName)

    return res.status(200).json({
      result: nftStats,
    })
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    })
  }
})

app.listen(3000, () => {
  console.log('server running on port 3000')
})
