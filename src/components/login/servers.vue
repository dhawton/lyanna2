<template>
  <b-container fluid class="fill">
    <b-row class="justify-content-center vertical-center">
      <b-col col md="4">
        <div style="width: 100%; text-align: center">
          <h2 style="color: white;">Island Life Role Play</h2>
          <!-- <b-img src="../../assets/logo.png" style="width: 200px;" class="pb-2"/> -->
        </div>
        <b-card header="Select Server">
          <div v-if="!prepared" class="text-center">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner" />
          </div>
          <div v-else-if="prepared">
            <div v-for="server in servers" :key="server.id" style="margin-bottom: -5px;">
              <b-button block variant="black" dark @click="selectServer(server)">
                {{
                server.name
                }}
              </b-button>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <div
      style="border: 1px solid black; border-radius: 99px; position: absolute; width: 200px; bottom: 5px; right: 5px;"
    >
      <img src="../../assets/logo.png" style="width: 198px;" />
    </div>
  </b-container>
</template>

<script>
import { GET_SERVERS } from "../../store/queries/misc";

export default {
  name: "Servers",
  beforeCreate() {
    document.body.className = "login";
  },
  data() {
    return {
      prepared: false,
      servers: []
    };
  },
  created() {
    this.$apollo
      .query({
        query: GET_SERVERS
      })
      .then(r => {
        this.servers = r.data.servers;
        this.prepared = true;
      })
      .catch(err => console.error(err));
  },
  methods: {
    clearError() {
      this.error = undefined;
    },
    selectServer(server) {
      this.$store.commit("server", server);
      this.$router.push("/login/departments");
    }
  }
};
</script>

<style scoped>
h1 {
  color: red;
}
.fill {
  min-height: 100%;
  height: 100%;
}
.vertical-center {
  min-height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.card-header {
  background-color: rgb(40, 44, 44);
  color: white;
}
.card {
  border: 0;
  background-color: rgba(255, 255, 255, 0.85);
}
.card-body {
  color: black;
}

.btn-black {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  margin-bottom: 1rem;
}

.btn-black:hover {
  background-color: rgba(10, 10, 10, 0.8);
  color: lightgray;
  margin-bottom: 1rem;
}

.btn-gray {
  background-color: rgba(40, 40, 40, 0.8);
  color: white;
}
</style>
