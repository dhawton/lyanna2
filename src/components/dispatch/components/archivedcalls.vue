<template>
  <div>
    <b-row v-if="isRetrieving">
      <b-col md="12" class="text-center">
        <b-spinner style="height: 3rem; width: 3rem;"/>
      </b-col>
    </b-row>
    <table v-else class="table table-border-teal table-sm text-uppercase" style="margin-top: 1rem;">
      <thead>
        <tr>
          <th style="width: 100px;">CN</th>
          <th style="width: 50px;">RECV'D</th>
          <th>TYPE</th>
          <th>LOCATION</th>
          <th>DESCRIPTION</th>
          <th style="width: 100px;">ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(call) in this.calls" :key="call.callnumber">
          <td>{{ call.callnumber }}</td>
          <td>{{ call.created_at.substring(5, 10).replace("-", "/") }} {{ call.created_at.substring(11, 16) }}</td>
          <td>{{ call.type }}</td>
          <td>
            {{ call.address }}
            <br>
            {{ call.city }}
          </td>
          <td>{{ call.description }}</td>
          <td>
            <b-button
              variant="darkblue"
              @click="restoreCall(call.callnumber)"
              v-if="!isRestoring"
            >Restore</b-button>
            <b-button variant="darkblue" v-else>
              <b-spinner/>
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable prefer-destructuring */
import { CALL_EDIT, GET_ARCHIVED_CALLS } from "@/store/queries/calls";

export default {
  name: "CADArchivedCalls",
  data() {
    return {
      isRetrieving: false,
      isRestoring: false,
      calls: []
    };
  },
  created() {
    this.isRetrieving = true;
    this.$apollo
      .query({
        query: GET_ARCHIVED_CALLS,
        variables: {
          server_id: this.$store.getters.server.id,
          limit: 100
        }
      })
      .then(r => {
        this.calls = r.data.CallArchive;
        this.isRetrieving = false;
      });
  },
  methods: {
    restoreCall(callnumber) {
      this.$apollo
        .mutate({
          mutation: CALL_EDIT,
          variables: {
            callnumber,
            status: "live"
          }
        })
        .then(() => {
          this.calls = this.calls.filter(c => c.callnumber !== callnumber);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.call-pending {
  background-color: rgb(100, 100, 0);
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
}
.btn-darkblue {
  background-color: rgb(0, 0, 40);
  color: #fff;
  border: 1px solid rgb(0, 0, 150);
}
.btn-darkblue:hover {
  background-color: rgb(0, 0, 100);
  color: #fff;
}
</style>
