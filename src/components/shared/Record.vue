<template>
  <b-container fluid>
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
        <div v-if="row.item.type==='Warrant'">
          <span v-if="row.item.type === 'Warrant' && !row.item.warrant_active">
            <i>Inactive</i>
            <div v-if="['court'].includes($store.getters.department.role)">
              <b-button
                size="sm"
                variant="danger"
                style="border-color: white;"
                @click="activateWarrant(row.item.id)"
                v-if="!processing"
              >Activate</b-button>
              <b-button size="sm" variant="danger" v-else>
                <b-spinner/>
              </b-button>
            </div>
          </span>
          <span v-else>
            <b>Active</b>
            <div
              v-if="['highway','sheriff','police','intel','court'].includes($store.getters.department.role)"
            >
              <b-button
                size="sm"
                variant="danger"
                style="border-color: white;"
                @click="askDeactivateWarrant(row.item.id)"
                v-if="!processing"
              >Deactivate</b-button>
              <b-button size="sm" variant="danger" v-else>
                <b-spinner/>
              </b-button>
            </div>
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
    <b-modal
      id="archive"
      size="md"
      title="Are you sure?"
      v-model="modelConfirmWarrantRemoval"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      ok-title="Yes"
      ok-variant="danger"
      cancel-title="No"
      @ok="deactivateWarrant"
    >Are you sure you wish to deactivate that warrant? Only courts can re-activate. Deactivating should only occur after arrest.</b-modal>
  </b-container>
</template>

<script>
import { agencies } from "@/utils/commondata";
import { DEACTIVATE_WARRANT } from "@/store/queries/legal";
import { EventBus } from "@/EventBus";

export default {
  name: "Record",
  data() {
    return {
      modelConfirmWarrantRemoval: false,
      pendingWarrantRemoval: null,
      commonAgencies: agencies,
      fields: [
        {
          key: "id",
          label: "Document ID",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "type", label: "Type", sortable: true },
        { key: "agency", label: "Issuer", sortable: true },
        { key: "location", label: "Address, City", sortable: true },
        {
          key: "violations",
          label: "Violations",
          sortable: true,
          formatter: "violations"
        },
        { key: "created_at", label: "Date/Time", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ],
      currentPage: 1,
      perPage: 25,
      pageOptions: [5, 10, 15, 25, 50, 100],
      sortBy: "date",
      sortDesc: false,
      sortDirection: "desc",
      filter: null,
      modalInfo: { title: "", content: "" },
      processing: false
    };
  },
  props: ["items", "charid"],
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }));
    },
    totalRows() {
      return this.items.length;
    }
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
    violations(value) {
      return `<ul class="violations"><li>${value.join("</li><li>")}</li></ul>`;
    },
    resetModal() {
      this.modalInfo.title = "";
      this.modalInfo.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    askDeactivateWarrant(id) {
      this.pendingWarrantRemoval = id;
      this.modelConfirmWarrantRemoval = true;
    },
    deactivateWarrant() {
      this.processing = true;
      this.$apollo
        .mutate({
          mutation: DEACTIVATE_WARRANT,
          variables: {
            id: this.pendingWarrantRemoval
          }
        })
        .then(() => {
          EventBus.$emit("record-update");
        });
    },
    activateWarrant(id) {
      this.processing = true;
      this.$apollo
        .mutate({
          mutation: DEACTIVATE_WARRANT,
          variables: {
            id
          }
        })
        .then(() => {
          EventBus.$emit("record-update");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.small-select {
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.375rem 0.375rem 0.375rem;
  width: 100px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  vertical-align: middle;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
.linedout {
  text-decoration: line-through;
}
</style>

<style lang="scss">
ul.violations {
  margin-bottom: 0;
  padding-left: 0;
}
.wanted {
  background-color: rgba(255, 0, 0, 0.4);
}
.warrant-hidden {
  display: none;
}
.linedout td:not(:last-child) {
  text-decoration: line-through;
}
</style>
