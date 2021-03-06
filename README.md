[![Build Status](https://travis-ci.org/bratzelk/WikiBingo.svg?branch=master)](https://travis-ci.org/bratzelk/WikiBingo)

WikiBingo
=======================


Table of Contents
-----------------

- [Intro](#intro)
- [Game Rules](#game-rules)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Tests](#tests)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)


Intro
-------------

 - This is a simple game to demonstrate Vue.JS + NodeJS + MongoDB + Wikipedia API etc etc 
 - TODO

Game Rules
-------------

 - Choose any topic as a goal
 - Get given a random starting topic
 - Follow the links from the starting topic
 - Try to get to the goal via the fewest links

Prerequisites
-------------

- [MongoDB](https://www.mongodb.org/downloads)
- [Node.js 6.0+](http://nodejs.org)
- [Nodemon](https://github.com/remy/nodemon) (sudo npm install -g nodemon)

Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone --depth=1 https://github.com/bratzelk/wikibingo.git wikibingo

# Change directory
cd wikibingo

# Install NPM dependencies
npm install

# Or, if you prefer to use `yarn` instead of `npm`
yarn install

# Then simply start the app
node app.js

# Or 
nodemon app.js
```

Tests
---------------

To run the tests simply execute:

```bash
npm test
```

FAQ
---

### I am getting MongoDB Connection Error, how do I fix it?
That's a custom error message defined in `app.js` to indicate that there was a
problem connecting to MongoDB:

```js
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure MongoDB is running.');
});
```
You need to have a MongoDB server running before launching `app.js`. You can
download MongoDB [here](http://mongodb.org/downloads), or install it via a package manager.

### I get an error when I deploy my app, why?
Chances are you haven't changed the *Database URI* in `.env`. If `MONGODB`/`MONGOLAB_URI` is
set to `localhost`, it will only work on your machine as long as MongoDB is
running. When you deploy to Heroku, OpenShift or some other provider, you will not have MongoDB
running on `localhost`. 

### Where do I change application settings/config?
All application config is currently in .env.dev

Contributing
------------

I would love it if someone would like to contribute to this project! You can help the project tremendously by discovering and reporting bugs, improving documentation, writing GitHub issues, or by adding your own features.

License
-------

The MIT License (MIT)

Copyright (c) 2017 Kim Bratzel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

