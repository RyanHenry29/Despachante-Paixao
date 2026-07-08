#!/usr/bin/env node
// Deploy script — lê secrets de variáveis de ambiente, nunca hardcoded
// Uso: $env:SUPABASE_TOKEN="sbp_..."; $env:GROQ_KEY="..."; $env:PLACES_KEY="..."; node deploy.mjs

const TOKEN = process.env.SUPABASE_TOKEN;
const GROQ_KEY = process.env.GROQ_KEY;
const PLACES_KEY = process.env.PLACES_KEY;
const PROJECT_REF = process.env.PROJECT_REF;
const API = 'https://api.supabase.com/v1';

if (!TOKEN || !PROJECT_REF) {
  console.error('Defina SUPABASE_TOKEN e PROJECT_REF nas variáveis de ambiente');
  process.exit(1);
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...options.headers } });
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; } catch { return { status: res.status, data: text }; }
}

async function main() {
  // 1. Deploy Edge Functions
  const fs = await import('fs');
  for (const name of ['chat', 'reviews']) {
    console.log(`\n=== Deploying ${name} ===`);
    const code = fs.readFileSync(`supabase/functions/${name}/index.ts`, 'utf8');
    const r = await api(`/projects/${PROJECT_REF}/functions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: name, name, verify_jwt: false, entrypoint_path: 'index.ts', body: code }),
    });
    console.log(`${name}:`, r.status, r.data?.id ? 'OK' : JSON.stringify(r.data).substring(0, 100));
  }

  // 2. Set secrets (if keys provided)
  const secrets = [];
  if (GROQ_KEY) secrets.push({ name: 'DENO_GROQ_API_KEY', value: GROQ_KEY });
  if (PLACES_KEY) secrets.push({ name: 'DENO_GOOGLE_PLACES_API_KEY', value: PLACES_KEY });
  
  if (secrets.length > 0) {
    console.log('\n=== Setting secrets ===');
    const r = await api(`/projects/${PROJECT_REF}/secrets`, {
      method: 'POST',
      body: JSON.stringify(secrets),
    });
    console.log('Secrets:', r.status);
  }

  // 3. Verify
  console.log('\n=== Verification ===');
  const fns = await api(`/projects/${PROJECT_REF}/functions`, { method: 'GET' });
  console.log('Functions:', (fns.data || []).map(f => `${f.slug} v${f.version}`).join(', '));
}

main().catch(console.error);
