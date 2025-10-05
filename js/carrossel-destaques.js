const setupCarrossel = (
  trackSelector,
  arrowLeftSelector,
  arrowRightSelector
) => {
  const track = document.querySelector(trackSelector);
  const container = track ? track.parentElement.parentElement : null;
  const slides = track ? Array.from(track.children) : [];
  const nextButton = container
    ? container.querySelector(arrowRightSelector)
    : null;
  const prevButton = container
    ? container.querySelector(arrowLeftSelector)
    : null;

  if (!track || !nextButton || !prevButton || slides.length === 0) {
    console.warn(
      `Carrossel com track ${trackSelector} não inicializado: elementos não encontrados.`
    );
    return;
  }

  let slideWidth = slides[0].getBoundingClientRect().width;
  const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32;

  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", true);
    track.appendChild(clone);
  });

  slides
    .slice()
    .reverse()
    .forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", true);
      track.prepend(clone);
    });

  let currentIndex = slides.length;
  let isTransitioning = false;

  const updatePosition = (instant = false) => {
    slideWidth = slides[0].getBoundingClientRect().width;

    if (instant) {
      track.style.transition = "none";
    } else {
      track.style.transition = "transform 0.5s ease-in-out";
    }
    const offset = -currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(${offset}px)`;
  };

  updatePosition(true);

  nextButton.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updatePosition();
  });

  prevButton.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updatePosition();
  });

  track.addEventListener("transitionend", () => {
    isTransitioning = false;

    if (currentIndex >= slides.length * 2) {
      currentIndex = slides.length;
      updatePosition(true);
    }

    if (currentIndex <= slides.length - 1) {
      currentIndex = slides.length * 2 - 1;
      updatePosition(true);
    }
  });

  window.addEventListener("resize", () => {
    updatePosition(true);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupCarrossel(
    ".carrossel-track",
    ".carrossel-arrow.left",
    ".carrossel-arrow.right"
  );
});
