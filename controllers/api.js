'use strict';

const request = require('request');
const _ = require('lodash');

/**
 * GET /api/query/:title
 */
exports.getQuery = (req, res, next) => {
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
exports.getRandom = (req, res, next) => {
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
exports.getOutgoingLinks = (req, res, next) => {
  var title = req.params.title;
  console.log('Fetching All Outgoing Links for: ' + title);

  const query = {
    'action': 'query',
    'titles': title,
    'prop': 'links',
    'pllimit': 'max',
    'format': 'json',
    'redirects': ''
  };

  getAll(query, 'plcontinue', function (err, everything) {
      if (err) { return console.log('Error fetching all results:', err); }
      //Only return an array of outgoing links
      var links = _.chain(everything)
                      .map('query.pages')
                      .map(function(item) { return _.values(item)[0].links; })
                      .flatten()
                      .sampleSize(10) //Randomise and reduce to 10
                      .value();
      res.send(links);
  });
};

/**
 * GET /api/incoming/:title
 */
exports.getIncomingLinks = (req, res, next) => {
  var title = req.params.title;
  console.log('Fetching Incoming Links For: ' + title);

  const query = {
    'action': 'query',
    'titles': title,
    'prop': 'linkshere',
    'lhlimit': 'max',
    'lhshow': '!redirect',
    'format': 'json',
  };

  getAll(query, 'lhcontinue', function (err, everything) {
      if (err) { return console.log('Error fetching all results:', err); }
      //Only return an array of linkshere
      var links = _.chain(everything)
                      .map('query.pages')
                      .map(function(item) { return _.values(item)[0].linkshere; })
                      .flatten()
                      .value();
      res.send(links);
  });
};

/**
 * GET /api/image/:title
 */
exports.getImage = (req, res, next) => {
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
exports.getContains = (req, res, next) => {
  var haystack = req.params.haystack;
  var needle = req.params.needle;
  console.log('Checking if ' + haystack + ' contains ' + needle);

  const query = {
    'action': 'query',
    'titles': needle,
    'prop': 'links',
    'pllimit': 'max',
    'format': 'json',
    'redirects': ''
  };

  //Find all outgoing links for needle, then see if any of them are the haystack
  getAll(query, 'plcontinue', function (err, everything) {
      if (err) { return console.log('Error fetching all results:', err); }
      //Return only outgoing links matching the haystack
      var links = _.chain(everything)
                      .map('query.pages')
                      .map(function(item) { return _.values(item)[0].links; })
                      .flatten()
                      .filter(function(e) { return e.title.toLowerCase() === haystack.toLowerCase(); })
                      .value();

      var result = {"result": links.length === 1};
      res.send(result);
  });

};


/**
 * Recursively fetches all results from api
 */
var getAll = function(querystring, continueKey, callback) {

  const maxPages = 5; //Maximum number of pages to fetch

  var pageNumber = 0;
  var results = [];

  function getNext(callback, shouldContinue) {

      if (pageNumber >= maxPages) {
        callback(null, results);
        return;
      }

      pageNumber++;

      if (shouldContinue) {
        querystring[continueKey] = shouldContinue[continueKey];
      }

      request.get({ url: process.env.WIKI_API, qs: querystring }, function(err, request, body) {
          if (err) { return callback(err); }

          var result = JSON.parse(body);
          results = results.concat(result);

          if ("continue" in result) {
            getNext(callback, result.continue);
          }
          else {
            callback(null, results);
          }
      });
  };

  getNext(callback);

};
