import { Client } from "@notionhq/client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_SECRET });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function check() {
  console.log("🏥 BUSCOHUELLA 2026 — HEALTH CHECK");
  console.log("═".repeat(40));

  // 1. Supabase
  try {
    const { data, error } = await supabase.from("pets").select("id").limit(1);
    if (error) throw error;
    console.log("✅ Supabase: Conexión y tabla 'pets' OK");
  } catch (e) {
    console.error("❌ Supabase:", e.message);
  }

  // 2. Notion Roadmap
  try {
    const res = await notion.databases.retrieve({
      database_id: process.env.NOTION_ROADMAP_ID,
    });
    console.log(`✅ Notion Roadmap: "${res.title[0].plain_text}" OK`);
  } catch (e) {
    console.error("❌ Notion Roadmap:", e.message);
  }

  // 3. Notion Bitácora
  try {
    const res = await notion.databases.retrieve({
      database_id: process.env.NOTION_BITACORA_ID,
    });
    console.log(`✅ Notion Bitácora: "${res.title[0].plain_text}" OK`);
  } catch (e) {
    console.error("❌ Notion Bitácora:", e.message);
  }
}

check();
