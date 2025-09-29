(() => {
  const SUPPORTED = ["pt", "en"];
  const FALLBACK = "pt";
  const LS_KEY = "site-lang";

  function getSavedLang() {
    const s = localStorage.getItem(LS_KEY);
    if (s && SUPPORTED.includes(s)) return s;
    const h = (document.documentElement.lang || "").slice(0, 2);
    if (h && SUPPORTED.includes(h)) return h;
    return FALLBACK;
  }
  let lang = getSavedLang();

  function getPageKey() {
    const htmlData = document.documentElement.getAttribute("data-page");
    if (htmlData) return htmlData;
    const path = location.pathname.split("/").filter(Boolean);
    const last = path[path.length - 1] || "index.html";
    return last.replace(/\.[^/.]+$/, "") || "index";
  }
  const pageKey = getPageKey();

  function detectI18nDir() {
    const current =
      document.currentScript ||
      Array.from(document.scripts).find(
        (s) => s.src && s.src.includes("idioma.js")
      ) ||
      null;
    if (current && current.src) {
      try {
        const scriptUrl = new URL(current.src, location.href);
        const scriptDir = scriptUrl.href.replace(/\/[^\/]*$/, "");
        return scriptDir + "/i18n";
      } catch (e) {}
    }
    return location.origin + "/js/i18n";
  }
  const I18N_DIR = detectI18nDir();

  async function fetchJson(url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[i18n] fetch fail:", url, err);
      return null;
    }
  }

  async function loadAll() {
    const commonUrl = `${I18N_DIR}/common.${lang}.json`;
    const pageUrl = `${I18N_DIR}/${pageKey}.${lang}.json`;
    console.log("[i18n] loading:", commonUrl, pageUrl);

    const [commonRes, pageRes] = await Promise.all([
      fetchJson(commonUrl),
      fetchJson(pageUrl),
    ]);

    const common =
      commonRes ??
      (lang !== FALLBACK
        ? await fetchJson(`${I18N_DIR}/common.${FALLBACK}.json`)
        : {}) ??
      {};
    const page =
      pageRes ??
      (lang !== FALLBACK
        ? await fetchJson(`${I18N_DIR}/${pageKey}.${FALLBACK}.json`)
        : {}) ??
      {};

    return Object.assign({}, common, page);
  }

  function applyMap(map) {
    if (!map || typeof map !== "object") return;

    if (map.title) document.title = map.title;

    const navMap = [
      { hrefEnd: "pioneiros.html", key: "nav.pioneiros" },
      { hrefEnd: "modelos.html", key: "nav.modelos" },
      { hrefEnd: "busca.html", key: "nav.busca" },
      { hrefEnd: "quiz/quiz.html", key: "nav.quiz" },
      { hrefEnd: "pags/sobre.html", key: "nav.sobre" },
      { hrefEnd: "index.html", key: "nav.home" },
    ];
    document.querySelectorAll(".header-nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const match = navMap.find((n) => href.endsWith(n.hrefEnd));
      if (match && map[match.key]) {
        let span = a.querySelector("span");
        if (!span) {
          span = document.createElement("span");

          const textNodes = Array.from(a.childNodes).filter(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
          );
          textNodes.forEach((n) => span.appendChild(n));
          a.appendChild(span);
        }
        span.textContent = map[match.key];
      }
    });

    const logo = document.querySelector(".project-logo");
    if (logo && map["logo.alt"]) logo.setAttribute("alt", map["logo.alt"]);
    const footerLogo = document.querySelector(".footer-logo");
    if (footerLogo && map["footer.logo.alt"])
      footerLogo.setAttribute("alt", map["footer.logo.alt"]);

    window.__i18n.themeLabels = {
      light: map["ui.theme.light"] || map["ui.theme"] || "Modo Claro",
      dark: map["ui.theme.dark"] || map["ui.theme"] || "Modo Escuro",
    };

    try {
      window.dispatchEvent(new Event("i18n:labels"));
    } catch (e) {
      console.warn("i18n:labels dispatch falhou", e);
    }

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      const span = langBtn.querySelector("span");
      const short = lang === "pt" ? "EN" : "PT";

      if (map["ui.langToggleFull"]) {
        if (span) span.textContent = map["ui.langToggleFull"];
        else langBtn.textContent = map["ui.langToggleFull"];
      } else {
        if (span) span.textContent = short;
        else langBtn.textContent = short;
      }
    }

    if (map["timeline.title"]) {
      const t = document.querySelector("#timeline-title");
      if (t) t.textContent = map["timeline.title"];
    }
    if (map["timeline.subtitle"]) {
      const s = document.querySelector(".timeline-header p");
      if (s) s.textContent = map["timeline.subtitle"];
    }

    document
      .querySelectorAll(".timeline-event[data-year]")
      .forEach((article) => {
        const year = article.getAttribute("data-year");
        if (!year) return;
        const titleKey = `event.${year}.title`;
        const descKey = `event.${year}.desc`;
        const h3 =
          article.querySelector(".card-title h3") ||
          article.querySelector("h3");
        if (h3 && map[titleKey]) h3.textContent = map[titleKey];
        const p =
          article.querySelector(".card > p") || article.querySelector("p");
        if (p && map[descKey]) p.textContent = map[descKey];
      });

    const endNote = document.querySelector(".timeline-end .end-note");
    if (endNote && map["timeline.endNote"])
      endNote.textContent = map["timeline.endNote"];

    document
      .querySelectorAll(".footer-actions a, .footer-container a")
      .forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (href.endsWith("pags/sobre.html") && map["nav.sobre"]) {
          const span = a.querySelector("span") || a;
          span.textContent = map["nav.sobre"];
        }
      });

    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }

  async function init() {
    const map = await loadAndCache();
    applyMap(map);
  }

  const cache = {};
  async function loadAndCache() {
    const cacheKey = `${pageKey}:${lang}`;
    if (cache[cacheKey]) return cache[cacheKey];
    const map = await loadAll();
    cache[cacheKey] = map;
    return map;
  }

  document.addEventListener("click", async (ev) => {
    const btn = ev.target.closest && ev.target.closest("#lang-toggle");
    if (!btn) return;
    lang = lang === "pt" ? "en" : "pt";
    try {
      localStorage.setItem(LS_KEY, lang);
    } catch (e) {}
    const map = await loadAndCache();
    applyMap(map);
  });

  document.addEventListener("DOMContentLoaded", init);

  window.__i18n = {
    getLang: () => lang,
    pageKey,
    i18nDir: I18N_DIR,
    reload: async () => {
      const m = await loadAndCache();
      applyMap(m);
    },
  };
})();
