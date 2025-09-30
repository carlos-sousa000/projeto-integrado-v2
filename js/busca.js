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
      title: "Máquina Diferencial — Charles Babbage",
      excerpt:
        "Projetada para calcular e imprimir tabelas matemáticas automaticamente. Era mecânica, com engrenagens.",
      tags: "babbage,máquina,diferencial",
      date: "1821",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a2",
      title: "Semyon Korsakov — Armazenamento por cartões",
      excerpt:
        "Utilizou cartões perfurados/registradores para organizar informações, antecipando sistemas de indexação mecânica de dados.",
      tags: "korsakov,cartoes,armazenamento",
      date: "1832",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a3",
      title: "Calculadora com teclado — Torchi",
      excerpt:
        "Exemplos iniciais de máquinas com entrada por teclado, facilitando inserção direta de números.",
      tags: "torchi,teclado",
      date: "1834",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a4",
      title: "Relé eletromecânico — Joseph Henry",
      excerpt:
        "Componentes eletromecânicos que permitiram o controle de sinais e são antecedentes dos circuitos lógicos.",
      tags: "henry,rele,eletromecanico",
      date: "1835",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a5",
      title: "Máquina Analítica — Charles Babbage",
      excerpt:
        "Conceito de computador de uso geral: unidade aritmética, memória, controle e uso de cartões para instruções.",
      tags: "babbage,analitica",
      date: "1837",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a6",
      title: "Ada Lovelace — Primeiro algoritmo",
      excerpt:
        "Nota sobre a máquina analítica contendo um algoritmo para calcular números de Bernoulli. Reconhecida como a primeira programadora.",
      tags: "ada,lovelace,algoritmo",
      date: "1842",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a7",
      title: "Álgebra de Boole e lógica simbólica",
      excerpt:
        "Formalização da lógica por George Boole que possibilitou operações lógicas em circuitos digitais.",
      tags: "boole,logica",
      date: "1854",
      url: ".././pags/artigos/artigo.html",
    },
    {
      id: "a8",
      title: "Máquina de Tabulação — Herman Hollerith",
      excerpt:
        "Usou cartões perfurados e leitores eletromecânicos para acelerar o processamento do censo dos EUA.",
      tags: "hollerith,tabulacao,cartoes",
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
      none.textContent = "Nenhum resultado encontrado.";
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
