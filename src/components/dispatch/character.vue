<template>
  <div>
    <b-row v-if="!isLoaded">
      <b-col md="12" class="text-center">
        <b-spinner variant="primary" style="width: 3rem; height: 3rem;"/>
      </b-col>
    </b-row>
    <div v-else>
      <License :documents="this.documents" :character="character"/>
      <b-card no-body>
        <b-tabs content-class="mt-3">
          <b-tab title-link-class="titlecadgray" ref="records" title="Record" active>
            <b-spinner
              variant="primary"
              style="width: 3rem; height: 3rem;"
              v-if="documents === undefined"
            />
            <Record v-else v-bind:items="documents"/>
          </b-tab>
          <b-tab title-link-class="titlecadgray" title="Vehicles">
            <div v-if="this.vehicles === undefined">
              <b-spinner variant="primary" style="width: 3rem; height: 3rem;"/>
            </div>
            <div v-else>
              <table class="table table-small">
                <thead>
                  <tr>
                    <th>License Plate</th>
                    <th>Make, Model, Color</th>
                    <th>Flags</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="car in this.vehicles" :key="car.licenseplate">
                    <td>{{ car.licenseplate }}</td>
                    <td>{{ car.make }} {{ car.model }} - {{ car.color }}</td>
                    <td>
                      <b-button variant="danger" v-if="!car.insurance">No Insurance</b-button>
                      <b-button variant="danger" v-if="car.stolen">Stolen</b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import License from "@/components/shared/License";
import Record from "@/components/shared/Record";
import { SEARCH_CHARACTERS, GET_CHARACTER_VEHICLES } from "@/store/queries/civ";
import { GET_CHARACTER_DOCUMENTS } from "@/store/queries/legal";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isLoaded: false,
      character: undefined,
      documents: undefined,
      updateRecordTimer: undefined,
      updateVehicleTimer: undefined,
      vehicles: undefined
    };
  },
  components: {
    License,
    Record
  },
  computed: {
    ...mapGetters(["leocharacter"])
  },
  name: "CADPCCharacter",
  props: ["idnumber"],
  created() {
    if (
      this.leocharacter !== undefined &&
      this.leocharacter.idnumber === this.idnumber &&
      this.isLoaded !== true
    ) {
      this.isLoaded = true;
      this.character = this.leocharacter;
      this.updateDocuments();
      this.updateVehicles();
    } else {
      // We got a direct query
      this.loadUser(this.idnumber);
    }
    this.updateRecordTimer = setInterval(this.updateDocuments, 5 * 60 * 1000); // Every 5 minutes
    this.updateVehicleTimer = setInterval(this.updateVehicles, 10 * 60 * 1000); // Every 10 minutes
  },
  beforeDestroy() {
    clearInterval(this.updateRecordTimer);
    this.updateRecordTimer = undefined;
    clearInterval(this.updateVehicleTimer);
    this.updateVehicleTimer = undefined;
  },
  methods: {
    loadUser(id) {
      this.$apollo
        .query({
          query: SEARCH_CHARACTERS,
          variables: {
            idnumber: id
          }
        })
        .then(r => {
          this.character = r.data.CharacterSearch;
          this.isLoaded = true;
          this.updateDocuments();
          this.updateVehicles();
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateDocuments() {
      this.$apollo
        .query({
          query: GET_CHARACTER_DOCUMENTS,
          variables: {
            id: this.character.id
          }
        })
        .then(r => {
          const docs = r.data.documentsByCharacter;
          docs.forEach((v, i) => {
            if (!Array.isArray(docs[i].violations)) {
              docs[i].violations = JSON.parse(docs[i].violations);
            }
            docs[i].violations.forEach((v2, i2) => {
              if (typeof vs !== "string") {
                docs[i].violations[i2] = `${v2.code} ${v2.title} [${v2.type}]`;
              }
            });
            docs[i].violationList = docs[i].violations.join("<br/>");
            let dt = new Date(docs[i].created_at).toLocaleString("en-US", {
              timeZone: "America/Chicago",
              hour12: false
            });
            dt = dt.substr(0, dt.length - 3);
            docs[i].created_at = dt.replace(",", "");
          });
          this.documents = docs;
          this.prepared = true;
        })
        .catch(err => {
          console.error(err);
          this.prepared = false;
        });
    },
    updateVehicles() {
      this.$apollo
        .query({
          query: GET_CHARACTER_VEHICLES,
          variables: {
            id: this.character.id
          }
        })
        .then(r => {
          this.vehicles = r.data.Character.vehicles;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="scss">
.titlecadgray {
  background-color: #0a0f28 !important;
  color: rgb(206, 222, 255) !important;
  border-color: rgb(40, 40, 200) !important;
  > .active {
    background-color: rgb(40, 40, 40);
  }
}
.nav-link.active {
  background-color: rgb(40, 40, 100) !important;
}
.active {
  border-color: #fff !important;
}
</style>

<style scoped>
.card {
  background-color: unset;
  color: #fff;
}

>>> .table {
  color: #fff !important;
}
>>> .form-control {
  background-color: unset;
  color: #fff;
}
>>> .form-control:focus {
  background-color: unset;
  color: #fff;
}
>>> .page-item .page-link {
  background-color: rgb(50, 50, 50);
}
>>> .page-item.disabled .page-link {
  background-color: rgb(50, 50, 50);
  color: rgb(200, 200, 200);
}
>>> .page-item.active .page-link {
  background-color: rgb(0, 0, 100);
  color: rgb(200, 200, 200);
  border-color: #fff;
}
</style>
