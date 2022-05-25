import React from "react";
import Product from "../Components/Product";
import "../Styles/PDP.scss";
import { connect } from "react-redux";
import { client, gql } from "../ApolloClient";

class ProductListingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
    this.loadProducts = this.loadProducts.bind(this);
  }

  componentDidMount() {
    this.loadProducts(this.props.category);
  }

  componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      this.loadProducts(this.props.category);
    }
  }

  loadProducts(category) {
    client
      .query({
        query: gql`
          query GetProducts($selectedCategory: String!) {
            category(input: { title: $selectedCategory }) {
              name
              products {
                attributes {
                  id
                  name
                  type
                  items {
                    displayValue
                    value
                    id
                  }
                }
                inStock
                brand
                description
                id
                gallery
                name
                prices {
                  amount
                  currency {
                    label
                    symbol
                  }
                }
              }
            }
          }
        `,
        variables: { selectedCategory: category },
      })
      .then((result) => {
        const products = result.data.category.products.map((product) => {
          return {
            ...product,
            prices: product.prices.reduce(
              (obj, price) => ({
                ...obj,
                [price.currency.label]: {
                  amount: price.amount,
                  symbol: price.currency.symbol,
                },
              }),
              {}
            ),
          };
        });
        this.setState({
          products: products,
        });
      });
  }

  render() {
    return (
      <div className='productsListingPage'>
        <h2 className='currentCategoryTitle'>{this.props.category}</h2>
        <div className='productsContainer'>
          {this.state.products.map((product, index) => {
            return <Product product={product} key={index}></Product>;
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    category: state.selectedCategory,
    selectedCurrency: state.selectedCurrency,
  };
};

export default connect(mapStateToProps)(ProductListingPage);
