import { chunkArray, escapeHtml, randomCode, seededShuffle } from "./utils.js";
import { getTheme, themes } from "./themes/index.js";

const state = {
  cards: [],
  categories: [],
  editions: [],
  generated: [],
  manifest: null,
  themeId: "trail-blue",
};
const byId = (id) => document.getElementById(id);
async function loadData() {
  const [cards, categories, editions] = await Promise.all([
    fetch("data/cards.json").then((r) => r.json()),
    fetch("data/categories.json").then((r) => r.json()),
    fetch("data/editions.json").then((r) => r.json()),
  ]);
  state.cards = cards;
  state.categories = categories;
  state.editions = editions;
  renderOptions();
  renderThemeOptions();
}
function renderOptions() {
  const e = byId("edition-options"),
    c = byId("category-options");
  state.editions
    .filter((x) => x.active)
    .forEach((x, i) =>
      e.insertAdjacentHTML(
        "beforeend",
        `<label class="option"><input type="checkbox" name="edition" value="${x.id}" ${i === 0 ? "checked" : ""}><span>${x.name}</span></label>`,
      ),
    );
  state.categories
    .filter((x) => x.active)
    .forEach((x) =>
      c.insertAdjacentHTML(
        "beforeend",
        `<label class="option"><input type="checkbox" name="category" value="${x.id}" checked><span>${x.icon} ${x.name}</span></label>`,
      ),
    );
}
function renderThemeOptions() {
  const selector = byId("theme");

  themes.forEach((theme) => {
    selector.insertAdjacentHTML(
      "beforeend",
      `
        <option value="${theme.id}">
          ${theme.name}
        </option>
      `,
    );
  });

  selector.value = state.themeId;
}
function selectedValues(n) {
  return [...document.querySelectorAll(`input[name="${n}"]:checked`)].map(
    (x) => x.value,
  );
}
function generateDeck() {
  const editions = selectedValues("edition"),
    categories = selectedValues("category"),
    requested = Number(byId("deck-size").value),
    seed = byId("seed").value.trim() || "convoy-demo";
  if (!editions.length || !categories.length) {
    byId("status").textContent =
      "Select at least one edition and one category.";
    return;
  }
  const eligible = state.cards.filter(
    (card) =>
      card.active &&
      card.status === "approved" &&
      card.editions.some((x) => editions.includes(x)) &&
      card.categories.some((x) => categories.includes(x)),
  );
  const chosen = seededShuffle(eligible, seed).slice(
    0,
    Math.min(requested, eligible.length),
  );
  const deckCode = randomCode(4),
    deckUuid = crypto.randomUUID();
  state.generated = chosen.map((card, index) => ({
    deck_position: index + 1,
    ...card,
  }));
  state.manifest = {
    deck_uuid: deckUuid,
    deck_code: deckCode,
    generated_at: new Date().toISOString(),
    seed,
    generator_version: "0.1.0",
    catalog_version: "2026.08.01",
    configuration: {
      editions,
      categories,
      theme: state.themeId,
      requested_card_count: requested,
      playable_card_count: chosen.length,
    },
    cards: state.generated.map((card) => ({
      deck_position: card.deck_position,
      card_uuid: card.card_uuid,
      content_version: card.content_version,
      content_snapshot: card.content,
    })),
  };
  byId("status").textContent =
    chosen.length < requested
      ? `Only ${chosen.length} eligible cards were available.`
      : `Generated ${chosen.length} playable cards.`;
  renderSummary();
  renderOutput();
}
function categoryFor(card) {
  return state.categories.find((x) => x.id === card.visual.primary_category);
}
function renderFrontCard(card) {
  const cat = categoryFor(card);

  return `
    <article class="play-card card-front">

      <div
        class="card-band"
        style="background:${cat.color}"
      >
        <span class="category-icon">${cat.icon}</span>
        <span class="category-name">${cat.name}</span>
      </div>

      <div class="card-body">
        <div>

          <div class="card-icon">
            ${cat.icon}
          </div>

          <p class="card-prompt">
            ${escapeHtml(card.content.prompt)}
          </p>

          ${
            card.content.instruction
              ? `
                <p class="card-instruction">
                  ${escapeHtml(card.content.instruction)}
                </p>
              `
              : ""
          }

        </div>
      </div>

      <div class="card-footer">
        <span>
          ${state.manifest.deck_code}
          ·
          ${card.deck_position}/${state.generated.length}
        </span>
      </div>

    </article>
  `;
}
function renderBackCard({
  showPunchGuide = true,
  themeId = state.themeId,
} = {}) {
  const theme = getTheme(themeId);
  return `
    <article class="play-card card-back ${theme.backClass}">

        ${
          showPunchGuide
            ? `
            <div
                class="punch-safe punch-safe-back"
                title="Optional hole-punch safe area"
            ></div>
            `
            : ""
        }

      <div class="card-back-content">

        <div
          class="trail-talk-compass"
          aria-hidden="true"
        >
          ✥
        </div>

        <h3>TRAIL TALK</h3>

        <p class="card-back-tagline">
          Real Questions. Real Connections.
        </p>

        <div
          class="trail-line"
          aria-hidden="true"
        >
          - - - - - - - - - - 🚩
        </div>

        <p class="card-back-brand">
          Overlanding Atlas
        </p>

      </div>

    </article>
  `;
}
function renderPreviewCard(card) {
  return `
    <div
      class="preview-card"
      role="button"
      tabindex="0"
      aria-pressed="false"
      aria-label="Flip card ${card.deck_position} to view the back"
    >
      <div class="preview-card-inner">
        <div class="preview-card-side preview-card-front">
          ${renderFrontCard(card)}
        </div>

        <div class="preview-card-side preview-card-back">
          ${renderBackCard({ showPunchGuide: false })}
        </div>
      </div>
    </div>
  `;
}
function renderSummary() {
  const el = byId("deck-summary"),
    m = state.manifest;
  el.hidden = false;
  el.innerHTML = `<strong>Deck ${m.deck_code}</strong> · ${m.configuration.playable_card_count} playable cards · Seed <code>${escapeHtml(m.seed)}</code> · Generator ${m.generator_version}`;
}

function renderOutput() {
  renderPreview();
  renderPrintOutput();
}

function renderPreview() {
  const mode = byId("output-mode").value;
  const out = byId("preview-output");

  out.innerHTML = "";

  if (mode === "list") {
    renderQuickList(out);
    return;
  }

  const previewGrid = document.createElement("div");
  previewGrid.className = "card-grid preview-card-grid";

  state.generated.forEach((card) => {
    previewGrid.insertAdjacentHTML("beforeend", renderPreviewCard(card));
  });

  out.appendChild(previewGrid);

  previewGrid.querySelectorAll(".preview-card").forEach((cardElement) => {
    cardElement.addEventListener("click", () => {
      togglePreviewCard(cardElement);
    });

    cardElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePreviewCard(cardElement);
      }
    });
  });
}
function togglePreviewCard(cardElement) {
  const isFlipped = cardElement.classList.toggle("is-flipped");

  cardElement.setAttribute("aria-pressed", String(isFlipped));
}
function renderQuickList(container) {
  const list = document.createElement("div");
  list.className = "quick-list";

  state.generated.forEach((card) => {
    const cat = categoryFor(card);

    list.insertAdjacentHTML(
      "beforeend",
      `
        <article class="list-item">
          <div class="list-meta">
            ${state.manifest.deck_code} ·
            ${card.deck_position}/${state.generated.length}
            <br>
            ${cat.icon} ${cat.name}
          </div>

          <p class="list-prompt">
            <strong>${escapeHtml(card.content.prompt)}</strong>
            ${
              card.content.instruction
                ? `<br>${escapeHtml(card.content.instruction)}`
                : ""
            }
          </p>
        </article>
      `,
    );
  });

  container.appendChild(list);
}

function renderPrintOutput() {
  const mode = byId("output-mode").value;
  const out = byId("print-output");

  out.innerHTML = "";

  if (mode === "list") {
    renderQuickList(out);
    return;
  }

  const cardsPerPage = 6;
  const cardGroups = chunkArray(state.generated, cardsPerPage);

  cardGroups.forEach((cards) => {
    const firstPosition = cards[0].deck_position;
    const lastPosition = cards[cards.length - 1].deck_position;

    /*
     * Front page
     */
    const frontPage = document.createElement("section");
    frontPage.className = "print-page front-page";
    frontPage.dataset.pageType = "front";
    frontPage.dataset.cardRange = `${firstPosition}-${lastPosition}`;

    const frontGrid = document.createElement("div");
    frontGrid.className = "card-grid";

    cards.forEach((card) => {
      frontGrid.insertAdjacentHTML("beforeend", renderFrontCard(card));
    });

    frontPage.appendChild(frontGrid);
    out.appendChild(frontPage);

    /*
     * Matching back page
     */
    const backPage = document.createElement("section");
    backPage.className = "print-page back-page";
    backPage.dataset.pageType = "back";
    backPage.dataset.cardRange = `${firstPosition}-${lastPosition}`;

    const backGrid = document.createElement("div");
    backGrid.className = "card-grid";

    cards.forEach(() => {
      backGrid.insertAdjacentHTML("beforeend", renderBackCard());
    });

    backPage.appendChild(backGrid);
    out.appendChild(backPage);
  });
}

function downloadManifest() {
  if (!state.manifest) {
    byId("status").textContent = "Generate a deck first.";
    return;
  }
  const blob = new Blob([JSON.stringify(state.manifest, null, 2)], {
      type: "application/json",
    }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = `convoy-${state.manifest.deck_code}-manifest.json`;
  a.click();
  URL.revokeObjectURL(url);
}
byId("generate").addEventListener("click", generateDeck);
byId("random-seed").addEventListener(
  "click",
  () => (byId("seed").value = randomCode(10)),
);
byId("print").addEventListener("click", () => window.print());
byId("download-manifest").addEventListener("click", downloadManifest);
byId("output-mode").addEventListener("change", () => {
  if (state.generated.length) renderOutput();
});
byId("theme").addEventListener("change", (event) => {
state.themeId = event.target.value;

if (state.generated.length) {
    renderOutput();
}
});
loadData().catch((error) => {
  console.error(error);
  byId("status").textContent =
    "Could not load JSON. Run this folder through a small local web server; see README.md.";
});
