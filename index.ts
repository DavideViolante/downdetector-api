import { load } from 'cheerio';
import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';

interface ChartPoint {
  date: string;
  value: number;
}

interface DowndetectorResponse {
  reports: ChartPoint[];
  baseline: ChartPoint[];
}

/**
 * Call Downdetector website and get the page content
 * @param {string} company Company to get the data for
 * @param {string} domain Domain suffix of downdetector website (eg: com)
 * @return {Promise<string>} The page content
 */
async function callDowndetector(company: string, domain: string): Promise<string> {
  puppeteer.use(pluginStealth());
  const browser = await puppeteer.launch({ 
    headless: true, 
    executablePath: executablePath() 
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
  );
  await page.goto(`https://downdetector.${domain}/status/${company}/`);
  const content = await page.content();
  await browser.close();
  return content;
}

/**
 * Get the script tag content from the Downdetector page content
 * @param {string} data Page content
 * @return {string} The content of the script tag
 */
function getScriptContent(data: string): string {
  const $ = load(data);
  const scriptElems = $('script[type="text/javascript"]');
  let res = '';
  for (const script of scriptElems) {
    const scriptContent = script.children?.[0] as unknown as { data: string };
    if (scriptContent?.data?.includes('{ x:')) {
      res = scriptContent.data;
      break;
    }
  }
  return res;
}

/**
 * Get array of data from a string
 * @param {string} scriptContent Script content as a string
 * @return {string[]} Array of strings each one containing a pair of data
 */
function getChartPointsString(scriptContent: string): string[] {
  return scriptContent.split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('{ x: \''));
}

/**
 * Convert a string to object with reports and baseline properties
 * @param {string[]} chartPoints string with dates and values
 * @return {DowndetectorResponse} object with reports and baseline properties
 */
function getChartPointsObject(chartPoints: string[]): DowndetectorResponse {
  return {
    reports: str2obj(chartPoints.slice(0, 96)),
    baseline: str2obj(chartPoints.slice(96, 192)),
  };
}

/**
 * Convert a string to object with date and value properties
 * @param {string[]} chartPoints string to convert to object
 * @return {ChartPoint[]} array of objects with date and value properties
 */
function str2obj(chartPoints: string[]): ChartPoint[] {
  return chartPoints
    .map((line) => line
      .replace(/\{ | \},|'/g, '')
      .split('x: ').pop()!
      .split(', y: '))
    .map((tuple) => ({ date: tuple[0], value: +tuple[1] }));
}

/**
 * Get data from Downdetector
 * @param {string} company Company name in Downdetector (see URL)
 * @param {string} [domain] Downdetector domain to use (default is 'com')
 * @return {Promise<DowndetectorResponse | undefined>} Object containing reports and baseline data
 */
export async function downdetector(
  company: string, 
  domain: string = 'com'
): Promise<DowndetectorResponse | undefined> {
  try {
    if (!company || typeof company !== 'string') {
      throw Error('Invalid input');
    }
    const data = await callDowndetector(company, domain);
    const scriptContent = getScriptContent(data);
    const chartPoints = getChartPointsString(scriptContent);
    const { reports, baseline } = getChartPointsObject(chartPoints);
    return { reports, baseline };
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'Unknown error');
    return undefined;
  }
}
