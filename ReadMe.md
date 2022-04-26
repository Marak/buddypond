# Buddy Pond ( Alpha )
## *Cloud Desktop and Instant Messenger*
[https://buddypond.com](https://buddypond.com)

 - Cloud Desktop
 - Desktop and Mobile Interfaces
 - Buddy Lists! Add Your Buddies
 - Peer to Peer Instant Messaging
 - Multimedia Pond Chat Rooms
 - Image and Paint Editors 
 - Audio MIDI Support
 - Create Media And Send To Buddies
 - Remix and Send Media With Single Click
 - Voice and Video Calls With Buddies!
 - Interdimensional Cable and Live Streaming
 - Audio Video Visualizations and VFX
 - Integrated Scripting Language ( `BuddyScript` )
 - Desktop download browser size is < 1MB ( Uncompressed )

###  Making the Internet Fun Again!

### No followers. No following. No Problem

### All your localhost works offline

## Quick Start

Buddy Pond is free use at: [https://buddypond.com](https://buddypond.com)

**Screenshots**

<a href="https://buddypond.com"><img src="https://github.com/Marak/buddypond-assets/raw/master/promo/buddypond-demo-april-2022.gif"/></a>

*April 13th, 2022*

## Built-in Help Commands

Once you've loaded Buddy Pond you can type the following commands to get help:

**Display chat commands**

Type `/help` in any chat window to get help.

**`BuddyScript` Commands**

Type `/bs` in any chat window to see `BuddyScript` commands.


`BuddyScript` is an integrated scripting languge in Buddy Pond that allows you to fully control the Desktop Application and all Apps through chat commands.

## Contributing to Buddy Pond

### No Build Steps. No Transpiling. No hassles.

## Download Buddy Pond with `My Buddy`

[My Buddy](https://github.com/Marak/mybuddy) is a companion app that lets you quickly clone and start Buddy Pond locally without having to run any commands. Get it at: [https://github.com/Marak/mybuddy](https://github.com/Marak/mybuddy)

**Remember**: Buddy Pond and the Buddy Pond AppStore *are just plain HTML and JavaScripts* with no build steps. You can clone either of these repos and use *any* HTTP server to run Buddy Pond locally.

## Download Buddy Pond with `git`

### Buddy Pond Based ( Desktop + Based Apps )

Download Buddy Pond Based

```
git clone  --depth 1 git@github.com:Marak/buddypond.git
cd buddypond
```

There will be an `index.html` file in the `buddypond` directory. You must serve this `index.html` from an HTTP server. *Any* HTTP server will work. You can download [My Buddy](https://github.com/Marak/mybuddy) to host or try using python SimpleHTTPServer for a quick start:

```
python -m SimpleHTTPServer
```

This will start the Buddy Pond application on port 8000. Open http://localhost:8000 in your local browser and you can immediately start adding and messaging buddies.

If you'd like to modify the based `Apps` see the `./desktop/based/` folder.

### Adding / Modifiying Apps in Buddy Pond AppStore

Buddy Pond has an integrated AppStore which allows buddies to easily contribute new applications to the Buddy Pond ecosystem. It's very simple to use. No installation, compile, or transpiling steps are required.

If you'd like to modify `Apps` see the `./desktop/appstore/` folder.

If you want to add a new application all you have to do is copy and paste an existing `App` folder and do a single string search and replace. 

Once the new App folder has been created you will now be able to open this `App` via `desktop.ui.openWindow('myapp')`. 

### Deploying your Buddy Pond

The easiest way to deploy Buddy Pond is to publish this entire folder to any web hosting platform. Since Buddy Pond is just static HTML, it can be hosted almost anywhere. You'll want to make sure your host has HTTPS / SSL enabled.

## Buddy Pond REST API SDK

Buddy Pond communicates via REST HTTP API calls to the Buddy Pond Server.

Interactive API Testing Page: [https://buddypond.com/sdk/client.html](https://buddypond.com/sdk/client.html)

JavaScript `buddypond.js` SDK API client: `./sdk/buddypond.js`

## Building custom Buddy Pond `App`

`desktop.use(appName, params)` will load Buddy Pond Apps which have an `App.load` method.

`App.load` is an async function

**For Example:**

```js
desktop.boo.load = function (params, next) {
  setTimeout(function(){
    // async `App.load` functions *must* continue with their callback
    next(null, true);
  }, 3000)
}
```

You may now open `App.Boo` by calling `desktop.ui.openWindow('boo', { foo: 'bar' })`

## Buddy Pond `AppStore`

See: https://github.com/Marak/buddypond-appstore

#### Linting / `eslint`

The codebase is currently *loosely linted*. You should be able to contribute to sections of code without asking us to reformat the entire codebase. Please try your best to adhere the best you can to our coding style and `.eslintrc.js` file.

If you need to lint a file you can install and run `eslint`

`npm install -g eslint@8.12.0`
`eslint ./path/to/file.js --fix`

## Buddy Pond Backend Server

So you've made it to the end of the `ReadMe.md`? Neat.

Buddy Pond consists of a backend server and front-end client.

The server code is currently private access invite-only. We intend to make the server code public in two more weeks.

In order to start your own private Buddy Pond ( not federated ) you can download the Buddy Pond Server at [https://github.com/marak/buddypond-server](https://github.com/marak/buddypond-server)

Once you have your own Buddy Server running you can modify `./sdk/buddypond.js` to point to your server endpoint over HTTP.

### License
Buddy Pond Copyright (C) 2022 Marak Squires
See `LICENSE` file
