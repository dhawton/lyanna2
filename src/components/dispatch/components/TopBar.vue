<template>
  <div class="allupper">
    <b-navbar dark class="bg-dispatch flex-md-nowrap p-0 navbar40" type="dark" fixed="top">
      <b-navbar-brand to="/" class="pl-1">
        Lyanna CAD - {{ server.name }} - {{ me.identifier }} {{ character.firstname }}
        {{ character.lastname }}
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/logout">Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <div class="navbuttondiv">
      <b-row class="navbuttons">
        <b-col md="1" class="navcol">
          <div class="navcolbutton" @click="$router.push({ path: '/cad' })">Calls
            <br>(F2)
          </div>
        </b-col>
        <b-col md="1" class="navcol">
          <div class="navcolbutton" @click="$router.push({ path: '/cad/vc' })">Vehicle Chk
            <br>(F3)
          </div>
        </b-col>
        <b-col md="1" class="navcol">
          <div class="navcolbutton" @click="$router.push({ path: '/cad/pc' })">Person Chk
            <br>(F4)
          </div>
        </b-col>
        <b-col md="1" class="navcol">
          <div class="navcolbutton" @click="$router.push({ path: '/cad/archived' })">Call Archive
            <br>&nbsp;
          </div>
        </b-col>
        <b-col md="1" class="navcol">
          <div class="navcolbutton" @click="$router.push({ path: '/cad/map' })">Map
            <br>&nbsp;
          </div>
        </b-col>
        <b-col md="1" class="navcol" :class="{ flash: priorityStage === true }">
          <div class="navcolbutton" @click="togglePriority">Priority
            <br>(F5)
          </div>
        </b-col>
        <b-col md="1" class="navcol" :class="{ flashCall: callStage === true }">
          <div class="navcolbutton" @click="EventBus.$emit('clear-ecall')">Phone
            <br>(F6)
          </div>
        </b-col>
        <b-col md="1" class="navcol">
          <div class="navcolbutton" @click="$router.push({ path: '/cad/radio' })">Radio Codes
            <br>&nbsp;
          </div>
        </b-col>
        <b-col md="1" class="navcol">
          <div class="navcolbutton" @click="$router.push({ path: '/cad/bolos' })">BOLOs
            <br>(F7)
          </div>
        </b-col>
        <b-col md="3" class="navcolclock">
          <div class="navcolbuttonclock">
            <span class="clock">{{ currentTime }}</span>
            <br>
            Prefix: {{ prefix }}
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { TOGGLE_HOLD } from "@/store/queries/misc";
import { EventBus } from "@/EventBus";

export default {
  name: "TopBar",
  data() {
    return {
      currentTime: "",
      timerCurrentTime: undefined,
      clock: undefined,
      months: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
      prefix: undefined,
      priorityStage: false,
      priorityTimer: undefined,
      callStage: false,
      callTimer: undefined,
      EventBus
    };
  },
  computed: {
    ...mapGetters(["server", "me", "character"])
  },
  created() {
    this.updateTime();
    this.timerCurrentTime = setInterval(this.updateTime, 1000);
    EventBus.$on("channel-held", h => {
      if (!h) {
        clearInterval(this.priorityTimer);
        this.priorityTimer = undefined;
        this.priorityStage = false;
      } else {
        this.priorityStage = true;
        this.priorityTimer = setInterval(() => {
          this.priorityStage = !this.priorityStage;
        }, 1000);
      }
    });
    EventBus.$on("ecall", h => {
      if (!h) {
        clearInterval(this.callTimer);
        this.callTimer = undefined;
        this.callStage = false;
      } else {
        this.callStage = true;
        this.callTimer = setInterval(() => {
          this.callStage = !this.callStage;
        }, 1000);
      }
    });
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString([], {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "numeric",
        hour12: false
      });
      const year = new Date()
        .toLocaleDateString([], {
          timeZone: "America/Chicago",
          year: "numeric"
        })
        .substr(2, 2);
      const month = this.months[new Date().getMonth()].toUpperCase();
      this.prefix = `${year}${month}`;
    },
    togglePriority() {
      this.$apollo.mutate({
        mutation: TOGGLE_HOLD,
        variables: {
          id: this.$store.getters.server.id
        }
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timerCurrentTime);
  }
};
</script>

<style lang="scss">
.allupper {
  text-transform: uppercase;
}
</style>

<style lang="scss" scoped>
.flash {
  background-color: rgb(100, 100, 0);
}
.flashCall {
  background-color: rgb(100, 0, 0);
}
.bg-dispatch {
  background-color: rgb(18, 30, 48);
}
.navbar-dark .navbar-nav .nav-link,
.navbar-brand {
  color: rgb(150, 150, 150) !important;
}
.navbar-dark .navbar-nav .nav-link:hover,
.navbar-brand:hover {
  color: rgb(200, 200, 200) !important;
}
.navbar40 {
  height: 40px;
}
.navbuttondiv {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  height: 125px;
  z-index: 9;
}
.navbuttons {
  height: 125px;
  background-color: rgb(10, 15, 40);
  color: rgb(128, 168, 255);
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 9;
  > .navcol {
    display: table;
    height: 125px;
    text-align: center;
    vertical-align: middle;
    padding-left: 0;
    padding-right: 0;
    & :hover {
      background-color: rgb(20, 35, 100);
      cursor: pointer;
    }
    > .navcolbutton {
      border: 1px solid rgb(0, 45, 112);
      height: 125px;
      vertical-align: middle;
      text-align: center;
      display: table-cell;
    }
  }
  > .navcolclock {
    display: table;
    height: 125px;
    text-align: center;
    vertical-align: middle;
    padding-left: 0;
    padding-right: 0;
    > .navcolbuttonclock {
      border: 1px solid rgb(0, 45, 112);
      height: 125px;
      vertical-align: middle;
      text-align: center;
      display: table-cell;
    }
  }
}
.clock {
  font-size: 2.5rem;
}
</style>
