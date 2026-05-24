import jsPDF from 'jspdf'
import logo from '../assets/logo-symbol.png'

export function generatePDF() {
    const clientName =
        document.querySelector('#client-name').value || 'Client non renseigné'

    const siteSelect = document.querySelector('#site-type')
    const siteLabel = siteSelect.options[siteSelect.selectedIndex].text
    const pages = Number(document.querySelector('#pages').value)

    let basePrice = 0

    if (siteSelect.value === 'portfolio') basePrice = 500
    else if (siteSelect.value === 'vitrine') basePrice = 800
    else if (siteSelect.value === 'restaurant') basePrice = 1200
    else if (siteSelect.value === 'ecommerce') basePrice = 2500

    const extraPages = pages - 1
    const extraPagesPrice = extraPages * 150

    const selectedOptions = document.querySelectorAll('.option:checked')
    let optionsTotal = 0
    const optionsDetails = []

    selectedOptions.forEach((option) => {
        optionsTotal += Number(option.value)
        optionsDetails.push(option.parentElement.textContent.trim())
    })

    const total = basePrice + extraPagesPrice + optionsTotal

    const doc = new jsPDF()

    doc.addImage(logo, 'PNG', 122, 10, 26, 26)

    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('ARNAUD ADAM', 140, 20)

    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.text('Création de sites web & solutions digitales', 140, 26)

    const today = new Date().toLocaleDateString('fr-BE')
    const currentYear = new Date().getFullYear()
    const lastQuoteNumber = Number(localStorage.getItem('lastQuoteNumber')) || 0
    const nextQuoteNumber = lastQuoteNumber + 1

    localStorage.setItem('lastQuoteNumber', nextQuoteNumber)

    const quoteRef = `DEV-${currentYear}-${String(nextQuoteNumber).padStart(3, '0')}`

    doc.setFontSize(22)
    doc.text('DEVIS CLIENT', 20, 45)

    doc.setFontSize(10)
    doc.text(`Date : ${today}`, 20, 55)
    doc.text(`Référence : ${quoteRef}`, 20, 62)

    doc.line(20, 68, 190, 68)

    doc.setFontSize(12)
    doc.text(`Client : ${clientName}`, 20, 85)
    doc.text(`Type de site : ${siteLabel}`, 20, 95)
    doc.text(`Nombre de pages : ${pages}`, 20, 105)

    doc.text(`Prix de base : ${basePrice} €`, 20, 125)
    doc.text(
        `Pages supplémentaires : ${extraPages} x 150 € = ${extraPagesPrice} €`,
        20,
        135
    )

    let currentY = 145

    if (optionsDetails.length > 0) {
        doc.text('Options sélectionnées :', 20, currentY)
        currentY += 8

        optionsDetails.forEach((optionText) => {
            doc.text(`• ${optionText}`, 30, currentY)
            currentY += 7
        })

        doc.text(`Total options : ${optionsTotal} €`, 20, currentY)
        currentY += 12
    }

    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text(`TOTAL ESTIMÉ : ${total} €`, 20, currentY)

    currentY += 18

    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')

    doc.text(
        'Ce devis est une proposition commerciale pouvant être ajustée selon les besoins du projet.',
        20,
        currentY
    )

    currentY += 14

    doc.setFontSize(10)
    doc.text('Validité du devis : 30 jours à compter de la date d’émission.', 20, currentY)
    doc.text('Délai estimatif de réalisation : 2 à 4 semaines après validation.', 20, currentY + 7)
    doc.text('Conditions de paiement : 30 % d’acompte à la commande, solde à la livraison.', 20, currentY + 14)

    doc.setGState(new doc.GState({ opacity: 0.08 }))
    doc.addImage(logo, 'PNG', 5, 205, 70, 70)
    doc.setGState(new doc.GState({ opacity: 1 }))

   doc.line(20, 255, 190, 255);

doc.setFontSize(10);

doc.setFont(undefined, "bold");
doc.text("Arnaud Adam", 20, 266);

doc.setFont(undefined, "normal");
doc.text("Création de sites web & solutions digitales", 55, 266);

doc.text("TVA : en cours d’attribution", 20, 274);

doc.text("contact@a-adam.be", 20, 282);
doc.text("www.a-adam.be", 145, 282);
    doc.save('devis-express.pdf')
}