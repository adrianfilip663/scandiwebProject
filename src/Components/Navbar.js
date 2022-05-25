import React from "react";
import "../Styles/navbar.scss";
import { connect } from "react-redux";
import { client, gql } from "../ApolloClient";
import store from "../store";
import icon from "../icon.png";
import Currencies from "./Currencies";
import Cart from "./Cart";
import { displayProduct, changeCategory, displayCartPage } from "../actions";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
    this.changeActiveCategory = this.changeActiveCategory.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  componentDidMount() {
    this.loadCategories();
  }

  loadCategories() {
    client
      .query({
        query: gql`
          query GetCategories {
            categories {
              name
            }
          }
        `,
      })
      .then((result) => {
        const categoriesList = result.data.categories.map((category) => {
          return category.name;
        });
        this.setState({
          categories: categoriesList,
        });
        if (localStorage.getItem("http://localhost:3000:state") === null) {
          store.dispatch(changeCategory(categoriesList[0]));
        }
      });
  }

  changeActiveCategory(category) {
    document
      .getElementsByClassName("activeCategory")[0]
      .classList.remove("activeCategory");
    document.getElementById(category).classList.add("activeCategory");

    store.dispatch(displayProduct(false, {}));
    store.dispatch(displayCartPage(false));
    store.dispatch(changeCategory(category));
  }

  render() {
    return (
      <div className='Navbar'>
        <div className='categoriesContainer'>
          {this.state.categories.map((category, index) => {
            const className =
              category === this.props.selectedCategory ? "categoryButton activeCategory" : "categoryButton";
            return (
              <button
                key={index}
                className={className}
                id={category}
                onClick={() => {
                  this.changeActiveCategory(category);
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
        <img src={icon} alt='Logo' className='logo'></img>
        <Currencies></Currencies>
        <Cart></Cart>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCategory: state.selectedCategory,
  };
};

export default connect(mapStateToProps)(Navbar);
