<template>
  <div>
    <CheckToken></CheckToken>
    <router-view/>
    <UpdateBar/>
    <WebSocket/>
    <SoundHandler/>
  </div>
</template>

<script>
import CheckToken from "./utils/token";
import UpdateBar from "./components/shared/UpdateBar";
import WebSocket from "./utils/websocket";
import SoundHandler from "./soundhandler";

export default {
  name: "App",
  components: {
    CheckToken,
    UpdateBar,
    WebSocket,
    SoundHandler
  },
  data() {
    return {
      updateChannel: undefined
    };
  },
  created() {
    this.updateChannel = this.$pusher.subscribe("updates");
    this.updateChannel.bind("Updated", () => this.$store.commit("update", true));
  }
};
</script>

<style>
html,
body {
  height: 100%;
  font-family: "Roboto Slab" !important;
}
body.login {
  background-image: url("./assets/lyanna-bg.jpg");
}
.bg-dark-grey {
  background-color: rgb(10, 10, 10);
  color: white;
}
.btn-darkblue {
  background-color: rgb(0, 0, 40);
  color: #fff;
  border: 1px solid rgb(0, 0, 255);
}
.btn-darkblue:hover {
  background-color: rgb(0, 0, 100);
  color: #fff;
}
.hover-pointer-cursor {
  cursor: pointer;
}
[role="main"] {
  padding-top: 133px; /* Space for fixed navbar */
}

@media (min-width: 768px) {
  [role="main"] {
    padding-top: 48px; /* Space for fixed navbar */
  }
}
.small-select {
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.375rem 0.375rem 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  vertical-align: middle;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
