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
      title: "Difference Engine — Charles Babbage",
      excerpt:
        "Designed to automatically calculate and print mathematical tables. It was mechanical, with gears.",
      tags: "babbage,differential,computation,machine",
      date: "1821",
      url: "../pags/artigos/artigos eng/artigo1-en.html",
    },
    {
      id: "a2",
      title: "Semyon Korsakov — Card Storage",
      excerpt:
        "Used punched cards/recorders to organize information, anticipating mechanical data indexing systems.",
      tags: "korsakov,cards,storage",
      date: "1832",
      url: "../pags/artigos/artigos eng/artigo-en.html",
    },
    {
      id: "a3",
      title: "Keyboard Calculator — Torchi",
      excerpt:
        "Early examples of machines with keyboard input, allowing direct number entry.",
      tags: "torchi,keyboard,calculator",
      date: "1834",
      url: "../pags/artigos/artigos eng/artigo2-en.html",
    },
    {
      id: "a4",
      title: "Electromechanical Relay — Joseph Henry",
      excerpt:
        "Electromechanical components that enabled signal control and were precursors to logic circuits.",
      tags: "henry,relay,electromechanical",
      date: "1835",
      url: "../pags/artigos/artigos eng/artigo3-en.html",
    },
    {
      id: "a5",
      title: "Analytical Engine — Charles Babbage",
      excerpt:
        "Concept of a general-purpose computer: arithmetic unit, memory, control, and use of cards for instructions.",
      tags: "babbage,analytical,computer",
      date: "1837",
      url: "../pags/artigos/artigos eng/artigo4-en.html",
    },
    {
      id: "a6",
      title: "Ada Lovelace — First Algorithm",
      excerpt:
        "A note about the Analytical Engine containing an algorithm to calculate Bernoulli numbers. Recognized as the first programmer.",
      tags: "ada,lovelace,algorithm",
      date: "1842",
      url: "../pags/artigos/artigos eng/artigo5-en.html",
    },
    {
      id: "a7",
      title: "Boolean Algebra and Symbolic Logic",
      excerpt:
        "Formalization of logic by George Boole, enabling logical operations in digital circuits.",
      tags: "boole,logic,algebra",
      date: "1854",
      url: "../pags/artigos/artigos eng/artigo8-en.html",
    },
    {
      id: "a8",
      title: "Tabulating Machine — Herman Hollerith",
      excerpt:
        "Used punched cards and electromechanical readers to speed up the U.S. census processing.",
      tags: "hollerith,tabulation,cards",
      date: "1890",
      url: "../pags/artigos/artigos eng/artigo16-en.html",
    },
    {
      id: "a9",
      title: "The Relational Machine — Alfred Smee",
      excerpt:
        "Proposed machines to represent and compare ideas mechanically — influential concepts, though rarely built.",
      tags: "smee,relational,machine",
      date: "1851",
      url: "../pags/artigos/artigos eng/artigo6-en.html",
    },
    {
      id: "a10",
      title: "Teletrophone — Antonio Meucci",
      excerpt:
        "A forerunner of the modern telephone, designed to transmit voice through electrical signals.",
      tags: "meucci,teletrophone,communication",
      date: "1856",
      url: "../pags/artigos/artigos eng/artigo7-en.html",
    },
    {
      id: "a11",
      title: "Single-Column Calculator — Caroline Winter",
      excerpt:
        "A mechanical calculator designed to perform simple calculations efficiently.",
      tags: "winter,calculator,mechanical",
      date: "1859",
      url: "../pags/artigos/artigos eng/artigo9-en.html",
    },
    {
      id: "a12",
      title: "The Typewriter",
      excerpt:
        "A mechanical device that revolutionized writing, enabling faster document production.",
      tags: "typewriter,machine,documents",
      date: "1867",
      url: "../pags/artigos/artigos eng/artigo10-en.html",
    },
    {
      id: "a13",
      title: "The Logical Piano — William Stanley Jevons",
      excerpt:
        "A machine designed to solve logical problems using mathematical principles.",
      tags: "jevons,logic,piano",
      date: "1869",
      url: "../pags/artigos/artigos eng/artigo11-en.html",
    },
    {
      id: "a14",
      title: "Direct Multiplication — Edmund Barbour",
      excerpt:
        "A mechanical device designed to perform multiplications directly and efficiently.",
      tags: "barbour,multiplication,mechanical",
      date: "1872",
      url: "../pags/artigos/artigos eng/artigo12-en.html",
    },
    {
      id: "a15",
      title: "Frege’s Logic — Gottlob Frege",
      excerpt:
        "Groundbreaking work that laid the foundations for modern logic and computing.",
      tags: "frege,logic,computation",
      date: "1879",
      url: "../pags/artigos/artigos eng/artigo13-en.html",
    },
    {
      id: "a16",
      title: "NOR and NAND — Charles Peirce",
      excerpt:
        "Fundamental logical concepts developed by Peirce that influenced symbolic logic.",
      tags: "peirce,logic,symbolic",
      date: "1880",
      url: "../pags/artigos/artigos eng/artigo14-en.html",
    },
    {
      id: "a17",
      title: "Brazilian Calculator — Azevedo Coutinho",
      excerpt:
        "A mechanical calculator developed in Brazil, notable for its local innovation.",
      tags: "coutinho,calculator,brazilian",
      date: "1884",
      url: "../pags/artigos/artigos eng/artigo15-en.html",
    },
    {
      id: "p1",
      title: "Herman Hollerith",
      excerpt:
        "Inventor of the tabulating machine, which revolutionized how information was stored and processed.",
      tags: "herman,census,pioneer",
      date: "-",
      url: "../pags/pioneiros/herman-hollerith-en.html",
    },
    {
      id: "p2",
      title: "Ada Lovelace",
      excerpt:
        "Considered the first computer programmer for her work with Charles Babbage’s machines.",
      tags: "ada,lovelace,programmer",
      date: "-",
      url: "../pags/pioneiros/ada-lovelace-en.html",
    },
    {
      id: "p3",
      title: "Joseph Henry",
      excerpt:
        "Contributed to electromagnetism and invented devices important to electrical communication.",
      tags: "henry,electric,telegraph",
      date: "-",
      url: "../pags/pioneiros/joseph-henry-en.html",
    },
    {
      id: "p4",
      title: "Charles Babbage",
      excerpt:
        "Creator of the Difference Engine and Analytical Engine, foundational to computing history.",
      tags: "babbage,computer,pioneer",
      date: "-",
      url: "../pags/pioneiros/charles-babbage-en.html",
    },
    {
      id: "p5",
      title: "Alfred Smee",
      excerpt:
        "Studied relational machines and early electrical circuits for information processing.",
      tags: "smee,relational,machine",
      date: "-",
      url: "../pags/pioneiros/alfred-smee-en.html",
    },
    {
      id: "p6",
      title: "Gottlob Frege",
      excerpt:
        "Developed foundational logic systems that influenced modern computation theory.",
      tags: "frege,logic,mathematics",
      date: "-",
      url: "../pags/pioneiros/gottlob-frege-en.html",
    },

    // site sections
    {
      id: "s-models",
      title: "3D Models",
      excerpt: "Collection of 3D models available in the project.",
      tags: "models,3d",
      date: "-",
      url: "../pags/modelos/modelos-en.html",
    },
    {
      id: "s-timeline",
      title: "Timeline",
      excerpt: "Browse the timeline of computing pioneers.",
      tags: "timeline,history",
      date: "-",
      url: "../pags/timeline-en.html",
    },
    {
      id: "s-pioneers",
      title: "Pioneers",
      excerpt: "Biographies of pioneers in computing.",
      tags: "pioneers,biographies",
      date: "-",
      url: "../pags/pioneiros-en.html",
    },
    {
      id: "s-quiz",
      title: "Quiz",
      excerpt: "Test your knowledge with our quiz.",
      tags: "quiz,test",
      date: "-",
      url: "../pags/quiz/quiz-en.html",
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
