---
date: 2014-08-27
title: Eskimo - Node Boilerplate Framework for Rapid MVP's
description: Eskimo helps you to rapidly build Node.js powered API's, online stores, and apps in general.
template: post.jade
---

# Introducing Eskimo

![Eskimo](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_0.jpg?1410375639)

> If an [eskimo][eskimo-wikipedia] builds an [igloo][igloo-wikipedia], and an igloo is a structure made up of individual building blocks, then [`eskimo`][eskimo] is a command line interface ("CLI") used for building an [`igloo`][igloo].

Eskimo is a new [Node.js][node] boilerplate for building **Rapid MVP's** ("RMVP's").

> Launched at a [NYC Node.js Meetup][meetup] held at Microsoft on August 27, 2014.


## Problems

### Cluttered community

![Boilerplates](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_11.jpg?1410375639)

Despite an abundance of boilerplates and frameworks ("project starters"), the Node community lacks an up-to-date, opinionated, simple, modular, and minimal project starter (specifically for building RMVP's with).  Projects start off small and opinionated by one person, but then they become influenced by contributors and grow to unmaintainable proportions.  Searching on Google and GitHub for "node boilerplates" or "node frameworks" yields hundreds of results.

### Sails/Locomotive !== Express 4.x

![Express 3 vs. 4](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_17.jpg?1410375639)

Due to heavy reliance on [connect][connect] in [express][express] 3.x, the projects have become outdated and do not abide by the concept of "use individual components" ([sails #1684](https://github.com/balderdashy/sails/issues/1684) and [locomotive #159](https://github.com/jaredhanson/locomotive/issues/159)).

### Lack of automation and best-practices

![Best Practices](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_25.jpg?1410375639)

Many project starters lack automation for testing and production deployments.  Several ignore front-end best-practices such as having an asset pipeline (uglify/minify/optimize assets) and don't utilize [Bower][bower], [Bootstrap][bootstrap], [Font Awesome][font-awesome], [S3/CloudFront][aws], [clustering][clustering], and [LESS][less].

### App structure and code re-usability

![Electrolyte](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_22.jpg?1410375639)

Currently no frameworks nor boilerplates have implemented dependency injection using [electrolyte][electrolyte] (other than [eskimo][eskimo], with exception of [Jared Hanson's][jared-hanson] projects as far as I know.

[![Catonmat](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_10.jpg?1410375639)][catonmat]

Most applications structure their code by passing around global objects to exported functions, or simply have global variables (which is bad practice).  For example, here's how many some project starters are structured using global objects:

```js
// config.js

module.exports = {
  port: process.env === 'development' ? 3000 : 80
};

```

```js
// controller.js

module.exports = function(config) {
  return function(req, res, next) {
    res.send('Hello world');
  });
};

```

```js
// app.js

var express = require('express');
var app = express();
var config = require('./config');
var controller = require('./controller')(config);

app.get('/', controller);

app.listen(config.port);

```


## Solution

### Eskimo

#### Install

![Install Eskimo](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_29.jpg?1410375639)

#### Usage

![Usage for Eskimo](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_30.jpg?1410375639)

#### Simple scaffolding

Built with [commander][commander] and inspired by [yo][yo], the `eskimo` CLI provides a command `create` to scaffold a new RMVP and `model`, `view`, and `controller` commands to scaffold a new [mongoose][mongoose] schema, [jade][jade] template, and route middleware respectively.

#### Highly opinionated

In order to stay focused, one direction across the front-end and back-end must be taken with a project starter.  Having support in the CLI for all templating languages, all ORM's for building schemas, SQL, NoSQL, etc. is too much to maintain.  However, support for swapping out anything that is default is required.  One templating language ([jade][jade]), one ORM ([mongoose][mongoose]), one database ([mongodb][mongodb]), and one CSS pre-processor ([less][less]) have been selected as initial candidates based off successful RMVP projects (see the [Showcase](#showcase)) below.

#### Easily customizable

![Highly configurable](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_23.jpg?1410375639)

Don't like using [jade][jade], [less][less], [passport][passport], &hellip;?  Simply delete them from the generated project starter files and remove them from `package.json` after running `eskimo create [name]`.

#### Documented micro-examples

After you create a new project starter, what's next?  Need Facebook and/or Google Authentication in your app?  Integration with Stripe for payments?  Documentation and setup for a RESTful API?  Using Sockets.io?  Setup for zero-downtime reloads and automated deployment? Simply look in the [`/examples`][examples] folder or file an issue if you'd like help.  By simply having micro-examples as Readme files, users are forced to learn by reading and thinking (as opposed to simply copying/paste a complete working example).


## Framework/boilerplate comparison

### Back-end

| Name                     | ☆'s* | Express 4 | DI** | Gulp | Mocha | Travis | Cov.  | LOC\*\*\* |
| ------------------------ | :--: | :-------: | :----: | :--: | :---: | :----: | :---: | :-------: |
| [eskimo][eskimo]         | 128  | ✓         | ✓      | ✓    | ✓     | ✓      | ✓     | 2730      |
| [sails][sails]           | 7550 | ✗         | ✗      | ✓    | ✓     | ✓      | ✗     | 26741     |
| [locomotive][locomotive] | 685  | ✗         | ✗      | ✓    | ✓     | ✓      | ✓     | 16598     |
| [totaljs][totaljs]       | 1061 | ✗         | ✗      | ✗    | ✗     | ✓      | ✗     | 14827     |
| [hackathon-starter][hs]  | 7300 | ✓         | ✗      | ✗    | ✓     | ✓      | ✗     | 16877     |
| [derby][derby]           | 3366 | ✗         | ✗      | ✗    | ✓     | ✓      | ✗     | 2688      |
| [kraken][kraken]         | 2901 | ✓         | ✗      | ✗    | ✗     | ✓      | ✓     | 1762      |


### Front-end

| Name                     | ☆'s* | Asset Pipeline | Bower | Bootstrap 3 | Font Awesome 4 | Jade | LESS |
| ------------------------ | :--: | :------------: | :---: | :---------: | :------------: | :--: | :--: |
| [eskimo][eskimo]         | 128  | ✓              | ✓     | ✓           | ✓              | ✓    | ✓    |
| [sails][sails]           | 7550 | ✗              | ✗     | ✗           | ✗              | ✗    | ✓    |
| [locomotive][locomotive] | 685  | ✗              | ✗     | ✗           | ✗              | ✗    | ✗    |
| [totaljs][totaljs]       | 1061 | ✗              | ✗     | ✗           | ✗              | ✗    | ✗    |
| [hackathon-starter][hs]  | 7300 | ✓              | ✗     | ✓           | ✓              | ✓    | ✓    |
| [derby][derby]           | 3366 | ✗              | ✗     | ✗           | ✗              | ✗    | ✗    |
| [kraken][kraken]         | 2901 | ✗              | ✗     | ✗           | ✗              | ✗    | ✗    |

* \* as of 9/10/2014
* ** dependency injection with [electrolyte][electrolyte]
* \*\*\* number of lines of code on a fresh `git clone` of the repository (using `git-extras`'s `git-line-summary` command) as of 9/10/2014

## Showcase

![Showcase](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_35.jpg?1410375639)

[![Our Harvest](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_36.jpg?1410375639)][our-harvest]

[![Market Prophit](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_37.jpg?1410375639)][market-prophit]

[![Seedfeed](https://speakerd.s3.amazonaws.com/presentations/c29172701b490132a3400ec9c33cef64/slide_38.jpg?1410375639)][seedfeed]

[seedfeed]: http://seedfeed.com
[market-prophit]: http://developer.marketprophit.com
[our-harvest]: https://ourharvest.com
[jared-hanson]: https://github.com/jaredhanson
[connect]: https://github.com/senchalabs/connect
[yo]: https://github.com/yeoman/yo
[eskimo-wikipedia]: https://en.wikipedia.org/wiki/Eskimo
[igloo-wikipedia]: https://en.wikipedia.org/wiki/Igloo
[eskimo]: http://eskimo.io
[igloo]: http://igloojs.com
[node]: http://nodejs.org
[clevertech]: http://clevertech.biz
[commander]: https://github.com/visionmedia/commander.js/
[electrolyte]: https://github.com/jaredhanson/electrolyte
[kraken]: https://github.com/krakenjs/kraken-js
[derby]: http://derbyjs.com
[hs]: https://github.com/sahat/hackathon-starter
[locomotive]: http://locomotivejs.org/
[sails]: http://sailsjs.org
[examples]: https://github.com/niftylettuce/eskimo/tree/master/examples
[less]: http://lesscss.org/
[passport]: http://passportjs.org/
[totaljs]: http://www.totaljs.com/
[mongoose]: http://mongoosejs.com
[jade]: http://jade-lang.com
[mongodb]: http://www.mongodb.org/
[meetup]: https://speakerdeck.com/niftylettuce/eskimo-nodejs-rapid-mvp-boilerplate-framework
[express]: http://expressjs.com
[bower]: http://bower.io/
[bootstrap]: http://getbootstrap.com/
[font-awesome]: http://fontawesome.io/
[aws]: https://aws.amazon.com/
[clustering]: http://nodejs.org/api/cluster.html
[catonmat]: http://www.catonmat.net/
