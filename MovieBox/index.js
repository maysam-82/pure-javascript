const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: getApiKey(),
      s: searchTerm,
    },
  });

  if (response.data.Error) return [];

  return response.data.Search;
};

const root = document.querySelector(".authcomplete");
root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
	<div class="dropdown-content results"></div>
  </div>
</div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);

  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  //  make `resultWrapper` empty if there is a previous fetch.
  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (const movie of movies) {
    const { Title, Poster } = movie;

    // Check if Poster is not "N/A"
    const imgSrc = Poster !== "N/A" ? Poster : "";
    const option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.innerHTML = `
		  <img src="${imgSrc}"  alt="${Title}"/>
		  ${Title}
		  `;

    option.addEventListener("click", () => {
      input.value = movie.Title;
      dropdown.classList.remove("is-active");
    });
    resultsWrapper.appendChild(option);
  }
};
input.addEventListener("input", debounce(onInput, 500));
document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) dropdown.classList.remove("is-active");
});
