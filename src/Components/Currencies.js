import React from "react";
import "../Styles/currencies.scss";
import { connect } from "react-redux";
import { client, gql } from "../ApolloClient";
import store from "../store";
import currencyChevron from "../Assets/currencyChevron.png";
import { changeCurrency } from "../actions";

class Currencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      isCurrenciesListOpen : false
    };
    this.loadCurrencies = this.loadCurrencies.bind(this);
    this.handleCurrenciesList = this.handleCurrenciesList.bind(this);
  }

  componentDidMount() {
    this.loadCurrencies();
    this.handleCurrenciesList();
  }

  loadCurrencies() {
    client
      .query({
        query: gql`
          query GetCurrencies {
            currencies {
              label
              symbol
            }
          }
        `,
      })
      .then((result) => {
        const currencies = result.data.currencies.map((currency) => {
          return {
            label: currency.label,
            symbol: currency.symbol,
          };
        });
        this.setState({
          currencies: currencies,
        });
        if(localStorage.getItem("http://localhost:3000:state") === null){
          store.dispatch(changeCurrency(currencies[0]));
        }
      });
  }

  handleCurrenciesList() {
    // OPEN CURRENCIES LIST AND CLOSE IT AFTER A CLICK IF THE CURRENCIES LIST IS ALREADY OPEN
    window.addEventListener("click", (e) => {
      if (
        (e.target.classList.contains("switcherButtonPart") &&
        this.state.isCurrenciesListOpen === false) ||
        this.state.isCurrenciesListOpen === true
      ) {
        this.setState(prevState => ({
          isCurrenciesListOpen : !prevState.isCurrenciesListOpen
        }))
      }
    });
  }

  render() {
    return (
      <div className='Currencies'>
        <div className='currencySwitcherContainer'>
          <button className='currencySwitcherButton switcherButtonPart'>
            {this.props.selectedCurrency.symbol}
            <img
              src={currencyChevron}
              alt='Currency Switcher Button'
              className='chevron closedChevron switcherButtonPart'
              id='currencyChevron'
            ></img>
          </button>
          <ul
            className={this.state.isCurrenciesListOpen === false ? "currenciesList closedCurrenciesList" : "currenciesList"}
            id='currenciesList'
          >
            {this.state.currencies.map((currency, index) => {
              return (
                <li
                  className='currency'
                  key={index}
                  onClick={() => store.dispatch(changeCurrency(currency))}
                >
                  <span>{currency.symbol} </span>
                  <span>{currency.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCurrency: state.selectedCurrency,
  };
};

export default connect(mapStateToProps)(Currencies);
