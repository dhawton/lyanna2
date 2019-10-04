<template>
  <div>
    <table class="table table-bordered table-sm col-md-8 offset-md-2">
      <tr>
        <td rowspan="2" class="bg-red" style="width: 10px;"></td>
        <td>
          Type:
          <select v-model="type">
            <option>Warning</option>
            <option>Citation</option>
            <option>Arrest</option>
            <option>Warrant</option>
          </select>
        </td>
      </tr>
      <tr style="margin-bottom: 10px;">
        <td>
          Case Number:
          <input type="text" v-model="casenumber" />
          Agency: {{ agencyLongNames[this.$store.getters.department.role] }}
        </td>
      </tr>
      <tr>
        <td rowspan="4" class="bg-red"></td>
        <td>Name: {{ character.firstname }} {{ character.lastname }}</td>
      </tr>
      <tr>
        <td>Address: {{ character.address }}</td>
      </tr>
      <tr>
        <td>City: {{ character.city }}, State: SA</td>
      </tr>
      <tr style="margin-bottom: 10px;">
        <td>ID #: {{ character.idnumber }} State: SA DOB: {{ character.dob }}</td>
      </tr>
      <tr>
        <td rowspan="2" class="bg-red"></td>
        <td>
          License Plate:
          <input type="text" v-model="licenseplate" /> State: SA
        </td>
      </tr>
      <tr style="margin-bottom: 10px;">
        <td>
          Make:
          <input type="text" v-model="make" /> Model:
          <input type="text" v-model="model" /> Color:
          <input type="text" v-model="color" />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <p>
            The Undersigned states that the Defendant at specifically
            <br />
            <input type="text" v-model="address" placeholder="Address" />
            in the city of
            <select v-model="city">
              <option v-for="city in cities" :key="city">{{ city }}</option>
            </select> did, then and there, commit the following offense(s):
          </p>
        </td>
      </tr>
      <tr style="margin-bottom: 10px;">
        <td rowspan="2" class="bg-red"></td>
        <td>
          <button class="btn btn-warning" @click="$refs.lawmodal.show()">Add Violation</button>
        </td>
      </tr>
      <tr>
        <td>
          <table class="table table-bordered table-sm">
            <thead>
              <tr>
                <th style="width: 220px;">Code</th>
                <th>Title</th>
                <th style="width: 100px;">Type</th>
                <th style="width: 100px;">Fine</th>
              </tr>
            </thead>
            <tbody id="leoPCdocumentViolationTable" style="min-height: 300px;">
              <tr v-for="(v, k) in violations" :key="k">
                <td>
                  <b-button variant="danger" sm @click="removeViolation(k)">
                    <i class="fa fa-trash" />
                  </b-button>
                  {{ v.code }}
                </td>
                <td>{{ v.title }}</td>
                <td>{{ v.type }}</td>
                <td>{{ v.fine !== null ? `$${v.fine}` : 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td
          colspan="2"
        >Under penalties as provided by law for false certification, the undersigned certifies that the statements set forth in this instrument are true and correct.</td>
      </tr>
      <tr>
        <td colspan="2">
          Narrative:
          <textarea v-model="narrative" rows="5" style="width: 100%;"></textarea>
        </td>
      </tr>
      <tr v-if="type === 'Arrest'">
        <td colspan="2">
          Plea:
          <select v-model="plea">
            <option>Innocent</option>
            <option>No Contest</option>
            <option>Guilty</option>
          </select>
        </td>
      </tr>
      <tr v-if="type === 'Arrest' && plea === 'Innocent'">
        <td colspan="2">Bail: ${{bail}}</td>
      </tr>
      <tr v-if="type === 'Arrest' && (plea === 'Guilty' || plea === 'No Contest')">
        <td colspan="2">
          Fine: ${{compfine}}
          <br />
          <u>or</u>
          <br />
          Time: {{time[0]}} years
          <span v-if="time[1] > 0">and a fine of ${{time[1]}}</span>
        </td>
      </tr>
      <tr v-if="type === 'Arrest' && (plea === 'Guilty' || plea === 'No Contest')">
        <td colspan="2">
          Restitution Type:
          <select v-model="restitution" @change="reschange">
            <option>Fine</option>
            <option>Time</option>
          </select>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button class="btn btn-primary" @click="issue">Certify and Submit</button>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          Address formats:
          <br />117 Grove St
          <br />Route 68 and Highway 1
          <br />Highway 1 Mile 3
        </td>
      </tr>
    </table>
    <!-- Modal for laws -->
    <b-modal
      id="laws"
      size="xl"
      scrollable
      ok-disabled
      title="Add Violation"
      ref="lawmodal"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      lazy
    >
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col md="6" class="my-1" offset-md="6">
            <b-form-group label-cols-sm="2" label-text-align="right" label="Filter" class="mb-0">
              <b-input-group>
                <b-form-input v-model="filter" placeholder="Type to Search" />
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table
          show-empty
          stacked="md"
          selectable
          select-mode="single"
          selectedVariant="local"
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
          @row-selected="rowSelected"
          ref="lawstable"
        ></b-table>

        <b-row>
          <b-col md="6" class="my-1">
            <b-form-group label-cols-sm="2" label="Per Page" class="mb-0" label-text-align="right">
              <b-form-select class="small-select" :options="pageOptions" v-model="perPage" />
            </b-form-group>
          </b-col>
          <b-col md="6" class="my-1">
            <b-pagination
              :total-rows="totalRows"
              :per-page="perPage"
              v-model="currentPage"
              class="my-0"
            />
          </b-col>
        </b-row>
      </b-container>
    </b-modal>

    <b-modal
      id="error-modal"
      size="md"
      title="Error"
      ok-only
      v-model="modelErrorShow"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      v-html="errorModalText"
    ></b-modal>
  </div>
</template>

<script>
import {
  cities,
  offenseToBail,
  offenseToFine,
  offenseToTime,
  agencyLongNames,
  agencyRoleToDB
} from "@/utils/commondata";
import { ISSUE_DOCUMENT } from "@/store/queries/legal";

export default {
  name: "LEODocument",
  props: ["character", "documents"],
  data() {
    return {
      cities,
      agencyLongNames,
      fields: [
        { key: "code", label: "Code", sortable: true, sortDirection: "desc" },
        { key: "title", label: "Title", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "fine", label: "Fine", sortable: true }
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [5, 10, 15, 25, 50, 100],
      sortBy: "date",
      sortDesc: false,
      sortDirection: "desc",
      filter: null,
      modalLawsShow: false,
      errorModalText: undefined,
      modelErrorShow: false,
      fineAmt: 0
    };
  },
  created() {
    if (this.$store.getters.assignedCall !== null) {
      this.casenumber = this.$store.getters.assignedCall.callnumber;
    }
    this.character_id = this.character.id;
    this.items = this.$store.getters.laws;
    this.totalRows = this.items.length;
  },
  computed: {
    type: {
      get() {
        return this.$store.state.forms.document.type;
      },
      set(value) {
        this.$store.commit("formdocument", { type: value });
      }
    },
    casenumber: {
      get() {
        return this.$store.state.forms.document.casenumber;
      },
      set(value) {
        this.$store.commit("formdocument", { casenumber: value });
      }
    },
    character_id: {
      get() {
        return this.$store.state.forms.document.character_id;
      },
      set(value) {
        this.$store.commit("formdocument", { character_id: value });
      }
    },
    licenseplate: {
      get() {
        return this.$store.state.forms.document.licenseplate;
      },
      set(value) {
        this.$store.commit("formdocument", { licenseplate: value });
      }
    },
    make: {
      get() {
        return this.$store.state.forms.document.make;
      },
      set(value) {
        this.$store.commit("formdocument", { make: value });
      }
    },
    model: {
      get() {
        return this.$store.state.forms.document.model;
      },
      set(value) {
        this.$store.commit("formdocument", { model: value });
      }
    },
    color: {
      get() {
        return this.$store.state.forms.document.color;
      },
      set(value) {
        this.$store.commit("formdocument", { color: value });
      }
    },
    address: {
      get() {
        return this.$store.state.forms.document.address;
      },
      set(value) {
        this.$store.commit("formdocument", { address: value });
      }
    },
    city: {
      get() {
        return this.$store.state.forms.document.city;
      },
      set(value) {
        this.$store.commit("formdocument", { city: value });
      }
    },
    violations: {
      get() {
        return this.$store.state.forms.document.violations;
      },
      set(value) {
        this.$store.commit("formdocument", { violations: value });
      }
    },
    narrative: {
      get() {
        return this.$store.state.forms.document.narrative;
      },
      set(value) {
        this.$store.commit("formdocument", { narrative: value });
      }
    },
    plea: {
      get() {
        return this.$store.state.forms.document.plea;
      },
      set(value) {
        this.$store.commit("formdocument", { plea: value });
      }
    },
    restitution: {
      get() {
        return this.$store.state.forms.document.restitution;
      },
      set(value) {
        this.$store.commit("formdocument", { restitution: value });
      }
    },
    restitution_amount: {
      get() {
        return this.$store.state.forms.document.restitution_amount;
      },
      set(value) {
        this.$store.commit("formdocument", { restitution_amount: value });
      }
    },
    bail() {
      let bail = 0;
      this.violations.forEach(v => {
        if (v.type === "I" || v.type === "MB") {
          bail += v.fine;
        } else {
          bail += offenseToBail[v.type];
        }
      });

      return bail;
    },
    compfine() {
      let fine = 0;
      this.violations.forEach(v => {
        if (v.type === "I" || v.type === "MB") {
          fine += v.fine;
        } else {
          fine += offenseToFine[v.type];
        }
      });
      return fine;
    },
    time() {
      let time = 0;
      let fine = 0;
      this.violations.forEach(v => {
        if (v.type === "I" || v.type === "MB") {
          fine += v.fine;
        } else {
          time += offenseToTime[v.type];
        }
      });
      return [time, fine];
    }
  },
  methods: {
    rowSelected(row) {
      const v = row[0];
      if (v.fine !== null) {
        this.fineAmt += v.fine;
      }

      this.violations.push(row[0]);
      setTimeout(() => {
        this.$refs.lawmodal.hide();
      }, 200);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    removeViolation(index) {
      if (this.violations[index].fine !== null) {
        this.fineAmt -= this.violations[index].fine;
      }

      this.violations.splice(index, 1);
    },
    reschange() {
      if (this.restitution === "Time") {
        this.restitution_amount = this.time;
      } else if (this.restitution === "Fine") {
        this.restitution_amount = this.compfine;
      } else {
        this.restitution_amount = 0;
      }
    },
    isDocumentReady() {
      if (
        this.address === null ||
        this.type === null ||
        this.city === null ||
        this.address === null ||
        this.violations === null ||
        this.violations.length === 0
      ) {
        return false;
      }
      if (
        !this.address.match(/(\d+) (.+)/g) &&
        !this.address.match(/[A-Za-z 0-9]+ and [A-za-z 0-9]/g) &&
        !this.address.match(/Route|highway \d+ Mile .+/g)
      ) {
        return false;
      }
      if (
        this.type === undefined ||
        this.city === undefined ||
        this.address === undefined ||
        this.violations === undefined
      ) {
        return false;
      }
      if (this.type === "Citation" || this.type === "Warning") {
        let hasNonInfractions = false;
        this.violations.forEach(v => {
          if (v.type !== "I") hasNonInfractions = true;
        });
        if (hasNonInfractions) {
          return false;
        }
      }
      if (this.type === "Arrest") {
        if (
          this.plea === null ||
          (this.plea !== "Innocent" &&
            (this.restitution === null ||
              this.restitution_amount === null ||
              this.restitution_amount === 0))
        ) {
          return false;
        }
      }
      return true;
    },
    issue() {
      if (
        this.address === null ||
        this.type === null ||
        this.city === null ||
        this.address === null ||
        this.violations === null ||
        this.violations.length === 0
      ) {
        this.errorModalText =
          "Document Type, Address, City and Violations cannot be blank.";
        this.modelErrorShow = true;
        return;
      }
      if (
        !this.address.match(/(\d+) (.+)/g) &&
        !this.address.match(/[A-Za-z 0-9]+ and [A-za-z 0-9]/g) &&
        !this.address.match(/Route|highway \d+ Mile \d+/g)
      ) {
        this.errorModalText = "The address is not formatted correctly";
        this.modelErrorShow = true;
        return;
      }
      if (
        this.type === undefined ||
        this.city === undefined ||
        this.address === undefined ||
        this.violations === undefined
      ) {
        this.errorModalText =
          "Document Type, Address, City and Violations cannot be blank.";
        this.modelErrorShow = true;
        return;
      }
      if (this.type === "Citation" || this.type === "Warning") {
        let hasNonInfractions = false;
        this.violations.forEach(v => {
          if (v.type !== "I") hasNonInfractions = true;
        });
        if (hasNonInfractions) {
          this.errorModalText =
            "You cannot issue a written warning or citation for non-infractions.";
          this.modelErrorShow = true;
          return;
        }
      }
      if (this.type === "Arrest") {
        if (
          this.plea === null ||
          (this.plea !== "Innocent" &&
            (this.restitution === null ||
              this.restitution_amount === null ||
              this.restitution_amount === 0))
        ) {
          this.errorModalText =
            "On arrests, plea and restitution cannot be left blank.";
          this.modelErrorShow = true;
          return;
        }
      }
      const issuer = `${this.$store.getters.signon.session_identifier} - ${this.$store.getters.signon.session_name}`;
      this.$apollo
        .mutate({
          mutation: ISSUE_DOCUMENT,
          variables: {
            character_id: this.character.id,
            type: this.type,
            agency: agencyRoleToDB[this.$store.getters.department.role],
            plate: this.licenseplate,
            make: this.make,
            model: this.model,
            color: this.color,
            address: this.address,
            city: this.city,
            issuer,
            violations: JSON.stringify(this.violations),
            fine: this.compfine,
            casenumber: this.casenumber,
            warrant_active: this.type === "Warrant" ? true : null,
            narrative: this.narrative,
            plea: this.plea,
            restitution: this.restitution,
            restitution_amount:
              this.plea !== "Innocent"
                ? JSON.stringify(this.restitution_amount)
                : this.bail
          }
        })
        .then(() => {
          this.type = undefined;
          this.licenseplate = undefined;
          this.make = undefined;
          this.model = undefined;
          this.color = undefined;
          this.address = undefined;
          this.city = undefined;
          this.violations = [];
          this.casenumber = undefined;
          this.plea = null;
          this.restitution = null;
          this.narrative = null;
          this.restitution_amount = null;
          this.fine = 0;
          this.$emit("has-issued");
        });
    },
    previousCheck(match) {
      let prev = 0;
      this.documents.forEach((v, i) => {
        this.documents[i].violations.forEach(v2 => {
          if (v2.toUpperCase().indexOf(match.toUpperCase()) !== -1) {
            prev += 1;
          }
        });
      });
      this.violations.forEach(v => {
        if (v.code.toUpperCase() === match.toUpperCase()) {
          prev += 1;
        }
      });
      return prev;
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  background-color: rgb(40, 40, 40);
  color: #fff;
}
.bg-red {
  background-color: rgb(150, 0, 0);
}
.table-local,
.table-local > th,
.table-local > td {
  background-color: rgb(40, 40, 40);
}
</style>

<style lang="scss">
.modal-content {
  background-clip: unset !important;
}
</style>
