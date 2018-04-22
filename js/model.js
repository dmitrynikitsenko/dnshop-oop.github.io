class Model {
  constructor(state = []) {
    this.state = state;
  }

  getProduct(id) {
    return this.state.find(product => product._id == id);
  }

  addToCart(product) {
    this.state.push(product);
  }

  updateToCart(id) {
    const currentProduct = this.getProduct(id);
    currentProduct.quantity++;
  }

  removeToCart(id) {
    const index = this.state.findIndex(product => product._id == id);
    if (index !== -1) {
      this.state.splice(index, 1);
    }
  }
}