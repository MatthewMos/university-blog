document.addEventListener("DOMContentLoaded", () => {
  const headerText = document.querySelector(".nav p");
  const burgerMenu = document.getElementById("burger-menu");
  const burgerLinks = document.getElementById("burger-links");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  const toggleMenu = () => {
    burgerMenu.classList.toggle("open");
    burgerLinks.classList.toggle("show");
    overlay.classList.toggle("show");
  };

  const checkForTablet = () => {
    window.innerWidth <= 768
      ? (headerText.innerText = "ХТ")
      : (headerText.innerText = "Официальный сайт ХТ");
  };

  checkForTablet();

  window.addEventListener("resize", checkForTablet);

  burgerMenu.addEventListener("click", toggleMenu);

  overlay.addEventListener("click", toggleMenu);

  burgerLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      toggleMenu();
    }
  });
});
