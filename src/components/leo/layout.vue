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
            <h1 class="h2" id="mainheader">{{ agencyLongNames[department.role] }}</h1>
          </div>

          <router-view></router-view>
        </b-col>

        <RightBar/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import TopBar from "./components/TopBar";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import { mapGetters } from "vuex";
import { agencyLongNames } from "@/utils/commondata";

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
    this.darkMode = window.localStorage.getItem("darkMode") || true;
    this.buildWS();
  },
  beforeDestroy() {
    this.$pusher.unsubscribe(`server${ this.server.id }`);
    // We should do other cleanup here...
  },
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      window.localStorage.setItem("darkMode", this.darkMode);
    },
    buildWS() {
      // Subscribe to WS channel
      const channel = this.$pusher.subscribe(`server${this.server.id}`);
      // Bind events to channel
      channel.bind("ChangeUnit", (e) => {
        if (this.signon.id === e.id) {
          this.$store.commit("signon", {
            session_identifier: e.session_identifier,
            status: e.status
          });
          this.$store.commit("department", e.dept);
        }
      });
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
