const key = "4e51bf67"
const resultsEl = document.querySelector(".results")
let watchlistArray = []



const renderMovie = (imdbID) => {

    fetch(`https://www.omdbapi.com/?apiKey=${key}&i=${imdbID}`)
        .then(res => res.json())
        .then(data => {
            const { Title, imdbRating, Runtime, Genre, Plot, Poster } = data;
            let watchlistHTML = watchlistArray.includes(imdbID) ? "Remove from Watchlist" : "Add to Watchlist";
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
            resultsEl.textContent = null;
            if (watchlistArray.length) {
                watchlistArray.forEach(mov => {
                    renderMovie(mov);
                })
            } else {
                resultsEl.innerHTML = `
                                        <div class="default">
                                        <h3>Your watchlist is looking a little empty...</h3>
                                        <div class="explore"> <a href="index.html">🎬 Let's add some movies! 🍿</a></div>
                                        </div>
                                        `
            }
        }
    })
}
handleAddRemove()

const updateWatchlist = _ => {
    if (JSON.parse(localStorage.getItem("watchlist")).length) {
        watchlistArray = JSON.parse(localStorage.getItem("watchlist"))
        resultsEl.innerHTML = null;
        watchlistArray.forEach(movie => {
            renderMovie(movie)
        })

    }
}
updateWatchlist()