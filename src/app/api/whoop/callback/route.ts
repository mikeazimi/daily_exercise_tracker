import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens } from "@/lib/whoop/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/settings?whoop=error&reason=missing_params`);
  }

  // Validate state
  const cookies = request.headers.get("cookie") || "";
  const stateMatch = cookies.match(/whoop_oauth_state=([^;]+)/);
  const storedState = stateMatch?.[1];

  if (state !== storedState) {
    return NextResponse.redirect(`${origin}/settings?whoop=error&reason=invalid_state`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    await supabase.from("whoop_tokens").upsert({
      user_id: user.id,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.expiresAt.toISOString(),
      scopes: tokens.scopes,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    const response = NextResponse.redirect(`${origin}/settings?whoop=connected`);
    response.cookies.delete("whoop_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(`${origin}/settings?whoop=error&reason=token_exchange`);
  }
}
