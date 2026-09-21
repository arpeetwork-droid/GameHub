/* ============================================================
   GameHub - scripthp.js
   Handles game data, rendering, search, filters, and nav
   ============================================================ */

// Fallback thumbnail used when a game image fails to load
const FALLBACK_THUMB = "https://via.placeholder.com/400x250/1c1c29/00e5b0?text=GameHub";

/* ------------------------------------------------------------
   MOCK GAME DATA
   In the future, this array will instead be fetched from a
   real API. The line below marks exactly where that swap
   would happen (see loadGames()).
------------------------------------------------------------ */
const mockGames = [
  {
    id: 1,
    title: "Neon Runner",
    description: "Dodge obstacles and run as far as you can through a glowing neon city.",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop",
    url: "https://example.com/games/neon-runner",
    featured: true
  },
  {
    id: 2,
    title: "Space Defender",
    description: "Defend your ship from waves of incoming asteroids and enemy fighters.",
    category: "Action",
    thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop",
    url: "https://example.com/games/space-defender",
    featured: true
  },
  {
    id: 3,
    title: "Block Puzzle",
    description: "Fit falling blocks together to clear lines in this classic-style puzzler.",
    category: "Puzzle",
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=250&fit=crop",
    url: "https://example.com/games/block-puzzle",
    featured: true
  },
  {
    id: 4,
    title: "Memory Match",
    description: "Flip cards and test your memory by matching pairs as fast as you can.",
    category: "Puzzle",
    thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=250&fit=crop",
    url: "https://example.com/games/memory-match",
    featured: true
  },
  {
    id: 5,
    title: "Mini Golf",
    description: "Putt your way through nine quirky holes with tricky angles and ramps.",
    category: "Sports",
    thumbnail: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=250&fit=crop",
    url: "https://example.com/games/mini-golf",
    featured: false
  },
  {
    id: 6,
    title: "Snake Arena",
    description: "The classic snake game, but with power-ups and a competitive twist.",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop",
    url: "https://example.com/games/snake-arena",
    featured: true
  },
  {
    id: 7,
    title: "Tower Tactics",
    description: "Place towers strategically to stop enemy waves from reaching your base.",
    category: "Strategy",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
    url: "https://example.com/games/tower-tactics",
    featured: false
  },
  {
    id: 8,
    title: "Penalty Shootout",
    description: "Step up to the spot and try to beat the keeper in five rounds.",
    category: "Sports",
    thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=250&fit=crop",
    url: "https://example.com/games/penalty-shootout",
    featured: false
  },
  {
    id: 9,
    title: "Word Chain",
    description: "Build the longest chain of connected words before the timer runs out.",
    category: "Puzzle",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop",
    url: "https://example.com/games/word-chain",
    featured: false
  },
  {
    id: 10,
    title: "Castle Siege",
    description: "Plan your army and lay siege to enemy castles turn by turn.",
    category: "Strategy",
    thumbnail: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=250&fit=crop",
    url: "https://example.com/games/castle-siege",
    featured: false
  },
  {
    id: 11,
    title: "Turbo Kart",
    description: "Race against the clock on winding tracks full of shortcuts.",
    category: "Action",
    thumbnail: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=250&fit=crop",
    url: "https://example.com/games/turbo-kart",
    featured: false
  },
  {
    id: 12,
    title: "Bubble Pop",
    description: "Match and pop groups of colored bubbles before they reach the bottom.",
    category: "Puzzle",
    thumbnail: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=250&fit=crop",
    url: "https://example.com/games/bubble-pop",
    featured: false
  }
];

// Holds the currently loaded games (populated by loadGames)
let allGames = [];
let currentCategory = "All";
let currentSearchTerm = "";

/* ------------------------------------------------------------
   loadGames()
   Right now this just returns the local mock array.
   ---- FUTURE API HOOK ----
   Later this function will be replaced with something like:
     async function loadGames() {
       const res = await fetch("https://api.gamehub.dev/games");
       return await res.json();
     }
   The rest of the app (rendering, search, filters) does not
   need to change when that happens.
------------------------------------------------------------ */
function loadGames() {
  return new Promise((resolve) => {
    // simulate a tiny loading delay like a real request would have
    setTimeout(() => {
      resolve(mockGames);
    }, 300);
  });
}

/* ------------------------------------------------------------
   RENDERING
------------------------------------------------------------ */
function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";

  card.innerHTML = `
    <img class="game-thumb" src="${game.thumbnail}" alt="${game.title}">
    <div class="game-info">
      <span class="game-category">${game.category}</span>
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <button class="play-btn" data-url="${game.url}">Play</button>
    </div>
  `;

  // handle broken images gracefully
  const img = card.querySelector(".game-thumb");
  img.addEventListener("error", () => {
    img.src = FALLBACK_THUMB;
  });

  // centralized play logic (see playGame())
  const playBtn = card.querySelector(".play-btn");
  playBtn.addEventListener("click", () => playGame(game));

  return card;
}

function renderFeaturedGames(games) {
  const container = document.getElementById("featuredGrid");
  container.innerHTML = "";

  const featured = games.filter((g) => g.featured);

  featured.forEach((game) => {
    container.appendChild(createGameCard(game));
  });
}

function renderGames(games) {
  const grid = document.getElementById("gamesGrid");
  const noResults = document.getElementById("noResults");

  grid.innerHTML = "";

  if (games.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  games.forEach((game) => {
    grid.appendChild(createGameCard(game));
  });
}

/* ------------------------------------------------------------
   PLAY SYSTEM
   Centralized so the future embed/iframe version only needs
   this one function changed.
------------------------------------------------------------ */
function playGame(game) {
  // For now: open the game's URL in a new tab.
  // Later this could open an iframe modal instead, e.g.:
  //   openGameModal(game.url);
  window.open(game.url, "_blank");
}

/* ------------------------------------------------------------
   SEARCH + FILTER LOGIC
------------------------------------------------------------ */
function applyFilters() {
  let filtered = allGames;

  if (currentCategory !== "All") {
    filtered = filtered.filter((g) => g.category === currentCategory);
  }

  if (currentSearchTerm.trim() !== "") {
    const term = currentSearchTerm.toLowerCase();
    filtered = filtered.filter((g) => g.title.toLowerCase().includes(term));
  }

  renderGames(filtered);
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value;
    applyFilters();
  });

  // navbar search also filters the main game list and scrolls to it
  const navSearch = document.getElementById("navSearchInput");
  navSearch.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value;
    searchInput.value = e.target.value;
    applyFilters();
  });
  navSearch.addEventListener("focus", () => {
    document.getElementById("all-games").scrollIntoView({ behavior: "smooth" });
  });
}

function setupCategoryFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      applyFilters();
    });
  });
}

/* ------------------------------------------------------------
   MOBILE NAVIGATION
------------------------------------------------------------ */
function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // close menu after clicking a link (mobile UX)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

/* ------------------------------------------------------------
   SMOOTH SCROLLING for anchor links
------------------------------------------------------------ */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ------------------------------------------------------------
   INIT
------------------------------------------------------------ */
async function init() {
  const loadingState = document.getElementById("loadingState");
  loadingState.style.display = "block";

  allGames = await loadGames();

  loadingState.style.display = "none";

  renderFeaturedGames(allGames);
  renderGames(allGames);

  setupSearch();
  setupCategoryFilters();
  setupMobileMenu();
  setupSmoothScroll();

  document.getElementById("year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);