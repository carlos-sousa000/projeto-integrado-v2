document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  const headerLogo = document.querySelector(".project-logo:not(.footer-logo)");
  const footerLogo = document.querySelector(".footer-logo");

  // Detecta automaticamente o nome do repositório (ex: "projeto-integrado-v2")
  const repoName = window.location.pathname.split("/")[1];
  const basePath = `/${repoName}`;

  const LOGOS = {
    light: `${basePath}/imgs/logo-preto.png`,
    dark: `${basePath}/imgs/logo-branco.png`,
  };

  function getThemeLabels() {
    const defaultLabels = { light: "Modo Claro", dark: "Modo Escuro" };
    try {
      if (window.__i18n && window.__i18n.themeLabels) {
        const t = window.__i18n.themeLabels;
        return {
          light: t.light || defaultLabels.light,
          dark: t.dark || defaultLabels.dark,
        };
      }
    } catch (e) {
      /* ignore */
    }
    return defaultLabels;
  }

  let theme = localStorage.getItem("theme") || "light";

  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);

    const labels = getThemeLabels();
    if (themeText) {
      themeText.textContent = mode === "light" ? labels.light : labels.dark;
    }

    const logoPath = LOGOS[mode];

    if (headerLogo) headerLogo.src = logoPath;
    if (footerLogo) footerLogo.src = logoPath;
  }

  applyTheme(theme);

  themeBtn?.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  });

  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        theme = e.matches ? "light" : "dark";
        applyTheme(theme);
      }
    });

  window.addEventListener("i18n:labels", () => {
    applyTheme(theme);
  });

  if (window.__i18n && window.__i18n.themeLabels) {
    applyTheme(theme);
  }
});
