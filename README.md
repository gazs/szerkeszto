# pattern drafting js thing

This is an app that I'm writing to learn about frontend tools as well as pattern drafting and tailoring.


- drafts are functions that take an object of measurements (measurements look like [this](https://github.com/gazs/szerkeszto/blob/master/sizes/normal.json)) and return something like `{points: {}, paths: {}}`
- szerkesztes.jsx renders an SVG  after executing the passed in draft function
- editor.html is (failed?) attempt at writing a DSL for describing the steps in a draft. `szerk.pegjs` is a parser written in [PEG.js](http://pegjs.org) that can render the jacket draft until point #49
- the rest is a React playground / battlefield.

## to run

`webpack-dev-server --progress --colors --devtool inline-source-map`

## to build

`webpack -p`

todo: automate build process / publishing to gh-pages?

## to see live version

- https://rawgit.com/gazs/szerkeszto/master/index.html#/zako
- https://rawgit.com/gazs/szerkeszto/master/editor.html



## more info (in Hungarian)

* http://testreszabas.cink.hu/bevasarlas-ferfi-es-fiuruhak-szerkesztese-es-szabasa-1721955504
* http://testreszabas.cink.hu/csak-nem-tudtam-megallni-hogy-ne-kezdjek-el-kodolni-1723067528


## This is the reference drawing from my book:

<img src="https://raw.githubusercontent.com/gazs/szerkeszto/master/zako.jpg">
