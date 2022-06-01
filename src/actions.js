const displayProduct = (product) => ({
  type: "DISPLAY_PRODUCT",
  payload: {displayedProduct: product },
});

const displayCartPage = () => ({
  type: "DISPLAY_CART_PAGE",
  payload: ""
});

const changeCategory = (category) => (
  {
  type: "CHANGE_CATEGORY",
  payload: category,
});

const changeCurrency = (currency) => ({
  type: "CHANGE_CURRENCY",
  payload: {
    label: currency.label,
    symbol: currency.symbol,
  },
});

const incrementItemQuantity = (productID, index) => ({
  type: "INCREMENT_ITEM_QUANTITY",
  payload: {
    productID: productID,
    index: index,
  },
});

const decrementItemQuantity = (productID, index) => ({
  type: "DECREMENT_ITEM_QUANTITY",
  payload: {
    index: index,
    productID: productID,
  },
});

const deleteItem = (productID, index) => ({
  type: "DELETE_ITEM",
  payload: {
    productID: productID,
    index: index,
  },
});

const addToCart = (productID, product, selectedAttributes) => ({
  type: "ADD_TO_CART",
  payload: {
    productID: productID,
    product: product,
    selectedAttributes: selectedAttributes,
  },
});

export {
  displayProduct,
  changeCategory,
  displayCartPage,
  changeCurrency,
  incrementItemQuantity,
  decrementItemQuantity,
  deleteItem,
  addToCart
};
