(function () {
  const cfg = {
    inputId: "filtro",
    btnSearchId: "doSearch",
    btnClearId: "clearFilter",
    resultsListId: "resultsList",
    resultsCountId: "resultsCount",
    debounceMs: 200,
    pinTopN: 2,
  };

  const DATA = [
    {
      id: "a1",
      title: "Differential Engine — Charles Babbage",
      excerpt:
        "Designed to calculate and print mathematical tables automatically. It was mechanical, using gears.",
      tags: "babbage,engine,differential",
      date: "1821",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a2",
      title: "Semyon Korsakov — Card-based storage",
      excerpt:
        "Used punched cards and registrars to organize information, anticipating mechanical data indexing systems.",
      tags: "korsakov,cards,storage",
      date: "1832",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a3",
      title: "Keyboard Calculator — Torchi",
      excerpt:
        "Early examples of machines with keyboard input, easing direct number entry.",
      tags: "torchi,keyboard",
      date: "1834",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a4",
      title: "Electromechanical Relay — Joseph Henry",
      excerpt:
        "Electromechanical components that enabled signal control and anticipated logic circuits.",
      tags: "henry,relay,electromechanical",
      date: "1835",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a5",
      title: "Analytical Engine — Charles Babbage",
      excerpt:
        "Concept of a general-purpose computer: arithmetic unit, memory, control and instruction cards.",
      tags: "babbage,analytical",
      date: "1837",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a6",
      title: "Ada Lovelace — First algorithm",
      excerpt:
        "Notes on the Analytical Engine including an algorithm to compute Bernoulli numbers. Recognized as the first programmer.",
      tags: "ada,lovelace,algorithm",
      date: "1842",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a7",
      title: "Boolean Algebra and symbolic logic",
      excerpt:
        "George Boole's formalization of logic enabled treatment of logical operations algebraically — basis of digital circuits.",
      tags: "boole,logic",
      date: "1854",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a8",
      title: "Tabulating Machine — Herman Hollerith",
      excerpt:
        "Used punched cards and electromechanical readers to speed up processing of the US census — milestone in data automation.",
      tags: "hollerith,tabulation,cards",
      date: "1890",
      url: ".././pags/artigos/hollerith.html",
    },
  ];

  function normalize(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");
  }
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function debounce(fn, ms) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  }

  function scoreItem(item, tokens) {
    if (!tokens.length) return 0;
    const nt = normalize(item.title);
    const ne = normalize(item.excerpt);
    const tg = normalize(item.tags || "");
    let sc = 0;
    tokens.forEach((t) => {
      if (nt.includes(t)) sc += 50;
      if (tg.includes(t)) sc += 25;
      const occ = ne.split(t).length - 1;
      if (occ > 0) sc += 8 * occ;
    });
    return sc;
  }

  function highlight(text, tokens) {
    if (!tokens.length) return escapeHtml(text);
    const sorted = Array.from(new Set(tokens))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
    const pat = sorted.map(escapeRegex).join("|");
    const re = new RegExp(pat, "ig");
    const tmp = document.createElement("div");
    tmp.textContent = text;
    return tmp.innerHTML.replace(re, (m) => `<mark class="hi">${m}</mark>`);
  }

  function renderResults(query, sortBy = "relevance") {
    const container = document.getElementById(cfg.resultsListId);
    container.innerHTML = "";
    const q = (query || "").trim();
    const tokens = q ? normalize(q).split(/\s+/).filter(Boolean) : [];

    let items = DATA.map((d) =>
      Object.assign({}, d, { score: scoreItem(d, tokens) })
    );
    if (tokens.length) {
      items = items.filter((i) => i.score > 0);
    }
    if (sortBy === "relevance") {
      items.sort(
        (a, b) => b.score - a.score || new Date(b.date) - new Date(a.date)
      );
    } else {
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const pinned = items.slice(0, cfg.pinTopN);
    const rest = items.slice(cfg.pinTopN);

    const frag = document.createDocumentFragment();
    function appendItem(it) {
      const r = document.createElement("article");
      r.className = "result";
      r.setAttribute("role", "listitem");
      const titleHtml = tokens.length
        ? highlight(it.title, tokens)
        : escapeHtml(it.title);
      const excerptHtml = tokens.length
        ? highlight(it.excerpt, tokens)
        : escapeHtml(it.excerpt);
      r.innerHTML = `
            <a class="title" href="${it.url}">${titleHtml}</a>
            <div class="excerpt">${excerptHtml}</div>
            <div class="meta">${it.date} • ${escapeHtml(it.tags || "")}</div>
          `;
      frag.appendChild(r);
    }

    pinned.forEach(appendItem);
    rest.forEach(appendItem);

    if (items.length === 0) {
      const none = document.createElement("div");
      none.style.padding = "12px";
      none.style.color = "var(--cor-suave)";
      none.textContent = "No results found.";
      frag.appendChild(none);
    }

    container.appendChild(frag);
    const cntEl = document.getElementById(cfg.resultsCountId);
    if (cntEl) cntEl.textContent = items.length;
  }

  const input = document.getElementById(cfg.inputId);
  const btnSearch = document.getElementById(cfg.btnSearchId);
  const btnClear = document.getElementById(cfg.btnClearId);
  const debouncedRender = debounce((v) => renderResults(v), cfg.debounceMs);

  input.addEventListener("input", (e) => debouncedRender(e.target.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      renderResults(input.value);
    }
  });
  btnSearch.addEventListener("click", () => renderResults(input.value));
  btnClear.addEventListener("click", () => {
    input.value = "";
    renderResults("");
    input.focus();
  });

  // initial render (all entries)
  renderResults("");
})();

