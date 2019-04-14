<template>
  <div>
    <TopBar/>
    <b-container fluid>
      <b-row>
        <LeftBar @toggle-dark="toggleDark"/>

        <b-col role="main" md="11" px="2" class="ml-sm-auto" :class="{ maindark: darkMode }">
          <div
            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
          >
            <h1 class="h2" id="mainheader">San Andreas Court System</h1>
          </div>

          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopBar from "./components/TopBar";
import LeftBar from "./components/LeftBar";
import { agencyLongNames } from "@/utils/commondata";
import { EventBus } from "@/EventBus";
import { GET_LAWS } from "@/store/queries/legal";

export default {
  name: "MDT",
  components: {
    TopBar,
    LeftBar
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
    if (this.$store.getters.laws.length === 0) {
      this.$apollo
        .query({
          query: GET_LAWS
        })
        .then(r => {
          this.$store.commit("laws", r.data.laws);
        });
    }
  },
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      window.localStorage.setItem("darkMode", this.darkMode);
    },
    buildWS() {}
  }
};
</script>

<style lang="scss" scoped>
.maindark {
  background-color: black;
  color: white;
}
</style>
