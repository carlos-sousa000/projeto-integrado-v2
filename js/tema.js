document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  const headerLogo = document.querySelector(".project-logo:not(.footer-logo)");
  const footerLogo = document.querySelector(".footer-logo");

  const LOGOS = {
    light: "./imgs/logo-preto.png",
    dark: "./imgs/logo-branco.png",
  };

  function getThemeLabels() {
    const lang = document.documentElement.lang;

    if (lang === "en") {
      return { light: "Light Mode", dark: "Dark Mode" };
    }

    return { light: "Modo Claro", dark: "Modo Escuro" };
  }
  let theme = localStorage.getItem("theme") || "light";

  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);

    const labels = getThemeLabels();
    if (themeText) {
      themeText.textContent = mode === "light" ? labels.light : labels.dark;
    }

    const isSubpage = window.location.pathname.includes("/pags/");
    const pathPrefix = isSubpage ? "../../" : "./";

    const logoPathLight = pathPrefix + "imgs/logo-preto.png";
    const logoPathDark = pathPrefix + "imgs/logo-branco.png";

    if (headerLogo)
      headerLogo.src = mode === "light" ? logoPathLight : logoPathDark;
    if (footerLogo)
      footerLogo.src = mode === "light" ? logoPathLight : logoPathDark;
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
});
