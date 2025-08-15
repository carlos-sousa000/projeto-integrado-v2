/* quiz.js - substitua o arquivo atual por este conteúdo.
   Correções incluídas:
   - detector de navegação por teclado (body--kb)
   - não dar focus automático ao carregar (evita "borda azul" inicial)
   - focar opções automaticamente APENAS se o usuário estiver em modo teclado
*/

(() => {
  const cardsContainer = document.getElementById("quiz-cards");
  let cards = Array.from(cardsContainer.querySelectorAll(".quiz-card"));
  const totalEl = document.getElementById("total-q");
  const currentEl = document.getElementById("current-q");
  const progressFill = document.querySelector(".progress-fill");
  const resultEl = document.getElementById("quiz-result");
  const restartBtn = document.getElementById("btn-restart");
  const celebration = document.getElementById("celebration");
  const footerEl = document.querySelector("footer.site-footer");

  let currentIndex = 0;
  let score = 0;

  /* ---------- keyboard focus ring helper ----------
     Adds class body--kb when user presses Tab the first time.
     Removes it if user uses mouse/touch; toggles accordingly.
  */
  function enableKeyboardFocusRing() {
    function onFirstTab(e) {
      if (e.key === "Tab") {
        document.body.classList.add("body--kb");
        window.removeEventListener("keydown", onFirstTab);
        window.addEventListener("mousedown", onPointerInput, { once: true });
        window.addEventListener("touchstart", onPointerInput, {
          once: true,
          passive: true,
        });
      }
    }
    function onPointerInput() {
      document.body.classList.remove("body--kb");
      window.addEventListener("keydown", onFirstTab, { once: true });
    }
    window.addEventListener("keydown", onFirstTab, { once: true });
  }
  enableKeyboardFocusRing();

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // randomize order and append
  cards = shuffle(cards);
  cards.forEach((card) => cardsContainer.appendChild(card));

  totalEl.textContent = cards.length;
  updateProgress();

  // hide all except first
  cards.forEach((c, idx) => (c.style.display = idx === 0 ? "block" : "none"));

  // ensure initial progress state
  progressFill.style.width = "0%";
  progressFill.parentElement.setAttribute("aria-valuenow", "0");

  // attach listeners to options
  cardsContainer.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => handleAnswer(btn));
  });

  // keyboard: Enter or Space to pick focused option
  document.addEventListener("keydown", (e) => {
    if (!["Enter", " "].includes(e.key)) return;
    const focused = document.activeElement;
    if (focused && focused.classList.contains("quiz-option")) {
      e.preventDefault();
      focused.click();
    }
  });

  function handleAnswer(optionBtn) {
    const card = optionBtn.closest(".quiz-card");
    if (!card || card.dataset.answered === "true") return;

    card.dataset.answered = "true";
    card.classList.add("answered");

    const options = Array.from(card.querySelectorAll(".quiz-option"));
    options.forEach((o) => (o.disabled = true));

    // try to remove visual focus from clicked button (avoids stuck :focus)
    try {
      optionBtn.blur();
    } catch (e) {}

    const correct = optionBtn.dataset.correct === "true";
    if (correct) {
      score++;
      optionBtn.classList.add("correct");
    } else {
      optionBtn.classList.add("wrong");
      const right = options.find((o) => o.dataset.correct === "true");
      if (right) right.classList.add("correct");
    }

    // update scoreboard
    resultEl.textContent = `Pontuação: ${score}`;

    // short pause then advance (or finish)
    const isLast = currentIndex === cards.length - 1;
    const pause = 600; // ms
    setTimeout(() => {
      if (isLast) {
        finishQuiz();
      } else {
        // hide current, show next
        card.style.display = "none";
        currentIndex++;
        updateProgress();
        cards[currentIndex].style.display = "block";

        // focus first option only if user is in keyboard mode
        const firstOpt = cards[currentIndex].querySelector(".quiz-option");
        if (firstOpt && document.body.classList.contains("body--kb"))
          firstOpt.focus();
      }
    }, pause);
  }

  function updateProgress() {
    currentEl.textContent = Math.min(currentIndex + 1, cards.length);
    const pct = Math.round((currentIndex / cards.length) * 100);
    progressFill.style.width = `${pct}%`;
    progressFill.parentElement.setAttribute("aria-valuenow", pct.toString());
  }

  function finishQuiz() {
    progressFill.style.width = `100%`;
    resultEl.textContent = `Pontuação: ${score}/${cards.length}`;

    const percent = Math.round((score / cards.length) * 100);
    let title = "",
      desc = "";
    if (percent === 100) {
      title = "Perfeito!";
      desc = `Você acertou todas as perguntas (${score}/${cards.length}). Parabéns — você domina a história da computação.`;
    } else if (percent >= 80) {
      title = "Muito bom!";
      desc = `Ótima pontuação: ${score}/${cards.length} (${percent}%). Dá pra chegar no topo com uma revisada.`;
    } else if (percent >= 50) {
      title = "Bom trabalho!";
      desc = `Você fez ${score}/${cards.length} (${percent}%). Revise os conteúdos e tente novamente.`;
    } else {
      title = "Continue praticando!";
      desc = `Pontuação: ${score}/${cards.length} (${percent}%). Leia e tente de novo!`;
    }

    const badgeTitle = document.getElementById("badge-title");
    const badgeText = document.getElementById("badge-text");
    if (badgeTitle) badgeTitle.textContent = title;
    if (badgeText) {
      badgeText.innerHTML = `
        <strong style="display:block;margin-bottom:.45rem">${score}/${cards.length} — ${percent}%</strong>
        <span style="color:var(--cor-suave);display:block;max-width:760px;margin:0 auto;">${desc}</span>
      `;
    }

    if (footerEl) footerEl.classList.add("hidden-overlay");
    document.body.style.overflow = "hidden";

    celebration.classList.add("show");
    celebration.setAttribute("aria-hidden", "false");

    createConfetti(36);

    const btnRestartFinal = document.getElementById("btn-restart-final");
    const closeBtn = document.getElementById("close-celebration");

    if (btnRestartFinal)
      btnRestartFinal.onclick = () => {
        restartQuiz();
        closeOverlay();
      };
    if (closeBtn)
      closeBtn.onclick = () => {
        closeOverlay();
      };
  }

  function closeOverlay() {
    celebration.classList.remove("show");
    celebration.setAttribute("aria-hidden", "true");
    if (footerEl) footerEl.classList.remove("hidden-overlay");
    document.body.style.overflow = "";
  }

  // restart logic
  if (restartBtn) restartBtn.addEventListener("click", restartQuiz);

  function restartQuiz() {
    score = 0;
    currentIndex = 0;
    resultEl.textContent = `Pontuação: 0`;

    cards = shuffle(cards);
    cards.forEach((c) => {
      c.style.display = "none";
      c.removeAttribute("data-answered");
      c.classList.remove("answered");
      c.querySelectorAll(".quiz-option").forEach((o) => {
        o.disabled = false;
        o.classList.remove("correct", "wrong");
      });
      cardsContainer.appendChild(c);
    });

    if (cards[0]) cards[0].style.display = "block";
    updateProgress();

    if (footerEl) footerEl.classList.remove("hidden-overlay");
    document.body.style.overflow = "";

    // focus first option only if keyboard navigation is enabled
    const firstOpt = cards[0]?.querySelector(".quiz-option");
    if (firstOpt && document.body.classList.contains("body--kb"))
      firstOpt.focus();
  }

  /* Confetti generator (kept intact) */
  function createConfetti(amount = 30) {
    const area = document.getElementById("confetti-area");
    if (!area) return;
    const colors = [
      "#ffd166",
      "#f4a261",
      "#06d6a0",
      "#118ab2",
      "#06b6d4",
      "#ef476f",
      "#ffd54a",
    ];
    for (let i = 0; i < amount; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      const size = Math.floor(Math.random() * 10) + 8;
      el.style.width = `${size}px`;
      el.style.height = `${Math.floor(size * 1.2)}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${-10 - Math.random() * 20}%`;
      const duration = 2200 + Math.random() * 1800;
      el.style.animation = `confetti-fall ${duration}ms linear forwards, confetti-sway ${
        700 + Math.random() * 600
      }ms ease-in-out infinite`;
      el.style.opacity = 0.98;
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.animationDelay = `${Math.random() * 300}ms`;
      area.appendChild(el);
      setTimeout(() => el.remove(), duration + 600);
    }
  }

  // INITIAL: if user already used keyboard recently, we might want to focus first option.
  // But to avoid the "borda azul on load" problem we DO NOT autofocus automatically.
  // If desired, user can press Tab to enable keyboard focus mode, then first option will show ring when focused.
})();
