Star Wars Combine: Galactic Shockball League
================

## Install
* `git clone https://github.com/bpkennedy/shockball2.git`
* `cd shockball2`
* do `npm install` in **three places**. Root directory, and then `/client` and `/server`.
* all npm tasks are run from the root directory of the project.

>**PRE-COMMIT** - there is a pre-commit hook (uses the 'husky' library) that is setup to require tests to pass and lint to pass before you are able to commit to a local branch, otherwise it will not allow you. **Update**: this is now only for api server changes

## Develop locally
After ensuring you have `npm install`'d everything, you can build and serve the react front-end by doing:
* `npm run dev`

For just changes to the api, you can do:
* `npm run buildServer`
* `npm run startServer`

However, if you need the entire frontend + api built and served you can do:
* `npm run build`
* `npm run startServer`

The front-end is always served from localhost:8080. The Swagger docs (with interactive CRUD thingy) can be accessed at localhost:8080/docs.

### Note about Pull Requests
You want to build before you create your PR. I did have Heroku setup to run build on deploy but it took so damn long and also was getting kicked off again on each dyno wakeup - I never was abe to find out why. To avoid, I have been building and committing the compiled code.  To build, simply:
* empty directory at `/public/static/js` and `/public/static/css`
* run `npm run build`
* add the bundle files/modifications produced from this task to your branch/PR.

### Secret API keys for Firebase and SWC API
There are two .json files with sensitive information in them - the `dev-firebase-security.json` and the `dev-swc-security.json`. You need to reach out to the project maintainer (bpkennedy) for how to get these files if you need to develop locally.

