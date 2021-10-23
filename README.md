# Downdetector.com Unofficial APIs
[![](https://github.com/davideviolante/downdetector-api/workflows/Node.js%20CI/badge.svg)](https://github.com/DavideViolante/downdetector-api/actions?query=workflow%3A"Node.js+CI") [![Coverage Status](https://coveralls.io/repos/github/DavideViolante/downdetector-api/badge.svg?branch=master)](https://coveralls.io/github/DavideViolante/downdetector-api?branch=master)  [![Maintainability](https://api.codeclimate.com/v1/badges/ce48adbd97ff85557918/maintainability)](https://codeclimate.com/github/DavideViolante/downdetector-api/maintainability) ![npm](https://img.shields.io/npm/dm/downdetector-api) [![Donate](https://img.shields.io/badge/paypal-donate-179BD7.svg)](https://www.paypal.me/dviolante)

[![NPM](https://nodei.co/npm/downdetector-api.png)](https://nodei.co/npm/downdetector-api/)

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
    const response = await downdetector('windtre', 'it');
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

