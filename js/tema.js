// ===== TEMA E TROCA DE LOGOS =====
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  const headerLogo =
    document.querySelector("img.project-logo") ||
    document.querySelector(".brand img");
  const footerLogo = document.querySelector("img.footer-logo");

  const LOGO_WHITE = "../imgs/logo-branco.png";
  const LOGO_BLACK = "../imgs/logo-preto.png";

  let isLightMode = localStorage.getItem("theme")
    ? localStorage.getItem("theme") === "light"
    : window.matchMedia("(prefers-color-scheme: light)").matches;

  function setLogoSrc(isLight) {
    if (headerLogo) headerLogo.src = isLight ? LOGO_BLACK : LOGO_WHITE;
    if (footerLogo) footerLogo.src = isLight ? LOGO_BLACK : LOGO_WHITE;
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

  // Aplica tema inicial
  setTheme(isLightMode);

  // Botão toggle
  themeBtn?.addEventListener("click", () => {
    isLightMode = !isLightMode;
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
    setTheme(isLightMode);
  });

  // Detecta mudança automática do sistema
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        isLightMode = e.matches;
        setTheme(isLightMode);
      }
    });
});
