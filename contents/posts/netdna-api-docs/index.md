---
date: 2013-05-24
title: NetDNA API Docs
description: Converting NetDNA API docs from HTML to Markdown.
template: post.jade
guest:
  name: NetDNA
  url: "http://blog.netdna.com/developer/converting-our-api-docs-from-closed-to-open/"
---

Over the past weeks I've helped out NetDNA by converting their API docs from hard-coded HTML to auto-generated Markdown with Github Pages.

They asked me to document it, so here's how it went from start to finish.  If you want to skip all this, then go check out their docs for yourself here:

<http://docs.netdna.com>


## Cleanup

The existing docs were OK, but needed cleanup for easier management and a new design.  Here's a screenshot of what they looked like and here's the [HTML][html].

![NetDNA Original API Docs Screenshot](http://i.imgur.com/hSailR6.png "NetDNA Original API Docs Screenshot")

[html]: https://gist.github.com/niftylettuce/e40b526a69ed2908aec4/raw/2e86db484370105d73cd5124120895cbb6d97975/netdna-docs.html

Key issues:

* Navigation was not friendly (no affix/sidebar that scrolls with page)
* No search for docs, you had to manually do CTRL+F and that took a while
* Everything was hard-coded in HTML, and making changes took a lot of time copy/paste
* Code examples were missing
* Lacked instructions for getting started
* No support info listed for integration/dev help
* API wrappers for languages weren't anywhere to be found

## Migration from HTML to Markdown

We had to convert HTML to Markdown.  Not an easy process with custom styling and getting GFM tables parsed correctly.  Doing this by hand would take a while (e.g. writing `<h1>Blah</h1>` to `# Blah` and so on...) so a script to scrape/parse did the trick.

It took this [100 LOC script][loc] to automate it, but it worked flawlessly.

Headaches may have occured while writing this regexp:

```js
md = md.replace(/<table>(?:(?:(?!<\/table>)[\s\S])*?)<\/table>/g, function(html) {
  return parseTable(html)
})
```

Not too fancy... but it worked!

[NPM][npm] modules used:

* [cheerio][cheerio] - parse HTML with jQuery helper functions and cleanup of HTML
* [fs][fs] - read existing HTML and write Markdown output
* [path][path] - namely `path.join` to join dirs
* [to-markdown][to-markdown] - convert HTML to markdown (still needs some touchups after this)
* [htmltidy][htmltidy] - beautify the HTML for any tab/space issues
* [htmlparser2][htmlparser2] - parse the HTML for GFM tables

[cheerio]: https://npmjs.org/package/cheerio
[fs]: http://nodejs.org/api/fs.html
[path]: http://nodejs.org/api/path.html
[to-markdown]: https://npmjs.org/package/to-markdown
[htmltidy]: https://npmjs.org/package/htmltidy
[htmlparser2]: https://npmjs.org/package/htmlparser2
[loc]: https://github.com/niftylettuce/node-netdna-parser/blob/master/scrape.js
[npm]: http://npmjs.org


## Setup

They wanted to integrate [Twitter Bootstrap][twitter-bootstrap], and so I had a module called [readme-docs][readme-docs] which was used for a bit (I recommend it if you want something simple for your Readme.md files).

However, more control over HTML/CSS without having to hack around with a CLI was essential -- so we couldn't use that module.

![Wintersmith](http://wintersmith.io/images/wintersmith.svg "Wintersmith")

I decided to use [wintersmith][wintersmith] to write and finish the [new stack][stack].  Wintersmith is a blog engine I used in the past for setting up [StartupSupper][startupsupper], so setup was straightforward.

This turned out to be the best decision, since this module lets you easily deploy pages to Github (e.g. a blog) while letting you use [Node][node] for builds.

Being able to use Node with [LESS][less] and [Jade][jade] for [Github Pages][github-pages] was the icing on the cake.

Adding [instructions][instructions] to let future maintainers have sanity was the last step.

[readme-docs]: https://npmjs.org/package/readme-docs
[startupsupper]: http://startupsupper.com
[wintersmith]: http://jnordberg.github.io/wintersmith/
[node]: http://nodejs.org
[stack]: https://github.com/netdna/netdna.github.com/
[twitter-bootstrap]: https://github.com/twitter/bootstrap
[less]: http://lesscss.org/
[jade]: http://jade-lang.com/
[github-pages]: https://help.github.com/articles/setting-up-a-custom-domain-with-pages
[instructions]: https://github.com/netdna/netdna.github.com/blob/source/Instructions.md


## Github Pages

Setting up  generated docs at <http://docs.netdna.com> was relatively simple and straightforward.

We added a [CNAME][cname] in "master" branch,  set DNS to [point to Github][point-to-github], and had our wintersmith project in the "source" branch.

[cname]: https://help.github.com/articles/setting-up-a-custom-domain-with-pages#setting-the-domain-in-your-repo)
[point-to-github]: https://help.github.com/articles/setting-up-a-custom-domain-with-pages#setting-up-dns

![Github Pages](http://pages.github.com/images/logo-pages-1x.png "Github Pages")

[Grunt][grunt] was used for the build process, and I pulled the [Gruntfile][gruntfile] out of StartupSupper ([good coders code, great reuse][pkrumins]).

Had some issues when I first tried running `grunt` to deploy to <http://netdna.github.io> (kept getting storage errors) &rarr; but then I soon realized Github was down... and then back up within minutes!

[grunt]: http://gruntjs.com/
[gruntfile]: https://github.com/netdna/netdna.github.com/blob/source/Gruntfile.js
[pkrumins]: http://www.catonmat.net/

Making updates to their API is now easy.

```bash
λ ~/Public/netdna.github.com/ source grunt
Running "setup" task
Creating ./_deploy folder
Initiating git repo
Adding github to remotes as origin
Setting master branch remote
Setting master branch merge

Running "deploy" task
Resetting repo
Building site
Adding all files from ./_deploy
Getting last commit from source branch
Make commit of changes with last commit msg from source branch
Push changes to github

Done, without errors.
```

Final result...

![Final Result](http://i.imgur.com/kb5DoFx.png "Final Result")
