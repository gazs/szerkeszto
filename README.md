# pattern drafting js thing

This is an app that I'm writing to play with newish frontend tools as well as pattern drafting and tailoring.


- drafts are functions that take an object of measurements (measurements look like [this](https://github.com/gazs/szerkeszto/blob/master/sizes/normal.json)) and return something like `{points: {}, paths: {}}`
- szerkesztes.jsx renders an SVG  after executing the passed in draft function
- editor.html is (failed?) attempt at writing a DSL for describing the steps in a draft. `szerk.pegjs` is a parser written in [PEG.js](http://pegjs.org) that can render the jacket draft until point #49
- the rest is a React playground / battlefield.

## to run

`webpack-dev-server --progress --colors --devtool inline-source-map`

## to deploy

`webpack -p && GIT_DEPLOY_DIR=build ./deploy.sh && rm build/*.js`

## to see live version

- http://gazs.github.io/szerkeszto/#/zako
- http://gazs.github.io/szerkeszto/editor.html



## more info (in Hungarian)

* http://testreszabas.cink.hu/bevasarlas-ferfi-es-fiuruhak-szerkesztese-es-szabasa-1721955504
* http://testreszabas.cink.hu/csak-nem-tudtam-megallni-hogy-ne-kezdjek-el-kodolni-1723067528


## This is the reference drawing from my book:

<img src="https://raw.githubusercontent.com/gazs/szerkeszto/master/zako.jpg">
