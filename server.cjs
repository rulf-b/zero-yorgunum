// Bootstrap for cPanel/Passenger to start Next.js server (standalone output)
// Usage: set this file as the startup file in cPanel Node.js app.

const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const projectRoot = __dirname;

// Detect build layout: prefer top-level `standalone/` + `static/` (present in this repo),
// fall back to Next's default `.next/standalone` + `.next/static` if provided instead.
const candidates = [
  {
    name: 'prepacked',
    serverRoot: path.join(projectRoot, 'standalone'),
    staticDir: path.join(projectRoot, 'static'),
  },
  {
    name: 'next-default',
    serverRoot: path.join(projectRoot, '.next', 'standalone'),
    staticDir: path.join(projectRoot, '.next', 'static'),
  },
];

let serverRoot = '';
let staticDir = '';
for (const c of candidates) {
  if (fs.existsSync(c.serverRoot) && fs.existsSync(c.staticDir)) {
    serverRoot = c.serverRoot;
    staticDir = c.staticDir;
    break;
  }
}

if (!serverRoot) {
  console.error('Build output not found. Please upload either:');
  console.error('  - standalone/ and static/ (this repo layout), or');
  console.error('  - .next/standalone and .next/static (Next default standalone output).');
  process.exit(1);
}

// Ensure public assets are available next to the server root (Next serves from <serverRoot>/public)
const sourcePublicDir = path.join(projectRoot, 'public');
const targetPublicDir = path.join(serverRoot, 'public');

if (fs.existsSync(sourcePublicDir)) {
  try {
    if (!fs.existsSync(targetPublicDir)) {
      fs.mkdirSync(targetPublicDir, { recursive: true });
    }
    // Merge-copy public assets without overwriting existing files
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(sourcePublicDir, targetPublicDir, { recursive: true, force: false, errorOnExist: false });
    } else {
      const copyRecursive = (src, dest) => {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          for (const entry of fs.readdirSync(src)) {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
          }
        } else if (!fs.existsSync(dest)) {
          fs.copyFileSync(src, dest);
        }
      };
      copyRecursive(sourcePublicDir, targetPublicDir);
    }
    console.log('Synced public assets to', targetPublicDir);
  } catch (e) {
    console.warn('Could not sync public assets:', e?.message || e);
  }
} else {
  console.warn('Source public directory not found at', sourcePublicDir);
}

// Log the environment for debugging
console.log('Starting Next.js server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 'Not set (Passenger will provide)');
console.log('Server root:', serverRoot);
console.log('Static dir:', staticDir);

// Ensure expected Next static location exists: <serverRoot>/.next/static
try {
  const expectedNextDir = path.join(serverRoot, '.next');
  const expectedStaticDir = path.join(expectedNextDir, 'static');
  if (!fs.existsSync(expectedStaticDir)) {
    if (!fs.existsSync(expectedNextDir)) fs.mkdirSync(expectedNextDir, { recursive: true });
    if (fs.existsSync(staticDir)) {
      if (typeof fs.cpSync === 'function') {
        fs.cpSync(staticDir, expectedStaticDir, { recursive: true });
      } else {
        const copyRecursive = (src, dest) => {
          const stat = fs.statSync(src);
          if (stat.isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            for (const entry of fs.readdirSync(src)) {
              copyRecursive(path.join(src, entry), path.join(dest, entry));
            }
          } else {
            fs.copyFileSync(src, dest);
          }
        };
        copyRecursive(staticDir, expectedStaticDir);
      }
      console.log('Prepared Next static at', expectedStaticDir);
    } else {
      console.warn('Static assets directory not found at', staticDir);
    }
  }
} catch (e) {
  console.warn('Could not ensure Next static directory:', e?.message || e);
}

// Optional: ensure data directory exists within server root for API routes using process.cwd()
try {
  const sourceDataDir = path.join(projectRoot, 'data');
  const targetDataDir = path.join(serverRoot, 'data');
  if (fs.existsSync(sourceDataDir)) {
    if (!fs.existsSync(targetDataDir)) fs.mkdirSync(targetDataDir, { recursive: true });
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(sourceDataDir, targetDataDir, { recursive: true, force: false, errorOnExist: false });
    } else {
      const copyRecursive = (src, dest) => {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          for (const entry of fs.readdirSync(src)) {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
          }
        } else if (!fs.existsSync(dest)) {
          fs.copyFileSync(src, dest);
        }
      };
      copyRecursive(sourceDataDir, targetDataDir);
    }
    console.log('Synced data files to', targetDataDir);
  }
} catch (e) {
  console.warn('Could not ensure data directory:', e?.message || e);
}

// Start Next.js standalone server using absolute path
require(path.join(serverRoot, 'server.js'));


