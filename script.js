const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");
const categorySelect = document.getElementById("category-select");

let displayedQuotes = new Set();

async function fetchQuotesByTag(tag) {
  const response = await fetch(
    `http://api.quotable.io/quotes?tags=${tag}&limit=50`,
    {
      headers: { Accept: "application/json" },
    }
  );
  const data = await response.json();
  return data.results;
}

async function getQuotes() {
  const tag = categorySelect.value;
  const quotes = await fetchQuotesByTag(tag);
  return quotes.filter((q) => !displayedQuotes.has(q._id));
}

async function displayNewQuote() {
  const quotes = await getQuotes();

  if (quotes.length === 0) {
    displayedQuotes.clear();
    quoteText.textContent = "All quotes shown. Restarting...";
    quoteAuthor.textContent = "";
    return;
  }

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  displayedQuotes.add(randomQuote._id);

  quoteText.classList.remove("slide-in");
  quoteAuthor.classList.remove("slide-in");

  setTimeout(() => {
    quoteText.textContent = `"${randomQuote.content}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
    quoteText.classList.add("slide-in");
    quoteAuthor.classList.add("slide-in");
  }, 10);
}
newQuoteBtn.addEventListener("click", displayNewQuote);
