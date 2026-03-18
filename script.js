// ==================== CONFIG ====================
const categories = {
  pcs: [
    { slug: "example-pc", name: "Example PC", short: "Your first player character" }
  ],
  npcs: [
    { slug: "example-npc", name: "Example NPC", short: "A shady Waterdeep contact" }
  ],
  locations: [
    { slug: "example-location", name: "Example Location", short: "A key spot in the city" }
  ],
  events: [
    { slug: "example-event", name: "Example Event", short: "Session highlight" }
  ],
  lore: [
    { slug: "example-lore", name: "Example Lore", short: "Background knowledge" }
  ],
  plotpoints: [
    { slug: "example-plot", name: "Example Plot Point", short: "Major revelation" }
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
