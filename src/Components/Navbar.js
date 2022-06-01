import React from "react";
import "../Styles/navbar.scss";
import { connect } from "react-redux";
import { client, gql } from "../ApolloClient";
import store from "../store";
import icon from "../icon.png";
import Currencies from "./Currencies";
import Cart from "./Cart";
import { changeCategory } from "../actions";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      isCartOpen: false,
    };
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
        if (this.props.selectedCategory === "") {
          store.dispatch(changeCategory(categoriesList[0]));
        }
      });
  }

  render() {
    return (
      <div className='Navbar'>
        <div className='categoriesContainer'>
          {this.state.categories.map((category, index) => {
            const className =
              category === this.props.selectedCategory
                ? "categoryButton activeCategory"
                : "categoryButton";
            return (
              <button
                key={index}
                className={className}
                id={category}
                onClick={() => {
                  store.dispatch(changeCategory(category));
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
        <img
          src={icon}
          alt='Logo'
          className='logo'
          onClick={() => {
            store.dispatch(changeCategory(this.state.categories[0]));
          }}
        ></img>
        <Currencies></Currencies>
        <Cart handler = {this.props.handler}></Cart>

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
