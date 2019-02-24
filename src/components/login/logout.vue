<template>
  <div/>
</template>

<script>
export default {
  name: "Logout",
  created() {
    window.localStorage.setItem("t", "");
    window.localStorage.setItem("te", "");
    this.$store.commit('loggedIn', false);
    this.$router.push("/login");
  }
}
</script>
