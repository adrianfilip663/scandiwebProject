import React from "react";
import Navbar from "./Components/Navbar";
import ProductListingPage from "./Pages/PLP";
import ProductDisplayPage from "./Pages/PDP";
import CartPage from "./Pages/CartPage";
import { connect } from "react-redux";
import "./Styles/App.scss";

var pages = {
  listingPage: ProductListingPage,
  displayPage: ProductDisplayPage,
  cartPage: CartPage,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartOpen: false,
    };
    this.handleOverlay = this.handleOverlay.bind(this);
  }

  handleOverlay() {
    this.setState((prevState) => ({
      isCartOpen: !prevState.isCartOpen,
    }));
  }

  render() {
    var DisplayedPage = pages[this.props.displayedPage];

    return (
      <div className='App'>
        <Navbar handler={this.handleOverlay}></Navbar>
        <DisplayedPage></DisplayedPage>
        <div
          className={
            this.state.isCartOpen === true ? "overlay" : "overlay overlayClosed"
          }
          id='overlay'
        ></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    displayedPage: state.displayedPage,
  };
};

export default connect(mapStateToProps)(App);
