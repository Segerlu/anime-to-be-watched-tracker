let tabContainer = document.getElementById("tabContainer");
let tabs = tabContainer.children;
let homeScreen = document.getElementById("topAnime");
let searchScreen = document.getElementById("searchResults");
let browseScreen = document.getElementById("browseResults");
let favoriteScreen = document.getElementById("favoriteScreen");
let searchWord = document.getElementById("searchBar");
let searchButton = document.getElementById("searchButton");
let saveButton = document.getElementById("saveFav");
let topAnime = "https://api.jikan.moe/v4/top/anime";
let apiURL = "https://api.jikan.moe/v4/anime?q=";
let genreURL = "https://api.jikan.moe/v4/anime?genres=";
let genFav = "https://api.jikan.moe/v4/anime/"
let favorites = {};
let username;
let path = "/Saved_Favorites/";

for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", tabClick);
}
loadHome();
getGenreList();



searchWord.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        searchForAnime(apiURL + searchWord.value);
    }
});

searchButton.addEventListener("click", function () {
    searchForAnime(apiURL + searchWord.value);
});

browseScreen.addEventListener("click", function (e) {

    if (e.target.className === "browse-title" || e.target.className === "browse-card") {

        populateBrowse(genreURL + e.target.parentNode.id);
    }
});

document.addEventListener("click", function (e) {

    if (e.target.parentNode.className === "result-card") {

        
        if (e.target.parentNode.parentNode.id === "favoriteScreen") {
            delete favorites[e.target.parentNode.id];
            populateFavorites();
        } else {

            if (favorites[e.target.parentNode.id]) {
                alert("This title is already favorited!")
            } else {

                favorites[e.target.parentNode.id] = true;

                e.target.parentNode.style.backgroundColor = "green";

                setTimeout(function () {
                    e.target.parentNode.style.backgroundColor = "rgb(41, 41, 135)";
                }, 1000);
            }
        }
    } else if (e.target.className === "result-card") {

        if (e.target.parentNode.id === "favoriteScreen") {
            delete favorites[e.target.parentNode.id];
            populateFavorites();
        } else {

        if (favorites[e.target.parentNode.id]) {
            alert("This title is already favorited!")
        } else {

            favorites[e.target.id] = true;

            e.target.style.backgroundColor = "green";

            setTimeout(function () {
                e.target.style.backgroundColor = "rgb(41, 41, 135)";
            }, 1000);
        }
        }
    }

});

document.body.addEventListener("mouseenter", function (e) {
    if (e.target.parentNode.className === "result-card") {
        console.log(e.target.parentNode.lastChild.style.display)
        e.target.parentNode.lastChild.style.display = "block";
    }
});

document.body.addEventListener("mouseleave", function (e) {
    if (e.target.parentNode.className === "result-card") {

        e.target.parentNode.lastChild.style.display = "none";
    }
});

saveButton.addEventListener("click", function () {

    if (favorites) {
        localStorage.setItem(username, JSON.stringify(Object.keys(favorites).join(",")))
    } else {
        localStorage.removeItem(username);
    }

    

});

async function populateFavorites() {
    deleteAllChildNodes(favoriteScreen);

    let arrFavorites = Object.keys(favorites);

    const results = arrFavorites.filter(element => {
        return element !== '';
      });

    if (results.length) {
        for (let i = 0; i < results.length; i++) {

            let response = await fetch(genFav + results[i]);
            let data = await response.json();

            createResultCard(data.data, favoriteScreen);
        }
    } else {
        favoriteScreen.append("No saved favorites!")
    }
}

async function populateBrowse(genre) {

    deleteAllChildNodes(browseScreen);

    let response = await fetch(genre);
    let data = await response.json();

    for (let i = 0; i < data.data.length; i++) {
        createResultCard(data.data[i], browseScreen);
    }
}

async function getGenreList() {

    deleteAllChildNodes(browseScreen);

    let response = await fetch("https://api.jikan.moe/v4/genres/anime");
    let data = await response.json();

    for (let i = 0; i < data.data.length; i++) {
        createBrowseCard(data.data[i], browseScreen);
    }
}

async function searchForAnime(query) {

    deleteAllChildNodes(searchScreen);

    let response = await fetch(query);
    let data = await response.json();

    if (data.data.length > 0) {

        for (let i = 0; i < data.data.length; i++) {

            createResultCard(data.data[i], searchScreen);
        }
    } else {
        searchScreen.append("No results found");
    }
    return data;
}

async function loadHome() {

    let response = await fetch(topAnime);
    let data = await response.json();

    for (let i = 0; i < data.data.length; i++) {

        createResultCard(data.data[i], homeScreen)

    }

    return data;
}

function deleteAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createResultCard(data, parent) {
    let genresAr = [];

    for (let i = 0; i < data.genres.length; i++) {
        genresAr.push(data.genres[i].name);
    }

    let resultsCard = document.createElement("span");
    resultsCard.classList.add("result-card");
    resultsCard.id = data.mal_id;

    let cardTitle = document.createElement("h1");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = data.title;

    let image = document.createElement("img");
    image.classList.add("card-image");
    image.src = data.images.jpg.image_url;

    let cardGenres = document.createElement("h2");
    cardGenres.classList.add("card-genres");
    cardGenres.textContent = genresAr.join(', ');

    let cardSummary = document.createElement("div");
    cardSummary.classList.add("card-summary");

    let summary = document.createElement("em");
    summary.classList.add("summary");
    summary.textContent = "Summary:";

    let p = document.createElement("p");
    p.classList.add("summary");
    p.textContent = data.synopsis;

    let link = document.createElement("div");

    let linkA = document.createElement("a");
    linkA.href = data.url;
    linkA.textContent = "View Show";


    link.appendChild(linkA);
    cardSummary.appendChild(summary);
    cardSummary.appendChild(p);
    resultsCard.append(cardTitle, image, cardGenres, link, cardSummary);
    parent.appendChild(resultsCard);
}

function createBrowseCard(data, parent) {

    let browseCard = document.createElement("span");
    browseCard.classList.add("browse-card");
    browseCard.id = data.mal_id;

    let cardTitle = document.createElement("h1");
    cardTitle.classList.add("browse-title");
    cardTitle.textContent = data.name;

    browseCard.appendChild(cardTitle);
    parent.appendChild(browseCard);
}

function tabClick(tab) {

    resetTabs(tab);
    if (tab.target.id === "searchTab") {
        searchForAnime(apiURL);
    } else if (tab.target.id === "browseTab") {
        getGenreList();
    } else if (tab.target.id === "favoritesTab") {
        populateFavorites();
    }

    if (tab.target.id === "login") {
        username = prompt("Please enter your username:", "Anonymous");
        if (username) {
            tab.target.textContent = "Welcome " + username + "!";
            let user = localStorage.getItem(username);
            user = user.replace(/"/g, "");
            let arrUser = user.split(",");
            favorites = {};
            for (let i = 0; i < arrUser.length; i++) {
                favorites[arrUser[i]] = true;
            }
        } else {
            username = "";
            alert("You cannot enter a blank username!");
        }
    } else {

        tab.target.style.color = "white";
        tab.target.style.backgroundColor = "blue";
    }

}

function resetTabs(tab) {

    var canvas = document.getElementById(tab.target.textContent);

    if (tab.target.id === "login") {
    } else {
        switchCanvas(canvas);

        for (let i = 0; i < tabs.length; i++) {

            tabs[i].style.color = "white";
            tabs[i].style.backgroundColor = "black";
        }
    }
}

function switchCanvas(canvas) {

    let allCanvases = document.getElementsByClassName("canvas");

    for (let i = 0; i < allCanvases.length; i++) {

        if (canvas.id === allCanvases[i].id) {
            allCanvases[i].style.display = "block";
        } else {
            allCanvases[i].style.display = "none";
        }

    }


}