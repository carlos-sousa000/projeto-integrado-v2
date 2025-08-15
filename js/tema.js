// ===== TROCA DE TEMA SIMPLIFICADA =====
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  const headerLogo = document.querySelector(".project-logo, .brand img");
  const footerLogo = document.querySelector(".footer-logo");

  const LOGOS = {
    light: "/imgs/logo-preto.png",
    dark: "/imgs/logo-branco.png",
  };

  // Detecta tema salvo ou preferência do sistema
  let theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");

  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);
    if (themeText)
      themeText.textContent = mode === "light" ? "Modo Escuro" : "Modo Claro";
    if (headerLogo) headerLogo.src = LOGOS[mode];
    if (footerLogo) footerLogo.src = LOGOS[mode];
  }

  // Aplica tema inicial
  applyTheme(theme);

  // Botão de alternância
  themeBtn?.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  });

  // Mudança automática do sistema (apenas se não houver preferência salva)
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        theme = e.matches ? "light" : "dark";
        applyTheme(theme);
      }
    });
});
