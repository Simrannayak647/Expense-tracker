let text = " Smart Expense Tracker";
let index = 0;

function showText() {
  document.getElementById("text").innerHTML = "🛒" + text.slice(0, index);
  index++;
  if (index <= text.length) {
    setTimeout(showText, 150);
  }
}
showText();

// get things from page
let input = document.getElementById("itemInput");
let button = document.getElementById("addBtn");
let list = document.getElementById("cartList");
let total = document.getElementById("total");

// if old data exists, load it
let items = JSON.parse(localStorage.getItem("items")) || [];
let sum = Number(localStorage.getItem("sum")) || 0;

// show saved items
showItems();

// when add button is clicked
button.onclick = async function () {
  let name = input.value;
  if (name === "") {
    alert("Type something!");
    return;
  }

  // get price from API
  let res = await fetch("https://dummyjson.com/products/search?q=" + name);
  let data = await res.json();

  if (data.products.length === 0) {
    alert("Item not found!");
    return;
  }

  let price = data.products[0].price;

  // add to list
  items.push({ name: name, price: price });
  sum += price;

  // save in browser memory
  saveData();
  showItems();
  input.value = "";
};

// show items on screen
function showItems() {
  list.innerHTML = "";

  for (let i = 0; i < items.length; i++) {
    let li = document.createElement("li");
    li.innerHTML = `
      <span>${items[i].name}</span>
      <span>
        <span class="price">₹${items[i].price}</span>
        <button class="deleteBtn" data-index="${i}">❌</button>
      </span>
    `;
    list.appendChild(li);
  }

  // if no items, reset total
  if (items.length === 0) {
    sum = 0;
  }

  total.textContent = sum.toFixed(2);
  saveData();
}

// when user clicks delete
list.onclick = function (e) {
  if (e.target.classList.contains("deleteBtn")) {
    let index = e.target.getAttribute("data-index");
    let removedItem = items[index];

    sum -= removedItem.price;
    items.splice(index, 1);

    showItems();
  }
};

// save to localStorage
function saveData() {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("sum", sum);
}
