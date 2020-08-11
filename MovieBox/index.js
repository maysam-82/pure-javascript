const autoCompleteConfig = {
  renderOptions: (movie) => {
    const { Poster, Title, Year } = movie;
    // Check if Poster is not "N/A"
    const imgSrc = Poster !== "N/A" ? Poster : "";
    return `
				<img src="${imgSrc}"  alt="${Title}"/>
				${Title} (${Year})
				`;
  },
  inputValue: (movie) => movie.Title,
  fetchData: async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: getApiKey(),
        s: searchTerm,
      },
    });

    if (response.data.Error) return [];

    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let rightMovie, leftMovie;
// Added `sideReference` to now which fetched data belongs to which summary side (left or right).
onMovieSelect = async (movie, summaryElement, sideReference) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: getApiKey(),
      i: movie.imdbID,
    },
  });

  summaryElement.innerHTML = movieTemplate(response.data);
  if (sideReference === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  console.log("Comparison");
};

const movieTemplate = (movieDetail) => {
  return `
	<article class="media">
	<figure class="media-left">
	<p class="image">
	<img src="${movieDetail.Poster}"/>
	</p>
	</figure>
	<div class="media-content">
	<div class="content">
	<h1>${movieDetail.Title}</h1>
	<h4>${movieDetail.Genre}</h4>
	<p>${movieDetail.Plot}</p>
	</div>
	</div>
	</article>
	<article class="notification is-primary">
	<p class="title">
	${movieDetail.Awards}
	</p>
	<p class="subtitle">
	Awards
	</p>
	</article>
	<article class="notification is-primary">
	<p class="title">
	${movieDetail.BoxOffice}
	</p>
	<p class="subtitle">
	Box Office
	</p>
	</article>
	<article class="notification is-primary">
	<p class="title">
	${movieDetail.Metascore}
	</p>
	<p class="subtitle">
	Metascore
	</p>
	</article>
	<article class="notification is-primary">
	<p class="title">
	${movieDetail.imdbRating}
	</p>
	<p class="subtitle">
	IMDB Rating
	</p>
	</article>
	<article class="notification is-primary">
	<p class="title">
	${movieDetail.imdbVotes}
	</p>
	<p class="subtitle">
	IMDB Votes
	</p>
	</article>
	`;
};
