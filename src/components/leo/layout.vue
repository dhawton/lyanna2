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
import { mapGetters } from "vuex";
import TopBar from "./components/TopBar";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import { agencyLongNames } from "@/utils/commondata";
import { EventBus } from "@/EventBus";

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
    if (this.server !== undefined && this.server !== null) {
      this.buildWS();
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
