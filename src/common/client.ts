import { Browser, Page, Puppeteer, PuppeteerNode } from 'puppeteer'
import puppeteer, { PuppeteerExtra } from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

interface ClientOptions {
  headless: boolean
  defaultViewport: null | {
    width: number
    height: number
  }
}

class Client {
  private client: Browser
  private page: Page

  async initialize(options: ClientOptions): Promise<void> {
    puppeteer.use(StealthPlugin())
    this.client = await puppeteer.launch(options)
    this.page = await this.client.newPage()
  }

  async goto(url: string, options?: { waitFor?: string }): Promise<void> {
    await this.page.goto(url)
  }
}
