<template>
  <b-container fluid>
    <div v-if="!prepared">
      <b-spinner large/>
    </div>
    <div v-else-if="writtenDeclaration !== null">
      <b-row>
        <b-col md="6">
          <table class="table table-bordered table-sm">
            <tr>
              <td rowspan="2" class="bg-red" style="width: 10px;"></td>
              <td>Type: {{writtenDeclarationCase.type}}</td>
            </tr>
            <tr style="margin-bottom: 10px;">
              <td>
                Case Number: {{writtenDeclarationCase.id}}
                <br>
                Agency: {{ agencyLongNames[writtenDeclarationCase.agency.toLowerCase()] }}
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
                {{ writtenDeclarationCase.licenseplate || "None Provided" }}
                <br>
                State: {{ writtenDeclarationCase.length > 0 ? "SA" : "None Provided" }}
              </td>
            </tr>
            <tr style="margin-bottom: 10px;">
              <td>
                Make: {{ writtenDeclarationCase.make || "None Provided" }}
                <br>
                Model: {{ writtenDeclarationCase.model || "None Provided" }}
                <br>
                Color: {{ writtenDeclarationCase.color || "None Provided" }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <p>
                  Offense(s) committed at
                  {{ writtenDeclarationCase.address }}
                  in the city of
                  {{ writtenDeclarationCase.city }}
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                Charges:
                <ul>
                  <li v-for="(v, k) in writtenDeclarationCase.violations" :key="k">{{ v }}</li>
                </ul>
              </td>
            </tr>
          </table>
        </b-col>
        <b-col md="6">
          Submit your written declaration:
          <textarea
            v-model="writtenDecBox"
            rows="10"
            style="width: 100%;"
          ></textarea>
          <b-button primary v-if="!submittingDeclaration" @click="doSubmitDeclaration">Submit</b-button>
          <b-button primary v-else disabled>
            <b-spinner small/>
          </b-button>
          <p>Written declarations should tell your side of the story, be factually based and present an argument that sways the court to your desired outcome. The courts will review this, along with the officer's narrative, to determine the outcome of the case. This outcome cannot be appealed, and once a written declaration is submitted, your right to a trial is waived.</p>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <!-- User Interface controls -->
      <b-row>
        <b-col md="6" class="my-1" offset-md="6">
          <b-form-group label-cols-sm="1" label="Filter" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Type to Search"/>
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
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        @filtered="onFiltered"
        :tbody-tr-class="rowClass"
      >
        <template slot="agency" slot-scope="data" v-bind:commonAgencies="commonAgencies">
          {{ data.item.issuer }}
          <br>
          {{ commonAgencies[data.item.agency] }}
        </template>

        <template slot="location" slot-scope="row">
          {{ row.item.address }},
          <br>
          {{ row.item.city }}, SA
        </template>

        <span slot="violations" slot-scope="data" v-html="data.value || Hi"/>
        <template slot="status" slot-scope="row">
          <div v-if="row.item.type==='Citation'">
            <span v-if="row.item.status === 'Open'">
              <i>Pending...</i>
            </span>
            <span v-else>
              Court Ruled
              <br>
              {{ row.item.outcome }}
            </span>
          </div>
          <div v-if="row.item.type==='Arrest'">
            <div v-if="row.item.plea === 'Guilty' || row.item.plea === 'No Contest'">
              Closed
              <br>
              Plead {{ row.item.plea }}
            </div>
            <div v-else>
              <span v-if="row.item.status === 'Open'">
                <i>Pending...</i>
              </span>
              <span v-else>
                Court Ruled
                <br>
                {{ row.item.outcome }}
              </span>
            </div>
          </div>
        </template>
        <template slot="actions" slot-scope="row">
          <div
            v-if="row.item.status === 'Open' || (row.item.type === 'Citation' && row.item.outcome.length === 0)"
          >
            <b-button primary @click="doWrittenDeclaration(row)">Submit Written Declaration</b-button>
          </div>
          <div v-if="row.item.status === 'Closed' && row.item.plea === 'Innocent'">
            <b-button primary @click="showOpinion(row.item.id)">View Court Opinion</b-button>
          </div>
        </template>
      </b-table>

      <b-row>
        <b-col md="6" class="my-1">
          <b-form-group
            label-cols-sm="2"
            label="Entries per page"
            class="mb-0"
            label-text-align="right"
          >
            <b-form-select class="small-select" :options="pageOptions" v-model="perPage"/>
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
    </div>
    <b-modal
      id="courtopinion"
      size="xl"
      title="Court Opinion"
      v-model="modelCourtOpinion"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      ok-only
      lazy
    >{{ courtOpinion }}</b-modal>
    <b-modal
      id="modelDeclarationError"
      size="xl"
      title="Error!"
      v-model="modelDeclarationError"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      ok-only
      lazy
    >There was an error submitting your written declaration. Please try again later or contact the Dev Team.</b-modal>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { agencies, agencyLongNames } from "@/utils/commondata";
import { GET_CHARACTER_DOCUMENTS, EDIT_DOCUMENT } from "@/store/queries/legal";

export default {
  name: "CivCases",
  data() {
    return {
      modelCourtOpinion: false,
      modelDeclarationError: false,
      prepared: false,
      courtOpinion: "",
      writtenDeclaration: null,
      writtenDeclarationCase: null,
      commonAgencies: agencies,
      agencyLongNames,
      submittingDeclaration: false,
      writtenDecBox: null,
      fields: [
        {
          key: "id",
          label: "Case ID",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "agency", label: "Issuer", sortable: true },
        {
          key: "violations",
          label: "Violations",
          sortable: true,
          formatter: "violations"
        },
        { key: "status", label: "Status", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      items: [],
      currentPage: 1,
      perPage: 25,
      pageOptions: [5, 10, 15, 25, 50, 100],
      sortBy: "date",
      sortDesc: false,
      sortDirection: "desc",
      filter: null,
      modalInfo: { title: "", content: "" },
      processing: false,
      totalRows: 0
    };
  },
  created() {
    this.updateDocuments();
    setInterval(this.updateDocuments, 5 * 60 * 1000);
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }));
    },
    ...mapGetters(["character"])
  },
  methods: {
    rowClass(item) {
      if (!item) return null;
      if (item.type === "Warrant" && item.warrant_active) return "wanted";
      if (item.type === "Warrant" && !item.warrant_active) {
        return "linedout";
      }
      if (item.outcome === "Innocent") return "linedout";

      return null;
    },
    doWrittenDeclaration(doc) {
      this.writtenDeclarationCase = doc.item;
      this.writtenDecBox = doc.item.declaration;
      this.writtenDeclaration = true;
    },
    violations(value) {
      return `<ul class="violations"><li>${value.join("</li><li>")}</li></ul>`;
    },
    showOpinion(i) {
      console.dir(this.items.filter(c => c.id === i)[0]);
      this.courtOpinion = this.items.filter(c => c.id === i)[0].opinion;
      this.modelCourtOpinion = true;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    typeString(classification) {
      switch (classification) {
        case "FU":
          return "Uncl. Fel.";
        case "FA":
          return "Cl. A Fel.";
        case "FB":
          return "Cl. B Fel.";
        case "FC":
          return "Cl. C Fel.";
        case "MA":
          return "Cl. A Misd.";
        case "MB":
          return "Cl. B Misd.";
        case "I":
          return "Infrac.";
        default:
          return "Unknown";
      }
    },
    doSubmitDeclaration() {
      this.submittingDeclaration = true;
      this.$apollo
        .mutate({
          mutation: EDIT_DOCUMENT,
          variables: {
            id: this.writtenDeclarationCase.id,
            declaration: this.writtenDecBox
          }
        })
        .then(r => {
          this.submittingDeclaration = false;
          if (
            r.errors !== undefined ||
            r.data.EditDocument.id !== this.writtenDeclarationCase.id
          ) {
            this.modelDeclarationError = true;
          }
        });
    },
    updateDocuments() {
      this.$apollo
        .query({
          query: GET_CHARACTER_DOCUMENTS,
          variables: {
            id: this.$store.getters.character.id
          }
        })
        .then(r => {
          const docs = r.data.documentsByCharacter.filter(
            d => d.type === "Arrest" || d.type === "Citation"
          );
          docs.forEach((v, i) => {
            if (!Array.isArray(docs[i].violations)) {
              docs[i].violations = JSON.parse(docs[i].violations);
            }
            docs[i].violations.forEach((v2, i2) => {
              if (typeof vs !== "string") {
                docs[i].violations[i2] = `${v2.code} ${
                  v2.title
                } [${this.typeString(v2.type)}]`;
              }
            });
            docs[i].violationList = docs[i].violations.join("<br/>");
            let dt = new Date(docs[i].created_at).toLocaleString("en-US", {
              timeZone: "America/Anchorage",
              hour12: false
            });
            dt = dt.substr(0, dt.length - 3);
            docs[i].created_at = dt.replace(",", "");
          });
          this.items = docs;
          this.prepared = true;
          this.totalRows = this.items.length;
        })
        .catch(err => {
          console.error(err);
          this.prepared = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.tabledoc {
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
