// scripts/timeline.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== dados / elementos =====
  const curiosities = [
    "Ada Lovelace escreveu notas que hoje consideramos o primeiro algoritmo destinado a execução por máquina.",
    "Babbage desenhou a Máquina Analítica com separação entre 'memória' e 'unidade de processamento' muito antes de eletrônica.",
    "Os cartões perfurados usados por Hollerith foram inspiração para armazenamento e entrada de dados por décadas.",
    "O selo do censo de 1890 mostrou redução drástica do tempo de processamento, graças à tabuladora.",
    "Alguns protótipos de máquinas de Babbage chegaram a ser montados séculos depois, provando que seu projeto funcionava.",
  ];

  const btnCur = document.getElementById("curiosityBtn");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  const themeBtn = document.getElementById("theme-toggle");
  const langBtn = document.getElementById("lang-toggle");
  const themeText = document.getElementById("theme-text");

  // logos - seletores específicos
  const headerLogo =
    document.querySelector("img.project-logo") ||
    document.querySelector(".brand img");
  const footerLogo = document.querySelector("img.footer-logo");

  // ===== modal curiosidade =====
  function openModal(title = "Informação") {
    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) modalTitle.textContent = title;
    if (modalBackdrop) {
      modalBackdrop.style.display = "grid";
      modalBackdrop.setAttribute("aria-hidden", "false");
    }
  }
  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.style.display = "none";
      modalBackdrop.setAttribute("aria-hidden", "true");
    }
  }

  btnCur?.addEventListener("click", () => {
    const idx = Math.floor(Math.random() * curiosities.length);
    if (modalContent) {
      modalContent.innerHTML = `<p style="font-size:1.05rem;margin-bottom:10px">${curiosities[idx]}</p><small style="color:var(--cor-suave)">Clique fora ou em ✕ para fechar</small>`;
    }
    openModal("Curiosidade");
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", (ev) => {
    if (ev.target === modalBackdrop) closeModal();
  });

  document.querySelectorAll(".gallery img").forEach((img) => {
    img.addEventListener("click", () => {
      const full = img.dataset.full || img.src;
      if (modalContent) {
        modalContent.innerHTML = `<img src="${full}" alt="${img.alt}" style="width:100%;height:auto;border-radius:10px">`;
      }
      openModal(img.alt || "Imagem");
    });
  });

  // ===== animação =====
  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));

  // ===== tema e troca de logos =====
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  let isLightMode = saved
    ? saved === "light"
    : window.matchMedia("(prefers-color-scheme: light)").matches;

  // Ajuste os paths aqui se necessário (use exatamente os paths que o HTML usa)
  const LOGO_WHITE = "../imgs/logo-branco.png";
  const LOGO_BLACK = "../imgs/logo-preto.png";

  // FUNÇÃO DE DEBUG PARA VERIFICAR SE IMAGENS EXISTEM (opcional)
  function checkImageExists(url, label) {
    const img = new Image();
    img.onload = () => console.log(`[OK] ${label} carregou: ${url}`);
    img.onerror = () =>
      console.warn(`[ERRO] ${label} não encontrado em: ${url}`);
    img.src = url;
  }
  checkImageExists(LOGO_WHITE, "Logo branco");
  checkImageExists(LOGO_BLACK, "Logo preto");

  function setLogoSrc(isLight) {
    if (headerLogo && headerLogo.tagName === "IMG") {
      headerLogo.src = isLight ? LOGO_BLACK : LOGO_WHITE;
    } else {
      console.warn("headerLogo não é <img> válido:", headerLogo);
    }

    if (footerLogo && footerLogo.tagName === "IMG") {
      footerLogo.src = isLight ? LOGO_BLACK : LOGO_WHITE;
    } else {
      // fallback: tentar qualquer <img> dentro do footer
      const anyFooterImg = document.querySelector("footer img");
      if (anyFooterImg) {
        anyFooterImg.src = isLight ? LOGO_BLACK : LOGO_WHITE;
        console.info("Usando fallback footer img:", anyFooterImg);
      } else {
        console.warn("Nenhuma imagem de footer encontrada.");
      }
    }
  }

  function setTheme(isLight) {
    root.style.setProperty(
      "--cor-fundo-principal",
      isLight ? "var(--cor-claro-fundo-principal)" : "#121212"
    );
    root.style.setProperty(
      "--cor-fundo-secundario",
      isLight ? "var(--cor-claro-fundo-secundario)" : "#2c3e50"
    );
    root.style.setProperty(
      "--cor-texto",
      isLight ? "var(--cor-claro-texto)" : "#ffffff"
    );
    root.style.setProperty(
      "--cor-destaque",
      isLight ? "var(--cor-claro-destaque)" : "#3498db"
    );
    root.style.setProperty(
      "--cor-destaque-btn",
      isLight ? "var(--cor-claro-destaque-btn)" : "#3498db"
    );
    root.style.setProperty(
      "--cor-destaque-hover",
      isLight ? "var(--cor-claro-destaque-hover)" : "#2980b9"
    );
    root.style.setProperty(
      "--cor-suave",
      isLight ? "var(--cor-claro-suave)" : "#95a5a6"
    );
    root.style.setProperty(
      "--cor-titulo",
      isLight ? "var(--cor-claro-titulo)" : "#ecf0f1"
    );
    root.setAttribute("data-theme", isLight ? "light" : "dark");
    if (themeText)
      themeText.textContent = isLight ? "Modo Escuro" : "Modo Claro";
    setLogoSrc(isLight);
  }

  // aplica inicialmente
  setTheme(isLightMode);

  // toggle
  themeBtn?.addEventListener("click", () => {
    isLightMode = !isLightMode;
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
    setTheme(isLightMode);
  });

  // atualiza quando prefer-color-scheme mudar (se o usuário não salvou preferência)
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener?.("change", (e) => {
    if (!localStorage.getItem("theme")) {
      isLightMode = e.matches;
      setTheme(isLightMode);
    }
  });

  // idioma
  langBtn?.addEventListener("click", () => {
    const currentLang = document.documentElement.lang;
    if (currentLang === "pt-BR") {
      alert("Função para traduzir para Inglês seria implementada aqui.");
      document.documentElement.lang = "en";
    } else {
      alert("Função para traduzir para Português seria implementada aqui.");
      document.documentElement.lang = "pt-BR";
    }
    document.addEventListener("DOMContentLoaded", () => {
      const headerLogo = document.querySelector("header img"); // ajusta se a logo do header tiver outra classe/id
      const footerLogo = document.querySelector("footer img");

      function trocarLogo(isLight) {
        const LOGO_PRETO = "imgs/logo-preto.png";
        const LOGO_BRANCO = "imgs/logo-branco.png";

        if (headerLogo) {
          headerLogo.src = isLight ? LOGO_PRETO : LOGO_BRANCO;
        }
        if (footerLogo) {
          footerLogo.src = isLight ? LOGO_PRETO : LOGO_BRANCO;
        }
      }

      // Detecta mudança de tema
      const modoClaro = document.body.classList.contains("light-mode");
      trocarLogo(modoClaro);

      // Se você já tiver um botão para alternar tema:
      const botaoTema = document.querySelector("#toggle-theme");
      if (botaoTema) {
        botaoTema.addEventListener("click", () => {
          const modoClaroAtivo = document.body.classList.toggle("light-mode");
          trocarLogo(modoClaroAtivo);
        });
      }
    });
  });
});
