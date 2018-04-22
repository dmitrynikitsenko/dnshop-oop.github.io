class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.on('add', this.addToCart.bind(this));
    this.view.on('cart', this.viewCart.bind(this));
    this.view.on('remove', this.removeCart.bind(this));
  }

  addToCart(product) {
    if (!this.model.getProduct(product._id)) {
      this.model.addToCart(product);
    } else {
      this.model.updateToCart(product._id);
    }

    this.view.renderButtonCart(this.totalCart(this.model.state));
  }
  
  totalCart(data) {
    const total = {};
    total.quantity = data.reduce(function(accumulator, currentValue) {
      return accumulator + currentValue.quantity;
    }, 0);
    total.cost = data.reduce(function(accumulator, currentValue) {
      return accumulator + currentValue.quantity * currentValue.price;
    }, 0);

    return total;
  }

  viewCart() {
    this.view.renderCart(this.model.state, this.totalCart(this.model.state));
  }

  removeCart(id) {
    this.model.removeToCart(id);
    this.view.renderButtonCart(this.totalCart(this.model.state));
    this.view.renderCart(this.model.state, this.totalCart(this.model.state));
  }
}