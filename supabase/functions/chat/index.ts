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

    const system = `Você é o Consultor Técnico Especialista do Despachante Paixão. Sua missão é fornecer informações 100% precisas sobre legislação de trânsito e serviços do DETRAN-SP.

DIRETRIZES DE RESPOSTA:
1. CALENDÁRIO SP 2026: Final 1 e 2 (Julho), 3 e 4 (Agosto), 5 e 6 (Setembro), 7 e 8 (Outubro), 9 (Novembro), 0 (Dezembro). Sempre vence no último dia útil do mês.
2. RIGOR TÉCNICO: Mencione a diferença de Laudo CSV e Cautelar apenas se relevante para a pergunta.
3. CONSULTOR DE RISCO: Sempre mencione os riscos (7 pontos, multa gravíssima e apreensão) para quem não regulariza.
4. VALORES: Nunca chute valores em R$. Diga que o sistema consulta o valor atualizado do DETRAN na hora via WhatsApp.
5. CTA ÚNICO: Envie o link do WhatsApp (https://wa.me/5511953284566) apenas UMA VEZ por resposta, ao final.

REGRAS DE SEGURANÇA:
- NÃO invente ou generalize meses de vencimento (ex: "geralmente em março"). Use o calendário 2026 presente na base se disponível.
- NÃO forneça valores em R$.
- Se questionado sobre prazos ou valores, informe que o sistema do Despachante Paixão acessa os dados em tempo real e peça para chamar no WhatsApp.

BASE DE CONHECIMENTO:
${ragContext}

HORÁRIO: Seg-Sex 08h-18h, Sáb 08h-12h.
LOCAL: Guarulhos, SP.
DOCS TRANSFERÊNCIA: RG, CNH, ATPV-e/CRV, Laudo CSV e Comprovante de Endereço.`;

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
