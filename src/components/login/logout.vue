<template>
  <div/>
</template>

<script>
import { SIGNOFF } from "@/store/queries/user";

export default {
  name: "Logout",
  created() {
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
        this.$router.push("/login");
      });
  }
};
</script>
