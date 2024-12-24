import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { version } from './package.json';

export default defineConfig({
  base: './',
  server: {
    configureServer: (server) => {
      return () => {
        server.middlewares.use((req, res, next) => {
          console.log("Requested URL:", req.url);  // Note: Using req.url instead of req.originalUrl
          const filePath = path.join(__dirname, 'src', req.url); // Adjust path as needed
          console.log("Resolved File Path:", filePath);
          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(filePath).pipe(res);
          } else {
            console.log("File not found:", filePath);
            next();
          }
        });
      };
    },
    watch: {
      ignored: [],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
});
