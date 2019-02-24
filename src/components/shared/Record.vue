<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1" offset-md="6">
        <b-form-group label-cols-sm="1" label="Filter" class="mb-0">
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
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
    >
      <template slot="agency" slot-scope="row" v-bind:commonAgencies="commonAgencies">
        {{ commonAgencies[row.value] }}
      </template>

      <template slot="location" slot-scope="row">
        {{ row.item.address }}, {{ row.item.city }}, SA
      </template>

      <span slot="violations" slot-scope="data" v-html="data.value || Hi" />
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="2" label="Entries per page" class="mb-0" label-text-align="right">
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
</template>

<script>
import { agencies } from "@/utils/commondata";

export default {
  name: "Record",
  data() {
    return {
      commonAgencies: agencies,
      fields: [
        { key: 'id', label: 'Document ID', sortable: true, sortDirection: 'desc' },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'agency', label: 'Agency', sortable: true },
        { key: 'location', label: 'Address, City', sortable: true },
        { key: 'violations', label: 'Violations', sortable: true, formatter: 'violations' },
        { key: 'created_at', label: 'Date/Time', sortable: true }
      ],
      currentPage: 1,
      perPage: 25,
      totalRows: this.items.length,
      pageOptions: [5, 10, 15, 25, 50, 100],
      sortBy: "date",
      sortDesc: false,
      sortDirection: 'desc',
      filter: null,
      modalInfo: { title: '', content: '' }
    };
  },
  props: ['items'],
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }));
    }
  },
  methods: {
    violations(value) {
      return `<ul class="violations"><li>${ value.join("</li><li>") }</li></ul>`;
    },
    resetModal() {
      this.modalInfo.title = '';
      this.modalInfo.content = '';
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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
</style>

<style lang="scss">
ul.violations {
  margin-bottom: 0;
  padding-left: 0;
}
</style>
