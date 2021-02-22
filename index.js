const axios = require('axios')
const cheerio = require('cheerio')

function callDowndetector (company, domain) {
  return axios({
    method: 'GET',
    url: `https://downdetector.${domain}/status/${company}/`
  })
}

function getScriptContent (data) {
  const $ = cheerio.load(data)
  const scriptElem = $('#chart-row > div > div.popover-container.justify-content-center.p-relative > script:nth-child(3)')
  return scriptElem.contents().get(0).data
}

function getChartPointsString (scriptContent) {
  return scriptContent.split('\n')
    .map(line => line.trim())
    .filter(line => line.includes('{ x: \''))
}

function getChartPointsObject (chartPoints) {
  return {
    reports: str2obj(chartPoints.slice(0, 96)),
    baseline: str2obj(chartPoints.slice(96, 192))
  }
}

function str2obj (chartPoints) {
  return chartPoints
    .map(line => line.replace(/\{ | \},|'/g, '').split('x: ').pop().split(', y: '))
    .map(tuple => ({ date: tuple[0], value: +tuple[1] }))
}

/**
 *
 * @param {string} company Company name in Downdetector (see URL)
 * @param {string} [domain] Downdetector domain to use (default is 'com')
 */
async function downdetector (company, domain = 'com') {
  try {
    if (!company || typeof company !== 'string') {
      throw Error('Invalid input')
    }
    const res = await callDowndetector(company, domain)
    const scriptContent = getScriptContent(res.data)
    const chartPoints = getChartPointsString(scriptContent)
    const { reports, baseline } = getChartPointsObject(chartPoints)
    // console.log(reports, baseline)
    return { reports, baseline }
  } catch (err) {
    console.error(err.message)
  }
}

exports.downdetector = downdetector

// downdetector('wind', 'it')
