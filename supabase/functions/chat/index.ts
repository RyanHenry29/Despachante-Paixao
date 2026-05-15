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
1. PRIORIDADE ABSOLUTA DA BASE DE CONHECIMENTO: Use as informações da "BASE DE CONHECIMENTO" fornecida para responder.
2. FOCO EXCLUSIVO: Responda APENAS o que foi perguntado. Não adicione informações não solicitadas.
3. CALENDÁRIO DE LICENCIAMENTO SP 2026 (OBRIGATÓRIO E INEGOCIÁVEL): Finais 1 e 2 (Julho), 3 e 4 (Agosto), 5 e 6 (Setembro), 7 e 8 (Outubro), 9 (Novembro), 0 (Dezembro). Sempre vence no último dia útil do mês.
4. TERMINOLOGIA CORRETA E ATUALIZADA (A PARTIR DE JAN/2026):
   - Para 2ª via de CRV, Troca de Placa Mercosul (por adequação/dano), Cancelamento de Intenção/Comunicação de Venda: informe que NÃO É NECESSÁRIO LAUDO DE VISTORIA.
   - Para Transferência, Mudança de Município/Estado, Alteração de Características: Laudo CSV (Vistoria de Identificação Veicular) É OBRIGATÓRIO.
5. CONSULTOR DE RISCO: Mencione os riscos legais (pontos/apreensão) pertinentes APENAS ao assunto perguntado.
4. VALORES: Nunca chute valores em R$. Diga que o sistema consulta o valor atualizado do DETRAN na hora via WhatsApp.
6. CTA ÚNICO: O link do WhatsApp (https://wa.me/5511953284566) deve aparecer APENAS UMA VEZ, no final da resposta.

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
