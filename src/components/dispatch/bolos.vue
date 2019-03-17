<template>
  <div>
    <table class="table table-bordered text-uppercase">
      <tr class="table-info">
        <td colspan="2">BOLOs</td>
      </tr>
      <tr v-if="!showNewBolo">
        <td colspan="2">
          <b-button variant="darkblue" @click="showNewBolo = true">New BOLO</b-button>
        </td>
      </tr>
      <tr v-if="showNewBolo">
        <td colspan="2">
          <b>
            <u>NEW BOLO</u>
          </b>
          <p>
            <b>SUSPECT INFO:</b>
            <textarea class="input-darkblue" v-model="suspectInfo" rows="2"></textarea>
          </p>
          <p>
            <b>VEHICLE INFO:</b>
            <textarea class="input-darkblue" v-model="vehicleInfo" rows="2"></textarea>
          </p>
          <p>
            <b>DETAILS:</b>
            <textarea class="input-darkblue" v-model="details" rows="4"></textarea>
            <b-button variant="darkblue" v-if="!isCreating" @click="createBOLO()">Create</b-button>
            <b-button variant="darkblue" v-else>
              <b-spinner/>
            </b-button>
            <b-button
              variant="darkred"
              @click="showNewBolo = false"
              style="margin-left: 5rem;"
            >Cancel</b-button>
          </p>
        </td>
      </tr>
      <tr v-if="showEditBolo">
        <td colspan="2">
          <b>
            <u>EDIT BOLO</u>
          </b>
          <p>
            <b>SUSPECT INFO:</b>
            <textarea class="input-darkblue" v-model="editBoloSuspectInfo" rows="2"></textarea>
          </p>
          <p>
            <b>VEHICLE INFO:</b>
            <textarea class="input-darkblue" v-model="editBoloVehicleInfo" rows="2"></textarea>
          </p>
          <p>
            <b>DETAILS:</b>
            <textarea class="input-darkblue" v-model="editBoloDetails" rows="4"></textarea>
            <b-button variant="darkblue" @click="editBolo" v-if="!isEditing">Save</b-button>
            <b-button variant="darkblue" v-else>
              <b-spinner/>
            </b-button>
            <b-button
              variant="darkred"
              @click="showEditBolo = false"
              style="margin-left: 5rem;"
            >Cancel</b-button>
          </p>
        </td>
      </tr>
      <tr v-if="bolos.length===0">
        <td colspan="2">No active BOLOs.</td>
      </tr>
      <tr v-for="bolo in bolos" :key="bolo.id">
        <td colspan="2">
          <b>
            <u>BOLO</u>
            ISSUED ON {{ bolo.created_at.substring(5, 16).replace("T", " AT ").replace("-", "/") }}
            <b-button
              style="float: right;"
              variant="darkred"
              @click="clearBOLO(bolo.id)"
              v-if="!isClearing"
            >Clear</b-button>
            <b-button variant="darkred" style="float:right;" v-else>
              <b-spinner/>
            </b-button>
            <b-button
              style="float: right; margin-right: 3rem;"
              variant="darkyellow"
              @click="doEditBOLO(bolo)"
            >Edit</b-button>
          </b>
          <p v-if="bolo.person_info !== null">
            <b>SUSPECT INFO:</b>
            {{ bolo.person_info }}
          </p>
          <p v-if="bolo.vehicle_info !== null">
            <b>VEHICLE INFO:</b>
            {{ bolo.vehicle_info }}
          </p>
          <p>
            <b>DETAILS:</b>
            {{ bolo.details }}
            <br>
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { EDIT_BOLO, CREATE_BOLO } from "@/store/queries/misc";

export default {
  name: "CADBOLOs",
  data() {
    return {
      showNewBolo: false,
      showEditBolo: false,
      isEditing: false,
      isCreating: false,
      isClearing: false,
      editBoloId: false,
      editBoloSuspectInfo: null,
      editBoloVehicleInfo: null,
      editBoloDetails: null
    };
  },
  computed: {
    ...mapGetters(["bolos"]),
    suspectInfo: {
      get() {
        return this.$store.getters.forms.bolo.suspect_info;
      },
      set(value) {
        this.$store.commit("formbolo", {
          suspect_info: value !== null ? value.toUpperCase() : null
        });
      }
    },
    vehicleInfo: {
      get() {
        return this.$store.getters.forms.bolo.vehicle_info;
      },
      set(value) {
        this.$store.commit("formbolo", {
          vehicle_info: value !== null ? value.toUpperCase() : null
        });
      }
    },
    details: {
      get() {
        return this.$store.getters.forms.bolo.details;
      },
      set(value) {
        this.$store.commit("formbolo", {
          details: value !== null ? value.toUpperCase() : null
        });
      }
    }
  },
  methods: {
    doEditBOLO(bolo) {
      this.editBoloSuspectInfo = bolo.person_info;
      this.editBoloVehicleInfo = bolo.vehicle_info;
      this.editBoloDetails = bolo.details;
      this.editBoloId = bolo.id;
      this.showEditBolo = true;
    },
    createBOLO() {
      this.isCreating = true;
      this.$apollo
        .mutate({
          mutation: CREATE_BOLO,
          variables: {
            server_id: this.$store.getters.server.id,
            person_info: this.suspectInfo,
            vehicle_info: this.vehicleInfo,
            details: this.details,
            status: "live"
          }
        })
        .then(() => {
          this.suspectInfo = null;
          this.vehicleInfo = null;
          this.details = null;
          this.showNewBolo = false;
          this.isCreating = false;
        });
    },
    clearBOLO(id) {
      this.isClearing = true;
      this.$apollo
        .mutate({
          mutation: EDIT_BOLO,
          variables: {
            id,
            status: "archived"
          }
        })
        .then(() => {
          this.isClearing = false;
        });
    },
    editBolo() {
      this.isEditing = true;
      this.$apollo
        .mutate({
          mutation: EDIT_BOLO,
          variables: {
            id: this.editBoloId,
            person_info: this.editBoloSuspectInfo,
            vehicle_info: this.editBoloVehicleInfo,
            details: this.editBoloDetails
          }
        })
        .then(() => {
          this.isEditing = false;
          this.editBoloId = null;
          this.editBoloSuspectInfo = null;
          this.editBoloVehicleInfo = null;
          this.editBoloDetails = null;
          this.showEditBolo = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-darkblue {
  background-color: rgb(0, 0, 40);
  color: #fff;
  border: 1px solid rgb(0, 0, 255);
}
.btn-darkblue:hover {
  background-color: rgb(0, 0, 100);
  color: #fff;
}
.btn-darkred {
  background-color: rgb(50, 0, 0);
  color: #fff;
  border: 1px solid rgb(255, 0, 0);
}
.btn-darkred:hover {
  background-color: rgb(200, 0, 0);
  color: #fff;
}
.btn-darkyellow {
  background-color: rgb(50, 50, 0);
  color: #fff;
  border: 1px solid rgb(255, 255, 0);
}
.btn-darkyellow:hover {
  background-color: rgb(187, 200, 0);
  color: #000;
}
table td {
  color: #fff;
}
.table-info td {
  background-color: rgb(0, 0, 100);
  border: 1px solid white;
}
.table-border-teal tr td,
.table-border-teal tr th {
  border: 1px solid rgb(0, 45, 112) !important;
  color: rgb(206, 222, 255);
}
.border-teal-input {
  border: 1px solid rgb(0, 0, 150);
}

.bg-dispatch {
  background-color: #001743 !important;
  color: #00a0dd;
}
.input-darkblue {
  background-color: rgb(0, 0, 40);
  color: #fff;
  border: 1px solid rgb(0, 0, 150);
  width: 100%;
}
</style>
