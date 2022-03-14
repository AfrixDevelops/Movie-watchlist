//http://www.omdbapi.com/?i=tt3896198&apikey=4e51bf67

const searchBar = document.querySelector(".search-bar")
const resultsEl = document.querySelector(".results")
const key = "4e51bf67"
let watchlistArray = []

const updateWatchlist = _ => {
    if (localStorage.watchlist) {
        watchlistArray = JSON.parse(localStorage.getItem("watchlist"))
    }
}
updateWatchlist()





const renderMovie = (imdbID) => {

    fetch(`https://www.omdbapi.com/?apiKey=${key}&i=${imdbID}`)
        .then(res => res.json())
        .then(data => {
            const { Title, imdbRating, Runtime, Genre, Plot, Poster } = data
            let watchlistHTML = watchlistArray.includes(imdbID) ? "Remove from Watchlist" : "Add to Watchlist"
            resultsEl.innerHTML += `
                                            <div class="result" id="${imdbID}">
                                            <div class="img-div"><img class="poster" src="${Poster}" alt="${Title}-poster"></div>
                                            <div class="result-info">
                                                <div class="result-header">
                                                    <h4 class="result-moviename">${Title}</h4>
                                                    <span class="result-rating">⭐${imdbRating}</span>
                                                </div>
                                                <div class="result-details">
                                                    <span class="result-duration">${Runtime}</span>
                                                    <span class="result-genre">${Genre}</span>  
                                                </div>
                                            <div class="result-description">
                                                <p>${Plot}</p>
                                            </div>
                                                <button class="watchlist-label">${watchlistHTML}</button>
                                            </div>

                                        `
            resultsEl.innerHTML += `<hr>`
        })

}


function handleAddRemove() {

    resultsEl.addEventListener("click", e => {

        if (e.target.matches(".watchlist-label")) {

            let movieID = e.target.closest(".result").id;

            if (watchlistArray.includes(movieID)) {

                watchlistArray = watchlistArray.filter(id => id !== movieID)
                e.target.textContent = "Add to Watchlist"
            } else {

                watchlistArray.push(movieID)
                e.target.textContent = "Remove from Watchlist"
            }

            localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
        }
    })
}
handleAddRemove()





document.querySelector(".search-bar").addEventListener("submit", e => {
    e.preventDefault()
    resultsEl.textContent = null;
    const searchBar  = e.currentTarget.firstElementChild.value;
    if (searchBar) {
        fetch(`http://www.omdbapi.com/?apiKey=${key}&s=${searchBar}`)
            .then(res => res.json())
            .then(data => {
                if (data.Response === "False") {
                    throw Error(data.Error);
                } else {
                    data.Search.forEach(movie => {
                        renderMovie(movie.imdbID)
                    });
                }
            })
            .catch(err => {
                resultsEl.innerHTML = `
                        <div class="default">
                        <h2> No results found for your search. Please try again. 🧐<h2>
                        </div>
                    `
            })
    }

})