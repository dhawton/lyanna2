<template>
  <b-col md="1" class="bg-green sidebar">
    <div class="sidebar-sticky">
      <b-nav vertical>
        <b-nav-item to="/civ" class="purewhite">
          Profile
        </b-nav-item>
        <b-nav-item to="/civ/dmv" class="purewhite">
          DMV
        </b-nav-item>
        <b-nav-item to="/login/characters" class="purewhite">
          Switch Character
        </b-nav-item>
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
  background-color: rgb(0,30,0);
}
.navbar-dark .navbar-nav .nav-link { color: white; }
.navbar-dark .navbar-nav .nav-link:hover { color: white; }
.sidebar {
    /*z-index: 100;  Behind the navbar */
    padding: 48px 0 0; /* Height of navbar */
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}
.sidebar-sticky {
    position: relative;
    top: 0;
    height: calc(100vh - 48px);
    padding-top: .5rem;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}
.purewhite a { color: #ffffff!important; }
</style>
