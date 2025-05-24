export const handleAddToCart = (cartProducts, newProduct) => {
    const existingProduct = cartProducts.find((product) => product.id === newProduct.id);
    if (existingProduct) {
      return cartProducts.map((product) =>
        product.id === newProduct.id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
    }
    return [...cartProducts, { ...newProduct, quantity: 1 }];
  };