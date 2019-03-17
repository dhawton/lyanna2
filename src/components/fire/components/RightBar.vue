<template>
  <b-col md="1" class="bg-green sidebar">
    <div class="sidebar-sticky">
      <b-nav vertical class="flex-column" v-if="signon !== undefined">
        <b-nav-item v-if="channelHeld === true">
          <b-button variant="danger" block>Channel Held</b-button>
        </b-nav-item>
        <b-nav-item class="purewhite text-center">Station
          <br>
          <span class="text-info">{{ $store.getters.fire.station.name }}</span>
        </b-nav-item>
        <b-nav-item class="purewhite text-center">Apparatus
          <br>
          <span class="text-info">{{ $store.getters.fire.id }}</span>
        </b-nav-item>
        <b-nav-item class="purewhite text-center">Radio ID
          <br>
          <span class="text-info">{{ $store.getters.fire.radio }}</span>
        </b-nav-item>
        <b-nav-item class="purewhite text-center">Status
          <br>
          <span class="text-info">{{ signon.status }}</span>
        </b-nav-item>
        <b-nav-item class="pd-0 pt-3">
          <b-button
            v-if="!settingStatus"
            @click="status('Available')"
            class="text-center"
            :variant="signon.status === 'Available' ? 'success' : 'outline-success'"
            block
          >Available</b-button>
          <b-button
            v-else
            disabled
            class="text-center"
            :variant="signon.status === 'Available' ? 'success' : 'outline-success'"
            block
          >
            <b-spinner small/>
          </b-button>
        </b-nav-item>
        <b-nav-item class="pd-0 pt-1">
          <b-button
            v-if="!settingStatus"
            @click="status('Busy')"
            class="text-center"
            :variant="signon.status === 'Busy' ? 'warning' : 'outline-warning'"
            block
          >Busy</b-button>
          <b-button
            v-else
            disabled
            class="text-center"
            :variant="signon.status === 'Busy' ? 'warning' : 'outline-warning'"
            block
          >
            <b-spinner small/>
          </b-button>
        </b-nav-item>
        <b-nav-item class="pd-0 pt-1">
          <b-button
            v-if="!settingStatus"
            @click="status('Out of Service')"
            class="text-center"
            :variant="signon.status === 'Out of Service' ? 'danger' : 'outline-danger'"
            block
          >Out of Service</b-button>
          <b-button
            v-else
            disabled
            class="text-center"
            :variant="signon.status === 'Out of Service' ? 'danger' : 'outline-danger'"
            block
          >
            <b-spinner small/>
          </b-button>
        </b-nav-item>
        <b-nav-item class="pd-0 pt-1">
          <b-button
            v-if="!settingStatus"
            @click="status('En-Route')"
            class="text-center"
            :variant="signon.status === 'En-Route' ? 'primary' : 'outline-primary'"
            block
          >En-Route</b-button>
          <b-button
            v-else
            disabled
            class="text-center"
            :variant="signon.status === 'En-Route' ? 'primary' : 'outline-primary'"
            block
          >
            <b-spinner small/>
          </b-button>
        </b-nav-item>
        <b-nav-item class="pd-0 pt-1">
          <b-button
            v-if="!settingStatus"
            @click="status('On Scene')"
            class="text-center"
            :variant="signon.status === 'On Scene' ? 'light' : 'outline-light'"
            block
          >On Scene</b-button>
          <b-button
            v-else
            disabled
            class="text-center"
            :variant="signon.status === 'On Scene' ? 'light' : 'outline-light'"
            block
          >
            <b-spinner small/>
          </b-button>
        </b-nav-item>
        <b-nav-item class="pd-0 pt-1">
          <b-button @click="status('Panic')" class="text-center" variant="danger" block>Panic</b-button>
        </b-nav-item>
      </b-nav>
      <span v-else>Loading...</span>
    </div>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import { CHANGE_STATUS } from "../../../store/queries/user";

export default {
  name: "RightBar",
  data() {
    return {
      settingStatus: false
    };
  },
  computed: {
    ...mapGetters(["department", "signon", "channelHeld"])
  },
  methods: {
    status(s) {
      this.settingStatus = true;
      this.$apollo
        .mutate({
          mutation: CHANGE_STATUS,
          variables: {
            identifier: this.signon.session_identifier,
            status: s
          }
        })
        .then(() => {
          this.settingStatus = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-green {
  background-color: rgb(30, 0, 0);
}
.navbar-dark .navbar-nav .nav-link {
  color: white;
}
.navbar-dark .navbar-nav .nav-link:hover {
  color: white;
}
.sidebar {
  /*z-index: 100;  Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
}
.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}
.purewhite a {
  color: #ffffff !important;
}
.pd-0 a {
  padding: 0;
}
</style>
