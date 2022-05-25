import React from "react";
import "../Styles/cartPage.scss";
import { connect } from "react-redux";
import CartItem from "../Components/CartItem";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='CartPage'>
        <h2 className='cartPageTitle'>Cart</h2>
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
        <div className='cartTotalInfoContainer'>
          <div className='cartTotalInfoWrapper'>
            <p>Tax 21%:</p>
            <p>Quantity:</p>
            <p>Total:</p>
          </div>
          <div className='cartTotalInfoWrapper'>
            <p>
              <b>
                {this.props.selectedCurrency.symbol +
                  Math.round(this.props.totalPrice * (21 / 100) * 100) / 100}
              </b>
            </p>
            <p>
              <b>{this.props.totalQuantity}</b>
            </p>
            <p>
              <b>
                {this.props.selectedCurrency.symbol +
                  Math.round(this.props.totalPrice * 100) / 100}
              </b>
            </p>
          </div>

        </div>
        <button className="cartPageOrderButton">ORDER</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    selectedCurrency: state.selectedCurrency,
    totalQuantity: state.totalCartItems,
    totalPrice: state.totalCartPrice,
  };
};

export default connect(mapStateToProps)(Cart);
