testgen1
================
To try to take over the world!

#### No transaction ID used

## Prerequisites
1. Access to node on your machine via `cmd`/`git bash`. You can type `node -v` and if you receive a version number then you have node setup.
2. Access to our npm registry, Artifactory, by doing `npm config set registry http://nlpadocrep-1.edwardjones.com:8181/artifactory/api/npm/npm-dev/
`.
3. A richer text editor (Atom, Sublime Text, Visual Studio Code) is recommended.  A full-featured IDE (Eclipse, Visual Studio) is not necessary but works as well.

## Install
* Use `cmd`/`git bash` and from the project directory do `npm install`.

## Usage
The commands for operating the project tasks are inside the `package.json` in the `scripts` section.  To run any of these commands, from your run `npm run (taskname)`.  Tasks are:

* `dev` - Babel converts your es6 code to es5 and starts a web server on port http://localhost:8080.  This is what you should do for local development.
* `build` - babelifys your code and "compiles" it into a /dist folder. This is the code that should be served for the production environment
* `start` - Like `dev` but runs what was "compiled" into the /dist folder. Use this to validate all is well before production push and/or to troubleshoot issues that exist when running from /dist but not from /src
* `lint` - runs eslint code linting for your code.  This should be run and pass before anything is merged into master branch.
* `test` - runs Jest tests for unit and integration tests.  It will run any files with extension `*.test.js`.
* `coverage` - creates a code coverage report (a feature built into Jest) that shows code branching coverage.  You can view in the `cmd`/`git bash` and it also creates a coverage folder with a rich html report.

**Note** - eslint and babel configurations are both inside `package.json`, if you need to make changes to those.

>**PRE-COMMIT** - there is a pre-commit hook (uses the 'husky' library) that is setup to require tests to pass and lint to pass before you are able to commit to a local branch, otherwise it will not allow you.  You can override this by using `--no-verify` as in `git commit -m "Even though tests/lint doesn't pass I want to commit anyway" --no-verify`.

## Running in production
Wherever this ends up running, you need to:
* Bring down the project to the server's file system (perhaps from Github master branch).
* Ensure the server has node installed and `cmd`/`git bash` access
* Go into the project and do `npm run build` and then `NODE_ENV=production npm start` which will start the server on port 8080. The "production" environment variable can allow the http traffic logger to use the combined/standard Apache style traffic logging.
