<template>
  <b-navbar dark class="bg-green flex-md-nowrap p-0" type="dark" fixed="top">
    <b-navbar-brand to="/" class="pl-1">
      Lyanna Civ Portal - {{ server.name }} - {{ me.identifier }} {{ character.firstname }}
      {{ character.lastname }}
    </b-navbar-brand>
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
    ...mapGetters(["server", "me", "character"])
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
  background-color: rgba(40, 0, 40);
}
.navbar-dark .navbar-nav .nav-link {
  color: white;
}
.navbar-dark .navbar-nav .nav-link:hover {
  color: white;
}
</style>
