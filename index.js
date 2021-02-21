const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 
 * @param {string} company Company name in Downdetector (see URL)
 * @param {string} [domain] Downdetector domain to use (default is 'com')
 */
async function downdetector(company, domain = 'com') {
  try {
    if (!company || typeof company !== 'string') {
      throw Error('Invalid input');
    }
    const res = await axios({
      method: 'GET',
      url: `https://downdetector.${domain}/status/${company}/`
    });
    const $ = cheerio.load(res.data);
    const scriptElem = $('#chart-row > div > div.popover-container.justify-content-center.p-relative > script:nth-child(3)');
    const scriptContent = scriptElem.contents().get(0).data;
    const chartPoints = scriptContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('{ x: \''));
    const reports = chartPoints.slice(0, 96)
      .map(line => line.replace(/\{ | \},|'/g, '').split('x: ').pop().split(', y: '))
      .map(tuple => ({ date: tuple[0], value: +tuple[1]}));
    const baseline = chartPoints.slice(96, 192)
      .map(line => line.replace(/\{ | \},|'/g, '').split('x: ').pop().split(', y: '))
      .map(tuple => ({ date: tuple[0], value: +tuple[1]}));
    // console.log(reports, baseline)
    return { reports, baseline };   
  } catch (err) {
    console.error(err.message);
  }
}

exports.downdetector = downdetector;

// downdetector('wind', 'it');
