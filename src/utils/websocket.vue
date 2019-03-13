<template>
  <div></div>
</template>

<script>
import { EventBus } from "@/EventBus";

export default {
  name: "WebSocket",
  data() {
    return {
      channels: []
    };
  },
  mounted() {
    EventBus.$on("bind-server", msg => {
      console.log(`Trying to mount server ${msg}`);
      const channel = this.$pusher.subscribe(`server${msg}`);
      // Bind events to channel
      channel.bind("ChangeUnit", e => {
        e.id = parseInt(e.id, 10);
        if (this.$store.getters.signon.id === e.id) {
          console.log("Should be changing my status...");
          this.$store.commit("signon", {
            session_identifier: e.session_identifier,
            status: e.status
          });
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
    });
  }
};
</script>

<style scoped>
</style>
