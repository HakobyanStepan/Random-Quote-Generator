const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");
const categorySelect = document.getElementById("category-select");

const API_KEY = "LYYulpwHKd5rck2JuZyhZQ==d0czhpwpjVNJQYmR";

const categoryMap = {
  inspirational: [
    "inspirational",
    "motivation",
    "success",
    "dreams",
    "courage",
    "hope",
    "leadership",
    "future",
    "change",
  ],
  love: ["love", "dating", "marriage", "family", "mom", "dad", "men"],
  wisdom: [
    "wisdom",
    "life",
    "learning",
    "knowledge",
    "experience",
    "intelligence",
    "education",
    "philosophy",
  ],
};

let allQuotes = [];
let quotesByCategory = {
  inspirational: [],
  love: [],
  wisdom: [],
};
let displayedQuotes = {
  inspirational: new Set(),
  love: new Set(),
  wisdom: new Set(),
};

async function fetchQuotes(count = 5) {
  console.log(`Fetching ${count} quotes...`);
  quoteText.classList.remove("slide-in");
  quoteAuthor.classList.remove("slide-in");
  quoteText.textContent = "Loading quotes...";
  quoteAuthor.textContent = "";
  quoteText.classList.add("slide-in");

  newQuoteBtn.disabled = true;
  newQuoteBtn.classList.add("disabled");

  const fetches = Array.from({ length: count }, () =>
    fetch("https://api.api-ninjas.com/v1/quotes", {
      headers: { "X-Api-Key": API_KEY },
    }).then((res) => res.json())
  );
  const results = await Promise.all(fetches);
  const quotes = results.flat();

  for (const quote of quotes) {
    allQuotes.push(quote);

    for (const key in categoryMap) {
      if (categoryMap[key].includes(quote.category)) {
        if (!quotesByCategory[key].some((q) => q.quote === quote.quote)) {
          quotesByCategory[key].push(quote);
        }
        break;
      }
    }
  }

  newQuoteBtn.disabled = false;
  newQuoteBtn.classList.remove("disabled");
}

function getUnseenQuotes(category) {
  return quotesByCategory[category].filter(
    (q) => !displayedQuotes[category].has(q.quote)
  );
}

async function displayNewQuote() {
  const selectedCategory = categorySelect.value;
  let unseen = getUnseenQuotes(selectedCategory);

  if (unseen.length === 0) {
    await fetchQuotes(5);
    unseen = getUnseenQuotes(selectedCategory);
  }

  if (unseen.length === 0) {
    quoteText.textContent = "No new quotes available in this category.";
    quoteAuthor.textContent = "";
    return;
  }

  const randomQuote = unseen[Math.floor(Math.random() * unseen.length)];
  displayedQuotes[selectedCategory].add(randomQuote.quote);

  quoteText.classList.remove("slide-in");
  quoteAuthor.classList.remove("slide-in");

  setTimeout(() => {
    quoteText.textContent = `"${randomQuote.quote}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
    quoteText.classList.add("slide-in");
    quoteAuthor.classList.add("slide-in");
  }, 5);
}

categorySelect.addEventListener("change", () => {
  displayNewQuote();
});

newQuoteBtn.addEventListener("click", displayNewQuote);

fetchQuotes(40).then(displayNewQuote);
