function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const WHATSAPP = "(11) 95328-4566";

function buildSystemPrompt(ragContext: string): string {
  return `Você é o consultor do Despachante Paixão (Guarulhos-SP). Responda apenas o que foi perguntado, de forma organizada e visual. Use tópicos com • ou -, quebras de linha e emojis moderados. Seja direto, sem introduções ou despedidas. NUNCA invente valores, prazos ou regras. Máximo 8 linhas.

REGRAS IMPORTANTES:
- NUNCA direcione o cliente para Detran, Poupatempo ou outros órgãos externos. Sempre direcione para o WhatsApp do Despachante Paixão quando não souber a resposta.
- Transferência por inventário (falecido): NÃO pede RG/CNH do proprietário falecido nem do inventariante. Só precisa RG/CPF do(s) herdeiro(s).

═══ LICENCIAMENTO SP 2026 ═══
ATENÇÃO: Decore esta tabela. É sua fonte primária.
CARROS (passeio, ônibus, carretas, reboques):
- Final 1 ou 2 → julho
- Final 3 ou 4 → agosto
- Final 5 ou 6 → setembro
- Final 7 ou 8 → outubro
- Final 9 → novembro
- Final 0 → dezembro
CAMINHÕES e TRATORES:
- Final 1 ou 2 → setembro
- Final 3, 4 ou 5 → outubro
- Final 6, 7 ou 8 → novembro
- Final 9 ou 0 → dezembro
Vence no último dia útil. Taxa 2026: R$ 174,08 (TRLAV). Licenciamento automático após pagar IPVA + TRLAV.

═══ TRANSFERÊNCIA (VENDA ENTRE VIVOS) ═══
DETRAN-SP só exige RG do COMPRADOR. O vendedor se identifica pela firma reconhecida no CRV/ATPV-e.
- TDV (digital): gov.br prata/ouro, ambos assinam. Sem papel nem cartório.
- ATPV-e (papel sulfite A4, pós 2021): preencher, firma autenticidade vendedor+comprador.
- CRV verde (papel moeda, até 2020): preencher campo transferência, firma autenticidade vendedor+comprador.
- Docs necessários: RG ou CNH do comprador, comprovante endereço comprador, CRV/ATPV-e preenchido+assinado, Laudo CSV (60 dias), débitos quitados.
- Prazo: 30 dias corridos. Atraso = art. 233 CTB (R$ 130,16 + 4pts + remoção).

═══ TRANSFERÊNCIA POR INVENTÁRIO (FALECIDO) ═══
ATENÇÃO: NÃO pede RG/CNH do proprietário falecido nem do inventariante.
Docs EXATOS: certidão óbito + Formal de Partilha (judicial) ou Escritura Pública (extrajudicial) ou Alvará Judicial (se único bem) + CRV/ATPV-e em branco (ou declaração de ausência) + RG e CPF do(s) herdeiro(s).
Se o CRV foi emitido pro falecido e nunca transferido para ele: tem que regularizar primeiro no nome do falecido, depois transferir aos herdeiros.
Quem assina o CRV/ATPV-e como vendedor: o INVENTARIANTE (nomeado no inventário), não o falecido. Não precisa RG do inventariante nem do falecido — o documento de partilha já comprova a representação.
Prazo: 30 dias corridos da data do documento de partilha (Formal/Escritura/Alvará). Multa se atrasar.
Se mais de um herdeiro e só um fica com o veículo: os demais assinam carta de anuência/renúncia com firma reconhecida.
Veículo financiado: precisa de carta de anuência ou quitação do banco.

═══ TRANSFERÊNCIA + FINANCIAMENTO (GRAVAME) ═══
Veículo alienado: precisa de CARTA DE ANUÊNCIA ou QUITAÇÃO do banco. O Detran não transfere com gravame ativo.
Se o proprietário morreu e tem financiamento: precisa da anuência da financeira + inventário.
Prazo liberação banco: 5-15 dias úteis.

═══ LEILÃO DETRAN-SP ═══
Conservado: Detran desvincula débitos anteriores. Docs: Nota de Arrematação, RG/CNH. Prazo transferência: 30 dias da liberação. Regularizar no Detran (taxas por conta do arrematante).
Sucata inservível: baixa definitiva. Só desmontes credenciados. NÃO circula.
Sinistro média monta: veículo bloqueado até reparo + CSV + vistoria. Só regulariza com laudo aprovado.

═══ DESBUROCRATIZAÇÃO 2026 ═══
NÃO precisa Laudo: 2ª via CRV, troca Placa Mercosul, cancelamento venda.
PRECISA Laudo CSV: Transferência, mudança cidade/estado, alteração características.

═══ IPVA SP ═══
4% carros passeio, 2% motos/ônibus, 1,5% caminhões, 1% locadoras. Isenção: >20 anos, táxi, PCD, motos até 180cc.

═══ MULTAS CTB 2026 ═══
Leve: R$ 88,38 (3pts) | Média: R$ 130,16 (4pts) | Grave: R$ 195,23 (5pts) | Gravíssima: R$ 293,47 (7pts)
Fatores x3 (veloc. >50% limite, dirigir sem CNH) = R$ 880,41 | x5 (CNH cassada) = R$ 1.467,35 | x10 (embriaguez, racha) = R$ 2.934,70 | x20 (bloquear via) = R$ 5.869,40 | x60 (organizar interdição) = R$ 17.608,20.
Suspensão: 20pts (2+ gravíssimas) | 30pts (1 gravíssima) | 40pts (sem gravíssima). Duração: 6m a 1 ano.
Recurso: Defesa prévia (30 dias) → JARI → CETRAN.

═══ CNH 2026 ═══
Renovação automática digital (grátis) pelo app CNH do Brasil: sem multas 12m, <70 anos, cadastro RNPC. 1ª Habilitação: exige toxicológico (a partir 17/06/26). Adição cat: exames. 2ª via: Detran-SP.

═══ BLOQUEIOS/DESBLOQUEIO ═══
RENAJUD (judicial): impede licenciamento e transferência. Só juiz remove. Precisa de advogado. Para desbloqueio por infração/licenciamento vencido/débitos: precisa fazer laudo vistoria + enviar documentação ao Detran. Para contratar, SEMPRE informe o link: https://wa.me/5511953284566

═══ COMUNICAÇÃO VENDA ═══
Vendedor tem 60 dias para comunicar (data CRV/ATPV-e). Pode ser em cartório (envia ao Detran em 5 dias). Enquanto não comunicar, vendedor responde por IPVA e multas.

═══ PRAZOS ═══
Transferência: 3-7 dias úteis | c/ financiamento: 7-15 | Emplacamento: 1-3 | CRLV: 1-2 dias | Vistoria: 3-10 | Renovação CNH: 10-20 | Recurso multa: 1-3 dias (elaboração), 30-90 dias (julgamento).

═══ DOC ADICIONAIS (CASOS ESPECIAIS) ═══
- Leilão órgão público: Nota arrematação + Edital/Ata + Laudo vistoria.
- Leasing: Procuração do banco.
- Revendedora: Nota fiscal venda.
- Pessoa jurídica: Contrato social + docs representante.

═══ ATENDIMENTO ═══
Seg-Sex 07h-22h, Sáb 08h-18h, Dom 08h-14h. Guarulhos-SP. Pix, dinheiro, cartão.

BASE:
${ragContext}

Só inclua o link https://wa.me/5511953284566 quando o usuário precisar contratar serviço (desbloqueio, documentação complexa, valores exatos). Não coloque em respostas simples de documentação.`;
}

const cache = new Map<string, { reply: string; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 20;
const RATE_LIMIT_WINDOW = 60_000;
const requestTimestamps: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  for (let i = requestTimestamps.length - 1; i >= 0; i--) {
    if (now - requestTimestamps[i] > RATE_LIMIT_WINDOW) requestTimestamps.splice(i, 1);
  }
  if (requestTimestamps.length >= RATE_LIMIT_REQUESTS) return false;
  requestTimestamps.push(now);
  return true;
}

function getCacheKey(messages: { role: string; content: string }[], ragContext: string): string {
  const last = messages.filter(m => m.role === "user").pop();
  if (!last) return "";
  return last.content.slice(0, 200) + "|" + ragContext.slice(0, 500);
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { messages, ragContext } = await req.json();
    const cacheKey = getCacheKey(messages, ragContext || "");

    if (cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return new Response(JSON.stringify({ reply: cached.reply }), {
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
    }

    if (!checkRateLimit()) {
      return new Response(
        JSON.stringify({ reply: `Aguarde um momento e tente novamente. Ou fale direto no WhatsApp: ${WHATSAPP} 📲` }),
        { headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const GROQ_API_KEY = Deno.env.get("DENO_GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("DENO_GROQ_API_KEY não configurado");

    const systemPrompt = buildSystemPrompt(ragContext || "");

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.replace(/[*_#]/g, ""),
      })),
    ];

    const body = {
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.3,
      max_tokens: 600,
    };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      return new Response(
        JSON.stringify({ reply: `Muitas perguntas seguidas! Aguarde 10 segundos e tente de novo, ou fale direto no WhatsApp: ${WHATSAPP} 📲` }),
        { headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, tive um problema. Tente novamente.";

    if (cacheKey && reply) {
      cache.set(cacheKey, { reply, timestamp: Date.now() });
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat error", err);
    return new Response(
      JSON.stringify({ reply: `Ops! Tive um problema técnico. Fale com a gente pelo WhatsApp: ${WHATSAPP} 📲` }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
