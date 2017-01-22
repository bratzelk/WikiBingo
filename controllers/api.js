'use strict';

const request = require('request');
const shuffle = require('shuffle-array');


/**
 * GET /api/query/:title
 */
exports.getQuery = (req, res) => {
  var title = req.params.title;
  console.log('Searching for: ' + title);
  
  const query = {
    'search': title,
    'action': 'opensearch',
    'limit': '10',
    'namespace': '0',
    'format': 'json',
  };

  request.get({ url: process.env.WIKI_API, qs: query }, (err, request, body) => {
    if (err) { return next(err); }
    const results = JSON.parse(body);
    res.send(results);
  });
};

/**
 * GET /api/random
 */
exports.getRandom = (req, res) => {
  console.log('Fetching Random Articles');
  
  const query = {
    'action': 'query',
    'list': 'random',
    'rnfilterredir': 'nonredirects',
    'rnlimit': '5',
    'rnnamespace': '0',
    'format': 'json',
  };

  request.get({ url: process.env.WIKI_API, qs: query }, (err, request, body) => {
    if (err) { return next(err); }
    const results = JSON.parse(body);
    res.send(results);
  });
};

/**
 * GET /api/outgoing/:title
 */
exports.getOutgoingLinks = (req, res) => {
  var title = req.params.title;
  console.log('Fetching All Outgoing Links for: ' + title);

  const query = {
    'action': 'query',
    'titles': title,
    'prop': 'links',
    'pllimit': 'max',
    'format': 'json',
  };

  var links = [];

  var randomiseAndReduce = function(results) {
    console.log('Found ' + results.length + ' outgoing links.');
    shuffle(results);
    results = results.splice(0, 9);
    res.send(results);
  };

  var recursivelyFetch = function(err, req, body) {
    if (err) { return next(err); }
    var results = JSON.parse(body);

    //Get all the outgoing links
    for (var result in results.query.pages) {
        if (results.query.pages[result].links) {
          links = links.concat(results.query.pages[result].links);
        }
    }

    var shouldContinue = ("continue" in results);
    if(shouldContinue) {
      query['plcontinue'] = results.continue.plcontinue;
      request.get({ url: process.env.WIKI_API, qs: query }, recursivelyFetch);
    }
    else {
      randomiseAndReduce(links);
    }
  }
  request.get({ url: process.env.WIKI_API, qs: query }, recursivelyFetch);
};


/**
 * GET /api/incoming/:title
 */
exports.getIncomingLinks = (req, res) => {
  var title = req.params.title;
  console.log('Fetching Incoming Links For: ' + title);

  const query = {
    'action': 'query',
    'titles': title,
    'prop': 'linkshere',
    'lhlimit': '100',
    'lhshow': '!redirect',
    'format': 'json',
  };

  request.get({ url: process.env.WIKI_API, qs: query }, (err, request, body) => {
    if (err) { return next(err); }
    const results = JSON.parse(body);
    res.send(results);
  });
};

/**
 * GET /api/image/:title
 */
exports.getImage = (req, res) => {
  var title = req.params.title;
  console.log('Fetching Image For: ' + title);
  
  const query = {
    'action': 'query',
    'titles': title,
    'prop': 'pageimages',
    'piprop': 'original',
    'redirects': '',
    'format': 'json',
  };

  request.get({ url: process.env.WIKI_API, qs: query }, (err, request, body) => {
    if (err) { return next(err); }
    const results = JSON.parse(body);

    var result = {'original': undefined};
    for (var result in results.query.pages) {
        result = results.query.pages[result].thumbnail;
    }
    res.send(result);
  });
};

/**
 * GET /api/contains/:haystack/:needle
 */
exports.getContains = (req, res) => {
  var haystack = req.params.haystack;
  var needle = req.params.needle;
  console.log('Checking if ' + haystack + ' contains ' + needle);

  //TODO 
  console.log('Not Implemented Yet!');
};


