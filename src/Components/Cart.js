import React from "react";
import "../Styles/cart.scss";
import { connect } from "react-redux";
import store from "../store";
import CartItem from "../Components/CartItem";
import cartIcon from "../Assets/emptyCart.png";
import {displayCartPage, displayProduct} from "../actions"

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleCart = this.handleCart.bind(this);
    this.displayCart = this.displayCart.bind(this);
  }

  componentDidMount() {
    this.handleCart();
  }

  handleCart() {
    // OPEN CART AND CLOSE IT ON CLICK OUTSIDE OF IT IF THE CART IS ALREADY OPEN
    document.addEventListener("click", (e) => {
      if (
        (!document.getElementById("cart").contains(e.target) &&
          !document.getElementById("cart").classList.contains("cartClosed")) ||
        e.target.classList.contains("cartButton") || e.target.classList.contains("viewBagButton")
      ) {
        document.getElementById("cart").classList.toggle("cartClosed");
        document.getElementById("overlay").classList.toggle("overlayClosed");
      }
    });
  }

  displayCart() {
    store.dispatch(displayCartPage(true))
    store.dispatch(displayProduct(false, {}))
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
        <div className='cartContainer cartClosed' id='cart'>
          <p className='cartQuantityTotal'>
            <b>My Bag</b>, {this.props.totalQuantity} items
          </p>
          <div className='cartWrapper'>
            {Object.keys(this.props.cart).map((productID) =>
              this.props.cart[productID].map((cartItem, cartItemIndex) => (
                <CartItem cartItem = {cartItem} cartItemIndex = {cartItemIndex} productID = {productID} key={cartItemIndex}></CartItem>
              ))
            )}
          </div>
          <div className='cartPriceTotalWrapper'>
            <p className='cartPriceTotalTitle'>Total</p>
            <p className='cartPriceTotalAmount'>
              {this.props.selectedCurrency.symbol + Math.round(this.props.totalPrice * 100) / 100}
            </p>
          </div>
          <div className='checkoutButtonContainer'>
            <button className='viewBagButton' onClick={this.displayCart}>
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
    totalPrice: state.totalCartPrice
  };
};

export default connect(mapStateToProps)(Cart);
