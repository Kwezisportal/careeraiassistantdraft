const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  system: string;
  user: string;
  jsonMode: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: RequestBody = await req.json();

    if (!body.system || !body.user) {
      return new Response(
        JSON.stringify({ error: "Missing 'system' or 'user' field in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "OpenAI API key is not configured. Please add the OPENAI_API_KEY secret in the Bolt database secrets settings.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = [
      { role: "system", content: body.system },
      { role: "user", content: body.user },
    ];

    const requestBody: Record<string, unknown> = {
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: body.jsonMode ? 2000 : 800,
    };

    if (body.jsonMode) {
      requestBody.response_format = { type: "json_object" };
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      let errorMsg = `OpenAI API error (${openaiResponse.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) errorMsg = errorJson.error.message;
      } catch {
        // keep default message
      }

      if (openaiResponse.status === 429) {
        errorMsg = "The AI service rate limit has been reached. Please wait a moment and try again.";
      }

      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: openaiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "The AI returned no content. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
