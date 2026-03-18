// ==================== CONFIG ====================
const categories = {
  pcs: [
    { slug: "thalor",      name: "Thalor",      short: "Player character – background, class, key traits" },
    { slug: "madrugal",    name: "Madrugal",    short: "Player character – background, class, key traits" }
  ],
  npcs: [
    { slug: "floon",       name: "Floon",       short: "Missing artist / plot hook victim" },
    { slug: "mirt",        name: "Mirt the Moneylender", short: "Wealthy retired adventurer, possible ally" },
    { slug: "renear",      name: "Renaer Neverember", short: "Dagult's estranged son, rebel figure" },
    { slug: "volo",        name: "Volo",        short: "Famous (and unreliable) chronicler & guide" }
  ],
  locations: [
    { slug: "trollskull-manor", name: "Trollskull Manor", short: "The party's tavern / home base in Trollskull Alley" },
    { slug: "waterdeep",        name: "Waterdeep",        short: "The City of Splendors – overview & wards" },
    { slug: "yawning-portal",   name: "Yawning Portal",   short: "Famous inn & entrance to Undermountain" }
  ],
  events: [
    { slug: "events",           name: "Session Summaries & Major Events", short: "Overview of important happenings (or move individual sessions here later)" }
  ],
  lore: [
    { slug: "lore",             name: "General Lore & World Information", short: "Gods, factions, history, secrets of Waterdeep" }
  ],
  plotpoints: [
    // Currently empty – add entries like this when you create files:
    // { slug: "vault-keys-revealed", name: "The Vault Keys Revealed", short: "Major discovery about the Stone of Golorr" },
  ]
};

// ==================== LOAD SECTION ====================
async function loadSection(section) {
  const content = document.getElementById('content');
  
  if (section === 'home') {
    content.innerHTML = `
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="fantasy-header text-6xl text-[#d4af37] gold-glow mb-4">WATERDEEP DRAGON HEIST</h1>
        <p class="text-2xl mb-12 text-[#d4af37]/70">Homebrew Campaign Wiki</p>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          ${Object.keys(categories).map(cat => `
            <div onclick="loadSection('${cat}')" 
                 class="bg-[#1f2937] hover:bg-[#2a3a4f] border border-[#d4af37]/30 rounded-2xl p-8 cursor-pointer transition">
              <i class="fa-solid fa-${cat === 'pcs' ? 'users' : cat === 'npcs' ? 'user-secret' : cat === 'locations' ? 'map' : cat === 'events' ? 'calendar' : cat === 'lore' ? 'book' : 'scroll'} text-4xl mb-4"></i>
              <h3 class="text-xl font-bold">${cat.toUpperCase()}</h3>
            </div>
          `).join('')}
        </div>
      </div>`;
    return;
  }

  const items = categories[section] || [];
  let html = `<h2 class="fantasy-header text-4xl mb-8 text-[#d4af37]">${section.toUpperCase().replace('PLOTPOINTS', 'PLOT POINTS')}</h2>`;
  html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;

  for (let item of items) {
    html += `
      <div onclick="showDetail('${item.slug}', '${section}')" 
           class="bg-[#1f2937] hover:border-[#d4af37] border border-transparent rounded-2xl p-6 cursor-pointer transition-all hover:scale-105">
        <h3 class="font-bold text-xl mb-2">${item.name}</h3>
        <p class="text-[#d4af37]/70 text-sm line-clamp-3">${item.short}</p>
      </div>`;
  }
  html += `</div>`;
  content.innerHTML = html;
}

// ==================== SHOW DETAIL MODAL ====================
async function showDetail(slug, section) {
  const modal = document.getElementById('modal');
  const titleEl = document.getElementById('modalTitle');
  const contentEl = document.getElementById('modalContent');

  try {
    const res = await fetch(`data/${section}/${slug}.md`);
    if (!res.ok) throw new Error();
    const md = await res.text();

    titleEl.textContent = md.split('\n')[0].replace('# ', '');
    contentEl.innerHTML = marked.parse(md);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } catch (e) {
    alert("Markdown file not found! Create data/" + section + "/" + slug + ".md");
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ==================== GLOBAL SEARCH ====================
function globalSearch() {
  const term = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!term) return loadSection('home');

  let found = false;
  for (let cat in categories) {
    const match = categories[cat].find(i => 
      i.name.toLowerCase().includes(term) || i.short.toLowerCase().includes(term)
    );
    if (match) {
      loadSection(cat);
      setTimeout(() => showDetail(match.slug, cat), 300);
      found = true;
      break;
    }
  }
  if (!found) alert("Nothing found in the city archives...");
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  loadSection('home');
});
