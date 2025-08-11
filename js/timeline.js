// ===== TIMELINE E MODAIS =====
document.addEventListener("DOMContentLoaded", () => {
  // Dados de curiosidades
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

  // Funções de abrir/fechar modal
  function openModal(title = "Informação") {
    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) modalTitle.textContent = title;
    modalBackdrop.style.display = "grid";
    modalBackdrop.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    modalBackdrop.style.display = "none";
    modalBackdrop.setAttribute("aria-hidden", "true");
  }

  // Botão de curiosidade
  btnCur?.addEventListener("click", () => {
    const idx = Math.floor(Math.random() * curiosities.length);
    modalContent.innerHTML = `<p style="font-size:1.05rem;margin-bottom:10px">${curiosities[idx]}</p><small style="color:var(--cor-suave)">Clique fora ou em ✕ para fechar</small>`;
    openModal("Curiosidade");
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", (ev) => {
    if (ev.target === modalBackdrop) closeModal();
  });

  // Modal de imagens na galeria
  document.querySelectorAll(".gallery img").forEach((img) => {
    img.addEventListener("click", () => {
      const full = img.dataset.full || img.src;
      modalContent.innerHTML = `<img src="${full}" alt="${img.alt}" style="width:100%;height:auto;border-radius:10px">`;
      openModal(img.alt || "Imagem");
    });
  });

  // Animação de fade
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
});
