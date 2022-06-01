const useFilter = () => {
  const categorySelect = document.querySelector("#category-select");
  const searchForm = document.querySelector(".search-form");

  categorySelect.addEventListener("change", ({ target }) => {
    const category = target.value;
    const search = new URLSearchParams(window.location.search);

    if (category === "all") {
      search.delete("category");
    } else {
      search.set("category", category);
    }

    window.location.search = search.toString();
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = event.target.keyword.value;
    const search = new URLSearchParams(window.location.search);

    search.set("keyword", keyword);

    window.location.search = search.toString();
  });
};

const useSelect = () => {
  const category = new URLSearchParams(window.location.search).get("category");

  if (!category) {
    return;
  }

  const options = document.querySelectorAll("option");
  options.forEach((option) => {
    if (option.value === category) {
      option.setAttribute('selected', 'selected');
    }
  });
};

useFilter();
useSelect();
