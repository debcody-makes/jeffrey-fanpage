// ===== Supabase Client =====
const SUPABASE_URL = "https://zjwvnyotathtmvvetndn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xG-TRPAjIbL0qgm2wklXzg_WQd7T5J1";

// Avoid naming collision with the CDN global "supabase"
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== Memory Wall =====
const memoryForm = document.querySelector("#memoryForm");
const memoryList = document.querySelector("#memoryList");

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function createBubbleRow(row) {
  const mood = (row.vibe || "funny").toLowerCase();

  const bubble = document.createElement("article");
  bubble.className = `bubble bubble-${mood}`;
  bubble.innerHTML = `
    <p class="bubble-text">${escapeHtml(row.message)}</p>
    <p class="bubble-meta">— ${escapeHtml(row.name)} (${escapeHtml(row.relationship || "friend")})</p>
  `;
  return bubble;
}

async function loadMemories() {
  if (!memoryList) return;

  memoryList.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("memories")
    .select("id, name, relationship, vibe, message, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("❌ Load error:", error);
    memoryList.innerHTML = `<p style="padding:12px;">Couldn’t load memories (check console)</p>`;
    return;
  }

  if (!data || data.length === 0) {
    memoryList.innerHTML = `
      <article class="bubble bubble-sweet">
        <p class="bubble-text">No memories yet… drop the first one 👀</p>
        <p class="bubble-meta">— Team Jeffrey</p>
      </article>
    `;
    return;
  }

  data.forEach((row) => memoryList.appendChild(createBubbleRow(row)));
}

if (memoryForm && memoryList) {
  memoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("✅ submit fired");

    const name = document.querySelector("#memoryName")?.value.trim();
    const relationship = document.querySelector("#memoryRelation")?.value;
    const message = document.querySelector("#memoryText")?.value.trim();
    const vibe = document.querySelector("#memoryMood")?.value;
    const code = document.querySelector("#memoryCode")?.value.trim();

    if (!name || !message || !code) {
      alert("Fill out name, memory, and access code 🙂");
      return;
    }

    const { error } = await supabaseClient.from("memories").insert([
      { name, relationship, vibe, message, code }
    ]);

    if (error) {
      console.error("❌ Insert error:", error);
      alert(`Insert failed: ${error.message}`);
      return;
    }

    console.log("✅ Insert success");
    memoryForm.reset();
    await loadMemories();
  });

  loadMemories();
} else {
  console.warn("⚠️ memoryForm or memoryList not found");
}

// ===== Footer Year =====
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();



