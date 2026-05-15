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

const storyRooms = document.querySelectorAll('.story-room');
const roomDots = document.querySelectorAll('.room-dot');

const roomObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const index = [...storyRooms].indexOf(entry.target);

      roomDots.forEach(dot => dot.classList.remove('is-active'));
      roomDots[index]?.classList.add('is-active');

      if (!entry.target.dataset.visited) {
        entry.target.dataset.visited = 'true';
        addXP?.(5, '来室ログ');
      }
    });
  },
  { threshold: 0.45 }
);

storyRooms.forEach(room => roomObserver.observe(room));