const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: unknown) => (e as { msg: string }).msg).join(", ");
      else if (err.error) msg = err.error;
      else if (err.message) msg = err.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{
      id: string;
      email: string;
      display_name: string;
      has_completed_onboarding: boolean;
      created_at: string;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () =>
    apiFetch<{
      id: string;
      email: string;
      display_name: string;
      has_completed_onboarding: boolean;
      created_at: string;
    }>("/api/auth/me"),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  subscription: () =>
    apiFetch<{
      tier: string;
      status: string;
      current_period_end?: string;
      meal_plan_limit_remaining: number;
      scan_limit_remaining: number;
      can_generate_meal_plan: boolean;
      can_scan: boolean;
      can_use_nutrition_tip: boolean;
      can_use_recipes: boolean;
      can_use_ask: boolean;
      ask_remaining?: number;
    }>("/api/auth/subscription"),
};

export const onboardingApi = {
  save: (data: {
    symptoms: string[];
    dietary_exclusions: string[];
    cycle_phase: string;
    primary_goal: string;
  }) =>
    apiFetch<{ status: string }>("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  get: () =>
    apiFetch<{
      id: string;
      symptoms: string[];
      dietary_exclusions: string[];
      cycle_phase: string;
      primary_goal: string;
      updated_at: string;
    }>("/api/onboarding"),

  update: (data: {
    symptoms: string[];
    dietary_exclusions: string[];
    cycle_phase: string;
    primary_goal: string;
  }) =>
    apiFetch<{ status: string }>("/api/onboarding", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const mealPlanApi = {
  getCurrent: () =>
    apiFetch<{
      has_plan: boolean;
      plan?: { days: unknown[] };
      week_start_date?: string;
      generated_at?: string;
    }>("/api/meal-plan/current"),

  generate: (dietaryFilters?: string[]) =>
    apiFetch<{ status: string; plan: { days: unknown[] }; week_start_date: string }>(
      "/api/meal-plan/generate",
      {
        method: "POST",
        body: JSON.stringify({ dietary_filters: dietaryFilters }),
      }
    ),
};

export const scannerApi = {
  scan: (inputType: "url" | "text" | "description", content: string) =>
    apiFetch<{
      id: string;
      safety_score: "Safe" | "Caution" | "Avoid";
      flagged_ingredients: unknown[];
      swap_suggestions: string[];
      explanation: string;
      scanned_at: string;
    }>("/api/scanner/scan", {
      method: "POST",
      body: JSON.stringify({ input_type: inputType, content }),
    }),

  usage: () =>
    apiFetch<{
      scans_this_week: number;
      scan_limit: number;
      scans_remaining: number;
    }>("/api/scanner/usage"),
};

export const symptomLogApi = {
  submit: (data: {
    energy: number;
    bloating: number;
    cravings: number;
    acne: number;
    notes?: string;
  }) =>
    apiFetch<{
      id: string;
      log_date: string;
      energy: number;
      bloating: number;
      cravings: number;
      acne: number;
      notes?: string;
      created_at: string;
    }>("/api/symptom-log", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  get: () =>
    apiFetch<{
      logs: unknown[];
      weekly_summary?: unknown;
    }>("/api/symptom-log"),
};

export const nutritionTipApi = {
  get: () =>
    apiFetch<{ id: string; tip_text: string; week_start_date: string }>(
      "/api/nutrition-tip"
    ),
};

export const recipesApi = {
  getAll: () =>
    apiFetch<
      {
        id: string;
        name: string;
        ingredients: string[];
        pcos_rationale: string;
        tags: string[];
      }[]
    >("/api/recipes"),
};

export const askApi = {
  ask: (question: string) =>
    apiFetch<{ id: string; question: string; answer: string; asked_at: string }>(
      "/api/ask",
      {
        method: "POST",
        body: JSON.stringify({ question }),
      }
    ),

  usage: () =>
    apiFetch<{
      questions_this_month: number;
      questions_limit: number;
      questions_remaining: number;
    }>("/api/ask/usage"),
};

export const settingsApi = {
  get: () =>
    apiFetch<{
      openai_api_key_masked?: string;
      subscription_tier: string;
      billing_portal_url?: string;
    }>("/api/settings"),

  update: (openaiApiKey?: string) =>
    apiFetch<{ status: string }>("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ openai_api_key: openaiApiKey }),
    }),
};

export const paymentsApi = {
  checkout: (tier: string, billingInterval: string) =>
    apiFetch<{ price_id: string; client_token: string }>(
      "/api/payments/checkout",
      {
        method: "POST",
        body: JSON.stringify({ tier, billing_interval: billingInterval }),
      }
    ),
};
