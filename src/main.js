import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import VueApollo from 'vue-apollo';
import BootstrapVue from 'bootstrap-vue';
import Pusher from 'pusher-js';

import App from './App';
import router from './router';
import store from './store';

import './assets/app.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${localStorage.getItem('t') || null}`
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
const uri =
  process.env.NODE_ENV === 'production'
    ? 'https://cad.lakecountyrp.com/graphql'
    : 'http://cad.rpcad.devel/graphql';
const httpLink = new HttpLink({ uri });
const cache = new InMemoryCache({});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authMiddleware, httpLink]),
  cache,
  connectToDevTools: true,
  defaultOptions: {
    $loadingKey: 'loading',
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    },
    mutate: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
});
const apolloProvider = new VueApollo({
  defaultClient: client
});
Vue.use(VueApollo);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

const wsOptions = {
  wsHost: process.env.VUE_APP_PUSHER_HOST,
  wsPort: 6001,
  disableStats: true,
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('t')}`
    }
  }
};
if (process.env.NODE_ENV === 'production') {
  wsOptions.wssPort = 6003;
  wsOptions.transport = ['wss', 'ws'];
  wsOptions.encrypted = true;
} else {
  wsOptions.transport = ['ws'];
  wsOptions.encrypted = false;
}
const pusher = new Pusher(process.env.VUE_APP_PUSHER_APP_KEY, wsOptions);
Vue.prototype.$pusher = pusher;
Vue.pusher = pusher;

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App)
}).$mount('#lyanna');
