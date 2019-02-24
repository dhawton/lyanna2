import Vue from 'vue';
import Router from 'vue-router';

import AuthGuard from "./utils/AuthGuard";

import Login from './components/login';
import Logout from "./components/login/logout";
import Servers from "./components/login/servers";
import Departments from "./components/login/departments";
import Characters from "./components/login/characters";
import NewCharacter from "./components/login/newcharacter";

import Civ from "./components/civ/layout";
import CivProfile from "./components/civ/profile";
import EditInfo from "./components/civ/EditInfo";
import CivDMV from "./components/civ/DMV";

import MDT from "./components/leo/layout";

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/login/servers',
      name: 'LoginServers',
      component: Servers,
      beforeEnter: AuthGuard
    },
    {
      path: '/login/departments',
      name: 'LoginDepartments',
      component: Departments,
      beforeEnter: AuthGuard
    },
    {
      path: '/login/characters',
      name: 'LoginCharacters',
      component: Characters,
      beforeEnter: AuthGuard
    },
    {
      path: '/login/characters/new',
      name: 'LoginCharactersNew',
      component: NewCharacter,
      beforeEnter: AuthGuard
    },
    {
      path: "/civ",
      component: Civ,
      beforeEnter: AuthGuard,
      children: [
        {
          path: '', component: CivProfile
        },
        {
          path: 'edit', component: EditInfo
        },
        {
          path: 'dmv', component: CivDMV
        }
      ]
    },
    {
      path: "/mdt",
      component: MDT,
      beforeEnter: AuthGuard,
    }
  ],
});
