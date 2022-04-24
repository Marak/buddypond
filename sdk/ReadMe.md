# Buddy Pond SDK ( Alpha )
## a pond for buddies


## Quick Start

The `buddypond.js` file contains a simple REST API wrapper you can use in the browser to communicate with the Buddy Pond Backend Server HTTP REST API.

`client.html` includes a simple HTML web form for sending and testing API requests.


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
