<template>
  <div/>
</template>

<script>
import { SIGNOFF } from "@/store/queries/user";

export default {
  name: "Logout",
  created() {
    if (
      !["civ", "fire"].includes(this.$store.getters.department.role) &&
      this.$store.getters.signon !== undefined
    ) {
      this.$apollo
        .mutate({
          mutation: SIGNOFF,
          variables: {
            id: this.$store.getters.signon.id
          }
        })
        .then(() => {
          window.localStorage.setItem("t", "");
          window.localStorage.setItem("te", "");
          this.$store.commit("loggedIn", false);
          this.$router.go("/"); // Reset state and websockets
        });
    } else {
      window.localStorage.setItem("t", "");
      window.localStorage.setItem("te", "");
      this.$store.commit("loggedIn", false);
      this.$router.go("/"); // Reset state and websockets
    }
  }
};
</script>
