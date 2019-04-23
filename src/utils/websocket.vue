<template>
  <div></div>
</template>

<script>
import { EventBus } from "@/EventBus";
import { GET_CASE } from "@/store/queries/cases";

export default {
  name: "WebSocket",
  data() {
    return {
      channels: []
    };
  },
  mounted() {
    EventBus.$on("bind-cases", () => {
      const channel = this.$pusher.subscribe("cases");
      this.$store.commit("ws", { cases: channel });
      channel.bind("LCase", e => {
        this.$apollo
          .query({
            query: GET_CASE,
            variables: {
              id: e.lcase.id
            }
          })
          .then(r => {
            r.data.case.id = parseInt(r.data.case.id, 10);
            this.$store.commit("case", r.data.case);
          });
      });
    });
    EventBus.$on("bind-server", msg => {
      const channel = this.$pusher.subscribe(`server${msg}`);
      this.$store.commit("ws", { server: channel });
      // Bind events to channel
      channel.bind("Map", e => {
        this.$store.commit("mapPlayers", JSON.parse(e.playerobject));
      });
      channel.bind("ChangeUnit", e => {
        e.id = parseInt(e.id, 10);
        if (this.$store.getters.signon.id === parseInt(e.id, 10)) {
          this.$store.commit("signon", {
            session_identifier: e.session_identifier,
            status: e.status
          });
          if (e.dept.role !== this.$store.getters.department.role) {
            // Department has changed...
            if (
              ["police", "highway", "sheriff", "intel"].includes(e.dept.role) &&
              !["police", "highway", "sheriff", "intel"].includes(
                this.$store.department.role
              )
            ) {
              // they logged in as leo elsewhere
              this.$store.commit("department", e.dept);
              this.$store.commit("unit", e);
              this.$router.push({ path: "/mdt" });
              return;
            }
            if (
              e.dept.role === "dispatch" &&
              this.$store.department.role !== "dispatch"
            ) {
              // they logged in as dispatch elsewhere
              this.$store.commit("department", e.dept);
              this.$store.commit("unit", e);
              this.$router.push({ path: "/cad" });
              return;
            }
            if (
              e.dept.role === "civ" &&
              this.$store.department.role !== "civ"
            ) {
              // they logged in as civ elsewhere
              this.$store.commit("department", e.dept);
              this.$store.commit("unit", e);
              this.$router.push({ path: "/civ" });
              return;
            }
            if (
              e.dept.role === "fire" &&
              this.$store.department.role !== "fire"
            ) {
              // they logged in as dispatch elsewhere
              this.$store.commit("department", e.dept);
              this.$store.commit("unit", e);
              this.$router.push({ path: "/fire" });
              return;
            }
          }
          this.$store.commit("department", e.dept);
        }
        this.$store.commit("unit", e);
      });
      channel.bind("SignOn", e => {
        e.dept = e.department;
        e.id = parseInt(e.id, 10);
        if (e.dept.role !== "civ" && e.dept.role !== "dispatch") {
          this.$store.commit("unit", e);
        }
      });
      channel.bind("SignOff", e => {
        this.$store.commit("removeunit", e.id);
        if (this.$store.getters.signon === undefined) {
          return; /* We haven't finished setting up */
        }
        if (this.$store.getters.signon.id === e.id) {
          // eslint-disable-next-line no-alert
          alert("You have been signed off remotely.");
          this.$router.push({ path: "/logout" });
        }
      });
      channel.bind("ArchiveCall", e => {
        this.$store.commit("removecall", e.call.callnumber);
        if (
          this.$store.getters.assignedCall !== null &&
          this.$store.getters.assignedCall.callnumber === e.call.callnumber
        ) {
          EventBus.$emit("call-cleared");
        }
      });
      channel.bind("ChannelHeld", e => {
        EventBus.$emit("channel-held", e.held);
      });
      channel.bind("NewCall", e => {
        e.call.assigned = JSON.parse(e.call.assigned);
        this.$store.commit("call", e.call);

        if (
          ["police", "highway", "sheriff", "intel"].includes(
            this.$store.getters.department.role
          )
        ) {
          if (
            e.call.assigned.includes(
              this.$store.getters.signon.session_identifier
            )
          ) {
            if (this.$store.getters.assignedCall === null) {
              EventBus.$emit("call-assigned");
            }
            this.$store.commit("assignedCall", e.call);
          } else if (
            this.$store.getters.assignedCall.callnumber === e.call.callnumber
          ) {
            EventBus.$emit("call-cleared");
            this.$store.commit("assignedCall", null);
          }
        }
      });
      channel.bind("EditCall", e => {
        e.call.assigned = JSON.parse(e.call.assigned);
        this.$store.commit("call", e.call);

        if (
          ["police", "highway", "sheriff", "intel"].includes(
            this.$store.getters.department.role
          )
        ) {
          if (
            e.call.assigned.includes(
              this.$store.getters.signon.session_identifier
            )
          ) {
            if (this.$store.getters.assignedCall === null) {
              EventBus.$emit("call-assigned");
            }
            this.$store.commit("assignedCall", e.call);
          } else if (
            this.$store.getters.assignedCall.callnumber === e.call.callnumber
          ) {
            EventBus.$emit("call-cleared");
            this.$store.commit("assignedCall", null);
          }
        }
      });
      channel.bind("BOLO", e => {
        this.$store.commit("bolo", e.bolo);
      });
      channel.bind("ECallPending", () => {
        EventBus.$emit("ecall", true);
      });
      channel.bind("ECallClear", () => {
        EventBus.$emit("ecall", false);
      });
    });
  }
};
</script>

<style scoped>
</style>
