// =============================================
// Animation de frappe (typing) — plusieurs phrases
// =============================================
const phrases = [
  "Création de sites web modernes...",
  "HTML • CSS • JavaScript...",
  "Responsive design & expérience utilisateur...",
  "Projets concrets en développement..."
];

const element = document.querySelector(".typing");
let indexPhrase = 0;  // quelle phrase on affiche
let indexLettre = 0;  // quelle lettre on est en train d'écrire
let effacement = false; // est-ce qu'on efface ou on écrit ?

element.textContent = "";

function animer() {
  const phraseActuelle = phrases[indexPhrase];

  if (!effacement) {
    // --- MODE ÉCRITURE ---
    element.textContent = phraseActuelle.slice(0, indexLettre + 1);
    indexLettre++;

    if (indexLettre === phraseActuelle.length) {
      // Phrase complète → on attend 2 secondes puis on efface
      effacement = true;
      setTimeout(animer, 2000);
      return;
    }
    setTimeout(animer, 80);

  } else {
    // --- MODE EFFACEMENT ---
    element.textContent = phraseActuelle.slice(0, indexLettre - 1);
    indexLettre--;

    if (indexLettre === 0) {
      // Phrase effacée → on passe à la suivante
      effacement = false;
      indexPhrase = (indexPhrase + 1) % phrases.length;
      setTimeout(animer, 500);
      return;
    }
    setTimeout(animer, 40); // efface plus vite qu'on écrit
  }
}

setTimeout(animer, 500);

// =============================================
// Bouton retour en haut
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  const btnTop = document.getElementById("btnTop");

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
});