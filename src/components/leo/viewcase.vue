<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title-link-class="titlegray" title="Case Notes" active>
        <CaseNotes :id="id"/>
      </b-tab>
      <b-tab title-link-class="titlegray" title="Suspects" :key="reloadKey">
        <b-tabs content-class="mt-2">
          <b-tab title-link-class="titlegray" ref="suspectlist" title="Suspects">
            <b-row v-for="s in lcase.suspects" :key="s.id">
              <b-col md="12" @click="selectSuspect(s)">
                <License :character="s.character" :documents="s.character.documents"/>
              </b-col>
            </b-row>
          </b-tab>
          <b-tab
            title-link-class="titlegray"
            ref="suspecttab"
            :disabled="suspect === undefined"
            :active="suspect !== undefined"
          >
            <template slot="title">
              <b-spinner type="border" small v-if="fetchingSuspect"/>Suspect Info
            </template>
            <div v-if="suspect !== undefined">
              <License :character="suspect.character" :documents="documents"/>
              <b-tabs content-class="mt-3">
                <b-tab title-link-class="titlegray" title="Record" active>
                  <Record :items="documents"/>
                </b-tab>
                <b-tab title-link-class="titlegray" title="New Document">
                  <Document
                    :character="suspect.character"
                    :documents="documents"
                    v-on:has-issued="issuedDocument"
                  />
                </b-tab>
                <b-tab title-link-class="titlegray" title="Vehicles">
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
                <template slot="tabs">
                  <b-button
                    class="nav-item"
                    variant="danger"
                    @click="removeSuspect(suspect.id)"
                  >Remove Suspect</b-button>
                </template>
              </b-tabs>
            </div>
          </b-tab>
          <b-tab title-link-class="titlegray" title="Add Suspect">
            <PersonCheck v-on:character-select="addSuspect"/>
          </b-tab>
        </b-tabs>
      </b-tab>
    </b-tabs>
    <b-modal
      id="deletemodal"
      v-model="showConfirm"
      @ok="confirmDelete"
      ok-title="Confirm"
      ok-variant="danger"
    >
      <div class="d-block black">Are you sure you wish to remove this suspect from the case?</div>
    </b-modal>
  </div>
</template>

<script>
import CaseNotes from "./components/casenotes";
import License from "@/components/shared/License";
import Record from "@/components/shared/Record";
import PersonCheck from "./components/personcheck";
import Document from "./components/document";
import { EDIT_CASE_SUSPECTS, GET_CASE } from "@/store/queries/cases";
import { GET_CHARACTER_DOCUMENTS } from "@/store/queries/legal";
import { GET_CHARACTER_VEHICLES } from "@/store/queries/civ";

export default {
  name: "LCase",
  components: {
    CaseNotes,
    License,
    Record,
    PersonCheck,
    Document
  },
  data() {
    return {
      selectedSuspect: 0,
      showConfirm: false,
      suspect: undefined,
      documents: undefined,
      fetchingSuspect: false,
      vehicles: undefined,
      suspectstab: 0,
      reloadKey: 0
    };
  },
  props: ["id"],
  computed: {
    lcase: {
      get() {
        return this.$store.getters.cases.find(
          c => c.id === parseInt(this.id, 10)
        );
      }
    }
  },
  methods: {
    selectSuspect(suspect) {
      this.suspect = undefined;
      this.fetchingSuspect = true;
      this.documents = undefined;
      this.vehicles = undefined;
      this.$apollo
        .query({
          query: GET_CHARACTER_DOCUMENTS,
          variables: {
            id: suspect.character.id
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
          this.fetchingSuspect = false;
          this.suspect = suspect;
          this.$refs.suspecttab.activate();
        });
      this.$apollo
        .query({
          query: GET_CHARACTER_VEHICLES,
          variables: {
            id: suspect.character.id
          }
        })
        .then(r => {
          this.vehicles = r.data.Character.vehicles;
        });
    },
    removeSuspect(id) {
      this.selectedSuspect = id;
      this.showConfirm = true;
    },
    hideModal() {
      this.showConfirm = false;
      this.selectedSuspect = 0;
    },
    confirmDelete() {
      this.showConfirm = false;
      this.fetchingSuspect = true;
      this.$apollo
        .mutate({
          mutation: EDIT_CASE_SUSPECTS,
          variables: {
            id: this.selectedSuspect,
            case_id: this.lcase.id,
            status: "remove"
          }
        })
        .then(() => {
          this.selectedSuspect = 0;
          this.suspect = undefined;
          this.documents = undefined;
          this.vehicles = undefined;
          this.fetchingSuspect = false;
        });
    },
    issuedDocument() {
      this.$apollo
        .query({
          query: GET_CASE,
          variables: {
            id: this.lcase.id
          }
        })
        .then(r => {
          r.data.case.id = parseInt(r.data.case.id, 10);
          this.$store.commit("case", r.data.case);
          this.reloadKey += 1;
          this.selectedSuspect = 0;
          this.suspect = undefined;
          this.documents = undefined;
          this.vehicles = undefined;
          this.fetchingSuspect = false;
        });
    },
    addSuspect(character) {
      this.fetchingSuspect = true;
      this.$apollo
        .mutate({
          mutation: EDIT_CASE_SUSPECTS,
          variables: {
            case_id: this.lcase.id,
            character_id: character.id,
            idnumber: character.idnumber,
            status: "add"
          }
        })
        .then(() => {
          this.selectedSuspect = 0;
          this.suspect = undefined;
          this.documents = undefined;
          this.vehicles = undefined;
          this.fetchingSuspect = false;
          this.$refs.suspectlist.activate();
        });
    }
  }
};
</script>

<style scoped>
.black {
  color: #000;
}
td,
th,
.table {
  color: #fff !important;
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
