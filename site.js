const slides = [
  ["Simplifying Financial Management", "I designed intuitive financial interfaces that bring invoicing, payments and cash flow into one clear view, helping users manage their finances with ease.", "Invoicing, revenue and cash flow panels"],
  ["Making Complex Tasks Simple", "Payroll and SARS workflows bring the information teams need into one place.", "Payroll, salary and SARS panels"],
  ["Turning Data into Clarity", "Reporting and analytics help users understand business performance at a glance.", "Financial reporting and analytics panels"],
  ["Designing Smarter Workflows", "AI bill capture helps users review documents and move through everyday tasks.", "Bill capture and workflow panels"]
];
const controls = [...document.querySelectorAll(".slide-controls button")];
if (controls.length) {
  const slide = document.querySelector(".slide");
  const image = document.querySelector(".feature-art");
  const title = document.querySelector("#feature-title");
  const description = document.querySelector("#feature-description");
  const animateSlide = () => {
    slide.classList.remove("animate");
    requestAnimationFrame(() => requestAnimationFrame(() => slide.classList.add("animate")));
  };

  const duration = 3000;
  const playback = document.querySelector(".slide-playback");
  const announcements = title.parentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0;
  let elapsed = 0;
  let previousFrame;
  let frame;
  let visible = !("IntersectionObserver" in window);
  let paused = reducedMotion.matches;

  function renderProgress() {
    controls.forEach((button, index) => {
      const fill = index < active ? 1 : index === active ? elapsed / duration : 0;
      button.style.setProperty("--fill", fill);
    });
  }

  function selectSlide(index) {
    active = index;
    elapsed = 0;
    previousFrame = undefined;
    const [heading, copy, alt] = slides[index];
    title.textContent = heading;
    description.textContent = copy;
    image.dataset.slide = index + 1;
    image.setAttribute("aria-label", alt);
    controls.forEach((button, position) => button.setAttribute("aria-pressed", position === index));
    renderProgress();
    animateSlide();
  }

  function tick(now) {
    if (previousFrame !== undefined) elapsed = Math.min(duration, elapsed + now - previousFrame);
    previousFrame = now;
    if (elapsed >= duration) {
      selectSlide((active + 1) % slides.length);
      previousFrame = now;
    }
    else renderProgress();
    frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    cancelAnimationFrame(frame);
    previousFrame = undefined;
    playback.textContent = paused ? "Play" : "Pause";
    announcements.setAttribute("aria-live", paused ? "polite" : "off");
    if (visible && !paused && !document.hidden) frame = requestAnimationFrame(tick);
  }

  playback.hidden = false;
  playback.addEventListener("click", () => {
    paused = !paused;
    syncPlayback();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  reducedMotion.addEventListener("change", () => {
    paused = reducedMotion.matches;
    syncPlayback();
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.25 });
    observer.observe(playback.parentElement);
  }

  controls.forEach((control, index) => control.addEventListener("click", () => selectSlide(index)));
  renderProgress();
  syncPlayback();
}
const preview = document.querySelector("#preview");
if (preview) {
  const image = preview.querySelector("img");
  document.querySelectorAll("[data-preview]").forEach((button) => {
    button.addEventListener("click", () => {
      image.src = `assets/${button.dataset.preview}.webp`;
      image.classList.toggle("logo-cutout", button.dataset.preview === "barongwa");
      image.alt = button.closest("article").querySelector(".card-art").alt;
      preview.showModal();
    });
  });
  preview.addEventListener("click", (event) => {
    if (event.target === preview) preview.close();
  });
}
const mode = document.querySelector(".mode");
if (mode) {
  mode.addEventListener("click", () => {
    const light = mode.getAttribute("aria-checked") === "false";
    mode.setAttribute("aria-checked", light);
    document.querySelectorAll("[data-screen]").forEach((image) => {
      image.src = `assets/${image.dataset.screen}-${light ? "light" : "dark"}.webp`;
    });
  });
}
