const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((json) => dataLesson(json.categories || []))
    .catch((err) => {
      console.error("Failed to load categories:", err);
      document.getElementById("categories").innerHTML =
        "<p class='text-sm text-red-600'>Failed to load categories.</p>";
    });
};

const loadLevelTree = (id, btnElement) => {
  document.querySelectorAll("#categories button").forEach((btn) => {
    btn.classList.remove("bg-green-800", "text-white");
    btn.classList.add("bg-white", "text-black");
  });

  btnElement.classList.add("bg-green-800", "text-white");
  btnElement.classList.remove("bg-white", "text-black");

  const treeContainer = document.getElementById("tree-container");
  treeContainer.innerHTML = `<div class="col-span-full flex justify-center items-center py-10">
    <i class="fa-solid fa-spinner animate-spin text-3xl"></i>
  </div>`;

  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const plants = data.plants || [];
      displayLevelTree(plants);
    })
    .catch((err) => {
      console.error(err);
      treeContainer.innerHTML = `<p class="col-span-full text-red-600">Failed to load trees.</p>`;
    });
};

const displayLevelTree = (trees) => {
  const treeContainer = document.getElementById("tree-container");
  treeContainer.innerHTML = "";

  if (!trees.length) {
    treeContainer.innerHTML = `<p class="col-span-full text-center text-gray-600 py-8">No trees found in this category.</p>`;
    return;
  }

  trees.forEach((tree) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-md overflow-hidden flex flex-col";

    const img =
      tree.image || "https://via.placeholder.com/400x240?text=No+Image";
    const name = tree.name || "No name";
    const description = tree.description || "No description available.";
    const category = tree.category || "Unknown";
    const price = tree.price ?? 0;

    card.innerHTML = `
      <div class="h-44 w-full overflow-hidden">
        <img src="${img}" alt="${name}" class="w-full h-full object-cover"/>
      </div>
      <div class="p-4 flex-1 flex flex-col">
        <h3 onclick="showModal('${tree.id}')" class="text-lg font-semibold text-gray-800 cursor-pointer">
          ${name}
        </h3>
        <p class="text-sm text-gray-600 mt-2 line-clamp-3">${description}</p>
        <div class="flex items-center justify-between mt-3">
          <button class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg">${category}</button>
          <span class="text-green-600 font-bold text-lg">৳ ${price}</span>
        </div>
        <button data-id="${tree.id}" data-name="${name}" data-price="${price}"
          class="add-to-cart w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg">
          Add to Cart
        </button>
      </div>
    `;
    treeContainer.append(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const name = e.currentTarget.dataset.name;
      const price = Number(e.currentTarget.dataset.price) || 0;
      addToCart({ id, name, price });
    });
  });
};

const dataLesson = (lessons) => {
  const levelContainer = document.getElementById("categories");
  levelContainer.innerHTML = "";

  if (!lessons || !lessons.length) {
    levelContainer.innerHTML =
      "<p class='text-sm text-gray-600'>No categories available.</p>";
    return;
  }

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const categoriesDiv = document.createElement("div");
    categoriesDiv.innerHTML = `
      <button onclick="loadLevelTree(${lesson.id}, this)"
        class="btn w-full bg-white text-black hover:bg-green-800 hover:text-white whitespace-nowrap justify-center border">
        ${lesson.category_name}
      </button>
    `;
    levelContainer.append(categoriesDiv);
  }

  const firstBtn = levelContainer.querySelector("button");
  if (firstBtn) firstBtn.click();
};

let cart = [];
const cartList = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");

function renderCart() {
  if (!cartList) return;
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center";
    li.innerHTML = `
      <span class="text-sm">${item.name} <span class="text-gray-400 text-xs">x1</span></span>
      <div class="flex items-center gap-2">
        <span class="font-semibold">৳ ${item.price}</span>
        <button data-idx="${idx}" class="remove-cart text-red-500 hover:text-red-700">❌</button>
      </div>
    `;
    cartList.append(li);
  });

  cartTotalEl.textContent = `৳${total}`;

  document.querySelectorAll(".remove-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.idx);
      if (!isNaN(idx)) {
        cart.splice(idx, 1);
        renderCart();
      }
    });
  });
}

function addToCart(item) {
  cart.push(item);
  renderCart();
}

function showModal(id) {
  alert("Open modal for tree id: " + id );
}

loadLessons();
