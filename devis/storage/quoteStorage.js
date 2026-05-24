const STORAGE_KEY = 'devisHistory'

export function saveQuote(quote) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []

  history.push(quote)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function getQuotes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}