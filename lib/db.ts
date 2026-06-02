"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * Google HCLS Navigator Portal Supabase Database Client
 * Uses direct Supabase JS client (no Prisma).
 * Contains fallback support for local developers without keys.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not detected in environment. Direct Supabase operations will fall back gracefully."
  );
}

// Create client instance
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

/**
 * Type definitions for HCLS Portal DB Schema
 */
export interface DbAccount {
  id: string;
  org_name: string;
  use_case: string;
  stage: "Pre-Sales" | "Production" | "At-Risk";
  score: number;
  is_at_risk: boolean;
  created_at?: string;
}

export interface DbAssessment {
  id: string;
  account_id: string;
  code: string;
  name: string;
  type: string;
  score: number;
  status: "done" | "prog" | "todo" | "blk";
  completed_date?: string;
}
