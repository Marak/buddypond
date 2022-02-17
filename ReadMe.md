# Buddy Pond ( Alpha )
## *a place for buddies*
[https://buddypond.com](https://buddypond.com)

 - Instant Buddy Messaging
 - Video and Audio Calls
 - Chat rooms ( we call them "Ponds" )
 - No followers or following counts, just Buddies
 - Open-Source: Built By Buddies
 - Developer-friendly REST API

## Quick Start

We've got a free hosted client available at: [https://buddypond.com](https://buddypond.com)

You can sign in immediately using a new unique username and passcode.

## Downloading Buddy Pond

If you want to run your own Buddy Pond it's very simple. Literally just open the `index.html` file in your browser.

### Installation

Download Buddy Pond as zip... [https://github.com/Marak/buddypond/archive/refs/heads/master.zip](https://github.com/Marak/buddypond/archive/refs/heads/master.zip)



...or you can use `git` to clone Buddy Pond.

```
git clone  --depth 1 git@github.com:Marak/buddypond.git
```

Once you have downloaded a local Buddy Pond you can start it!

### Starting Buddy Pond from file system

```
cd buddypond
open index.html
```

This will start the Buddy Pond application. Open the web interface in your local browser and you can immediately start adding and messaging buddies!

### Starting Buddy Pond with HTTPS / SSL

The `file://` protocol should support all core features like: Buddy List, Buddy Messaging, and Ponds

The `https://` protocol is required for more advanced features like: Video Calls or third-party APIs ( like Youtube ) will not work correctly when loading Buddy Pond directly from `file://`.

To start Buddy Pond over HTTPS / SSL, simply place the *entire* contents of *this* folder into any existing secure web server's public HTML directory and Buddy Pond will be accessible.

### Deploying your Buddy Pond

The easiest way to deploy Buddy Pond is to publish this entire folder to any web hosting platform. Since Buddy Pond is just static HTML, it can be hosted almost anywhere. You'll want to make sure your host has HTTPS / SSL enabled.

## API Rest Client

Interactive API Testing Page: /sdk/client.html

JavaScript buddypond.js API client: buddypond.js

API Specification Page: /api/v3

Buddy Pond communicates via REST API calls to the Buddy Pond Server.

### cURL REST API Examples

**Open `client.html` for interactive REST examples**

**Get Auth Token**
curl -d buddyname=Dave -d buddypassword=asd "http://localhost:8080/api/v3/auth"

**Send Buddy Request**
curl -H "qtokenid: abcd1234" -X POST "http://localhost:8080/api/v3/buddies/Marak/addbuddy"

**Send Message To Buddy**
curl -H "qtokenid: abcd1234" -d buddytext=hello "http://localhost:8080/api/v3/buddies/Marak/message"

**Get Buddy Messages**
curl -H "qtokenid: abcd1234" "http://localhost:8080/api/v3/buddies/Marak/message"

**Get Buddy List and Buddy Requests**
curl -H "qtokenid: 27727B46-6D5B-4DC7-98CF-CFC54BF86B24" "http://localhost:8080/api/v3/buddies"

**Approve Buddy Request**
curl -H "qtokenid: abcd1234" POST "http://localhost:8080/api/v3/buddies/Marak/approve"

**Deny Buddy Request**
curl -H "qtokenid: abcd1234"  POST "http://localhost:8080/api/v3/buddies/Marak/deny"

**Remove Buddy from Buddy List**
curl -H "qtokenid: abcd1234"  POST "http://localhost:8080/api/v3/buddies/Marak/remove"

### License
All rights reserved Marak Squires 2022