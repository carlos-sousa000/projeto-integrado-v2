// ===== IDIOMA =====
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-toggle");

  langBtn?.addEventListener("click", () => {
    const currentLang = document.documentElement.lang;

    if (currentLang === "pt-BR") {
      alert("Função para traduzir para Inglês seria implementada aqui.");
      document.documentElement.lang = "en";
    } else {
      alert("Função para traduzir para Português seria implementada aqui.");
      document.documentElement.lang = "pt-BR";
    }
  });
});
