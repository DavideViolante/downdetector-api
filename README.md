# Downdetector.com unofficial APIs
Unofficial APIs for Downdetector.com website.

### Install
`npm i downdetector-api`

### Example
```js
const { downdetector } = require('downdetector-api');

async function main () {
  try {
    // Without specifying the downdetector domain
    const response = await downdetector('steam');
    // Specifying the downdetector domain (some companies are not in the .com domain)
    const response = await downdetector('wind', 'it');
  } catch (err) {
    console.error(err);
  }
}
```

### Response
```js
{
  reports: [
    { date: '2021-02-21T20:16:06+00:00', value: 17 },
    { date: '2021-02-21T20:31:06+00:00', value: 16 },
    { date: '2021-02-21T20:46:06+00:00', value: 16 },
    { date: '2021-02-21T21:01:06+00:00', value: 14 }
    ...
  ],
  baseline: [
    { date: '2021-02-21T20:16:06+00:00', value: 1 },
    { date: '2021-02-21T20:31:06+00:00', value: 2 },
    { date: '2021-02-21T20:46:06+00:00', value: 2 },
    { date: '2021-02-21T21:01:06+00:00', value: 3 }
  ]
}
```

### Available inputs
- All the companies for which Downdetector has a page. 

### Author
- [Davide Violante](https://github.com/DavideViolante/)

