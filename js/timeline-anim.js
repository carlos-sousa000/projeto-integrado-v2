document.addEventListener("DOMContentLoaded", () => {
  // intersection observer for .fade-up
  const inView = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  };
  const obs = new IntersectionObserver(inView, { threshold: 0.18 });
  document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));

  // parallax-ish shift for timeline rail using CSS var --rail-shift
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

  // hover helpers (add hovered class on event to allow more advanced CSS if desired)
  document.querySelectorAll(".timeline-event").forEach((ev) => {
    ev.addEventListener("mouseenter", () => ev.classList.add("hovered"));
    ev.addEventListener("mouseleave", () => ev.classList.remove("hovered"));
  });

  // NOTE: we NO LONGER auto-add rotation class to icons.
  // If you want an icon to rotate, add class="icon-gear" directly in the HTML:
  // <i class="fas fa-cog icon-gear"></i>
});
