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
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);
    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  //   Extracts all numbers in `Awards` string and makes a summation of them.
  const awards = movieDetail.Awards.split(" ").reduce((previousValue, word) => {
    const value = parseInt(word);
    return !isNaN(value) ? previousValue + value : previousValue;
  }, 0);

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
	<article data-value=${awards} class="notification is-primary">
	<p class="title">
	${movieDetail.Awards}
	</p>
	<p class="subtitle">
	Awards
	</p>
	</article>
	<article data-value=${dollars} class="notification is-primary">
	<p class="title">
	${movieDetail.BoxOffice}
	</p>
	<p class="subtitle">
	Box Office
	</p>
	</article>
	<article data-value=${metascore} class="notification is-primary">
	<p class="title">
	${movieDetail.Metascore}
	</p>
	<p class="subtitle">
	Metascore
	</p>
	</article>
	<article data-value=${imdbRating} class="notification is-primary">
	<p class="title">
	${movieDetail.imdbRating}
	</p>
	<p class="subtitle">
	IMDB Rating
	</p>
	</article>
	<article data-value=${imdbVotes} class="notification is-primary">
	<p class="title">
	${movieDetail.imdbVotes}
	</p>
	<p class="subtitle">
	IMDB Votes
	</p>
	</article>
	`;
};
