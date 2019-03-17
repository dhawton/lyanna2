<template>
  <div></div>
</template>

<script>
import { EventBus } from "@/EventBus";

export default {
  name: "SoundHandler",
  data() {
    return {
      login: null,
      assign: null,
      unassign: null,
      priority: null,
      tone: null,
      phone: null,
      heldInterval: undefined
    };
  },
  created() {
    this.login = this.loadAudio("/sounds/login.ogg");
    this.assign = this.loadAudio("/sounds/notify.wav"); // Call Assign
    this.unassign = this.loadAudio("/sounds/unassign.wav"); // Call Unassigned
    this.priority = this.loadAudio("/sounds/pri.wav"); // Priority tones
    this.tone = this.loadAudio("/sounds/tone.mp3");
    this.phone = this.loadAudio("/sounds/ring.mp3");
    this.bolo = this.loadAudio("/sounds/bolo.mp3");

    EventBus.$on("channel-held", msg => {
      if (msg && this.heldInterval === undefined) {
        const { priority, tone } = this;
        priority.play();
        setTimeout(() => tone.play(), 2000);
        this.heldInterval = setInterval(() => tone.play(), 10000);
      } else if (!msg) {
        clearInterval(this.heldInterval);
        this.heldInterval = undefined;
      }
      this.$store.commit("channelHeld", msg);
    });
    EventBus.$on("login-sound", () => {
      const { login } = this;
      login.volume = 0.5;
      login.play();
    });
    EventBus.$on("call-assigned", () => {
      const { assign } = this;
      assign.volume = 0.5;
      assign.play();
    });
    EventBus.$on("call-cleared", () => {
      const { unassign } = this;
      unassign.volume = 0.5;
      unassign.play();
    });
    EventBus.$on("ecall", h => {
      if (h) {
        const { phone } = this;
        phone.volume = 0.5;
        phone.play();
      }
    });
    EventBus.$on("new-bolo", () => {
      const { bolo } = this;
      bolo.volume = 0.5;
      bolo.play();
    });
  },
  methods: {
    loadAudio: snd => {
      const audio = new Audio();
      audio.src = snd;
      audio.preload = "auto";
      audio.volume = 0.2;
      return audio;
    }
  }
};
</script>

<style>
</style>
