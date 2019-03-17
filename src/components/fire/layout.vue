<template>
  <div>
    <TopBar/>
    <b-container fluid>
      <b-row>
        <LeftBar @toggle-dark="toggleDark"/>

        <b-col role="main" md="10" px="4" class="ml-sm-auto" :class="{ maindark: darkMode }">
          <div
            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
          >
            <h1 class="h2" id="mainheader">San Andreas Fire Department</h1>
          </div>

          <router-view></router-view>
        </b-col>

        <RightBar/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopBar from "./components/TopBar";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import { agencyLongNames } from "@/utils/commondata";
import { EventBus } from "@/EventBus";
import { GET_SERVER_CALLS_USERS } from "@/store/queries/misc";

export default {
  name: "MDT",
  components: {
    TopBar,
    LeftBar,
    RightBar
  },
  data() {
    return {
      agencyLongNames,
      darkMode: true
    };
  },
  computed: {
    ...mapGetters(["department", "server", "signon"])
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
            this.$store.commit("fillunits", r.data.server.signedons);
            this.$store.commit("fillcalls", r.data.server.calls);
            EventBus.$emit("channel-held", r.data.server.channel_held);
          });
      }, 5000);
    }
  },
  beforeDestroy() {},
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      window.localStorage.setItem("darkMode", this.darkMode);
    },
    buildWS() {
      EventBus.$emit("bind-cases");
      EventBus.$emit("bind-server", this.server.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.maindark {
  background-color: black;
  color: white;
}
</style>
