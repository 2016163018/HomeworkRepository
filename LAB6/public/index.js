let isLoading = false;
let category = "all";
let keyword = "";
let data = new Proxy([], {
  set: (target, property, value) => {
    target[property] = value;
    const filteredData = filterData(target, category, keyword);
    makeItem(filteredData);
    return true;
  },
});

const fetchProduct = async () => {
  if (isLoading) {
    return;
  }

  isLoading = true;
  const res = await fetch("product.json");
  const json = await res.json();

  Array.prototype.push.call(data, ...json);

  makeCategory();
  isLoading = false;
};

const useSelect = () => {
  let selectedItem;

  const itemWrapper = document.querySelector(".item-wrapper");
  itemWrapper.addEventListener("click", (event) => {
    const itemElement = event.target.closest(".item");

    if (!itemElement || itemElement === selectedItem) {
      return;
    }

    if (selectedItem) {
      selectedItem.classList.remove("item__selected");
    }

    itemElement.classList.add("item__selected");
    selectedItem = itemElement;
  });
};

const makeCategory = () => {
  const categorySelect = document.querySelector("#category-select");
  const categories = new Set(data.map((item) => item.category));

  const categoryHtml = Array.from(categories).reduce(
    (prev, category) =>
      prev + `<option value='${category}'>${category}</option>`,
    '<option value="all">all</option>'
  );

  categorySelect.innerHTML = categoryHtml;
  categorySelect.value = category;
};

const makeItem = (data) => {
  const itemWrapper = document.querySelector(".item-wrapper");
  const items = data.reduce(
    (prev, item) =>
      prev +
      `
            <div class="item">
                <img class="item-image" src="${item.image}" />
                <div class="item-name">${item.name}</div>
                <div class="item-desc">${item.desc}</div>
            </div>
            `,
    ""
  );

  itemWrapper.innerHTML = items;
};

const filterData = (data, category, keyword) => {
  return data.filter((item) => {
    const isMatchedCategory = category === "all" || item.category === category;
    const isMatchedKeyword =
      item.name.includes(keyword) || item.desc.includes(keyword);
    return isMatchedCategory && isMatchedKeyword;
  });
};

const useFilter = () => {
  const categorySelect = document.querySelector("#category-select");
  const searchForm = document.querySelector(".search-form");

  categorySelect.addEventListener("change", ({ target }) => {
    category = target.value;
    const filteredData = filterData(data, category, keyword);
    makeItem(filteredData);
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    keyword = event.target.keyword.value;
    const filteredData = filterData(data, category, keyword);
    makeItem(filteredData);
  });
};

const useInfiniteScroll = () => {
  const target = document.querySelector(".observe-target");
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      return;
    }
    fetchProduct();
  });
  io.observe(target);
};

const init = async () => {
  fetchProduct();
  useSelect();
  useFilter();
  makeItem(data);
  useInfiniteScroll();
};

init();
