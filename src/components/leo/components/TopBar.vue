<template>
  <b-navbar
    dark
    class="bg-green flex-md-nowrap p-0"
    type="dark"
    fixed="top"
    v-if="signon !== undefined"
  >
    <b-navbar-brand
      to="/"
      class="pl-1"
    >Lyanna MDT - {{ server.name }} - {{ signon.session_identifier }} {{ signon.session_name }}</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#" class="pr-1">{{ currentTime }}</b-nav-item>
      <b-nav-item to="/logout">Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
  <b-navbar dark class="bg-green flex-md-nowrap p-0" type="dark" fixed="top" v-else>
    <b-navbar-brand to="/" class="pl-1">Lyanna MDT - {{ server.name }} - loading...</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#" class="pr-1">{{ currentTime }}</b-nav-item>
      <b-nav-item to="/logout">Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TopBar",
  data() {
    return {
      currentTime: "",
      timerCurrentTime: undefined
    };
  },
  computed: {
    ...mapGetters(["server", "character", "signon"])
  },
  created() {
    this.updateTime();
    this.timerCurrentTime = setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString([], {
        timeZone: "America/Anchorage",
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timerCurrentTime);
  }
};
</script>

<style lang="scss" scoped>
.bg-green {
  background-color: rgb(0, 0, 40);
}
.navbar-dark .navbar-nav .nav-link {
  color: white;
}
.navbar-dark .navbar-nav .nav-link:hover {
  color: white;
}
</style>
