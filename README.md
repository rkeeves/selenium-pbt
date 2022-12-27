# selenium-pbt

Simple node.js + jest + selenium project.

Property based testing at its essence sounds cool.
But stateful model based testing using `fast-check` sounds even cooler.

In this repository I just made a totally minimalistic little example of using `fast-check`.

## Overview

If we have a state-machine, possible state-transitions, a simplified model, then we can be a bit more sophisticated than randomly turning knobs and hitting things with our hammer.

This dumb example is centered on [Sauce demo](https://github.com/saucelabs/sample-app-web).
This might be not the best use case for model based testing, but I like browser automation, so I thought why not...

**Q: What is the goal?**

**A: To find a bug... without writing a normal test case.**

By test case I mean the usual non-sense:

```gherkin
Given gaily they ring
When people sing songs of good cheer
Then christmas is here
```

So... instead of writing user stories, we just model the contract/spec.
*(It is insanely hard to model 'correctly' - to help narrowing, and also to be 'shrink compatible' -, in my opinion. I don't know. It might be because I'm dumb... There are some really smart people who are really good at this kind of stuff.)*

On the Inventory Page, a user can add-to-cart/remove-from-cart a product.

- The Inventory Page should render the add-to-cart button only when the product is NOT in the cart.
- The Inventory Page should render the remove-from-cart button only when the product is IN the cart.
- A product cannot be both in and NOT in the cart (at least while qbit-sauce-demo-app is not ready for production due to high margins of measurement errors).

Just to spice things up a bit both `standard_user` and `problem_user` was used.

In this simplistic, dumb, ineffective and overkill example we define a:
- `Model` which is a lightweight representation of the system
- an initial `Model` instance
- `Commands` which are like state transitions
  - a `Command` has a `check` method to prune absurdity (think of it like: you cannot query if you have no db connection),
  - a `Command` has a `run` method, which mutates the system under test, checks contraints
  - a `Command` - if everything went fine - mutates the `Model` (clone of the previous state...)

You supply `Command` generators. Using these fast-check will generate a pseudo-random sequence of commands (remember the `check`, it is needed to prune out non-sense).

After all of this, some command sequence will be `executed`.
If the command sequence encounters a problem, then fast-check will try to `shrink` the sequence to generate a `minimal reproducible example`.

At the end of the day:
 - **the program needs to find a bug,**
 - **and spit out a command sequence (so we can reproduce the bug),**
 - **but the program must shrink down the command sequence to the bare minimum to reproduce the issue (so we can reproduce the bug easily)**

So basically executing (ran by jest, but be aware...`beforeEach` is part of fast-check):

> **DO NOT ATTEMPT TO RUN THIS** against the public saucedemo app. Clone it and run the server locally. The test basically fuzzes the browser and the server.


```shell
npm run test example.spec.ts
```

The above test will produce a report like this:

```shell
 RUNS  specs/example.spec.ts
 FAIL  specs/example.spec.ts (16.8 s)vice_event_log_impl.cc(215)] [21:50:58.202] USB: usb_device_handle_win.cc:1045 Failed to read descriptor from node connection: E  Sauce demo model
    × Inventory Page add-to-cart/remove, should behave just like add/remove from a set (13306 ms)

  ● Sauce demo model › Inventory Page add-to-cart/remove, should behave just like add/remove from a set

    Property failed after 2 tests
    { seed: -214457843, path: "1:3", endOnFailure: true }
    Counterexample: [LoginSuccessfullyCommand{uname=problem_user, pass=secret_sauce},AddItemViaInventoryCommand{itemId=3} /*replayPath="CBAB:K"*/]
    Shrunk 1 time(s)
    Got error: TimeoutError: Waiting for element to be located By(css selector, button[data-test='remove-test.allthethings()-t-shirt-(red)'])
    Wait timed out after 5111ms

    Stack trace: TimeoutError: Waiting for element to be located By(css selector, button[data-test='remove-test.allthethings()-t-shirt-(red)'])
    Wait timed out after 5111ms

      at node_modules/selenium-webdriver/lib/webdriver.js:907:17
      Execution summary:
      √ [LoginSuccessfullyCommand{uname=problem_user, pass=secret_sauce} /*replayPath="CBAB:K"*/]
      × [LoginSuccessfullyCommand{uname=problem_user, pass=secret_sauce},AddItemViaInventoryCommand{itemId=5} /*replayPath="CBAB:K"*/]
      . √ [ /*replayPath="CBAB:K"*/]
      . √ [ /*replayPath="CBAB:K"*/]
      . √ [LoginSuccessfullyCommand{uname=problem_user, pass=secret_sauce},AddItemViaInventoryCommand{itemId=0} /*replayPath="CBAB:K"*/]
      . × [LoginSuccessfullyCommand{uname=problem_user, pass=secret_sauce},AddItemViaInventoryCommand{itemId=3} /*replayPath="CBAB:K"*/]
      . . √ [ /*replayPath="CBAB:K"*/]
      . . √ [LoginSuccessfullyCommand{uname=problem_user, pass=secret_sauce},AddItemViaInventoryCommand{itemId=2} /*replayPath="CBAB:K"*/]
      at buildError (node_modules/fast-check/lib/check/runner/utils/RunDetailsFormatter.js:131:15)
      at asyncThrowIfFailed (node_modules/fast-check/lib/check/runner/utils/RunDetailsFormatter.js:148:11)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        16.98 s
Ran all test suites matching /example.spec.ts/i.
```

In the report above, there's a really important thing the `seed` and `path` (*LIE! There are actually a lot of   interesting things not just one...*):

```shell
    Property failed after 2 tests
    { seed: -214457843, path: "1:3", endOnFailure: true }
    Counterexample: [LoginSuccessfullyCommand{uname=problem_user, pass=secret_sauce},AddItemViaInventoryCommand{itemId=3} /*replayPath="CBAB:K"*/]
    Shrunk 1 time(s)
```

It gives you the pseudo-random `seed` and the `path`.
You can copy and paste this into `example.spec.ts` (I commented into the file).

In this dumb example this approach is not the best.
I mean most bugs become apparent even after a short manual testing session.
Also, most bugs were intentionally made by the developers,
so they are a bit...unrealistic.

All in all: the main point of this repo is just to show that model based testing, or even just property based testing can be applied to any system.

Is this method good for web testing?
I leave this up to (and really depends on what kind of app do you want to test...).

On the other hand a more practical use would be to use this in conjuction with example based testing.
I mean with examples...you can never be exhaustive *(in some rare cases you can)*.

Also...I don't really care about selenium's nonsense, so I did some crazy bad things.

But...once again: Selenium is not the point. I wrote a lot about stabilization and advanced techniques in other repos. In this repo I'm just like `Selenium, please sush...`.

The main point is the approach.
I mean with this approach our main task is modeling.
I mean you must create a model which can 'help' the random search and shrinking to 'home in to the bugs' like little heat seeking missiles.
So, as always with these kinds of search, minimalistic models, clearly defined contracts and good heuristics can help a lot...I guess. I can't prove it though :)
