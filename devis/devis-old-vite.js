import './style.css'
import logo from './assets/logo-symbol.png'
import { generatePDF } from './pdf/pdfGenerator'
import { saveQuote, getQuotes } from './storage/quoteStorage'


document.querySelector('#app').innerHTML = `
  <div class="app">
    <header>
  <img src="${logo}" alt="Logo Arnaud Adam" class="app-logo">
  <h1>Devis Express</h1>
  <p>Créez une estimation rapide pour un site web</p>
</header>

    <main class="container">
      <form id="devis-form">
        <label for="client-name">Nom du client</label>
        <input type="text" id="client-name" placeholder="Ex: Boucherie Dupont">

        <label for="site-type">Type de site</label>
        <select id="site-type">
          <option value="">Choisir...</option>
          <option value="portfolio">Portfolio</option>
          <option value="vitrine">Site vitrine</option>
          <option value="restaurant">Restaurant</option>
          <option value="ecommerce">E-commerce</option>
        </select>

        <label for="pages">Nombre de pages</label>
        <input type="number" id="pages" min="1" value="1">
       
<div class="options">
  <label>Options supplémentaires</label>
  <label><input type="checkbox" value="150" class="option"> Formulaire de contact (+150 €)</label>
  <label><input type="checkbox" value="250" class="option"> Blog / actualités (+250 €)</label>
  <label><input type="checkbox" value="400" class="option"> Réservation en ligne (+400 €)</label>
  <label><input type="checkbox" value="300" class="option"> Optimisation SEO (+300 €)</label>
  <label><input type="checkbox" value="120" class="option"> Hébergement 1 an (+120 €)</label>
  <label><input type="checkbox" value="20" class="option"> Nom de domaine (+20 €)</label>
  <label><input type="checkbox" value="80" class="option"> Google Maps (+80 €)</label>
  <label><input type="checkbox" value="200" class="option"> Galerie photos (+200 €)</label>
  <label><input type="checkbox" value="500" class="option"> Multi-langue (+500 €)</label>
</div>



        <button type="button" id="calculate-btn">
          Calculer le devis
        </button>
        <button type="button" id="reset-btn" class="secondary">
          Réinitialiser
        </button>
        <button type="button" id="pdf-btn" class="secondary">
          Télécharger PDF
        </button>

      </form>

      <div>
  <section class="result">
    <h2>Résumé du devis</h2>
    <p>Le devis apparaîtra ici.</p>
  </section>

  <section class="history">
    <h2>Historique des devis</h2>
    <ul id="quote-history">
      <li>Aucun devis enregistré.</li>
    </ul>
  </section>
</div>
    </main>
  </div>
`

const button = document.querySelector('#calculate-btn')
const result = document.querySelector('.result p')
const historyList = document.querySelector('#quote-history')
function renderHistory() {
  const quotes = getQuotes()

  if (quotes.length === 0) {
    historyList.innerHTML = '<li>Aucun devis enregistré.</li>'
    return
  }

  historyList.innerHTML = ''

  quotes.forEach((quote) => {
    const li = document.createElement('li')
    li.textContent = `${quote.date} - ${quote.clientName} - ${quote.total} €`
    historyList.appendChild(li)
  })
}

const savedClientName = localStorage.getItem('clientName')
const savedSiteType = localStorage.getItem('siteType')
const savedPages = localStorage.getItem('pages')

if (savedClientName) {
  document.querySelector('#client-name').value = savedClientName
}

if (savedSiteType) {
  document.querySelector('#site-type').value = savedSiteType
}

if (savedPages) {
  document.querySelector('#pages').value = savedPages
}

button.addEventListener('click', () => {
  const siteSelect = document.querySelector('#site-type')
  const siteType = siteSelect.value
  const pages = Number(document.querySelector('#pages').value)

  if (pages < 1) {
    result.textContent = 'Le nombre de pages doit être au minimum de 1.'
    return
  }

  let basePrice = 0

  if (!siteType) {
    result.textContent = 'Veuillez choisir un type de site.'
    return
  }

  if (siteType === 'portfolio') {
    basePrice = 500
  } else if (siteType === 'vitrine') {
    basePrice = 800
  } else if (siteType === 'restaurant') {
    basePrice = 1200
  } else if (siteType === 'ecommerce') {
    basePrice = 2500
  }

  const extraPages = pages - 1
  const extraPagesPrice = extraPages * 150
  const selectedOptions = document.querySelectorAll('.option:checked')
  let optionsTotal = 0
  selectedOptions.forEach((option) => {
    optionsTotal += Number(option.value)
  })
  const total = basePrice + extraPagesPrice + optionsTotal

  const clientName = document.querySelector('#client-name').value || 'Client non renseigné'

  localStorage.setItem('clientName', clientName)
  localStorage.setItem('siteType', siteType)
  localStorage.setItem('pages', pages)

  let optionsDetails = ''

  selectedOptions.forEach((option) => {
    const optionText = option.parentElement.textContent.trim()
    optionsDetails += `${optionText}<br>`
  })

  saveQuote({
    clientName,
    siteType,
    pages,
    total,
    date: new Date().toLocaleDateString('fr-BE')
  })

  result.innerHTML = `
  Client : ${clientName}<br>
  Type de site : ${siteType}<br>
  Nombre de pages : ${pages}<br><br>

  Prix de base : ${basePrice} €<br>
  Pages supplémentaires : ${extraPages} x 150 € = ${extraPagesPrice} €<br><br>

  <strong>Options :</strong><br>
  ${optionsDetails}
  <br>

  <strong>Total estimé : ${total} €</strong>
`
})

const resetButton = document.querySelector('#reset-btn')

resetButton.addEventListener('click', () => {
  document.querySelector('#client-name').value = ''
  document.querySelector('#site-type').value = ''
  document.querySelector('#pages').value = 1
  localStorage.removeItem('clientName')
  localStorage.removeItem('siteType')
  localStorage.removeItem('pages')

  result.textContent = 'Le devis apparaîtra ici.'
})

const pdfButton = document.querySelector('#pdf-btn')

pdfButton.addEventListener('click', () => {
  generatePDF()
})
