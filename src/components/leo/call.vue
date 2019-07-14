<template>
  <b-tabs content-class="mb-3">
    <b-tab title="Assigned Call" active>
      <b-card-text>
        <div v-if="assignedCall === null">You do not have an assigned call.</div>
        <div v-else>
          <table class="table table-bordered text-uppercase">
            <tr class="table-info">
              <td colspan="2">Assigned Call</td>
            </tr>
            <tr>
              <td colspan="2">
                <b>CN:</b>
                {{ assignedCall.callnumber }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <b>ADDRESS:</b>
                {{ assignedCall.address }}, {{ assignedCall.city }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <b>TYPE:</b>
                {{ assignedCall.type }}
                <br />
                <br />
                <b>DESCRIPTION:</b>
                {{ assignedCall.description }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button class="btn btn-darkblue" @click="clearCall" v-if="!clearing">Clear Call</button>
                <button class="btn btn-darkblue" disabled v-if="clearing">
                  <b-spinner variant="primary" />
                </button>
              </td>
            </tr>
          </table>
        </div>
      </b-card-text>
    </b-tab>
    <b-tab title="Calls">
      <b-card-text>
        <table class="table table-bordered text-uppercase" v-for="(call, i) in calls" :key="i">
          <tr>
            <td colspan="2">
              <b>CN:</b>
              {{ call.callnumber }}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <b>ADDRESS:</b>
              {{ call.address }}, {{ call.city }}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <b>TYPE:</b>
              {{ call.type }}
              <br />
              <br />
              <b>DESCRIPTION:</b>
              {{ call.description }}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <b>ASSIGNED:</b>
              {{ call.assigned.length > 0 ? call.assigned.join(", ") : "NONE" }}
              <tr>
                <td colspan="2">
                  <button
                    class="btn btn-green"
                    @click="assignCall(call)"
                    v-if="assignedCall !== null && call.callnumber !== assignedCall.callnumber"
                  >Assign Me</button>
                  <button class="btn btn-darkblue" disabled v-if="assigning">
                    <b-spinner variant="primary" />
                  </button>
                  <button
                    class="btn btn-darkblue"
                    @click="archiveCall(call)"
                    v-if="!clearing"
                  >Archive Call</button>
                  <button class="btn btn-darkblue" disabled v-if="archiving">
                    <b-spinner variant="primary" />
                  </button>
                </td>
              </tr>
            </td>
          </tr>
        </table>
      </b-card-text>
    </b-tab>
  </b-tabs>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { CALL_CLEAR, CALL_EDIT } from "@/store/queries/calls";

export default Vue.extend({
  name: "MDTCall",
  data() {
    return {
      clearing: false,
      assigning: false,
      archiving: false
    };
  },
  computed: {
    ...mapGetters(["assignedCall", "signon", "calls"])
  },
  methods: {
    clearCall() {
      this.$apollo.mutate({
        mutation: CALL_CLEAR,
        variables: {
          identifier: this.signon.session_identifier,
          callnumber: this.assignedCall.callnumber
        }
      });
    },
    calls() {
      /* eslint-disable arrow-body-style */
      const c = this.calls.sort((a, b) => {
        return a.callnumber.substring(4) > b.callnumber.substring(4) ? 1 : -1;
      });
      return c;
    },
    assignCall(call) {
      if (call.assigned.includes(this.signon.session_identifier)) {
        return;
      }

      this.assigning = true;
      const { assigned } = call;
      assigned.push(this.signon.session_identifier);
      this.$apollo
        .mutate({
          mutation: CALL_EDIT,
          variables: {
            callnumber: call.callnumber,
            assigned: JSON.stringify(assigned)
          }
        })
        .then(() => {
          this.assigning = false;
        });
    },
    archiveCall(call) {
      this.archiving = true;
      this.$apollo
        .mutate({
          mutation: CALL_EDIT,
          variables: {
            callnumber: call.callnumber,
            assigned: "[]",
            status: "archived"
          }
        })
        .then(() => {
          this.archiving = false;
        });
    }
  }
});
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
table td {
  color: #fff;
}
.table-info td {
  background-color: rgb(0, 0, 100);
  border: 1px solid white;
}
</style>
