# Buddy Pond ( Alpha )
## *a place for buddies*
[https://buddypond.com](https://buddypond.com)

 - Cloud Desktop
 - Instant Buddy Messaging
 - Video and Audio Calls
 - Chat rooms ( we call them "Ponds" )
 - No followers or following counts, just Buddies
 - Open-Source: Built By Buddies
 - Developer-friendly REST API

## Quick Start

Buddy Pond is free use at: [https://buddypond.com](https://buddypond.com)

You can sign in immediately with a new unique username and passcode.

<a href="https://buddypond.com"><img src="https://github.com/Marak/buddypond-assets/raw/master/promo/alpha-demo.gif"/></a>
<a href="https://buddypond.com"><img src="https://github.com/Marak/buddypond-assets/raw/master/promo/alphs-screenshot.png"/></a>


## Downloading Buddy Pond

If you want to run your own Buddy Pond it's very simple. Literally just open the `index.html` file in your browser.

### Installation

Download Buddy Pond as zip... [https://github.com/Marak/buddypond/archive/refs/heads/master.zip](https://github.com/Marak/buddypond/archive/refs/heads/master.zip)

...or you can use `git` to clone Buddy Pond.

```
git clone  --depth 1 git@github.com:Marak/buddypond.git
```

Once you have downloaded a local Buddy Pond you can start it!

### Starting Buddy Pond Locally

```
cd buddypond
python -m SimpleHTTPServer
```

This will start the Buddy Pond application on port 8000. Open http://localhost:8000 in your local browser and you can immediately start adding and messaging buddies!

### Starting Buddy Pond with HTTPS / SSL

The `http://` protocol should support all core features like: Buddy List, Buddy Messaging, and Ponds

The `https://` protocol is required for more advanced features like Video Calls.

To start Buddy Pond over HTTPS / SSL, simply place the *entire* contents of *this* folder into any existing secure web server's public HTML directory and Buddy Pond will be accessible.

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

## Buddy Pond Mobile Client

The mobile friendly client is in progress. We have stubs placed in `./mobile` and will have a version of Buddy Pond working for iOS a and Andriod soon. Please [reach out](https://github.com/Marak/buddypond/issues) if you can help!

## Buddy Pond Backend Server
So you've made it to the end of the `ReadMe.md`? Neat.

Buddy Pond consists of a backend server and front-end client.

In order to start your own private Buddy Pond ( not federated ) you can dowload the Buddy Pond Server at [https://github.com/marak/buddypond-server](https://github.com/marak/buddypond-server)

Once you have your own Buddy Server running you can modify `./sdk/buddypond.js` to point to your server endpoint over HTTP.

### License
Buddy Pond Copyright (C) 2022 Marak Squires
See `LICENSE` file
