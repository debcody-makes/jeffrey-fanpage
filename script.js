const SUPABASE_URL = "https://zjwvnyotathtmvvetndn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xG-TRPAjIbL0qgm2wklXzg_WQd7T5J1";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
// ===== Memory Wall (Supabase) =====
const memoryForm = document.querySelector("#memoryForm");
const memoryList = document.querySelector("#memoryList");

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

function createBubbleRow(mem) {
  const bubble = document.createElement("article");
  const mood = (mem.mood || "funny").toLowerCase();

  bubble.className = `bubble bubble-${mood}`;
  bubble.innerHTML = `
    <p class="bubble-text">${escapeHtml(mem.text)}</p>
    <p class="bubble-meta">— ${escapeHtml(mem.name)} (${escapeHtml(mem.relation || "friend")})</p>
  `;
  return bubble;
}

async function loadMemories() {
  if (!memoryList) return;

  // optional: clear existing bubbles first
  memoryList.innerHTML = "";

  const { data, error } = await supabase
    .from("memories")
    .select("id, name, relationship, vibe, message, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Load error:", error);
    memoryList.innerHTML = `<p>Wall is down 😭</p>`;
    return;
  }

  data.forEach((row) => {
    const bubble = createBubbleRow({
      name: row.name,
      relation: row.relationship,
      text: row.message,
      mood: row.vibe
    });
    memoryList.appendChild(bubble);
  });
}

if (memoryForm) {
  memoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#memoryName").value.trim();
    const relation = document.querySelector("#memoryRelation").value;
    const text = document.querySelector("#memoryText").value.trim();
    const mood = document.querySelector("#memoryMood").value;
    const code = document.querySelector("#memoryCode").value.trim();

    if (!name || !text || !code) return;

    const res = await supabase.from("memories").insert([{
      name,
      relationship: relation,
      message: text,
      vibe: mood,
      code
    }]);

    if (res.error) {
      console.error("Insert error:", res.error);
      alert(res.error.message);
      return;
    }

    memoryForm.reset();
    await loadMemories();
  });

  // load on first visit
  loadMemories();
}

const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


