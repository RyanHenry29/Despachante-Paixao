function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

const PLACE_ID = "ChIJjf_y6uGJzpQRzJYssyNyLZg";

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const API_KEY = Deno.env.get("DENO_GOOGLE_PLACES_API_KEY");
    if (!API_KEY) throw new Error("DENO_GOOGLE_PLACES_API_KEY não configurado");

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "id,displayName,rating,userRatingCount,reviews.name,reviews.relativePublishTimeDescription,reviews.text,reviews.originalText,reviews.rating,reviews.authorAttribution,reviews.publishTime",
      },
    });

    if (!res.ok) {
      throw new Error(`Google Places API error: ${res.status}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("reviews error", err);
    return new Response(JSON.stringify({ error: "Erro ao buscar avaliações" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
