import React from "react";
import { connect } from "react-redux";
import store from "../store";
import "../Styles/PLP.scss";
import { addToCart, incrementItemQuantity } from "../actions";

class ProductDisplayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: "",
      displayedImage: this.props.displayedProduct.gallery[0],
    };
    this.addProductToCart = this.addProductToCart.bind(this);
    this.selectAttribute = this.selectAttribute.bind(this);
  }

  addProductToCart() {
    const cart = this.props.cart;
    const productID = this.props.displayedProduct.id;
    if (cart[productID]) {
      var index = -1;
      for (var i = 0; i < cart[productID].length; i++) {
        const cartItem = cart[productID][i];
        var sameAttributesExist = true;
        Object.keys(cartItem.selectedAttributes).map((attributeName) => {
          if (
            cartItem.selectedAttributes[attributeName] !==
            this.state.selectedAttributes[attributeName]
          ) {
            sameAttributesExist = false;
          }
        });
        if (sameAttributesExist) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        store.dispatch(incrementItemQuantity(productID, index));
      } else {
        store.dispatch(addToCart(productID, this.props.displayedProduct, this.state.selectedAttributes));
      }
    } else {
      store.dispatch(addToCart(productID, this.props.displayedProduct, this.state.selectedAttributes));
    }
  }

  componentDidMount() {
    this.props.displayedProduct.attributes.map((attributeSet) => {
      this.selectAttribute(attributeSet.name, attributeSet.items[0].value);
    });
  }

  selectAttribute(name, attribute) {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [name]: attribute,
      },
    }));
  }

  changeDisplayedImage(src) {
    this.setState({
      displayedImage: src,
    });
  }

  render() {
    const displayedProduct = this.props.displayedProduct;
    return (
      <div className='ProductDisplayPage'>
        <div className='productGalleryContainer'>
          <div className='productImagesWrapper'>
            {displayedProduct.gallery.map((image, index) => (
              <img
                src={image}
                className='smallProductImage'
                key={index}
                alt="Small Product"
                onClick={() => {
                  this.changeDisplayedImage(image);
                }}
              ></img>
            ))}
          </div>
          <img
            className='bigProductImage'
            src={this.state.displayedImage}
            alt='Big Product'
          ></img>
        </div>
        <div className='productInfoContainer'>
          <h2 className='displayedProductName'>
            <span>{displayedProduct.brand}</span> <br />{" "}
            {displayedProduct.name}
          </h2>
          <div className='productAttributesContainer'>
            {displayedProduct.attributes.map((attributeSet, index) => (
              <div key={index} className='attributeSetWrapper'>
                <h2 className='infoTitle'>{attributeSet.name}</h2>
                <div className='attributeSetOptionsWrapper'>
                  {attributeSet.items.map((attribute, index) => (
                    <p
                      key={index}
                      className={
                        this.state.selectedAttributes !== ""
                          ? attribute.value ===
                            this.state.selectedAttributes[attributeSet.name]
                            ? "attributeButton selectedAttribute"
                            : "attributeButton"
                          : ""
                      }
                      type={attributeSet.type}
                      style={
                        attributeSet.type === "swatch"
                          ? { backgroundColor: attribute.value }
                          : {}
                      }
                      onClick={() => {
                        this.selectAttribute(
                          attributeSet.name,
                          attribute.value
                        );
                      }}
                    >
                      {attributeSet.type === "swatch"
                        ? ""
                        : attribute.displayValue}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='priceWrapper'>
            <h2 className='infoTitle'>Price</h2>
            <h2 className='displayedProductPrice'>
              {this.props.selectedCurrency.symbol +
                displayedProduct.prices[
                  this.props.selectedCurrency.label
                ].amount}
            </h2>
          </div>
          <button
            className='productAddToCartButton'
            onClick={this.addProductToCart}
          >
            ADD TO CART
          </button>
          <div
            dangerouslySetInnerHTML={{
              __html: displayedProduct.description,
            }}
            className='productDescription'
          ></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCurrency: state.selectedCurrency,
    displayedProduct: state.productDisplayPage.displayedProduct,
    cart: state.cart,
  };
};

export default connect(mapStateToProps)(ProductDisplayPage);
