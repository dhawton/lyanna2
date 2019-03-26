<template>
  <b-col md="1" class="bg-green sidebar">
    <div class="sidebar-sticky">
      <b-nav vertical>
        <b-nav-item to="/mdt" class="purewhite">Call Info</b-nav-item>
        <b-nav-item to="/mdt/bolos" class="purewhite">BOLOs</b-nav-item>
        <b-nav-item
          to="/mdt/cases"
          class="purewhite"
          v-if="this.$store.getters.department.role === 'intel'"
        >Cases</b-nav-item>
        <b-nav-item to="/mdt/pc" class="purewhite">Person Check</b-nav-item>
        <b-nav-item to="/mdt/vc" class="purewhite">Vehicle Check</b-nav-item>
        <b-nav-item to="/mdt/units" class="purewhite">Active Units</b-nav-item>
        <b-nav-item to="/mdt/dept" class="purewhite">Change Dept</b-nav-item>
        <b-nav-item to="/login/characters" class="purewhite">Change Character</b-nav-item>
      </b-nav>
    </div>
  </b-col>
</template>

<script>
export default {
  name: "LeftBar",
  methods: {
    changeCharacter() {
      // Soon... need to signoff current character and then redirect to /login/characters
      // and update store information
    }
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
.sidebar {
  /*z-index: 100;  Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
}
.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}
.purewhite a {
  color: #ffffff !important;
}
</style>
