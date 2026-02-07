const API = "http://localhost:3000/products";

getData();

// ================== READ ==================
async function getData() {
    const res = await fetch(API);
    const products = await res.json();

    const body = document.getElementById("table_body");
    body.innerHTML = "";

    for (const p of products) {
        const className = p.isDeleted ? "deleted" : "";

        body.innerHTML += `
      <tr class="${className}">
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>
          <button onclick="editProduct(${p.id})">Sửa</button>
          <button onclick="softDelete(${p.id})">Xóa</button>
        </td>
      </tr>
    `;
    }
}

// ================== CREATE / UPDATE ==================
async function saveProduct() {
    const id = document.getElementById("txt_id").value;
    const name = document.getElementById("txt_name").value;
    const price = document.getElementById("txt_price").value;

    if (!name || !price) {
        alert("Nhập đầy đủ thông tin");
        return;
    }

    // CREATE (ID tự tăng)
    if (id === "") {
        const res = await fetch(API);
        const list = await res.json();
        const maxId = list.length ? Math.max(...list.map(p => p.id)) : 0;

        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: maxId + 1,
                name: name,
                price: Number(price),
                isDeleted: false
            })
        });
    }
    // UPDATE (KHÔNG ĐỤNG isDeleted)
    else {
        await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                price: Number(price)
            })
        });
    }

    clearForm();
    getData();
}

// ================== SOFT DELETE ==================
async function softDelete(id) {
    await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            isDeleted: true
        })
    });
    getData();
}

// ================== EDIT ==================
async function editProduct(id) {
    const res = await fetch(`${API}/${id}`);
    const p = await res.json();

    document.getElementById("txt_id").value = p.id;
    document.getElementById("txt_name").value = p.name;
    document.getElementById("txt_price").value = p.price;
}

// ================== CLEAR FORM ==================
function clearForm() {
    document.getElementById("txt_id").value = "";
    document.getElementById("txt_name").value = "";
    document.getElementById("txt_price").value = "";
}