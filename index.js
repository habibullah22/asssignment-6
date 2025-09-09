// category section load start
const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((json) => dataLesson(json.categories));
};

const loadLevelTree = (id, btnElement) => {
  document
    .querySelectorAll("#categories button")
    .forEach((btn) => btn.classList.remove("bg-green-800", "text-white"));
  btnElement.classList.add("bg-green-800", "text-white");

  // click to active button 
  btnElement.classList.add("bg-green-800", "text-white");
  btnElement.classList.remove("bg-white", "text-black");


  // tree loading spinner 
  const treeContainer = document.getElementById("tree-container");
  treeContainer.innerHTML = `<i class="fa-duotone fa-solid fa-spinner"></i>`;

  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      displayLevelTree(data.plants);
    })
    
    .catch(err => console.error(err));
};

const displayLevelTree = (trees) => {
  const treeContainer = document.getElementById("tree-container");
  treeContainer.innerHTML = "";

  trees.forEach((tree) => {
    const card = document.createElement("div");
    card.className = "w-72 bg-white rounded-2xl shadow-md overflow-hidden";
    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-44 object-cover"/>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800">${tree.name}</h3>
        <p class="text-sm text-gray-600 mt-2">${tree.description}</p>
        <div class="flex items-center justify-between mt-3">
          <button class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg">${tree.category}</button>
          <span class="text-green-600 font-bold text-lg">৳ ${tree.price}</span>
        </div>
        <button class="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg">
          Add to Cart
        </button>
      </div>
    `;
    treeContainer.append(card);
  });
};

const dataLesson = (lessons) => {
  const levelContainer = document.getElementById("categories");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const categoriesDiv = document.createElement("div");
    categoriesDiv.innerHTML = `
      <button onclick="loadLevelTree(${lesson.id}, this)" 
        class="btn w-full bg-white text-black hover:bg-green-800 hover:text-white whitespace-nowrap justify-center border">
        ${lesson.category_name}
      </button>
    `;
    levelContainer.append(categoriesDiv);
  }
};

loadLessons();
// category section load data
