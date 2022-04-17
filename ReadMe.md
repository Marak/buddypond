# Buddy Pond ( Alpha )
## *Cloud Operating System and Instant Messenger*
[https://buddypond.com](https://buddypond.com)

 - Cloud Operating System
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

**BuddyScript Commands**

Type `/bs` in any chat window to see `BuddyScript` commands.


`BuddyScript` is an integrated scripting languge in Buddy Pond that allows you to fully control the Desktop Application and all Apps through chat commands.

## Contributing to Buddy Pond

### No Build Steps. No Transpiling. No hassles.

### Buddy Pond Base ( Desktop + Base Apps )

Download Buddy Pond Base

```
git clone  --depth 1 git@github.com:Marak/buddypond.git
cd buddypond
```

There will be an `index.html` file in the `buddypond` directory. You must serve this `index.html` from an HTTP server. *Any* HTTP server will work. Try using python SimpleHTTPServer for now:

```
python -m SimpleHTTPServer
```

This will start the Buddy Pond application on port 8000. Open http://localhost:8000 in your local browser and you can immediately start adding and messaging buddies.

You may notice that certain apps will be missing. These apps are located in the [AppStore repo](https://github.com/Marak/buddypond-appstore).

### Adding / Modifiying Apps in Buddy Pond AppStore

Buddy Pond has an integrated AppStore which allows buddies to easily contribute new applications to the Buddy Pond ecosystem. It's very simple to use. No installation, compile, or transpiling steps are required.

The AppStore is located at: [https://github.com/Marak/buddypond-appstore](https://github.com/Marak/buddypond-appstore)

If you want to add a new application all you have to do is copy and paste an existing `App` folder and do a single string search on replace. 

Once the new App folder has been created you will now be able to open this `App` via `desktop.ui.openWindow('myapp')`

## Downloading Buddy Pond

If you want to run your own Buddy Pond it's very simple. Just load the `index.html` file in your browser ( requires a local http server ).

### Deploying your Buddy Pond

The easiest way to deploy Buddy Pond is to publish this entire folder to any web hosting platform. Since Buddy Pond is just static HTML, it can be hosted almost anywhere. You'll want to make sure your host has HTTPS / SSL enabled.

## Buddy Pond REST API SDK

Buddy Pond communicates via REST HTTP API calls to the Buddy Pond Server.

Interactive API Testing Page: [https://buddypond.com/sdk/client.html](https://buddypond.com/sdk/client.html)

JavaScript `buddypond.js` SDK API client: `./sdk/buddypond.js`

## cURL REST API Examples


**Sign Up or Get Auth Token for existing account**

```
curl -X POST "https://buddypond.com/api/v3/auth"  -H 'Content-Type: application/json' -d '{"buddyname":"Dave","buddypassword":"asd"}'
```

*Return the `qtokenid` uuid which must be used for all subsequent calls to the API session.*

**Send Buddy Request**

```
curl -X POST "https://buddypond.com/api/v3/buddies/Marak/addbuddy"  -H 'Content-Type: application/json' -d '{"qtokenid":"00e7fa95-ff2c-40d6-a6c0-0bc4457d6196"}'
```

**Send Message To Buddy**

```
curl -X POST "https://buddypond.com/api/v3/messages/buddy/Marak"  -H 'Content-Type: application/json' -d '{"qtokenid":"00e7fa95-ff2c-40d6-a6c0-0bc4457d6196", "text": "hello buddy!"}'
```

**Get Messages**

```
curl -X POST "https://buddypond.com/api/v3/messages/getMessages"  -H 'Content-Type: application/json' -d '{"qtokenid":"00e7fa95-ff2c-40d6-a6c0-0bc4457d6196", "buddyname": "Marak,Dave", "pondname": "Lily"}'
```

**Get Buddy List and Buddy Requests**

```
curl -X POST "https://buddypond.com/api/v3/buddies"  -H 'Content-Type: application/json' -d '{"qtokenid":"00e7fa95-ff2c-40d6-a6c0-0bc4457d6196"}'
```

**Approve Buddy Request**

```
curl -X POST "https://buddypond.com/api/v3/buddies/Marak/approve"  -H 'Content-Type: application/json' -d '{"qtokenid":"00e7fa95-ff2c-40d6-a6c0-0bc4457d6196"}'
```

**Deny Buddy Request**

```
curl -X POST "https://buddypond.com/api/v3/buddies/Marak/deny"  -H 'Content-Type: application/json' -d '{"qtokenid":"00e7fa95-ff2c-40d6-a6c0-0bc4457d6196"}'
```

**Remove Buddy from Buddy List**

```
curl -X POST "https://buddypond.com/api/v3/buddies/Marak/remove"  -H 'Content-Type: application/json' -d '{"qtokenid":"00e7fa95-ff2c-40d6-a6c0-0bc4457d6196"}'
```

## Building custom Buddy Pond `Desktop`

### Example Usage

```js
$(document).ready(function(){
  desktop
    .use('console')
    .use('localstorage')
    .use('settings')
    .use('wallpaper')
    .use('audioplayer')
    .use('tts')
    .use('login')
    .use('notifications')
    .use('buddylist')
    .use('pond')
    .use('streamsquad')
    .use('spellbook', { defer: true })
    .use('profile', { defer: true })
    .use('mirror', { defer: true })
    .use('videochat', { defer: true })
    .use('automaton', { defer: true })
    .ready(function(err, apps){
      // desktop.log("Loaded", desktop.apps.loaded);
      desktop.log('Ready:', 'Buddy Pond', 'v4.20.69')
      });
  });
```

### Building custom Buddy Pond `App`

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

### `defer` or `lazy` load of `App`

Buddy Pond Desktop supports both `defer` loading and `lazy` loading of `App`. 

`defer` means load after Deskop is ready.
`lazy` means load after user clicks on `App` icon.

### **Apps load in this order:**

### desktop.use(appName)
*Sync style blocking loads*
Calling `desktop.use(appName)` sync style should be used only for mission-critical Apps. 

The Desktop will **not** be ready until these Apps finish loading.

### desktop.use(appName, { defer: true })

*Async style non-blocking loads*
`defer` indicates the `App` wil load immediately after the Desktop is ready.
`defer` param should be used for Apps that are non-critical, but frequently used.

The Desktop will load these Apps **immediately after** it's ready. If the Buddy tries to open a deferred App while it is still loading, the UI will respond with a spinning cursor and hold the `openWindow` event until the App has completely loaded.

### After Desktop Ready Completes ( `lazy` loading )

After the Desktop is ready, additional Apps can be `lazy` loaded by calling: `desktop.use(appName).ready(function(){})` again.

The desktop handles this automatically by attempting to `lazy` load any opens which are not loaded and are attempted to be opened with `desktop.ui.openWindow(appName);`. 

The UI will displaying a spinning cursor to the Buddy and hold the `openWindow` event until the App has completely loaded.

Ex: `desktop.ui.openWindow('paint');`

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
