import React from "react";
import Navbar from "./Components/Navbar";
import ProductListingPage from "./Pages/PLP";
import ProductDisplayPage from "./Pages/PDP";
import CartPage from "./Pages/CartPage"
import { connect } from "react-redux";
import "./Styles/App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='App'>
        <Navbar></Navbar>
        {this.props.isDisplayingProduct === true ? (
          <ProductDisplayPage></ProductDisplayPage>
        ) : this.props.isDisplayingCart === true ? (
          <CartPage></CartPage>
        ) : (
          <ProductListingPage></ProductListingPage>
        )}
        <div className='overlay overlayClosed' id='overlay'></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isDisplayingProduct: state.productDisplayPage.isDisplayingProduct,
    isDisplayingCart: state.isDisplayingCartPage,
  };
};

export default connect(mapStateToProps)(App);
