const expenseAmount = document.querySelector("#amount");
const description = document.querySelector("#description");
const category = document.querySelector("#category");
const list = document.querySelector("#list");
const deleteBtn = document.querySelector("#deleteBtn");
const editBtn = document.querySelector("#editBtn");
loadItems();
let isEditing = false;
let editIndex = null;
let editKey = null;

function submitForm(event) {
  event.preventDefault();
  const amount = expenseAmount.value;
  const des = description.value;
  const cat = category.value;
  const key = new Date().toISOString();
  if (!isEditing) {
    if (localStorage.getItem("expenses") === null) {
      let stringifyData = JSON.stringify([
        {
          key,
          amount,
          category: cat,
          description: des,
        },
      ]);
      localStorage.setItem("expenses", stringifyData);
    } else {
      let parsedData = JSON.parse(localStorage.getItem("expenses"));
      parsedData.push({
        key,
        amount,
        category: cat,
        description: des,
      });
      const stringifyData = JSON.stringify(parsedData);
      localStorage.setItem("expenses", stringifyData);
    }
    list.innerHTML += `
      <li data-key="${key}"> ${amount}-${des}-on ${cat}
        <button type="button" class="delete">Delete expense</button>
        <button type="button" class="edit">Edit expense</button>
      </li>
    `;
  } else {
    let data = JSON.parse(localStorage.getItem("expenses"));
    console.log(data[editIndex]);
    data[editIndex].amount = amount;
    data[editIndex].description = des;
    data[editIndex].category = cat;
    console.log(data[editIndex]);
    localStorage.setItem("expenses", JSON.stringify(data));
    const listItem = document.querySelector(`li[data-key="${editKey}"]`);
    if (listItem) {
      listItem.innerHTML = `
        ${amount}-${des}-on ${cat}
        <button type="button" class="delete">Delete expense</button>
        <button type="button" class="edit">Edit expense</button>
      `;
    }

    isEditing = false;
    editIndex = null;
    editKey = null;
  }
}

function deleteItem(event) {
  if (event.target.classList.contains("delete")) {
    const key = event.target.parentElement.getAttribute("data-key");
    let data = JSON.parse(localStorage.getItem("expenses"));
    let index = data.findIndex((item) => {
      return item.key === key;
    });

    if (index >= 0) {
      const listItem = event.target.parentElement;
      listItem.remove();
      data.splice(index, 1);
    }
    localStorage.setItem("expenses", JSON.stringify(data));
  }
}

function editItem(event) {
  let data = JSON.parse(localStorage.getItem("expenses"));
  const key = event.target.parentElement.getAttribute("data-key");
  let index = data.findIndex((item) => {
    return item.key === key;
  });
  console.log("object");
  if (index >= 0) {
    let item = data[index];
    expenseAmount.value = item.amount;
    description.value = item.description;
    category.value = item.category;
    isEditing = true;
    editIndex = index;
    editKey = key;
  }
}

function loadItems() {
  let data = JSON.parse(localStorage.getItem("expenses"));
  if (data !== null) {
    data.forEach((item) => {
      list.innerHTML += `
        <li data-key="${item.key}"> ${item.amount}-${item.description}-on ${item.category}
          <button type="button" class="delete">Delete expense</button>
          <button type="button" class="edit">Edit expense</button>
        </li>
      `;
    });
  }
}

list.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit")) {
    editItem(event);
  }
  if (event.target.classList.contains("delete")) {
    deleteItem(event);
  }
});
let form = document.querySelector("form");
form.addEventListener("submit", submitForm);
