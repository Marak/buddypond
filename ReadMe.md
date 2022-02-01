# buddy pond ( alpha )
## a pond for buddies

 - Peer to Peer Buddy Messaging
 - Doesn't store your data
 - Unencrypted messages
 - Unencrypted chat rooms
 - No followers or following counts, just Buddies
 - Open-Source: Built By Buddies
 - Developer-friendly REST API

### Download and Start Messaging Buddies Now

### Installation

Download Zip File TODO

```
git clone git@github.com:Marak/buddypond-client.git
```

*cloning the pond*

### Starting Buddy Pond

```
cd buddypond
open index.html
```

This will start the Buddy Pond application. Open the web interface in your local browser and you can start adding and messaging buddies!

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