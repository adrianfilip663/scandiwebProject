import React from "react";
import "../Styles/cartItem.scss";
import { connect } from "react-redux";
import store from "../store";
import minus from "../Assets/minus-square.png";
import plus from "../Assets/plus-square.png";
import {
  incrementItemQuantity,
  decrementItemQuantity,
  deleteItem,
} from "../actions";
import leftChevron from "../Assets/leftChevron.png";
import rightChevron from "../Assets/rightChevron.png";

class CartItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGalleryPhoto: 0,
    };
    this.handleDecrement = this.handleDecrement.bind(this);
    this.nextPhoto = this.nextPhoto.bind(this);
    this.previousPhoto = this.previousPhoto.bind(this);
  }

  handleDecrement(productID, index) {
    if (this.props.cart[productID][index].cartItemQuantity === 1) {
      store.dispatch(deleteItem(productID, index));
    } else {
      store.dispatch(decrementItemQuantity(productID, index));
    }
  }

  nextPhoto(cartItem) {
    if (this.state.currentGalleryPhoto < cartItem.product.gallery.length - 1) {
        this.setState({
          currentGalleryPhoto: this.state.currentGalleryPhoto + 1,
        });
    }
  }

  previousPhoto() {
    if (this.state.currentGalleryPhoto > 0) {
        this.setState({
          currentGalleryPhoto: this.state.currentGalleryPhoto - 1,
        });
    }
  }

  render() {
    const cartItem = this.props.cartItem;
    const cartItemIndex = this.props.cartItemIndex;
    const productID = this.props.productID;
    return (
      <div className='CartItem'>
        <div className='cartItemWrapper' key={cartItemIndex}>
          <div className='cartItemInfoContainer'>
            <p className='cartItemName'>
              <span>{cartItem.product.brand}</span> <br />{" "}
              {cartItem.product.name}
            </p>
            <p className='cartItemPrice'>
              {this.props.selectedCurrency.symbol +
                cartItem.product.prices[this.props.selectedCurrency.label]
                  .amount}
            </p>
            {cartItem.product.attributes.map(
              (attributeSet, attributeSetIndex) => (
                <div
                  className='cartItemAttributeSetWrapper'
                  key={attributeSetIndex}
                >
                  <p className='cartItemAttributeSetTitle'>
                    {attributeSet.name}
                  </p>
                  <div className='cartItemAttributeSetOptionsContainer'>
                    {attributeSet.items.map((attribute, attributeIndex) => (
                      <p
                        key={attributeIndex}
                        className={
                          attribute.value ===
                          cartItem.selectedAttributes[attributeSet.name]
                            ? "cartItemAttributeButton selectedAttribute"
                            : "cartItemAttributeButton"
                        }
                        type={attributeSet.type}
                        style={
                          attributeSet.type === "swatch"
                            ? { backgroundColor: attribute.value }
                            : {}
                        }
                      >
                        {attributeSet.type === "swatch"
                          ? ""
                          : attribute.displayValue}
                      </p>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
          <div className='quantityAndPhotoContainer'>
            <div className='cartItemQuantityContainer'>
              <img
                className='cartItemQuantityButton'
                src={plus}
                alt='Increase Item Quantity'
                onClick={() => {
                  store.dispatch(
                    incrementItemQuantity(productID, cartItemIndex)
                  );
                }}
              ></img>
              <p className='cartItemQuantity'>{cartItem.cartItemQuantity}</p>
              <img
                className='cartItemQuantityButton quantityButtonMinus'
                src={minus}
                alt='Decrease Item Quantity'
                onClick={() => {
                  this.handleDecrement(productID, cartItemIndex);
                }}
              ></img>
            </div>
            <div className='cartItemPhotoContainer'>
              <img
                src={cartItem.product.gallery[this.state.currentGalleryPhoto]}
                alt='Cart Item'
                className='cartItemPhoto'
              ></img>
              {cartItem.product.gallery.length > 1 ? (
                <div className='cartPageImageButtonsContainer'>
                  <div className='cartPageImageButtonsWrapper'>
                    <button onClick={this.previousPhoto}>
                      <img src={leftChevron} alt="Left Arrow"></img>
                    </button>
                    <button
                      onClick={() => {
                        this.nextPhoto(cartItem);
                      }}
                    >
                      <img src={rightChevron} alt="Right Arrow"></img>
                    </button>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
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
  };
};

export default connect(mapStateToProps)(CartItem);
