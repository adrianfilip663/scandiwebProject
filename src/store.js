import { createStore } from "redux";

const initialState =
  localStorage.getItem("http://localhost:3000:state") === null
    ? {
        selectedCategory: "",
        selectedCurrency: "",
        cart: {},
        totalCartItems: 0,
        totalCartPrice: 0,
        displayedProduct: {},
        displayedPage: "listingPage",
      }
    : JSON.parse(localStorage.getItem("http://localhost:3000:state"));

const saveState = (state) => {
  localStorage.setItem("http://localhost:3000:state", JSON.stringify(state));
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
        displayedPage: "listingPage",
      };
    case "CHANGE_CURRENCY":
      var newTotalPrice = 0;
      Object.keys(state.cart).forEach((productID) => {
        state.cart[productID].forEach((cartItem) => {
          newTotalPrice +=
            cartItem.product.prices[action.payload.label].amount *
            cartItem.cartItemQuantity;
        });
      });
      return {
        ...state,
        selectedCurrency: action.payload,
        totalCartPrice: newTotalPrice,
      };
    case "ADD_TO_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.productID]: state.cart[action.payload.productID]
            ? [
                ...state.cart[action.payload.productID],
                {
                  product: action.payload.product,
                  selectedAttributes: action.payload.selectedAttributes,
                  cartItemQuantity: 1,
                },
              ]
            : [
                {
                  product: action.payload.product,
                  selectedAttributes: action.payload.selectedAttributes,
                  cartItemQuantity: 1,
                },
              ],
        },
        totalCartItems: state.totalCartItems + 1,
        totalCartPrice:
          state.totalCartPrice +
          action.payload.product.prices[state.selectedCurrency.label].amount,
      };
    case "INCREMENT_ITEM_QUANTITY":
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.productID]: [
            ...state.cart[action.payload.productID].map((cartItem, index) =>
              index === action.payload.index
                ? {
                    ...cartItem,
                    cartItemQuantity:
                      state.cart[action.payload.productID][index]
                        .cartItemQuantity + 1,
                  }
                : cartItem
            ),
          ],
        },
        totalCartItems: state.totalCartItems + 1,
        totalCartPrice:
          state.totalCartPrice +
          state.cart[action.payload.productID][action.payload.index].product
            .prices[state.selectedCurrency.label].amount,
      };
    case "DECREMENT_ITEM_QUANTITY":
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.productID]: [
            ...state.cart[action.payload.productID].map((cartItem, index) =>
              index === action.payload.index
                ? {
                    ...cartItem,
                    cartItemQuantity:
                      state.cart[action.payload.productID][index]
                        .cartItemQuantity - 1,
                  }
                : cartItem
            ),
          ],
        },
        totalCartItems: state.totalCartItems - 1,
        totalCartPrice:
          state.totalCartPrice -
          state.cart[action.payload.productID][action.payload.index].product
            .prices[state.selectedCurrency.label].amount,
      };
    case "DISPLAY_PRODUCT":
      return {
        ...state,
        displayedProduct: action.payload.displayedProduct,
        displayedPage: "displayPage",
      };
    case "DELETE_ITEM":
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.productID]: state.cart[
            action.payload.productID
          ].filter((item, index) => index !== action.payload.index),
        },
        totalCartItems: state.totalCartItems - 1,
        totalCartPrice:
          state.totalCartPrice -
          state.cart[action.payload.productID][action.payload.index].product
            .prices[state.selectedCurrency.label].amount,
      };
    case "DISPLAY_CART_PAGE":
      return {
        ...state,
        displayedPage: "cartPage",
      };
    default:
      return state;
  }
};

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
