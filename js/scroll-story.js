const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.14
  }
);

revealItems.forEach(item => revealObserver.observe(item));

const root = document.documentElement;

function updateScrollStory() {
  const max = document.body.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;

  root.style.setProperty("--scroll-progress", progress.toFixed(4));
}

window.addEventListener("scroll", updateScrollStory, { passive: true });
window.addEventListener("resize", updateScrollStory);
updateScrollStory();