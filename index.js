const autoCompleteConfig = {
  renderOption(movie) {
    return `<img src="${movie.Poster}"/>
            <h2>${movie.Title}</h2>
            <h4> (${movie.Year})</h4>`;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(inputData) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "2607c954",
        s: inputData,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};
createAutocomplete({
  root: document.getElementById("left-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    const summary = document.getElementById("left-summary");
    onMovieSelect(movie, summary, "left");
  },
});
createAutocomplete({
  root: document.getElementById("right-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    const summary = document.getElementById("right-summary");
    onMovieSelect(movie, summary, "right");
  },
});
let leftMovie, rightMovie;
const onMovieSelect = async (movie, summary, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "2607c954",
      i: movie.imdbID,
    },
  });
  summary.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparision();
  }
};
const runComparision = () => {
const leftMovieStats=document.querySelectorAll("#left-summary .notification");
  const rightMovieStats = document.querySelectorAll('#right-summary .notification');
  leftMovieStats.forEach((stat, index) => { 
    const leftMovieStat = stat.dataset.value;
    const rightMovieStat = rightMovieStats[index].dataset.value;
    if (leftMovieStat>rightMovieStat) {
      rightMovieStats[index].classList.remove("is-primary");
      rightMovieStats[index].classList.add("is-danger");
    } else {
      stat.classList.remove("is-primary");
      stat.classList.add("is-danger");
    }
  })
  
};

const movieTemplate = (movieDetail) => {
  const dollar = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbVotes = parseFloat(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce((count, word) => {
    word = parseInt(word);
    if (isNaN(word)) {
      return count;
    } else {
     return count + word;
    }
  }, 0);
  return `
  <article class="media">
  <figure class="media-left">
  <img src="${movieDetail.Poster}"/>
  </figure>
  <div class="media-content">
    <div class="content">
    <h1>${movieDetail.Title}</h1>
    <h4>${movieDetail.Genre}</h4>
    <p>${movieDetail.Plot}</p>
    </div>
    </div>
    </article>
    <article class="notification is-primary" data-value=${awards}>
    <p class="title">${movieDetail.Awards}</p>
    <p class='subtitle'>Awards</p>
    </article>
    <article class="notification is-primary" data-value=${dollar}>
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class='subtitle'>BoxOffice</p>
    </article>
    <article class="notification is-primary" data-value=${metascore}>
    <p class="title">${movieDetail.Metascore}</p>
    <p class='subtitle'>Metascore</p>
    </article>
    <article class="notification is-primary" data-value=${imdbVotes}>
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class='subtitle'>imdbVotes</p>
    </article>
    `;
};
