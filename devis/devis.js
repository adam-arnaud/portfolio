const prices = {
    landing: 500,
    vitrine: 900,
    portfolio: 700,
    refonte: 650
};

const labels = {
    landing: "Landing page",
    vitrine: "Site vitrine",
    portfolio: "Portfolio professionnel",
    refonte: "Refonte simple"
};

const form = document.querySelector("#quote-form");
const clientNameInput = document.querySelector("#client-name");
const siteTypeSelect = document.querySelector("#site-type");
const pagesInput = document.querySelector("#pages");
const optionInputs = document.querySelectorAll(".option");

const calculateBtn = document.querySelector("#calculate-btn");
const pdfBtn = document.querySelector("#pdf-btn");
const resetBtn = document.querySelector("#reset-btn");
const result = document.querySelector("#result");
const historyList = document.querySelector("#quote-history");
const clearHistoryBtn = document.querySelector("#clear-history");
let lastQuote = null;
function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function formatPrice(price) {
    return new Intl.NumberFormat("fr-BE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(price);
}

function getSelectedOptions() {
    return Array.from(optionInputs)
        .filter((option) => option.checked)
        .map((option) => ({
            label: option.parentElement.textContent.trim(),
            price: Number(option.value)
        }));
}

function calculateQuote() {
    const clientName = clientNameInput.value.trim() || "Client non renseigné";
    const siteType = siteTypeSelect.value;
    const pages = Math.max(Number(pagesInput.value) || 1, 1);
    const selectedOptions = getSelectedOptions();

    const basePrice = prices[siteType];
    const pagesPrice = Math.max(pages - 1, 0) * 120;
    const optionsPrice = selectedOptions.reduce((total, option) => total + option.price, 0);
    const total = basePrice + pagesPrice + optionsPrice;

    lastQuote = {
        clientName,
        siteType,
        siteLabel: labels[siteType],
        pages,
        selectedOptions,
        basePrice,
        pagesPrice,
        optionsPrice,
        total,
        date: new Date().toLocaleDateString("fr-BE")
    };

   result.innerHTML = `
    <span>Projet : <strong>${escapeHTML(lastQuote.siteLabel)}</strong></span><br>
    <span>Pages : <strong>${escapeHTML(String(lastQuote.pages))}</strong></span><br>
    <span>Options : <strong>${escapeHTML(String(lastQuote.selectedOptions.length))}</strong></span>
    <span class="quote-price">${escapeHTML(formatPrice(lastQuote.total))}</span>
  `;

    saveQuote(lastQuote);
    renderHistory();

    return lastQuote;
}

function saveQuote(quote) {
    const history = getHistory();
    history.unshift(quote);
    localStorage.setItem("arnaudQuoteHistory", JSON.stringify(history.slice(0, 5)));
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem("arnaudQuoteHistory")) || [];
    } catch {
        return [];
    }
}

function renderHistory() {
    const history = getHistory().slice(0, 3);

    if (!history.length) {
        historyList.innerHTML = "<li>Aucun devis enregistré.</li>";
        return;
    }

    historyList.innerHTML = history
        .map(
            (quote) => `
      <li>
        <strong>${escapeHTML(quote.clientName)}</strong><br>
        ${escapeHTML(quote.siteLabel)} — ${escapeHTML(formatPrice(quote.total))}<br>
        <small>${escapeHTML(quote.date)}</small>
      </li>
    `
        )
        .join("");
}

function clearHistory() {
    localStorage.removeItem("arnaudQuoteHistory");
    renderHistory();
}

function resetQuote() {
    form.reset();
    pagesInput.value = 1;
    lastQuote = null;
    result.textContent =
    'Complétez le formulaire pour obtenir votre estimation personnalisée.'
}

async function loadLogo() {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = "devis/assets/logo-symbol.png";
        img.onload = () => resolve(img);
    });
}

async function generatePDF() {
    const quote = lastQuote || calculateQuote();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const logo = await loadLogo();

    doc.addImage(logo, "PNG", 122, 10, 26, 26);

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("ARNAUD ADAM", 140, 20);

    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.text("Création de sites web & solutions digitales", 140, 26);

    const currentYear = new Date().getFullYear();
    const lastQuoteNumber = Number(localStorage.getItem("lastQuoteNumber")) || 0;
    const nextQuoteNumber = lastQuoteNumber + 1;
    localStorage.setItem("lastQuoteNumber", nextQuoteNumber);

    const quoteRef = `DEV-${currentYear}-${String(nextQuoteNumber).padStart(3, "0")}`;

    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("DEVIS CLIENT", 20, 45);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Date : ${quote.date}`, 20, 55);
    doc.text(`Référence : ${quoteRef}`, 20, 62);

    doc.line(20, 68, 190, 68);

    doc.setFontSize(12);
    doc.text(`Client : ${quote.clientName}`, 20, 85);
    doc.text(`Type de projet : ${quote.siteLabel}`, 20, 95);
    doc.text(`Nombre de pages : ${quote.pages}`, 20, 105);

    doc.text(`Prix de base : ${quote.basePrice} €`, 20, 125);
    doc.text(`Pages supplémentaires : ${quote.pagesPrice} €`, 20, 135);

    let currentY = 145;

    if (quote.selectedOptions.length > 0) {
        doc.text("Options sélectionnées :", 20, currentY);
        currentY += 8;

        quote.selectedOptions.forEach((option) => {
            doc.text(`• ${option.label}`, 30, currentY);
            currentY += 7;
        });

        doc.text(`Total options : ${quote.optionsPrice} €`, 20, currentY);
        currentY += 12;
    }

   doc.setFillColor(56, 189, 248);
doc.roundedRect(20, currentY - 8, 170, 18, 4, 4, "F");

doc.setTextColor(11, 17, 32);
doc.setFontSize(15);
doc.setFont(undefined, "bold");
doc.text(`TOTAL ESTIMATIF : ${quote.total} €`, 26, currentY + 4);

doc.setTextColor(0, 0, 0);
    currentY += 18;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(
        "Ce devis est une proposition commerciale pouvant être ajustée selon les besoins du projet.",
        20,
        currentY
    );

    currentY += 14;

   if (currentY > 245) {
  currentY = 245;
}

    doc.setFontSize(10);
    doc.text("Validité du devis : 30 jours à compter de la date d’émission.", 20, currentY);
    doc.text("Délai estimatif de réalisation : 2 à 4 semaines après validation.", 20, currentY + 7);
    doc.text("Conditions de paiement : 30 % d’acompte à la commande, solde à la livraison.", 20, currentY + 14);

    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.addImage(logo, "PNG", 5, 205, 70, 70);
    doc.setGState(new doc.GState({ opacity: 1 }));

   doc.line(20, 252, 190, 252);

doc.setFontSize(10);

doc.setFont(undefined, "bold");
doc.text("Arnaud Adam", 20, 262);

doc.setFont(undefined, "normal");
doc.text("Création de sites web & solutions digitales", 55, 262);

doc.text("TVA : en cours d’attribution", 20, 270);

doc.text("contact@a-adam.be", 20, 278);
doc.text("www.a-adam.be", 145, 278);
doc.save("devis-arnaud-adam.pdf");
}

calculateBtn.addEventListener("click", calculateQuote);
pdfBtn.addEventListener("click", generatePDF);
resetBtn.addEventListener("click", resetQuote);
clearHistoryBtn.addEventListener("click", clearHistory);

renderHistory();