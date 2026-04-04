import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // Refresh the session (required for Server Components to read auth state)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isPublicRecipeRoute = pathname.startsWith("/recipes/");
  const isPublicRoute =
    isAuthRoute || isOnboardingRoute || isPublicRecipeRoute || pathname.startsWith("/api") || pathname === "/";

  const sharedDashboardRecipeMatch = pathname.match(/^\/dashboard\/recipes\/([0-9a-f-]+)$/i);

  if (!user && sharedDashboardRecipeMatch) {
    const recipeId = sharedDashboardRecipeMatch[1];
    const { data: publicRecipe } = await supabase
      .from("recipes")
      .select("id")
      .eq("id", recipeId)
      .eq("visibility", "public")
      .maybeSingle();

    if (publicRecipe) {
      const publicRecipeUrl = request.nextUrl.clone();
      publicRecipeUrl.pathname = `/recipes/${recipeId}`;
      return NextResponse.redirect(publicRecipeUrl);
    }
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/v2/login";
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute) {
    const treeUrl = request.nextUrl.clone();
    treeUrl.pathname = "/dashboard/tree";
    return NextResponse.redirect(treeUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
