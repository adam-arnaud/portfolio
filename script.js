// =============================================
// Animation de frappe + bouton retour en haut
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------------------------
  // Animation de frappe
  // ---------------------------------------------
  const phrases = [
    "Création de sites vitrines modernes...",
    "Solutions web pour indépendants...",
    "Design responsive & expérience utilisateur...",
    "Estimation de projet avec devis PDF..."
  ];

  const element = document.querySelector(".typing");

  // Sécurité : si l'élément .typing n'existe pas, on évite une erreur JS
  if (element) {
    let indexPhrase = 0;
    let indexLettre = 0;
    let effacement = false;

    element.textContent = "";

    function animer() {
      const phraseActuelle = phrases[indexPhrase];

      if (!effacement) {
        element.textContent = phraseActuelle.slice(0, indexLettre + 1);
        indexLettre++;

        if (indexLettre === phraseActuelle.length) {
          effacement = true;
          setTimeout(animer, 2000);
          return;
        }

        setTimeout(animer, 80);
      } else {
        element.textContent = phraseActuelle.slice(0, indexLettre - 1);
        indexLettre--;

        if (indexLettre === 0) {
          effacement = false;
          indexPhrase = (indexPhrase + 1) % phrases.length;
          setTimeout(animer, 500);
          return;
        }

        setTimeout(animer, 40);
      }
    }

    setTimeout(animer, 500);
  }

  // ---------------------------------------------
  // Bouton retour en haut
  // ---------------------------------------------
  const btnTop = document.getElementById("btnTop");

  // Sécurité : si le bouton n'existe pas, on évite une erreur JS
  if (btnTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        btnTop.classList.add("visible");
      } else {
        btnTop.classList.remove("visible");
      }
    });

    btnTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (!question || !answer) return;

  question.addEventListener("click", () => {
    const isAlreadyOpen = item.classList.contains("active");

    // On ferme d'abord tous les volets
    faqItems.forEach((otherItem) => {
      const otherAnswer = otherItem.querySelector(".faq-answer");

      otherItem.classList.remove("active");

      if (otherAnswer) {
        otherAnswer.style.maxHeight = null;
      }
    });

    // Si le volet cliqué était fermé, on l'ouvre
    // S'il était déjà ouvert, il reste fermé
    if (!isAlreadyOpen) {
      item.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// ---------------------------------------------
// Menu burger mobile
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const icon = menuToggle.querySelector("i");

    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
      menuToggle.setAttribute("aria-label", "Fermer le menu");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");

      const icon = menuToggle.querySelector("i");
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    });
  });

  document.addEventListener("click", (event) => {
    const isClickInsideMenu = navLinks.contains(event.target);
    const isClickOnButton = menuToggle.contains(event.target);

    if (
      navLinks.classList.contains("active") &&
      !isClickInsideMenu &&
      !isClickOnButton
    ) {
      navLinks.classList.remove("active");

      const icon = menuToggle.querySelector("i");
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");

      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
  });
});

// ---------------------------------------------
// Animations d’apparition au scroll
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(
    ".service-card, .skill-card, .project-card, .about-card, .contact-card, .faq-item"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
});

// ---------------------------------------------
// Lien actif dans la navbar
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("header[id], section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

  function activateNavLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;

      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activateNavLink);
  activateNavLink();
});