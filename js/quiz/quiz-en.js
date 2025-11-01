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

  cards = shuffle(cards);
  cards.forEach((card) => cardsContainer.appendChild(card));

  totalEl.textContent = cards.length;
  updateProgress();

  cards.forEach((c, idx) => (c.style.display = idx === 0 ? "block" : "none"));

  progressFill.style.width = "0%";
  progressFill.parentElement.setAttribute("aria-valuenow", "0");

  cardsContainer.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => handleAnswer(btn));
  });

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

    resultEl.textContent = `Score: ${score}`; // Traduzido

    const isLast = currentIndex === cards.length - 1;
    const pause = 600;
    setTimeout(() => {
      if (isLast) {
        finishQuiz();
      } else {
        card.style.display = "none";
        currentIndex++;
        updateProgress();
        cards[currentIndex].style.display = "block";

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
    resultEl.textContent = `Score: ${score}/${cards.length}`; // Traduzido

    const percent = Math.round((score / cards.length) * 100);
    let title = "",
      desc = "";
    if (percent === 100) {
      title = "Perfect!"; // Traduzido
      desc = `You answered all questions correctly (${score}/${cards.length}). Congratulations — you master the history of computing.`; // Traduzido
    } else if (percent >= 80) {
      title = "Very good!"; // Traduzido
      desc = `Great score: ${score}/${cards.length} (${percent}%). You can reach the top with a little review.`; // Traduzido
    } else if (percent >= 50) {
      title = "Good job!"; // Traduzido
      desc = `You got ${score}/${cards.length} (${percent}%). Review the content and try again.`; // Traduzido
    } else {
      title = "Keep practicing!"; // Traduzido
      desc = `Score: ${score}/${cards.length} (${percent}%). Read and try again!`; // Traduzido
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
        restartQuiz();
        closeOverlay();
      };
  }

  function closeOverlay() {
    celebration.classList.remove("show");
    celebration.setAttribute("aria-hidden", "true");
    if (footerEl) footerEl.classList.remove("hidden-overlay");
    document.body.style.overflow = "";
  }

  if (restartBtn) restartBtn.addEventListener("click", restartQuiz);

  function restartQuiz() {
    score = 0;
    currentIndex = 0;
    resultEl.textContent = `Score: 0`; // Traduzido

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

    const firstOpt = cards[0]?.querySelector(".quiz-option");
    if (firstOpt && document.body.classList.contains("body--kb"))
      firstOpt.focus();
  }

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
})();
