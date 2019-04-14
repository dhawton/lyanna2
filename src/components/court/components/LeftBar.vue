<template>
  <b-col md="1" class="bg-green sidebar">
    <div class="sidebar-sticky">
      <b-nav vertical>
        <b-nav-item to="/court" class="purewhite">Cases</b-nav-item>
        <b-nav-item to="/court/pc" class="purewhite">Person Check</b-nav-item>
        <b-nav-item to="/court/vc" class="purewhite">Vehicle Check</b-nav-item>
      </b-nav>
    </div>
  </b-col>
</template>

<script>
export default {
  name: "LeftBar"
};
</script>

<style lang="scss" scoped>
.bg-green {
  background-color: #0f204b;
}
.navbar-dark .navbar-nav .nav-link {
  color: #ffb612;
}
.navbar-dark .navbar-nav .nav-link:hover {
  color: #ffb612;
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
  color: #ffb612 !important;
}
</style>
