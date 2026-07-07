// build.js
// Runs during Netlify's build step. Reads SUPABASE_URL and SUPABASE_ANON_KEY
// from Netlify's environment variables and injects them into the two HTML
// files, then writes the results into dist/ for Netlify to publish.
//
// This only runs on a proper Netlify build (Git-connected site, or
// `netlify deploy` via the CLI) — NOT on a drag-and-drop Netlify Drop
// deploy, since Netlify Drop skips the build step entirely.

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable.');
  console.error('Set both in Netlify: Site configuration > Environment variables.');
  process.exit(1);
}

const files = ['numbers-foundry.html', 'teacher-dashboard.html'];
const outDir = path.join(__dirname, 'dist');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

files.forEach(file => {
  const srcPath = path.join(__dirname, file);
  let html = fs.readFileSync(srcPath, 'utf8');
  html = html.split('__SUPABASE_URL__').join(SUPABASE_URL);
  html = html.split('__SUPABASE_ANON_KEY__').join(SUPABASE_ANON_KEY);
  fs.writeFileSync(path.join(outDir, file), html);
  console.log('Built', file, '->', path.join('dist', file));
});

// Make numbers-foundry.html the site's home page.
fs.copyFileSync(
  path.join(outDir, 'numbers-foundry.html'),
  path.join(outDir, 'index.html')
);
console.log('Also wrote dist/index.html (copy of numbers-foundry.html) as the homepage.');
