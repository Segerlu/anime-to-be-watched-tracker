let tabContainer = document.getElementById("tabContainer");
let tabs = tabContainer.children;
let homeScreen = document.getElementById("topAnime");
let topAnime = "https://api.jikan.moe/v4/top/anime";
let apiURL = "https://api.jikan.moe/v4/anime?";

for (let i = 0; i < tabs.length; i++) {
    
    tabs[i].addEventListener("click", tabClick);
}
loadHome();

async function loadHome() {

        let response = await fetch(topAnime);
        let data = await response.json();

        for (let i = 0; i < data.data.length; i++) {
            
            createResultCard(data.data[i])        

        }

        return data;
}

function createResultCard(data) {
    let genresAr = [];

    for (let i = 0; i < data.genres.length; i++) {
        genresAr.push(data.genres[i].name);
    }

    console.log(typeof homeScreen)

    let resultsCard = document.createElement("span");
    resultsCard.classList.add("result-card");

    let cardTitle = document.createElement("h3");
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
    summary.textContent = "Summary:";

    let p = document.createElement("p");
    p.textContent = data.synopsis;

    let link = document.createElement("div");
    
    let linkA = document.createElement("a");
    linkA.href = data.url;
    linkA.textContent = "View Show";


    link.appendChild(linkA);
    cardSummary.appendChild(summary);
    cardSummary.appendChild(p);
    resultsCard.append(cardTitle, image, cardGenres, cardSummary, link);
    homeScreen.appendChild(resultsCard);
}


function tabClick(tab) {

    resetTabs(tab);

    tab.target.style.color = "white";
    tab.target.style.backgroundColor = "midnightBlue";

}

function resetTabs(tab) {

    var canvas = document.getElementById(tab.target.textContent);

    switchCanvas(canvas);

    for (let i = 0; i < tabs.length; i++) {

        tabs[i].style.color = "black";
        tabs[i].style.backgroundColor = "white";
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