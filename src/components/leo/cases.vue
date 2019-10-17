<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title-link-class="titlegray" title="Open" active>
        <table class="table table-bordered pure-white">
          <thead>
            <tr>
              <th style="width: 100px;">Case #</th>
              <th>Title</th>
              <th>Opened By</th>
              <th>Opened</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="opencases.length === 0">
              <td colspan="4" class="text-center">No open cases.</td>
            </tr>
            <tr v-else v-for="lcase in opencases" :key="lcase.id" @click="openCase(lcase.id)">
              <td>{{ lcase.id }}</td>
              <td>{{ lcase.title }}</td>
              <td>{{ lcase.created_by }}</td>
              <td>
                {{
                `${(new Date(lcase.created_at)).getMonth()+1}/${(new Date(lcase.created_at)).getDate()}/${(new Date(lcase.created_at)).getYear()+1900}`
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </b-tab>
      <b-tab title-link-class="titlegray" title="Cold">
        <table class="table table-bordered pure-white">
          <thead>
            <tr>
              <th style="width: 100px;">Case #</th>
              <th>Title</th>
              <th>Opened By</th>
              <th>Opened</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="coldcases.length === 0">
              <td colspan="4" class="text-center">No cold cases.</td>
            </tr>
            <tr v-else v-for="lcase in cold" :key="lcase.id" @click="openCase(lcase.id)">
              <td>{{ lcase.id }}</td>
              <td>{{ lcase.title }}</td>
              <td>{{ lcase.created_by }}</td>
              <td>
                {{
                `${(new Date(lcase.created_at)).getMonth()+1}/${(new Date(lcase.created_at)).getDate()}/${(new Date(lcase.created_at)).getYear()+1900}`
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </b-tab>
      <b-tab title-link-class="titlegray" title="Closed">
        <table class="table table-bordered pure-white">
          <thead>
            <tr>
              <th style="width: 100px;">Case #</th>
              <th>Title</th>
              <th>Opened By</th>
              <th>Opened</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="closedcases.length === 0">
              <td colspan="4" class="text-center">No closed cases.</td>
            </tr>
            <tr v-else v-for="lcase in closedcases" :key="lcase.id" @click="openCase(lcase.id)">
              <td>{{ lcase.id }}</td>
              <td>{{ lcase.title }}</td>
              <td>{{ lcase.created_by }}</td>
              <td>
                {{
                `${(new Date(lcase.created_at)).getMonth()+1}/${(new Date(lcase.created_at)).getDate()}/${(new Date(lcase.created_at)).getYear()+1900}`
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </b-tab>
      <b-tab title-link-class="titlegray" title="New Case"></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "LEOCases",
  computed: {
    ...mapGetters(["cases"]),
    opencases: {
      get() {
        return this.cases.filter(c => c.status === "Open");
      }
    },
    closedcases: {
      get() {
        return this.cases.filter(c => c.status === "Closed");
      }
    },
    coldcases: {
      get() {
        return this.cases.filter(c => c.status === "Cold");
      }
    }
  },
  methods: {
    openCase(id) {
      this.$router.push(`/mdt/cases/${id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
th {
  background-color: rgb(0, 0, 40);
  color: #fff;
}
td {
  color: #fff;
}
</style>
