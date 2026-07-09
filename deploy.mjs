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
  // Usa o endpoint /functions/deploy?slug=X, que cria OU atualiza a function
  // existente (multipart/form-data). O endpoint antigo POST /functions só
  // servia para criar functions novas e falhava com "Duplicated function slug"
  // ao tentar atualizar uma já existente.
  const fs = await import('fs');
  for (const name of ['chat', 'reviews']) {
    console.log(`\n=== Deploying ${name} ===`);
    const code = fs.readFileSync(`supabase/functions/${name}/index.ts`, 'utf8');

    const form = new FormData();
    form.append('metadata', JSON.stringify({ entrypoint_path: 'index.ts', name, verify_jwt: false }));
    form.append('file', new Blob([code], { type: 'application/typescript' }), 'index.ts');

    const res = await fetch(`${API}/projects/${PROJECT_REF}/functions/deploy?slug=${name}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}` },
      body: form,
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    console.log(`${name}:`, res.status, res.status === 200 || res.status === 201 ? 'OK' : JSON.stringify(data).substring(0, 200));
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
