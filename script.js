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
    item.classList.toggle("active");

    if (item.classList.contains("active")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});