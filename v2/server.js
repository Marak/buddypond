import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

//import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: 'html' }, // Ensure this is set correctly
    appType: 'custom', // This ensures we're not handling HTML automatically
  });

  // Use Vite's middleware
  app.use(vite.middlewares);

  // Correctly resolve the path to your static assets
  const staticPath = path.join(__dirname, 'apps', 'based');
  console.log("staticPath", staticPath)
  app.use('/v2/apps/based', express.static(staticPath));

  // mount a dummy /events route for EventSource testing
  app.get('/profile', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };


    let newMessage = 'profile::buddy::newmessage';
    let buddyCalling = 'profile::buddy::calling';
    let buddyIn = 'profile::buddy::in';
    let buddyOut = 'profile::buddy::out';
    const interval = setInterval(() => {


      sendEvent({ event: buddyIn, data: { name: 'Buddy 1', buddydata: {} } });
    }, 500);

    const interval2 = setInterval(() => {

      let chatMessage = {
        to: 'Marak',
        from: 'Buddy 1',
        message: 'Hello Marak! message',
        text: 'Hello Marak! text',
        ctime: Date.now()
      };
      sendEvent({ event: newMessage, data: chatMessage });
    }, 1000);




    res.on('close', () => {
      clearInterval(interval);
    });
  });

  // Handle any requests that don't match the above
  app.use('*', async (req, res) => {
    res.status(404).send('Page not found');
  });

  app.listen(5174, () => {
    console.log('Server running on http://localhost:5174');
  });
}

createServer();
