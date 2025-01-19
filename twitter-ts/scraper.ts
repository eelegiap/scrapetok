import { MAX_POOL_SIZE, PlaywrightCrawler, Request } from "@crawlee/playwright";
import { Page, Cookie, BrowserContext, ElementHandle } from "playwright";
import { writeFileSync, existsSync, readFileSync } from "fs";
const MIN_COLLECTION_SIZE = 30;

// const fileContent = readFileSync("../afd_accts_12-5_0.txt", "utf-8");
// const urlsToProcess = fileContent
//   .split("\n")
//   .map((line) => line.trim())
//   .filter((line) => line !== "")
//   .map((line) => `https://www.tiktok.com/@${line}`);

const IS_HEADLESS = true;
const MAX_SCROLLS = 50;
const SET_COOKIES_BOOL = true;
const SAVE_COOKIES_BOOL = false;
const COOKIE_FILE_PATH = "cookies.json";

function randBtwn(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getFilePath(filename: string, max_scrolls: number): string {
  let folder = "test";

  return `../twitter-data/${folder}/${filename}_scrolls-${max_scrolls}.json`;
}

async function scrollUsingDownKey(page: Page, scrollCount: number = 8) {
  for (let i = 0; i < scrollCount; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(randBtwn(100, 500));
  }
}

// async function filterCollectedUrls(
//   urls: string[],
//   intiialPageUrl: string
// ): Promise<string[]> {
//   return urls.filter((url) => {
//     const urlId = url.split("/").pop() || "";
//     const filePath = getFilePath(urlId, intiialPageUrl);
//     return urlId && !existsSync(filePath);
//   });
// }

function makeFileFriendlyName(link: string): string {
  const sanitized = link.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

  const noSpaces = sanitized.replace(/\s+/g, "_");

  const truncated = noSpaces.substring(0, 255);

  return truncated;
}

async function saveCookiesToJson(cookies: Cookie[], filePath: string) {
  writeFileSync(filePath, JSON.stringify(cookies, null, 2), "utf-8");
  console.log("Cookies saved to", filePath);
}

async function loadCookiesFromJson(context: BrowserContext, filePath: string) {
  if (existsSync(filePath)) {
    const cookies = JSON.parse(readFileSync(filePath, "utf-8"));
    await context.addCookies(cookies);
    console.log("Cookies loaded from", filePath);
  }
}

async function savePageHtmlToFile(page: Page, filePath: string) {
  // usage like // savePageHtmlToFile(page, "page.html");
  const html = await page.content(); // Get the full page HTML
  writeFileSync(filePath, html, "utf-8"); // Save to a file
  console.log(`Page HTML saved to ${filePath}`);
}

function parseCountString(count: string | null): number | null {
  if (!count) return null;

  // Handle K (thousands) and M (millions)
  if (count.endsWith("K")) {
    return Math.round(parseFloat(count) * 1000);
  } else if (count.endsWith("M")) {
    return Math.round(parseFloat(count) * 1000000);
  } else {
    return parseInt(count, 10);
  }
}

async function extractTweetData(element: ElementHandle) {
  // Locators relative to the provided element
  const datetimeLocator = await element.$("time[datetime]"); // Find the <time> tag with a datetime attribute
  const authorLocator = await element.$('[data-testid="User-Name"] a'); // Author nickname
  const likesLocator = await element.$('[data-testid="like"] span'); // Likes count
  const repostsLocator = await element.$('[data-testid="retweet"] span'); // Reposts count
  const commentsLocator = await element.$('[data-testid="reply"] span'); // Comments count
  const innerTextLocator = await element.$('[data-testid="tweetText"]'); // Tweet inner text
  const statusLinkLocator = await element.$('a[href*="/status/"]'); // Status link
  const viewsLocator = await element.$('a[aria-label*="views"] span'); // Adjust selector as needed

  // Extract Data
  const datetime = datetimeLocator
    ? await datetimeLocator.getAttribute("datetime")
    : null;
  const authorNickname = authorLocator
    ? await authorLocator.textContent()
    : null;
  const likesText = likesLocator ? await likesLocator.textContent() : "0";
  const repostsText = repostsLocator ? await repostsLocator.textContent() : "0";
  const commentsText = commentsLocator
    ? await commentsLocator.textContent()
    : "0";
  const innerText = innerTextLocator
    ? await innerTextLocator.textContent()
    : null;
  const statusHref = statusLinkLocator
    ? await statusLinkLocator.getAttribute("href")
    : null;
  const viewsText = viewsLocator ? await viewsLocator.textContent() : "0";

  const likes = parseCountString(likesText) || 0;
  const reposts = parseCountString(repostsText) || 0;
  const comments = parseCountString(commentsText) || 0;
  const views = parseCountString(viewsText) || 0;

  // Return the extracted data
  return {
    datetime,
    authorNickname,
    likes,
    reposts,
    comments,
    views,
    innerText,
    statusHref,
  };
}

async function urlCollectorCrawler(url: string): Promise<string[]> {
  const collectedUrls = new Set<string>(); // Use Set to store unique URLs

  const crawler = new PlaywrightCrawler({
    useSessionPool: true,
    persistCookiesPerSession: true,
    maxRequestRetries: 3,
    launchContext: {
      useIncognitoPages: true,
      launchOptions: {
        headless: IS_HEADLESS,
        // args: ["--incognito"],
        viewport: { width: 500, height: 500 },
      },
    },
    requestHandlerTimeoutSecs: 300,
    maxConcurrency: 3,
    preNavigationHooks: [
      async (crawlingContext) => {
        const { page } = crawlingContext;
        if (SET_COOKIES_BOOL) {
          const context = page.context();
          await loadCookiesFromJson(context, COOKIE_FILE_PATH);
        }
      },
    ],
    async requestHandler({ page, request }: { page: Page; request: Request }) {
      console.log(`Crawling ${request.url} for URLs...`);

      if (SAVE_COOKIES_BOOL) {
        console.log("You have 60 seconds to enter your creds.");
        await page.waitForTimeout(60_000);
        const context = page.context(); // Get the browser context
        const cookies = await context.cookies(); // Extract cookies
        await saveCookiesToJson(cookies, COOKIE_FILE_PATH); // Save cookies

        await page.waitForTimeout(randBtwn(1000, 2000));
        return;
      }

      // await page.waitForTimeout(randBtwn(20_000, 10_000));
      await page.waitForTimeout(randBtwn(3_000, 5_000));

      let breakCollection = false;
      let startCt = 0;

      const diffs = [];
      const results = [];
      for (let scrollNum = 0; scrollNum < MAX_SCROLLS; scrollNum++) {
        if (diffs.length > 2) {
          console.log(diffs.slice(-2));
          if (diffs.slice(-2).every((num) => num === 0)) {
            breakCollection = true;
          }
        }
        if (breakCollection) {
          break;
        }
        startCt = collectedUrls.size;

        const elements = await page.$$("article"); // Replace with actual class name for each post

        console.log(`Found ${elements.length} tweets.`);

        for (const element of elements) {
          const tweetData = await extractTweetData(element);
          // console.log(tweetData);
          const href = tweetData.statusHref;
          if (href) {
            if (!collectedUrls.has(href)) {
              collectedUrls.add(href);
              results.push(tweetData);
              console.log(
                `Adding ${href} to collection (size ${results.length}) on scroll ${scrollNum}.`
              );
            }
          }
        }
        // await page.waitForTimeout(1_000_000);
        await scrollUsingDownKey(page);
        console.log(`Waiting!`);
        await page.waitForTimeout(randBtwn(3000, 6000));
        console.log(`Scrolling down (${scrollNum + 1})`);

        diffs.push(collectedUrls.size - startCt);
      }
      // Save data
      const dataPath = getFilePath(
        makeFileFriendlyName(page.url()),
        MAX_SCROLLS
      );
      writeFileSync(dataPath, JSON.stringify(results, null, 2), "utf-8");
      console.log(`Data (${results.length}) saved to ${dataPath}`);

      console.log(`Crawler is done for ${page.url()}.`);
    },
  });

  await crawler.run([url]);
  console.log(
    `URL collection complete. Collected ${collectedUrls.size} unique links.`
  );

  return Array.from(collectedUrls); // Convert Set to Array and return
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processUrlsSequentially(urls: string[]) {
  for (const url of urls) {
    console.log(`Processing URL: ${url}`);
    const collectedUrls = await urlCollectorCrawler(url);
    await delay(randBtwn(25_000, 35_000));
  }
}

function generateUrls(
  startDate: string,
  endDate: string,
  queryParts: string[]
): string[] {
  const urls: string[] = [];
  const currentDate = new Date(startDate);
  const stopDate = new Date(endDate);

  // Increment dates and generate URLs
  while (currentDate < stopDate) {
    const sinceDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1);
    const untilDate = currentDate.toISOString().split("T")[0];

    for (const query of queryParts) {
      const url = `https://x.com/search?q=(${encodeURIComponent(
        query
      )})%20until%3A${untilDate}%20since%3A${sinceDate}&src=typed_query`;
      urls.push(url);
    }
  }

  return urls;
}
// const urlsToProcess = [
//   "https://x.com/search?q=(%23afd)%20until%3A2025-01-01%20since%3A2024-12-13&src=typed_query",
// ];

const startDate = "2024-12-13";
const endDate = "2025-01-07";
const queryParts = ["#afdja"];
// #afd Alternative für Deutschland" AfD-Fraktion @Alice_Weidel

const urlsToProcess = generateUrls(startDate, endDate, queryParts);

(async () => {
  console.log(urlsToProcess);
  await processUrlsSequentially(urlsToProcess);
})();
