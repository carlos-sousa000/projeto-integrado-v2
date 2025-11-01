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
      tags: "babbage,diferencial,computacao,maquina",
      date: "1821",
      url: "../pags/artigos/artigos-pt/artigo1.html",
    },
    {
      id: "a2",
      title: "Semyon Korsakov — Armazenamento por cartões",
      excerpt:
        "Utilizou cartões perfurados/registradores para organizar informações, antecipando sistemas de indexação mecânica de dados.",
      tags: "korsakov,cartoes,armazenamento",
      date: "1832",
      url: "../pags/artigos/artigos-pt/artigo.html",
    },
    {
      id: "a3",
      title: "Calculadora com teclado — Torchi",
      excerpt:
        "Exemplos iniciais de máquinas com entrada por teclado, facilitando inserção direta de números.",
      tags: "torchi,teclado,calculadora",
      date: "1834",
      url: "../pags/artigos/artigos-pt/artigo2.html",
    },
    {
      id: "a4",
      title: "Relé eletromecânico — Joseph Henry",
      excerpt:
        "Componentes eletromecânicos que permitiram o controle de sinais e são antecedentes dos circuitos lógicos.",
      tags: "henry,rele,eletromecanico",
      date: "1835",
      url: "../pags/artigos/artigos-pt/artigo3.html",
    },
    {
      id: "a5",
      title: "Máquina Analítica — Charles Babbage",
      excerpt:
        "Conceito de computador de uso geral: unidade aritmética, memória, controle e uso de cartões para instruções.",
      tags: "babbage,analitica,computador",
      date: "1837",
      url: "../pags/artigos/artigos-pt/artigo4.html",
    },
    {
      id: "a6",
      title: "Ada Lovelace — Primeiro algoritmo",
      excerpt:
        "Nota sobre a máquina analítica contendo um algoritmo para calcular números de Bernoulli. Reconhecida como a primeira programadora.",
      tags: "ada,lovelace,algoritmo",
      date: "1842",
      url: "../pags/artigos/artigos-pt/artigo5.html",
    },
    {
      id: "a7",
      title: "Álgebra de Boole e lógica simbólica",
      excerpt:
        "Formalização da lógica por George Boole que possibilitou operações lógicas em circuitos digitais.",
      tags: "boole,logica,algebra",
      date: "1854",
      url: "../pags/artigos/artigos-pt/artigo8.html",
    },
    {
      id: "a8",
      title: "Máquina de Tabulação — Herman Hollerith",
      excerpt:
        "Usou cartões perfurados e leitores eletromecânicos para acelerar o processamento do censo dos EUA.",
      tags: "hollerith,tabulacao,cartoes",
      date: "1890",
      url: "../pags/artigos/artigos-pt/artigo16.html",
    },
    {
      id: "a9",
      title: "A Máquina Relacional — Alfred Smee",
      excerpt:
        "Propôs máquinas para representar e comparar ideias mecanicamente — ideias influentes, embora raramente tenham sido construídas.",
      tags: "smee,relacional,maquina",
      date: "1851",
      url: "../pags/artigos/artigos-pt/artigo6.html",
    },
    {
      id: "a10",
      title: "Teletrofone — Antonio Meucci",
      excerpt:
        "Dispositivo precursor do telefone moderno, projetado para transmitir voz por sinais elétricos.",
      tags: "meucci,teletrofone,comunicacao",
      date: "1856",
      url: "../pags/artigos/artigos-pt/artigo7.html",
    },
    {
      id: "a11",
      title: "Calculadora de Coluna Única — Caroline Winter",
      excerpt:
        "Uma calculadora mecânica projetada para realizar cálculos simples de forma eficiente.",
      tags: "winter,calculadora,mecanica",
      date: "1859",
      url: "../pags/artigos/artigos-pt/artigo9.html",
    },
    {
      id: "a12",
      title: "A Máquina de Escrever",
      excerpt:
        "Dispositivo mecânico que revolucionou a escrita, permitindo a produção de documentos de forma mais rápida.",
      tags: "escrever,maquina,documentos",
      date: "1867",
      url: "../pags/artigos/artigos-pt/artigo10.html",
    },
    {
      id: "a13",
      title: "O Plano Lógico — William Stanley Jevons",
      excerpt:
        "Uma máquina projetada para resolver problemas lógicos usando princípios matemáticos.",
      tags: "jevons,logico,plano",
      date: "1869",
      url: "../pags/artigos/artigos-pt/artigo11.html",
    },
    {
      id: "a14",
      title: "Multiplicação Direta — Edmund Barbour",
      excerpt:
        "Dispositivo mecânico projetado para realizar multiplicações de forma direta e eficiente.",
      tags: "barbour,multiplicacao,mecanica",
      date: "1872",
      url: "../pags/artigos/artigos-pt/artigo12.html",
    },
    {
      id: "a15",
      title: "A Lógica de Frege — Gottlob Frege",
      excerpt:
        "Trabalho pioneiro que lançou as bases para a lógica moderna e a computação.",
      tags: "frege,logica,computacao",
      date: "1879",
      url: "../pags/artigos/artigos-pt/artigo13.html",
    },
    {
      id: "a16",
      title: "NE e NOU — Charles Peirce",
      excerpt:
        "Conceitos lógicos fundamentais desenvolvidos por Peirce, que influenciaram a lógica simbólica.",
      tags: "peirce,logica,simbolica",
      date: "1880",
      url: "../pags/artigos/artigos-pt/artigo14.html",
    },
    {
      id: "a17",
      title: "Calculadora Brasileira — Azevedo Coutinho",
      excerpt:
        "Uma calculadora mecânica desenvolvida no Brasil, destacando-se pela inovação local.",
      tags: "coutinho,calculadora,brasileira",
      date: "1884",
      url: "../pags/artigos/artigos-pt/artigo15.html",
    },
    {
      id: "p1",
      title: "Herman Hollerith",
      excerpt:
        "Inventor da máquina de tabulação, que revolucionou a forma como informações são armazenadas e processadas.",
      tags: "herman,censo,pioneiro",
      date: "-",
      url: "../pags/pioneiros/herman-hollerith.html",
    },
    {
      id: "p2",
      title: "Ada Lovelace",
      excerpt:
        "Considerada a primeira programadora por seu trabalho com as máquinas de Charles Babbage.",
      tags: "ada,lovelace,programadora",
      date: "-",
      url: "../pags/pioneiros/ada-lovelace.html",
    },
    {
      id: "p3",
      title: "Joseph Henry",
      excerpt:
        "Contribuiu para a eletrônica e inventos que auxiliaram a comunicação elétrica (relés).",
      tags: "henry,eletrico,telecomunicacao",
      date: "-",
      url: "../pags/pioneiros/joseph-henry.html",
    },
    {
      id: "p4",
      title: "Charles Babbage",
      excerpt:
        "Criador da Máquina Diferencial e da Máquina Analítica, precursor das ideias de programação.",
      tags: "babbage,computador,pioneiro",
      date: "-",
      url: "../pags/pioneiros/charles-babbage.html",
    },
    {
      id: "p5",
      title: "Alfred Smee",
      excerpt:
        "Autor de estudos sobre máquinas relacionais e circuitos elétricos aplicados ao processamento de informações.",
      tags: "smee,relacional,maquina",
      date: "-",
      url: "../pags/pioneiros/alfred-smee.html",
    },
    {
      id: "p6",
      title: "Gottlob Frege",
      excerpt:
        "Filósofo e lógico que fundou a lógica moderna formal, influenciando a computação teórica.",
      tags: "frege,logica,matematica",
      date: "-",
      url: "../pags/pioneiros/gottlob-frege.html",
    },

    // simple entries for site sections (searchable)
    {
      id: "s-modelos",
      title: "Modelos 3D",
      excerpt: "Coleção de modelos 3D do projeto.",
      tags: "modelos,3d,modelos 3d",
      date: "-",
      url: "../pags/modelos/modelos.html",
    },
    {
      id: "s-timeline",
      title: "Linha do Tempo",
      excerpt: "Navegue pela linha do tempo dos pioneiros da computação.",
      tags: "linha do tempo,timeline,cronologia",
      date: "-",
      url: "../pags/timeline.html",
    },
    {
      id: "s-pioneiros",
      title: "Pioneiros",
      excerpt: "Página de pioneiros e biografias.",
      tags: "pioneiros,biografias",
      date: "-",
      url: "../pags/pioneiros/pioneiros.html",
    },
    {
      id: "s-quiz",
      title: "Quiz",
      excerpt: "Teste seus conhecimentos com nosso quiz.",
      tags: "quiz,testes",
      date: "-",
      url: "../pags/quiz/quiz.html",
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
