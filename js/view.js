class View extends EventEmitter {
  constructor(root) {
    super();
    this.root = document.getElementById(root);
    this.buttonAuth = document.querySelector('.open-submenu');
    this.categories = document.querySelectorAll('.categories--item a');
    this.search = document.querySelector('.sf--search');
    this.cart = document.querySelector('.cart');
    this.currentProducts;
    this.buttonAuth.addEventListener('click', this.handleAuthMenu.bind(this));
    this.categories.forEach(category => {
      category.addEventListener('click', this.handleCategories.bind(this));
    });
    this.search.addEventListener('change', this.handleSearch.bind(this));
    this.search.addEventListener('keyup', this.handleSearch.bind(this));
    this.cart.addEventListener('click', this.handleCart.bind(this));
  }

  handleAuthMenu(evt) {
    evt.preventDefault();
    evt.target.parentElement.classList.toggle('active');
    evt.target.nextElementSibling.classList.toggle('active');
  }

  getCategoryProducts(id, data) {
    if (id == 0) {
      return data;
    } else if (id == 7) {
      return data.filter(product => product.discount);
    } else {
      return data.filter(product => product.group_id == id);
    }
  }

  findProducts(search, data) {
    return data.filter(item => {
      const regex = new RegExp(search, 'gi');
      return item.name.match(regex);
    });
  }

  handleSearch(evt) {
    const result = this.findProducts(evt.target.value, this.currentProducts);
    this.renderCategories(result);
  }

  activeCategories(evt) {
    if (typeof evt === 'number') return false;
    this.categories.forEach(category => category.classList.remove('active'));
    evt.target.classList.add('active');
  }

  handleCategories(evt, data) {
    let products = data || DATA;
    let categoryId;

    if (typeof evt === 'number') {
      categoryId = evt;
    } else {
      categoryId = evt.target.dataset.groupid;
    }
    
    this.currentProducts = this.getCategoryProducts(categoryId, products);

    this.renderCategories(this.currentProducts);
    this.activeCategories(evt);

  }

  renderCategories(data) {
    const content = data.map(product => (
      `
        <div class="products--item">
          <div class="product">
            <div class="product--img">
              <img src="./assets/img/products/${ product.img }" alt="">
            </div>
            <a href="" class="product--name" data-id="${ product._id }">${ product.name }</a>
            <p class="product--price">${ product.price }.00 руб.</p>
            <button type="button" class="product-btn product--add">Добавить в корзину</button>
            <button type="button" class="product-btn product--one-click">Купить в один клик</button>
          </div>
        </div>
      `
    )).join('');

    this.root.innerHTML = content;

    this.bindAddToCart();
  }

  addToCart(evt) {
    const parent = evt.target.parentElement;
    const _id = parent.querySelector('.product--name').dataset.id;
    const name = parent.querySelector('.product--name').textContent;
    const img = parent.querySelector('.product--img img').src.split('/').reverse()[0];
    const price = parseInt(parent.querySelector('.product--price').textContent, 10);

    const newProduct = {
      _id,
      name,
      img,
      price,
      quantity: 1
    };

    this.emit('add', newProduct);
  }

  bindAddToCart() {
    const addToCartButton = document.querySelectorAll('.product--add');
    addToCartButton.forEach(button => button.addEventListener('click', this.addToCart.bind(this)));
  }

  bindRemoveToCart() {
    const deleteBtn = document.querySelectorAll('.delete');
    deleteBtn.forEach(btn => {
     btn.addEventListener('click', this.removeToCart.bind(this));
    });
  }

  renderButtonCart(total) {
    const content = `Товаров ${ total.quantity } (${ total.cost }.00 руб.)`;
    this.cart.innerHTML = content;
  }

  renderCart(products, total) {
    const content = products.map(product => (
      `
      <div class="cart-list--item" data-id="${ product._id }">
        <div class="cl-item--img">
          <img src="./assets/img/products/${ product.img }" alt="">
        </div>
        <div class="cl-item--name">${ product.name }</div>
        <div class="cl-item--sum">
          <div class="cl-item--price">${ product.price }.00 руб.</div>
          <div class="cl-item--quantity">${ product.quantity } шт.</div>
          <div class="cl-item--total">${ product.price * product.quantity }.00 руб.</div>
          <button type="button" class="delete">Удалить</button>
        </div>
      </div>
      `
    )).join('');

    root.innerHTML = `
      <div class="cart-list">
        ${ content }
        <div class="cart-list--sum">
          <div class="cl-item--sum">
            <div class="cl-item--quantity">${ total.quantity } шт.</div>
            <div class="cl-item--total">${ total.cost }.00 руб.</div>
          </div>
        </div>
        <button type="button" class="success">Подтвердить и оформить</button>
      </div>
    `;

    this.bindRemoveToCart();
  }

  handleCart() {
    this.emit('cart', null);
  }

  removeToCart(evt) {
    const parent = evt.target.parentElement.parentElement;
    const id = parent.dataset.id;

    this.emit('remove', id);
  }
}