import React from "react";
import "../Styles/product.scss";
import store from "../store";
import { connect } from "react-redux";
import addToCartIcon from "../Assets/addToCartCircleIcon.png";
import { addToCart, incrementItemQuantity, displayProduct } from "../actions";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: "",
    };
    this.addProductToCart = this.addProductToCart.bind(this);
  }

  componentDidMount() {
    // SET THE FIRST ATTRIBUTE OF EACH ATTRIBUTE-SET AS THE SELECTED ATTRIBUTE FOR THE PRODUCT
    this.setState({
      selectedAttributes: this.props.product.attributes.reduce(
        (obj, attributeSet) => ({
          ...obj,
          [attributeSet.name]: attributeSet.items[0].value,
        }),
        {}
      ),
    });
  }

  addProductToCart() {
    const cart = this.props.cart;
    const productID = this.props.product.id;

    /* 
    Check if product already exists in cart.
    If product exists and has the same attributes, 
    increment the quantity of first item which has the same attributes,
    else add a new item with different attributes
    */
    if (cart[productID]) {
      var index = -1;
      for (var i = 0; i < cart[productID].length; i++) {
        const cartItem = cart[productID][i];
        var sameAttributesExist = true;
        for( var j=0;j < Object.keys(cartItem.selectedAttributes).length; j++){
          var attributeName = Object.keys(cartItem.selectedAttributes)[j]
          if (
            cartItem.selectedAttributes[attributeName] !==
            this.state.selectedAttributes[attributeName]
          ) {
            sameAttributesExist = false;
          }
        }
        if (sameAttributesExist) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        store.dispatch(incrementItemQuantity(productID, index));
      } else {
        store.dispatch(addToCart(productID, this.props.product, this.state.selectedAttributes));
      }
    } else {
      store.dispatch(addToCart(productID, this.props.product, this.state.selectedAttributes));
    }
  }

  render() {
    const product = this.props.product;
    return (
      <div
        className='productCardContainer'
        stock={product.inStock.toString()}
      >
        <div
          className='productCardWrapper'
          onClick={() => {
            if(this.props.product.inStock === true){
              store.dispatch(displayProduct(this.props.product))
            };
          }}
        >
          <div className='productImageWrapper'>
            <div className='productImageOverlayWrapper'>
              <p>OUT OF STOCK</p>
            </div>
            <img src={product.gallery[0]} className='productImage' alt="Product"></img>
          </div>
          <h2 className='productName'>{product.brand} {product.name}</h2>
          <p className='productPrice'>
            {this.props.selectedCurrency.symbol +
              product.prices[this.props.selectedCurrency.label].amount}
          </p>
        </div>
        <div className='addToCartButtonWrapper'>
          <button
            className='addToCartCircleButton'
            onClick={() => {
              this.addProductToCart();
            }}
          >
            <img
              src={addToCartIcon}
              alt='Add to cart button'
              className='addToCartIcon'
            ></img>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCurrency: state.selectedCurrency,
    cart: state.cart,
  };
};

export default connect(mapStateToProps)(Product);
