<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";
import { REFRESH_TOKEN, PING } from "../store/queries/user";

export default {
  name: "TokenChecker",
  methods: {
    checkToken() {
      if (!this.$store.getters.isLoggedIn) {
        return;
      }
      if (typeof this.signon === "object" && this.signon.id !== undefined) {
        this.ping();
      }
      if (
        window.localStorage.getItem("t") === null ||
        window.localStorage.getItem("te") === null ||
        Math.floor(new Date().getTime() / 1000) >
          window.localStorage.getItem("te")
      ) {
        this.$router.push({ path: "/login" });
        return;
      }

      if (
        Math.floor(new Date().getTime() / 1000) >=
        window.localStorage.getItem("te") - 600
      ) {
        this.refreshToken();
      }
    },
    refreshToken() {
      this.$apollo
        .query({
          query: REFRESH_TOKEN
        })
        .then(r => {
          window.localStorage.setItem("t", r.data.RefreshToken.token);
          window.localStorage.setItem("te", r.data.RefreshToken.expiresAt);
        })
        .catch(() => {
          this.$router.push({ path: "/login" });
        });
    },
    ping() {
      this.$apollo.mutate({
        mutation: PING,
        variables: { id: this.signon.identifier }
      });
    }
  },
  created() {
    setInterval(this.checkToken, 60000);
  },
  computed: {
    ...mapGetters(["signon"])
  }
};
</script>
