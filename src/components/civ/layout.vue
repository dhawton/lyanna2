<template>
  <div>
    <TopBar/>
    <b-container fluid>
      <b-row>
        <LeftBar/>

        <b-col role="main" md="11" px="4" class="ml-sm-auto">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2" id="mainheader">Civilian Department</h1>
          </div>

          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import TopBar from "./components/TopBar";
import LeftBar from "./components/LeftBar";

export default {
  name: "Civ",
  components: {
    TopBar,
    LeftBar
  },
  beforeCreate() {
    document.body.className = '';
  }
};
</script>

<style lang="scss" scoped>

</style>
