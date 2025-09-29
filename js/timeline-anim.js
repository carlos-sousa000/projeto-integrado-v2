document.addEventListener("DOMContentLoaded", () => {
  // adiciona classe .in quando elemento entra na viewport
  const inView = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  };
  const obs = new IntersectionObserver(inView, { threshold: 0.18 });
  document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));

  const tl = document.querySelector(".timeline");
  if (tl) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = tl.getBoundingClientRect();
        const h = window.innerHeight;
        const pct = Math.min(
          Math.max((h - rect.top) / (h + rect.height), 0),
          1
        );
        tl.style.setProperty("--rail-shift", `${(pct - 0.5) * 8}px`);
      },
      { passive: true }
    );
  }

  document.querySelectorAll(".timeline-event").forEach((ev) => {
    ev.addEventListener("mouseenter", () => ev.classList.add("hovered"));
    ev.addEventListener("mouseleave", () => ev.classList.remove("hovered"));
  });

  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Tab") document.body.classList.add("body--kb");
    },
    { once: true }
  );
});
