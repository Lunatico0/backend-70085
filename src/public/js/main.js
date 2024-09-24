const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnecteted from server');
});

socket.on('products', (products) => {
  renderProductos(products);
});

function renderProductos(products) {
  const productsContainer = document.getElementById('productsContainer');
  const limitContainer = document.getElementById('limitContainer');
  const paginationContainer = document.getElementById('pagination');
  const form = document.createElement('form');

  productsContainer.innerHTML = '';
  limitContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  form.classList.add('mb-4');
  form.id = 'limitForm';
  form.action = '?'
  form.innerHTML = `
    <label for="cant" class="text-white">Cantidad de productos mostrados</label>
    <select name="limit" id="cant" class="bg-slate-300 border border-slate-400 rounded px-2 py-1">
      <option value="5" ${products.productsList.limit == 5 ? 'selected' : ''}>5</option>
      <option value="10" ${products.productsList.limit == 10 ? 'selected' : ''}>10</option>
      <option value="15" ${products.productsList.limit == 15 ? 'selected' : ''}>15</option>
      <option value="30" ${products.productsList.limit == 30 ? 'selected' : ''}>30</option>
      <option value="50" ${products.productsList.limit == 50 ? 'selected' : ''}>50</option>
      <option value="75" ${products.productsList.limit == 75 ? 'selected' : ''}>75</option>
      <option value="100" ${products.productsList.limit == 100 ? 'selected' : ''}>100</option>
      <option value="200" ${products.productsList.limit == 200 ? 'selected' : ''}>200</option>
    </select>
  `;

  limitContainer.appendChild(form);

  const selectLimit = document.getElementById('cant');
  selectLimit.addEventListener('change', () => {
    const selectedLimit = selectLimit.value;
    loadPage(1, selectedLimit);
  });


  products.productsList.docs.forEach((product) => {
    const card = document.createElement('div');
    let label;
    let value;
    card.classList.add('flex', 'flex-col', 'justify-between', 'bg-slate-600', 'rounded', 'w-60', 'min-h-32', 'h-[400px]', 'p-1');
    product.description.forEach((desc) => {
      if (desc.label == "MEDIDAS") {
        label = desc.label;
        value = desc.value
      }
    });
    card.innerHTML = `
      <div class="flex flex-col justify-center text-white">
      <img src="${product.thumbnails[0]}" alt="${product.title}" class="w-full h-auto object-cover">
      <h3 class="text-xl itemDescripcion">${product.title}</h3>
      <h3 class="text-sm">${label}: ${value}</h3>
      <p>$${product.price}</p>
      </div>
      <div class="bg-slate-400/90 border-slate-400 border hover:bg-slate-500 active:bg-slate-300 active:text-black mt-3 text-center rounded text-white">
      <button>Eliminar</button>
      </div>
    `;

    productsContainer.appendChild(card);

    // Agregamos un listener para eliminar el producto
    card.querySelector('button').addEventListener('click', () => {
      console.log('Deleting product with id:', product.id);
      deleteProduct(product.id);
    });
  });

  paginationContainer.classList.add('flex', 'flex-row', 'gap-4', 'pt-4');

  const prevLink = document.createElement('a');
  prevLink.classList.add('bg-slate-400/90', 'border-slate-400', 'border', 'hover:bg-slate-500', 'active:bg-slate-300', 'active:text-black', 'text-white', 'mt-2', 'px-2', 'py-1', 'rounded');
  prevLink.innerText = 'Página Anterior';
  if (products.productsList.hasPrevPage) {
    prevLink.href = `?page=${products.productsList.prevPage}&limit=${products.productsList.limit}${products.productsList.sort ? `&sort=${products.productsList.sort}` : ''}`;
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadPage(products.productsList.prevPage, products.productsList.limit);
    });
  } else {
    prevLink.classList.add('cursor-not-allowed', 'opacity-50');
    prevLink.style.pointerEvents = 'none';
  }
  paginationContainer.appendChild(prevLink);

  const nextLink = document.createElement('a');
  nextLink.classList.add('bg-slate-400/90', 'border-slate-400', 'border', 'hover:bg-slate-500', 'active:bg-slate-300', 'active:text-black', 'text-white', 'mt-2', 'px-2', 'py-1', 'rounded');
  nextLink.innerText = 'Página Siguiente';
  if (products.productsList.hasNextPage) {
    nextLink.href = `?page=${products.productsList.nextPage}&limit=${products.productsList.limit}${products.productsList.sort ? `&sort=${products.productsList.sort}` : ''}`;
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadPage(products.productsList.nextPage, products.productsList.limit);
    });
  } else {
    nextLink.classList.add('cursor-not-allowed', 'opacity-50');
    nextLink.style.pointerEvents = 'none';
  }
  paginationContainer.appendChild(nextLink);
}

const deleteProduct = async (id) => {
  socket.emit('deleteProduct', await id);
};

function addProduct() {
  const formContainer = document.getElementById('formContainer');

  const form = document.createElement('form');
  form.classList.add('form', 'fixed', 'mt-10', 'w-96');
  form.innerHTML = `
    <div class="input-group title">
      <input aria-label="Título" type="text" placeholder=" " id="title" required />
      <span>Título *</span>
    </div>
    <div class="input-group description">
      <input aria-label="Descripción" type="text" placeholder=" " id="description" required />
      <span>Descripción *</span>
    </div>
    <div class="input-group price">
      <input aria-label="Precio" type="number" step="0.01" placeholder=" " id="price" required />
      <span>Precio *</span>
    </div>
    <div class="input-group thumbnails">
      <input aria-label="Thumbnails" type="text" placeholder=" " id="thumbnails" />
      <span>Thumbnails</span>
    </div>
    <div class="input-group code">
      <input aria-label="Código" type="text" placeholder=" " id="code" required />
      <span>Código *</span>
    </div>
    <div class="input-group stock">
      <input aria-label="Stock" type="number" placeholder=" " id="stock" required />
      <span>Stock *</span>
    </div>
    <div class="input-group category">
      <input aria-label="Categoría" type="text" placeholder=" " id="category" required />
      <span>Categoría *</span>
    </div>
    <div class="input-group status">
      <input aria-label="Estado" type="text" placeholder=" " id="status" required />
      <span>Estado *</span>
    </div>
    <div class="col-span-2">
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Add Product</button>
    </div>
  `;

  formContainer.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addProductToServer();
  });

  socket.on('newProductAdded', (data) => {
    console.log(`Se agrego correctamente el producto: ${data.title}`)
  });

  socket.on('errorAddingProduct', (err) => {
    console.error(`Error al agregar el producto: ${err}`)
  })

}

function addProductToServer() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  const thumbnails = document.getElementById('thumbnails').value;
  const code = document.getElementById('code').value;
  const stock = parseInt(document.getElementById('stock').value, 10);
  const category = document.getElementById('category').value;
  const status = document.getElementById('status').value;

  const form = {
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    status
  }

  socket.emit('addProduct', form);

  deleteAllInputs(form);
}

function deleteAllInputs() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('price').value = '';
  document.getElementById('thumbnails').value = '';
  document.getElementById('code').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('category').value = '';
  document.getElementById('status').value = '';
}

addProduct();

function loadPage(page, limit, sort) {
  socket.emit('requestPage', { page, limit, sort });
}