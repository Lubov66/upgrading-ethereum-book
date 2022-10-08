# Upgrading Ethereum

**You are viewing the Altair branch, which is outdated and unmaintained.**

This is my book about Ethereum&nbsp;2.0: Ethereum on proof of stake and beyond.

You can read it at [eth2book.info](https://eth2book.info/latest) (also available at [upgrading-ethereum.info](https://upgrading-ethereum.info/latest)).

It is a work in progress. There's more about the roll-out plan in the [preface](https://eth2book.info/latest/preface).

## Licence

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) licence.

## Contributing

I am not looking for contributions at this time. That may change in future, but for now I will not be accepting any PRs to _src/book.md_.

Please feel free, however, to raise issues for typos, inaccuracies, omissions, and suggestions. And I'll happily consider PRs for improvements to the CSS or JavaScript.

Kindly note that [British spelling](https://www.oxfordinternationalenglish.com/differences-in-british-and-american-spelling/) is not a typo.

## Installing

### Pre-requisites

Install `node`, `npm`, and `gatsby-cli`. These are my versions:

```
> node --version
v16.17.1
> npm --version
8.19.2
> gatsby --version
Gatsby CLI version: 4.24.0
```

`gatsby-cli` can be installed with,

```
npm install -g gatsby-cli
```

You'll also need a working `perl` installed at _/usr/bin/perl_ so that the build can preprocess the book document.

### Building

Clone this repo. `cd` into it, then:

```
npm install
gatsby build
```

### Viewing

After building as above, do

```
gatsby serve
```

and visit http://localhost:9000 in a web browser.

Instead of building and serving, you can run `gatsby develop` and point your browser at port 8000. This will not pick up real-time changes to _src/book.md_ and will need to be restarted to pick up changes. It is useful, though, for checking CSS and React changes interactively.

## Workflow

The entire text for the book is in the _src/book.md_ file. Everything under _src/md/pages_ is auto-generated and any changes there will be lost.

There are various npm script commands to help with building:

  - `npm run clean` runs `gatsby clean`.
    - Do this after adding new graphics or if anything weird happens.
  - `npm run check` runs a bunch of custom linting and checking, controlled by the _bin/build/prebuild.js_ script.
    - Check all links to internal anchors, image files, and footnotes.
    - Spell check. Add any exceptions to _src/spellings.txt_
    - Markdown linting on both the original source and the generated pages.
  - `npm run build` runs `gatsby build --prefix-paths`.
  - `npm run serve` runs `gatsby serve --prefix-paths`.
    - Visit http://localhost:9000/altair/ to see the result.
  - `npm run links` checks external links.
    - Checking links to GitHub it will fail due to rate-limiting unless you supply GitHub credentials.

## How to

### Create a new page

New pages are created by appending HTML comments to headings (first three levels only):

```
## Heading <!-- /new/page/path -->
```

Take care to get the white space correct.

### Make a page unlinkable

Do this if a page has no content yet. It will appear in the index, but not linkable.

Append a `*` to the path:

```
## Heading <!-- /unlinked/page/path* -->
```

## Images

All images are SVG, and text elements are replaced by paths for maximum compatibility: it seems that a lot of applications have trouble with embedded fonts.

### Diagrams

Diagrams have been created in [diagrams.net](https://www.diagrams.net/) and exported to SVG with the following options:
  - Border width: 10 (some of the sketched elements go out of bounds)
  - Text settings: Convert labels to SVG
  
Source files for all diagrams are in the _src/diagrams_ directory. The font used is the _Gloria Hallelujah_ Google font.

### Charts

Charts (graphs, barcharts) are generated using my ~~hacked~~extended version of the [roughViz](https://github.com/benjaminion/roughViz) library. Load the _src/charts/charts.html_ file in a browser (you might need to fiddle with some browser security settings to allow it to load local files). The charts are downloaded via the link that should appear on each image. If the download link doesn't appear check the browser console for errors.

Pre-requisites:
  - _roughviz.min.js_ needs to be [downloaded](https://raw.githubusercontent.com/benjaminion/roughViz/master/dist/roughviz.min.js) from my repo and put in the _charts_ directory.
  - _svg-text-to-path.js_ needs to be [downloaded](https://raw.githubusercontent.com/paulzi/svg-text-to-path/master/dist/svg-text-to-path.js), also to the _charts_ directory.
  - The _Gaegu-Light.ttf_ file needs to be extracted from the [Gaegu](https://fonts.google.com/specimen/Gaegu) Google font and put in the _charts/font_ directory.
