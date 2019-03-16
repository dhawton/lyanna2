<template>
  <div v-hotkey="keymap">
    <TopBar/>
    <b-container fluid>
      <b-row>
        <b-col
          role="main"
          md="10"
          px="4"
          class="ml-sm-auto fullheight"
          :class="{ maindark: darkMode }"
        >
          <router-view></router-view>
        </b-col>
        <b-col
          role="main"
          md="2"
          px="4"
          class="ml-sm-auto fullheight"
          :class="{ maindark: darkMode }"
        >
          <Units/>
        </b-col>
      </b-row>
    </b-container>
    <ConsoleInterpreter/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopBar from "./components/TopBar";
import Units from "./components/units";
import ConsoleInterpreter from "@/ConsoleInterpreter";
import { agencyLongNames } from "@/utils/commondata";
import { EventBus } from "@/EventBus";
import {
  GET_BOLOS,
  GET_SERVER_CALLS_USERS,
  TOGGLE_HOLD
} from "@/store/queries/misc";

export default {
  name: "MDT",
  components: {
    TopBar,
    Units,
    ConsoleInterpreter
  },
  data() {
    return {
      agencyLongNames,
      darkMode: true
    };
  },
  computed: {
    ...mapGetters(["department", "server", "signon"]),
    keymap() {
      return {
        F1: this.handleKey,
        F2: this.handleKey,
        F5: this.handleKey
      };
    }
  },
  beforeCreate() {
    document.body.className = "dark";
  },
  created() {
    EventBus.$emit("login-sound");
    this.darkMode = window.localStorage.getItem("darkMode") || true;
    if (this.server !== undefined && this.server !== null) {
      this.buildWS();
    }
    if (this.$store.getters.units.length === 0) {
      // API needs to settle for a couple seconds
      this.$store.commit("dispatchInitial", true);
      setTimeout(() => {
        this.$apollo
          .query({
            query: GET_SERVER_CALLS_USERS,
            variables: {
              id: this.server.id
            }
          })
          .then(r => {
            r.data.server.signedons.forEach((v, i) => {
              r.data.server.signedons[i].id = parseInt(
                r.data.server.signedons[i].id,
                10
              );
              r.data.server.signedons[i].dept = {
                ...r.data.server.signedons[i].department
              };
              r.data.server.signedons[i].department = undefined;
            });
            r.data.server.signedons = r.data.server.signedons.filter(
              u => u.dept.role !== "civ" && u.dept.role !== "dispatch"
            );
            r.data.server.calls.forEach((v, i) => {
              r.data.server.calls[i].assigned = JSON.parse(
                r.data.server.calls[i].assigned
              );
            });
            this.$store.commit("fillunits", r.data.server.signedons);
            this.$store.commit("fillcalls", r.data.server.calls);
            EventBus.$emit("channel-held", r.data.server.channel_held);
            this.$store.commit("dispatchInitial", false);
          });
      }, 5000);
    }
    if (this.$store.getters.bolos.length === 0) {
      this.$apollo
        .query({
          query: GET_BOLOS,
          variables: {
            server_id: this.server.id
          }
        })
        .then(r => {
          r.data.BOLOs = r.data.BOLOs.filter(b => b.status === "live");
          r.data.BOLOs.forEach((v, i) => {
            r.data.BOLOs[i].id = parseInt(v.id, 10);
          });
          this.$store.commit("bolos", r.data.BOLOs);
        });
    }
  },
  beforeDestroy() {
    this.$pusher.unsubscribe(`server${this.server.id}`);
    // We should do other cleanup here...
  },
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      window.localStorage.setItem("darkMode", this.darkMode);
    },
    buildWS() {
      EventBus.$emit("bind-cases");
      EventBus.$emit("bind-server", this.server.id);
    },
    handleKey(e) {
      e.preventDefault();
      if (e.code === "F1") {
        if (this.$router.currentRoute.path === "/cad") {
          EventBus.$emit("focus-console");
        }
      }
      if (e.code === "F2") {
        if (this.$router.currentRoute.path === "/cad") {
          EventBus.$emit("focus-new-call");
        } else {
          this.$router.push({ path: "/cad" });
        }
      }
      if (e.code === "F5") {
        console.log("Caught F5");
        this.$apollo.mutate({
          mutation: TOGGLE_HOLD,
          variables: {
            id: this.$store.getters.server.id
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.maindark {
  background-color: rgb(10, 15, 40);
  color: rgb(128, 168, 255);
}
.fullheight {
  position: relative;
  top: 0;
  height: calc(100vh);
  padding-top: 165px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
