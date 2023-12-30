const API_KEY = "3cee18fa4cb74b9291d8ff7cf8c2db16";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
const suggestionsContainer = document.getElementById("suggestions-container");

searchText.addEventListener("input", async () => {
    const query = searchText.value;
    if (!query) {
        suggestionsContainer.innerHTML = "";
        return;
    }

    const suggestions = await fetchSuggestions(query);
    displaySuggestions(suggestions);
});

searchText.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const query = searchText.value;
        if (query) {
            fetchNews(query);
            curSelectedNav?.classList.remove("active");
            curSelectedNav = null;
        }
    }
});

async function fetchSuggestions(query) {
    const suggestUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&pageSize=5`;
    const res = await fetch(suggestUrl);
    const data = await res.json();
    return data.articles.map((article) => article.title);
}

function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";
    suggestions.forEach((suggestion) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener("click", () => {
            searchText.value = suggestion;
            suggestionsContainer.innerHTML = "";
            fetchNews(suggestion);
            curSelectedNav?.classList.remove("active");
            curSelectedNav = null;
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}
