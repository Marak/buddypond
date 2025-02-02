import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { version } from './package.json';

export default defineConfig({
  optimizeDeps: {
    include: ['mime']
  },
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
  build: {
    // Specify build options
    lib: {
      entry: path.resolve(__dirname, 'bp.js'), // Ensure this is the path to your entry file
      name: 'BP',
      formats: ['umd'], // Output format as IIFE
    },
    rollupOptions: {
      // further Rollup options can go here
      output: {
        // set custom output dir
        dir: 'dist',
        // Additional output options
        extend: true, // Extend global variable
        globals: {
          BP: 'BP'
        }
      }
    }
  }
});
