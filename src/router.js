/* eslint-disable implicit-arrow-linebreak */
import Vue from "vue";
import Router from "vue-router";

import AuthGuard from "./utils/AuthGuard";

import Login from "./components/login";
import Logout from "./components/login/logout";
import Servers from "./components/login/servers";
import Departments from "./components/login/departments";
import Characters from "./components/login/characters";
import NewCharacter from "./components/login/newcharacter";
import LoginFire from "./components/login/fire";

const Civ = () => import(/* webpackChunkName: "Civ" */ "./components/civ/layout.vue");
const CivProfile = () => import(/* webpackChunkName: "Civ" */ "./components/civ/profile.vue");
const EditInfo = () => import(/* webpackChunkName: "Civ" */ "./components/civ/EditInfo.vue");
const CivDMV = () => import(/* webpackChunkName: "Civ" */ "./components/civ/DMV.vue");

const Units = () => import(/* webpackChunkName: "ActiveUnits" */ "./components/shared/units.vue");

const Fire = () => import(/* webpackChunkName: "Fire" */ "./components/fire/layout.vue");
const FireCalls = () => import(/* webpackChunkName: "Fire" */ "./components/fire/call.vue");
const FireApparatus = () =>
  import(/* webpackChunkName: "Fire" */ "./components/fire/chgapparatus.vue");

const MDT = () => import(/* webpackChunkName: "MDT" */ "./components/leo/layout.vue");
const MDTCall = () => import(/* webpackChunkName: "MDT" */ "./components/leo/call.vue");
const MDTPC = () => import(/* webpackChunkName: "MDT" */ "./components/leo/personcheck.vue");
const MDTPCCharacter = () => import(/* webpackChunkName: "MDT" */ "./components/leo/character.vue");
const MDTVC = () => import(/* webpackChunkName: "MDT" */ "./components/leo/vehiclecheck.vue");
const MDTChangeDept = () => import(/* webpackChunkName: "MDT1" */ "./components/leo/chgdept.vue");
const MDTBOLOs = () => import(/* webpackChunkName: "MDT" */ "./components/leo/bolos.vue");
const MDTCases = () => import(/* webpackChunkName: "MDT2" */ "./components/leo/cases.vue");
const MDTCase = () => import(/* webpackChunkName: "MDT2" */ "./components/leo/viewcase.vue");

const CAD = () => import(/* webpackChunkName: "CAD" */ "./components/dispatch/layout.vue");
const CADCalls = () => import(/* webpackChunkName: "CAD" */ "./components/dispatch/calls.vue");
const CADVC = () => import(/* webpackChunkName: "CAD" */ "./components/dispatch/vehiclecheck.vue");
const CADPC = () => import(/* webpackChunkName: "CAD" */ "./components/dispatch/personcheck.vue");
const CADCharacter = () =>
  import(/* webpackChunkName: "CAD" */ "./components/dispatch/character.vue");
const CADRadioCodes = () =>
  import(/* webpackChunkName: "CAD1" */ "./components/dispatch/radiocodes.vue");
const CADMap = () => import(/* webpackChunkName: "CAD2" */ "./components/dispatch/map.vue");
const CADArchived = () =>
  import(/* webpackChunkName: "CAD3" */ "./components/dispatch/components/archivedcalls.vue");
const CADBolos = () => import(/* webpackChunkName: "CAD4" */ "./components/dispatch/bolos.vue");

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Login
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/logout",
      name: "Logout",
      component: Logout,
      beforeEnter: AuthGuard
    },
    {
      path: "/login/servers",
      name: "LoginServers",
      component: Servers,
      beforeEnter: AuthGuard
    },
    {
      path: "/login/departments",
      name: "LoginDepartments",
      component: Departments,
      beforeEnter: AuthGuard
    },
    {
      path: "/login/characters",
      name: "LoginCharacters",
      component: Characters,
      beforeEnter: AuthGuard
    },
    {
      path: "/login/characters/new",
      name: "LoginCharactersNew",
      component: NewCharacter,
      beforeEnter: AuthGuard
    },
    {
      path: "/login/fire",
      component: LoginFire,
      beforeEnter: AuthGuard
    },
    {
      path: "/cad",
      component: CAD,
      beforeEnter: AuthGuard,
      children: [
        {
          path: "",
          component: CADCalls
        },
        {
          path: "vc",
          component: CADVC
        },
        {
          path: "pc",
          component: CADPC
        },
        {
          path: "pc/:idnumber",
          component: CADCharacter,
          props: true
        },
        {
          path: "radio",
          component: CADRadioCodes
        },
        {
          path: "map",
          component: CADMap
        },
        {
          path: "archived",
          component: CADArchived
        },
        {
          path: "bolos",
          component: CADBolos
        }
      ]
    },
    {
      path: "/civ",
      component: Civ,
      beforeEnter: AuthGuard,
      children: [
        {
          path: "",
          component: CivProfile
        },
        {
          path: "edit",
          component: EditInfo
        },
        {
          path: "dmv",
          component: CivDMV
        }
      ]
    },
    {
      path: "/fire",
      component: Fire,
      beforeEnter: AuthGuard,
      children: [
        {
          path: "",
          component: FireCalls
        },
        {
          path: "units",
          component: Units
        },
        {
          path: "apparatus",
          component: FireApparatus
        }
      ]
    },
    {
      path: "/mdt",
      component: MDT,
      beforeEnter: AuthGuard,
      children: [
        {
          path: "",
          component: MDTCall
        },
        {
          path: "pc",
          component: MDTPC
        },
        {
          path: "pc/:idnumber",
          component: MDTPCCharacter,
          props: true
        },
        {
          path: "vc",
          component: MDTVC
        },
        {
          path: "dept",
          component: MDTChangeDept
        },
        {
          path: "units",
          component: Units
        },
        {
          path: "bolos",
          component: MDTBOLOs
        },
        {
          path: "cases",
          component: MDTCases
        },
        {
          path: "cases/:id",
          component: MDTCase,
          props: true
        }
      ]
    }
  ]
});
