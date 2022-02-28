import "./index.css";

import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import App from "./App";

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
});

ReactDOM.render(

  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,

  document.getElementById("root"),
);
