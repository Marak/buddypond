var CLOUDSAVEURL = "";

let referrer = document.referrer;
if(referrer==null || referrer=="")
	referrer = "NONE";
$.get('https://neilb.net/tetrisjsbackend/api/stuff/AddN64Wasm?referrer=' + referrer);

