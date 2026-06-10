export interface User {
  id: string;
  email: string;
  display_name: string;
  has_completed_onboarding: boolean;
  created_at: string;
}

export interface Subscription {
  tier: "free" | "pro" | "plus";
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
}

export interface PCOSProfile {
  id: string;
  symptoms: string[];
  dietary_exclusions: string[];
  cycle_phase: string;
  primary_goal: string;
  updated_at: string;
}

export interface MealPlanDay {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
}

export interface Meal {
  name: string;
  why_this_works: string;
  glycemic_load: "Low" | "Medium" | "High";
  glycemic_explanation: string;
  swap_suggestion: string;
}

export interface MealPlan {
  has_plan: boolean;
  plan?: {
    days: MealPlanDay[];
  };
  week_start_date?: string;
  generated_at?: string;
}

export interface FlaggedIngredient {
  ingredient: string;
  status: "Safe" | "Caution" | "Avoid";
  explanation: string;
  swap: string;
}

export interface ScanResult {
  id: string;
  safety_score: "Safe" | "Caution" | "Avoid";
  flagged_ingredients: FlaggedIngredient[];
  swap_suggestions: string[];
  explanation: string;
  scanned_at: string;
}

export interface SymptomLog {
  id: string;
  log_date: string;
  energy: number;
  bloating: number;
  cravings: number;
  acne: number;
  notes?: string;
  created_at: string;
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  avg_energy: number;
  avg_bloating: number;
  avg_cravings: number;
  avg_acne: number;
}

export interface NutritionTip {
  id: string;
  tip_text: string;
  week_start_date: string;
}

export interface CuratedRecipe {
  id: string;
  name: string;
  ingredients: string[];
  pcos_rationale: string;
  tags: string[];
}

export interface UserSettings {
  openai_api_key_masked?: string;
  subscription_tier: string;
  billing_portal_url?: string;
}

export interface AskResponse {
  id: string;
  question: string;
  answer: string;
  asked_at: string;
}

export interface AskUsage {
  questions_this_month: number;
  questions_limit: number;
  questions_remaining: number;
}

export interface ScanUsage {
  scans_this_week: number;
  scan_limit: number;
  scans_remaining: number;
}

export const SYMPTOM_OPTIONS = ["irregular cycles", "acne", "weight gain", "cravings", "fatigue", "bloating"] as const;
export const DIETARY_OPTIONS = ["dairy-free", "gluten-free", "vegetarian", "vegan"] as const;
export const CYCLE_PHASE_OPTIONS = ["menstrual", "follicular", "ovulatory", "luteal", "I don't track"] as const;
export const PRIMARY_GOAL_OPTIONS = [
  "manage insulin resistance",
  "reduce cravings",
  "support cycle regularity",
  "reduce acne/inflammation",
  "general PCOS nutrition",
] as const;
