import React from "react";
import "../Styles/cart.scss";
import { connect } from "react-redux";
import store from "../store";
import CartItem from "../Components/CartItem";
import cartIcon from "../Assets/emptyCart.png";
import { displayCartPage } from "../actions";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartOpen: false,
    };
    this.cartRef = React.createRef();
    this.handleCart = this.handleCart.bind(this);
  }

  componentDidMount() {
    this.handleCart();
  }

  handleCart() {
    // OPEN CART AND CLOSE IT ON CLICK OUTSIDE OF IT IF THE CART IS ALREADY OPEN
    window.addEventListener("click", (e) => {
      if (
        (!this.cartRef.current.contains(e.target) &&
          this.state.isCartOpen === true) ||
        e.target.classList.contains("cartButton") ||
        e.target.classList.contains("viewBagButton")
      ) {
        if (!e.target.classList.contains("quantityButtonMinus")) {
          this.setState((prevState) => ({
            isCartOpen: !prevState.isCartOpen,
          }));
          this.props.handler();
        }
      }
    });
  }

  render() {
    return (
      <div className='Cart'>
        <div className='cartButtonWrapper'>
          <img
            src={cartIcon}
            alt='Cart Icon'
            className='cartIcon cartButton'
            id='cartButton'
          ></img>
          <p
            className='cartItemsQuantityIcon cartButton'
            id='cartItemsQuantity'
            style={
              this.props.totalCartItemsQuantity > 0
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
          >
            {this.props.totalCartItemsQuantity}
          </p>
        </div>
        <div
          className={
            this.state.isCartOpen === false
              ? "cartContainer cartClosed"
              : "cartContainer"
          }
          ref={this.cartRef}
        >
          <p className='cartQuantityTotal'>
            <b>My Bag</b>, {this.props.totalCartItemsQuantity} items
          </p>
          <div className='cartWrapper'>
            {Object.keys(this.props.cart).map((productID) =>
              this.props.cart[productID].map((cartItem, cartItemIndex) => (
                <CartItem
                  cartItem={cartItem}
                  cartItemIndex={cartItemIndex}
                  productID={productID}
                  key={cartItemIndex}
                ></CartItem>
              ))
            )}
          </div>
          <div className='cartPriceTotalWrapper'>
            <p className='cartPriceTotalTitle'>Total</p>
            <p className='cartPriceTotalAmount'>
              {this.props.selectedCurrency.symbol +
                Math.round(this.props.totalPrice * 100) / 100}
            </p>
          </div>
          <div className='checkoutButtonContainer'>
            <button
              className='viewBagButton'
              onClick={() => {
                store.dispatch(displayCartPage());
              }}
            >
              VIEW BAG
            </button>
            <button className='checkoutButton'>CHECKOUT</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    selectedCurrency: state.selectedCurrency,
    totalCartItemsQuantity: state.totalCartItems,
    totalPrice: state.totalCartPrice,
  };
};

export default connect(mapStateToProps)(Cart);
