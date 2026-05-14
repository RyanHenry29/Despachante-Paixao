// Edge function que conversa com o Lovable AI Gateway (Gemini)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, ragContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurado");

    const system = `Você é o assistente virtual do Despachante Paixão, especializado em serviços veiculares.

INFORMAÇÕES DO ESTABELECIMENTO:
- Nome: Despachante Paixão
- WhatsApp: (11) 95328-4566
- Localização: Guarulhos, SP
- Horário: Segunda a sexta 8h–18h, sábado 8h–12h

SERVIÇOS:
- Transferência de veículo (com e sem financiamento)
- Licenciamento e emplacamento (novo e renovação)
- Consulta e quitação de débitos e multas
- CRLV digital e físico
- Registro de veículo novo (0km)
- Lacre e substituição de placa
- Regularização de dívidas veiculares
- Vistoria veicular (cautelar e obrigatória)
- Atendimento no DETRAN e POUPATEMPO

${ragContext ? `BASE DE CONHECIMENTO INTERNA (priorize estas informações):\n${ragContext}\n` : ""}

REGRAS:
- Responda em português do Brasil, de forma clara e acolhedora
- Respostas objetivas (até 4 linhas)
- Priorize a base de conhecimento interna
- Se não souber o valor exato, oriente a pedir orçamento via WhatsApp
- Nunca invente documentos, leis ou prazos — se incerto, diga "confirme pelo WhatsApp"
- Para situações complexas, sugira falar com atendente humano: (11) 95328-4566`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ reply: "Limite de uso temporário atingido. Fale com a gente pelo WhatsApp: (11) 95328-4566 📲" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ reply: "Créditos de IA esgotados. Fale com a gente pelo WhatsApp: (11) 95328-4566 📲" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, tive um problema. Tente novamente.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat error", err);
    return new Response(JSON.stringify({ reply: "Ops! Tive um problema técnico. Fale com a gente pelo WhatsApp: (11) 95328-4566 📲" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
