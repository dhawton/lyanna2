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

import CAD from "./components/dispatch/layout";
import CADCalls from "./components/dispatch/calls";
import CADVC from "./components/dispatch/vehiclecheck";
import CADPC from "./components/dispatch/personcheck";
import CADCharacter from "./components/dispatch/character";
import CADRadioCodes from "./components/dispatch/radiocodes";
import CADMap from "./components/dispatch/map";
import CADArchived from "./components/dispatch/components/archivedcalls";
import CADBolos from "./components/dispatch/bolos";

import Civ from "./components/civ/layout";
import CivProfile from "./components/civ/profile";
import EditInfo from "./components/civ/EditInfo";
import CivDMV from "./components/civ/DMV";

import Fire from "./components/fire/layout";
import FireCalls from "./components/fire/call";
import Units from "./components/shared/units";
import FireApparatus from "./components/fire/chgapparatus";

import MDT from "./components/leo/layout";
import MDTCall from "./components/leo/call";
import MDTPC from "./components/leo/personcheck";
import MDTPCCharacter from "./components/leo/character";
import MDTVC from "./components/leo/vehiclecheck";
import MDTChangeDept from "./components/leo/chgdept";
import MDTBOLOs from "./components/leo/bolos";
import MDTCases from "./components/leo/cases";
import MDTCase from "./components/leo/viewcase";

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
      component: Logout
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
