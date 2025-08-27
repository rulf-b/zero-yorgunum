// Bootstrap for cPanel/Passenger to start Next.js server (standalone output)
// Usage: set this file as the startup file in cPanel Node.js app.

const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const SKIP_STATIC_COPY = String(process.env.SKIP_STATIC_COPY || '').toLowerCase() === '1';

const projectRoot = __dirname;

// Help Node resolve modules in cPanel: include app and nodevenv global node_modules
try {
  const Module = require('module');
  const addNodePath = (p) => {
    if (p && fs.existsSync(p)) {
      process.env.NODE_PATH = process.env.NODE_PATH ? (p + path.delimiter + process.env.NODE_PATH) : p;
      Module._initPaths();
      console.log('[bootstrap] Added NODE_PATH:', p);
    }
  };
  // app-level node_modules
  addNodePath(path.join(projectRoot, 'node_modules'));
  // nodevenv global modules: <nodevenv>/bin/node -> ../lib/node_modules
  const nodeBin = process.execPath; // e.g. /home/.../nodevenv/app/20/bin/node
  const globalModules = path.resolve(nodeBin, '..', '..', 'lib', 'node_modules');
  addNodePath(globalModules);
} catch (e) {
  console.warn('[bootstrap] Could not adjust NODE_PATH:', e?.message || e);
}

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

// Diagnostics
console.log('[bootstrap] projectRoot:', projectRoot);
console.log('[bootstrap] chosen layout:', serverRoot.includes('.next') ? 'next-default' : 'prepacked');
console.log('[bootstrap] serverRoot:', serverRoot);
console.log('[bootstrap] staticDir:', staticDir);

// Ensure public assets are available next to the server root (Next serves from <serverRoot>/public)
const sourcePublicDir = path.join(projectRoot, 'public');
const targetPublicDir = path.join(serverRoot, 'public');

if (fs.existsSync(sourcePublicDir)) {
  try {
    // If target public already exists (or is symlink), skip merge-copy to avoid EACCES on shared hosts
    let shouldCopy = true;
    try {
      const st = fs.lstatSync(targetPublicDir);
      if (st && (st.isSymbolicLink() || st.isDirectory())) {
        shouldCopy = false;
      }
    } catch (_) {
      // doesn't exist; we'll copy
    }
    if (shouldCopy) {
      fs.mkdirSync(targetPublicDir, { recursive: true });
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
    } else {
      console.log('Public assets already present at', targetPublicDir, '(skipping copy)');
    }
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
console.log('SKIP_STATIC_COPY:', SKIP_STATIC_COPY);

// Ensure expected Next directories
const expectedNextDir = path.join(serverRoot, '.next');
const expectedStaticDir = path.join(expectedNextDir, 'static');
const expectedBuildIdFile = path.join(expectedNextDir, 'BUILD_ID');

// 1) Ensure BUILD_ID first (independent of static copy)
try {
  const buildIdSources = [
    path.join(projectRoot, '.next', 'BUILD_ID'), // preferred
    path.join(projectRoot, 'BUILD_ID'), // fallback (if user uploaded root-level BUILD_ID only)
  ];
  let copied = false;
  if (!fs.existsSync(expectedBuildIdFile)) {
    for (const src of buildIdSources) {
      if (fs.existsSync(src)) {
        if (!fs.existsSync(expectedNextDir)) fs.mkdirSync(expectedNextDir, { recursive: true });
        fs.copyFileSync(src, expectedBuildIdFile);
        console.log('Copied BUILD_ID from', src, 'to', expectedBuildIdFile);
        copied = true;
        break;
      }
    }
  }
  if (!copied && fs.existsSync(expectedBuildIdFile)) {
    console.log('BUILD_ID present at', expectedBuildIdFile);
  } else if (!copied) {
    console.warn('BUILD_ID source not found; expected one of:', buildIdSources.join(', '));
  }
} catch (e) {
  console.warn('Could not ensure BUILD_ID file:', e?.message || e);
}

// 2) Ensure Next static contents under <serverRoot>/.next/static (can be skipped)
if (!SKIP_STATIC_COPY) {
  try {
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
    } else {
      console.log('Next static already present at', expectedStaticDir);
    }
  } catch (e) {
    console.warn('Could not ensure Next static directory:', e?.message || e);
  }
} else {
  console.log('Skipping static copy due to SKIP_STATIC_COPY=1');
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
try { process.chdir(serverRoot); } catch {}
require(path.join(serverRoot, 'server.js'));


