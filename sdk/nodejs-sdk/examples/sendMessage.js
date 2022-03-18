let bp = require('../buddypond');
let client = new bp.Client({})

async function go () {
  
  await client.authBuddy('Bob', 'asd');
 
  await client.pondSendMessage('Lily', 'sexy script');
  await client.buddySendMessage('Marak', 'hello there!');

}

go();