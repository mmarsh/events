VS Event System
====================
Hi! Thanks for taking the time to look at this coding challenge.

Startup
--------------------
To run the application, just clone this repo and open index.html.
I kept all directive templates inline to avoid cross domain request issues
when running outside of a server

Unit Tests
--------------------
To run the unit tests you will need nodejs and npm installed.
Go to the root directory and run

```sh
npm install
bower install
node node_modules\karma\bin\karma start test\karma.conf.js --single-run
```

npm install will bring down all of the node dependencies, which are laid out in package.json.

bower install gets the javascript dependencies. When running the actual application, the angular
script is loaded through angularjs.org's hosted files. For the tests we want a local copy, as well
as the angular mocking module for helping us test. 
All of these dependencies are found in bower.json

Lastly, I used the karma test runner with jasmine as my testing framework.
Karma has great plugin support for things like jasmine, and it can also continuously watch for modified files and execute tests as you're working, shortening the feedback loop.
To start karma in continuous run mode, you can drop the --single-run switch from the start command

About the implementation
--------------------
Outside of testing no external libraries were used. My first thought was that there must be a data grid library out there for angular, and sure enough ng-grid seems to have a lot of traction. But once I starting messing with it I decided that I'd rather not introduce the learning curve and instead took the path of trying to keep things simple and using what was already available, i.e. tables.
Much maligned for their use as a layout tool in lieu of CSS, they're still very powerful and seemed to do the trick.

Underneath the covers are a few controllers, some messaging, and some data filtering to adapt to the changing tabs.

Things that would be cool to do
--------------------
  - Implement some sort of retry logic. Right now the app contends with the intermittent service failures by prompting the user to try again.
  - More advanced tab filtering logic. For example, the Local Events could tap into the browser's location features (right now it's hard-coded to assume you're in NY)
  - Let the user make their own tab. A few form fields and they could specify something simple like a string, a comparator, and a data field and the app can generate a filter, create new tab to hang on to, and maybe even stash it in local storage so you can have it the next time you start the app
