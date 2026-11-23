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

  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateSlide();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(slide);
  }

  controls.forEach((control, index) => {
    control.addEventListener("click", () => {
      const [heading, copy, alt] = slides[index];
      title.textContent = heading;
      description.textContent = copy;
      image.dataset.slide = index + 1;
      image.setAttribute("aria-label", alt);
      controls.forEach((button, position) => button.setAttribute("aria-pressed", position === index));
      animateSlide();
    });
  });
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
