import { PlaywrightCrawler, Request } from "@crawlee/playwright";
import { Page } from "playwright";
import { writeFileSync, existsSync, readFileSync } from "fs";
const MIN_COLLECTION_SIZE = 30;
// const urlsToProcess = [
//   "https://www.tiktok.com/tag/afd",
//   "https://www.tiktok.com/tag/afdsong",
//   "https://www.tiktok.com/@mutzurwahrheit90",
//   "https://www.tiktok.com/@alice_weidel_afd",
//   "https://www.tiktok.com/@muenzenmaier",
//   "https://www.tiktok.com/@maximilian_krah",
//   "https://www.tiktok.com/@miguel_klauss",
//   "https://www.tiktok.com/music/Originalton-7397674347915184929",
//   "https://www.tiktok.com/music/Originalton-7325539076818488096",
//   "https://www.tiktok.com/music/Originalton-7375784153096244000",
//   "https://www.tiktok.com/music/Ein-Volk-Vereint-AFD-Song-7383368569742051329",
//   "https://www.tiktok.com/tag/AlternativefürDeutschland",
//   "https://www.tiktok.com/tag/afddeutschland",
//   "https://www.tiktok.com/tag/afdwählen",
//   "https://www.tiktok.com/tag/afddemo ",
//   "https://www.tiktok.com/tag/unserlandzuerst",
//   "https://www.tiktok.com/tag/seischlauwählblau",
//   "https://www.tiktok.com/tag/AfDWähler",
//   "https://www.tiktok.com/tag/AfDPartei",
//   "https://www.tiktok.com/tag/AfDPolitik",
//   "https://www.tiktok.com/tag/DeutschlandZuerst",
//   "https://www.tiktok.com/tag/EuroAlternativen",
//   "https://www.tiktok.com/tag/Euroskepsis",
//   "https://www.tiktok.com/tag/afrfraktion",
// ];

const fileContent = readFileSync("../afd_accts_12-5_0.txt", "utf-8");
const urlsToProcess = fileContent
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line !== "")
  .map((line) => `https://www.tiktok.com/@${line}`);

const isHeadless = true;
const maxScrolls = 50;

function randBtwn(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getFilePath(id: string, pageUrl: string): string {
  let filename = id;
  let folder = "test";
  if (pageUrl.includes("tag")) {
    const tagName = pageUrl.split("/").pop();
    filename = `${id}_tag-${tagName}`;
    folder = "by_tag";
  }
  if (pageUrl.includes("@")) {
    folder = "by_user";
  }
  if (pageUrl.includes("music")) {
    const musicTitle = pageUrl.split("/").pop();
    filename = `${id}_music-${musicTitle}`;
    folder = "by_music";
  }
  return `../data/${folder}/${filename}.json`;
}

async function scrollUsingDownKey(page: Page, scrollCount: number = 8) {
  for (let i = 0; i < scrollCount; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight / 4));
    await page.waitForTimeout(randBtwn(100, 500));
  }
}

async function filterCollectedUrls(
  urls: string[],
  intiialPageUrl: string
): Promise<string[]> {
  return urls.filter((url) => {
    const urlId = url.split("/").pop() || "";
    const filePath = getFilePath(urlId, intiialPageUrl);
    return urlId && !existsSync(filePath);
  });
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
        headless: isHeadless,
        // args: ["--incognito"],
        viewport: { width: 500, height: 500 },
      },
    },
    requestHandlerTimeoutSecs: 300,
    maxConcurrency: 3,
    async requestHandler({ page, request }: { page: Page; request: Request }) {
      console.log(`Crawling ${request.url} for URLs...`);

      await page.waitForTimeout(randBtwn(3000, 5000));
      if (page.url().includes("https://www.tiktok.com/foryou")) {
        console.log(`ENDING SCRAPER DUE TO BAD REDIRECT ON ${url}`);
        return;
      }
      // Example pop-up and cookie acceptance handling
      try {
        const closeButton = await page.$('button[aria-label="Close"]');
        if (closeButton) {
          await closeButton.click();
          console.log("Popup closed.");
        }
      } catch (e) {
        console.log("Close button not found or could not be clicked:", e);
      }

      try {
        const declineButton = await page.$('button:text-is("Decline all")');
        if (declineButton) {
          await declineButton.click();
          console.log("Clicked 'Decline all' button.");
        }
        const declineOptButton = await page.$(
          'button:text-is("Decline optional cookies")'
        );
        if (declineOptButton) {
          await declineOptButton.click();
          console.log("Clicked 'Decline optional cookies' button.");
        }
      } catch (e) {
        console.log("Decline button not found or could not be clicked:", e);
      }

      await page.waitForTimeout(randBtwn(3000, 5000));

      let breakCollection = false;
      let startCt = 0;

      const diffs = [];
      for (let i = 0; i < maxScrolls; i++) {
        if (diffs.length > 2) {
          if (diffs.slice(-2).every((num) => num === 0)) {
            breakCollection = true;
          }
        }
        startCt = collectedUrls.size;
        if (breakCollection) {
          if (false) {
            // if (collectedUrls.size < MIN_COLLECTION_SIZE && url.includes("@")) {
            throw new Error(
              "Collection interrupted, no new elts found: Restarting scraper..."
            );
          } else {
            console.log("Not finding any new URLs, breaking");
            break;
          }
        }
        const elements = await page.$$(".e19c29qe13"); // Replace with actual class name

        for (const element of elements) {
          const href = await element.getAttribute("href");
          if (href) {
            collectedUrls.add(href);
            console.log(`Collected ${collectedUrls.size} links: ${href}`);
          }
        }

        await scrollUsingDownKey(page);
        console.log(`Waiting!`);
        await page.waitForTimeout(randBtwn(3000, 6000));
        console.log(`Scrolling down (${i + 1})`);

        diffs.push(collectedUrls.size - startCt);
      }
      console.log("Crawler 1 is done.");
    },
  });

  await crawler.run([url]);
  console.log(
    `URL collection complete. Collected ${collectedUrls.size} unique links.`
  );

  return Array.from(collectedUrls); // Convert Set to Array and return
}

async function visitCollectedUrlsCrawler(
  urls: string[],
  initialPageUrl: string
) {
  const crawler = new PlaywrightCrawler({
    maxConcurrency: 5,
    async requestHandler({ page, request }: { page: Page; request: Request }) {
      console.log(`Visiting ${request.url}...`);
      await page.waitForTimeout(randBtwn(2000, 3000));

      const scriptElement = await page.$("#__UNIVERSAL_DATA_FOR_REHYDRATION__");
      if (scriptElement) {
        const jsonData = await scriptElement.textContent();

        if (jsonData) {
          try {
            const parsedData = JSON.parse(jsonData);
            const itemStruct =
              parsedData?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo
                ?.itemStruct;

            if (itemStruct) {
              const filePath = getFilePath(itemStruct.id, initialPageUrl);

              // Check if the file already exists
              if (!existsSync(filePath)) {
                writeFileSync(filePath, JSON.stringify(itemStruct, null, 2));
                console.log(`Data saved for ${itemStruct.id}`);
              } else {
                console.log(
                  `File already exists for ${itemStruct.id}, skipping save.`
                );
              }
            } else {
              console.log("itemStruct data not found in parsed JSON.");
            }
          } catch (error) {
            console.error("Failed to parse JSON data:", error);
          }
        } else {
          console.log("No JSON data found in the <script> tag.");
        }
      } else {
        console.log(
          "Script tag with ID '__UNIVERSAL_DATA_FOR_REHYDRATION__' not found."
        );
      }
    },
  });

  await crawler.run(urls);
  console.log("Second crawl complete for all URLs.");
}

async function processUrlsSequentially(urls: string[]) {
  for (const url of urls) {
    console.log(`Processing URL: ${url}`);

    // Step 1: Collect URLs from the first crawler
    const collectedUrls = await urlCollectorCrawler(url);
    const filteredUrls = await filterCollectedUrls(collectedUrls, url);
    console.log(`Collected URLs: ${collectedUrls.length}`);
    console.log(`Filter URLs: ${filteredUrls.length}`);

    // Step 2: Visit each collected URL with the second crawler
    await visitCollectedUrlsCrawler(filteredUrls, url);
  }
}

(async () => {
  await processUrlsSequentially(urlsToProcess.reverse().slice(20));
})();
