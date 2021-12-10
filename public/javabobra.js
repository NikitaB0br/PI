fetch("http://localhost:8000/table").then(res => res.json()).then(res => {
  console.log(res)
  res.forEach(item => render(item))
})

const deleteBtns = document.querySelectorAll(".delete-btn");
const deleteConfirm = document.querySelector(".delete-wrapper");
const addBtn = document.querySelector(".add-btn")
const addForm = document.querySelector(".add-form")
const addFormBtn = document.querySelector(".add-form-btn")
const table = document.querySelector(".table > tbody")
const agree = deleteConfirm.querySelector("#yes");
const decline = deleteConfirm.querySelector("#no");
const closeBtns = document.querySelectorAll(".close")
const changeBtns = document.querySelectorAll(".change-btn");
const changeForm = document.querySelector(".change-form");
const submitChangeBtn = document.querySelector(".submit-change-btn");
let currentRow = null;

closeBtns.forEach(btn => {
  btn.addEventListener("click", evt => {
    evt.target.parentElement.style.display = "none"
    addForm.reset();
    changeForm.reset();
  })
})

addBtn.addEventListener("click", e => {
  e.preventDefault()
  addForm.style.display = "block"
})
console.log(addFormBtn)
addFormBtn.addEventListener("click", evt => {
  evt.preventDefault()
  const data = getDataFromForm(addForm)
  console.log(data)
  render(data)
  fetch(`http://localhost:8000/table/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({data: data}),
  })
  addForm.style.display = "none"
  addForm.reset();
})

let currentRowForDelete
agree.addEventListener("click", () => {
  currentRowForDelete.remove();
  deleteConfirm.style.display = "none";
  let number = 0
  let children = [...table.children]
  children.forEach((item,i) => {
    if (item === currentRowForDelete) {
      number = i
    }
  })
  console.log(number)

  fetch(`http://localhost:8000/table/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(number),
  });
});
decline.addEventListener("click", () => {
  deleteConfirm.style.display = "none";
});

function changeHandler(btn) {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    changeForm.style.display = "block"
    currentRow = e.target.parentElement.parentElement
    for (let i = 0; i < currentRow.children.length - 2; i++) {
      let allFormInput = changeForm.querySelectorAll("input")
      if (i === 1) {
        console.log(allFormInput[i])
        allFormInput[i].value = currentRow.children[i].textContent.split(".").reverse().join("-")
        console.log(currentRow.children[i].textContent, allFormInput[i])
      } else {
        allFormInput[i].value = currentRow.children[i].textContent
      }

    }
  });
}

submitChangeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const data = getDataFromForm(changeForm);
  changeForm.style.display = "none";
  changeForm.reset();
  let number
  [...table.children].forEach((item, i) => {
    if (item === currentRow) {
      number = i
    }
  })
  console.log(number)
  let arrayOfData = Object.values(data)
  for (let i = 0; i < 5; i++) {
    currentRow.children[i].textContent = arrayOfData[i]
    if (i === 1) {
      currentRow.children[i].textContent = arrayOfData[i].split("-").reverse().join(".")
    }
  }
  fetch(`http://localhost:8000/table/change`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      number: number,
      data: data,
    }),
  })
});

function getDataFromForm(selector) {
  const name = selector.querySelector(".name").value
  const date = selector.querySelector(".date").value
  const group = selector.querySelector(".group").value
  const phone = selector.querySelector(".phone").value
  const eduForm = selector.querySelector(".education-form").value
  return {
    name,
    date,
    group,
    phone,
    eduForm
  }
}

function render(data) {
  const deleteBtn = document.createElement("a");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Удалить";
  deleteBtn.style.cursor = "pointer";
  const changeBtn = document.createElement("a");
  changeBtn.className = "change-btn";
  changeBtn.textContent = "Изменить";
  changeBtn.style.cursor = "pointer";

  const tdDelete = createTd();
  tdDelete.append(deleteBtn);
  deleteBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    let link = evt.target;
    const td = link.parentElement.parentElement;
    deleteConfirm.style.display = "flex"
    currentRowForDelete = td
  });
  changeHandler(changeBtn)
  const tdChange = createTd();
  tdChange.append(changeBtn);
  const element = `
      <td>${data.name}</td>
      <td>${data.date.split("-").reverse().join(".")}</td>
      <td>${data.group}</td>
      <td>${data.phone}</td>
      <td>${data.eduForm}</td>
  `;
  const tr = document.createElement("tr");
  tr.innerHTML = element;
  tr.append(tdDelete, tdChange);
  table.append(tr)
}

function createTd() {
  const td = document.createElement("td");
  td.style.borderBottom = "1px solid gray";
  return td;
}
