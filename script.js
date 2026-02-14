const SUPABASE_URL = "https://zjwvnyotathtmvvetndn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xG-TRPAjIbL0qgm2wklXzg_WQd7T5J1";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===== Memory Wall =====
const memoryForm = document.querySelector("#memoryForm");
const memoryList = document.querySelector("#memoryList");

function createBubble({ name, relation, text, mood }) {
  const bubble = document.createElement("article");
  bubble.className = `bubble bubble-${mood}`;

  const p = document.createElement("p");
  p.className = "bubble-text";
  p.textContent = text;

  const meta = document.createElement("p");
  meta.className = "bubble-meta";
  meta.textContent = `— ${name} (${relation})`;

  bubble.appendChild(p);
  bubble.appendChild(meta);

  return bubble;
}

if (memoryForm && memoryList) {
  memoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#memoryName").value.trim();
    const relation = document.querySelector("#memoryRelation").value;
    const text = document.querySelector("#memoryText").value.trim();
    const mood = document.querySelector("#memoryMood").value;

    if (!name || !text) return;

    const bubble = createBubble({ name, relation, text, mood });
    memoryList.prepend(bubble);

    memoryForm.reset();
  });
}

const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

