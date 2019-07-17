/* eslint-disable global-require */
import Vue from "vue";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { Icon } from "leaflet";
import VueApollo from "vue-apollo";
import BootstrapVue from "bootstrap-vue";
import Pusher from "pusher-js";
import VueHotkey from "v-hotkey";

import App from "./App";
import router from "./router";
import store from "./store";

import "./assets/app.scss";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "leaflet/dist/leaflet.css";

// this part resolve an issue where the markers would not appear
// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.use(VueHotkey);

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${localStorage.getItem("t") || null}`
    }
  });
  return forward(operation);
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});
const uri = /*  process.env.NODE_ENV === "production"
    ? */ "https://api.bigislandrp.org/graphql";
/*     : ("http://cad.rpcad.devel/graphql"); */
const httpLink = new HttpLink({ uri });
const cache = new InMemoryCache({});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authMiddleware, httpLink]),
  cache,
  connectToDevTools: true,
  defaultOptions: {
    $loadingKey: "loading",
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all"
    },
    mutate: {
      fetchPolicy: "no-cache",
      errorPolicy: "all"
    }
  }
});
const apolloProvider = new VueApollo({
  defaultClient: client
});
Vue.use(VueApollo);

Vue.use(BootstrapVue);

let wsOptions = {};
/* if (process.env.NODE_ENV === "production") { */
wsOptions = {
  wsHost: "cad.bigislandrp.org",
  wsPort: 6001,
  wssPort: 6003,
  enabledTransports: ["wss", "ws"],
  encrypted: true,
  disableStats: true,
  authEndpoint: "/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("t")}`
    }
  },
  cluster: null
};
/* } else { */
/*  wsOptions = {
    cluster: "us3"
  }; */
/*   wsOptions = {
    wsHost: "cad.rpcad.devel",
    wsPort: 6001,
    enabledTransports: ["ws"],
    encrypted: false,
    disableStats: true,
    authEndpoint: "/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("t")}`
      }
    },
    cluster: null
  };
} */

const pusher = new Pusher(process.env.VUE_APP_PUSHER_APP_KEY, wsOptions);
/* Pusher.log = message => {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
}; */
Vue.prototype.$pusher = pusher;
Vue.pusher = pusher;

// eslint-disable-next-line no-restricted-globals
if (location.origin.indexOf("nui://") === -1) {
  new Vue({
    apolloProvider,
    router,
    store,
    render: h => h(App)
  }).$mount("#lyanna");
}
