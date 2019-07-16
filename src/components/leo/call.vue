<template>
  <b-tabs class="darktabs" content-class="mb-3">
    <b-tab title="Assigned Call" active>
      <b-card-text>
        <div v-if="assignedCall === null">You do not have an assigned call.</div>
        <div v-else>
          <table class="table table-bordered text-uppercase">
            <tr>
              <td>
                {{ call.callnumber }} // {{ call.address }}, {{ call.city }} //
                <span
                  style="color: #15f4ee"
                >{{ call.type }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="3">{{ call.description }}</td>
            </tr>
            <tr>
              <td
                colspan="3"
              >{{ call.assigned.length > 0 ? call.assigned.join(", ") : "PENDING ASSIGNMENT" }}</td>
            </tr>
            <tr>
              <td colspan="3">
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
    <b-tab title="Pending Calls">
      <b-card-text>
        <table
          class="table table-bordered text-uppercase"
          v-for="call in callsUnassignedSorted()"
          :key="call.callnumber"
        >
          <tr>
            <td>
              {{ call.callnumber }} // {{ call.address }}, {{ call.city }} //
              <span
                style="color: #15f4ee"
              >{{ call.type }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="3">{{ call.description }}</td>
          </tr>
          <tr>
            <td
              colspan="3"
            >{{ call.assigned.length > 0 ? call.assigned.join(", ") : "PENDING ASSIGNMENT" }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <button
                class="btn btn-success"
                @click="assignCall(call)"
                v-if="(assignedCall === null || (assignedCall !== null && call.callnumber !== assignedCall.callnumber)) && !assigning"
              >Assign Me</button>
              <button class="btn btn-success" disabled v-if="assigning">
                <b-spinner variant="primary" />
              </button>
              <button
                class="btn btn-darkblue ml-2"
                @click="archiveCall(call)"
                v-if="!archiving"
              >Archive Call</button>
              <button class="btn btn-darkblue" disabled v-if="archiving">
                <b-spinner variant="primary" />
              </button>
            </td>
          </tr>
        </table>
      </b-card-text>
    </b-tab>
    <b-tab title="All Calls">
      <b-card-text>
        <table
          class="table table-bordered text-uppercase"
          v-for="call in callsSorted()"
          :key="call.callnumber"
        >
          <tr>
            <td>
              {{ call.callnumber }} // {{ call.address }}, {{ call.city }} //
              <span
                style="color: #15f4ee"
              >{{ call.type }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="3">{{ call.description }}</td>
          </tr>
          <tr>
            <td
              colspan="3"
            >{{ call.assigned.length > 0 ? call.assigned.join(", ") : "PENDING ASSIGNMENT" }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <button
                class="btn btn-success"
                @click="assignCall(call)"
                v-if="(assignedCall === null || (assignedCall !== null && call.callnumber !== assignedCall.callnumber)) && !assigning"
              >Assign Me</button>
              <button class="btn btn-success" disabled v-if="assigning">
                <b-spinner variant="primary" />
              </button>
              <button
                class="btn btn-darkblue ml-2"
                @click="archiveCall(call)"
                v-if="!archiving"
              >Archive Call</button>
              <button class="btn btn-darkblue" disabled v-if="archiving">
                <b-spinner variant="primary" />
              </button>
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
    ...mapGetters(["assignedCall", "signon"])
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
    callsSorted() {
      return this.$store.getters.calls.sort((a, b) => (a.callnumber.substring(4) > b.callnumber.substring(4) ? 1 : -1));
    },
    callsUnassignedSorted() {
      return this.$store.getters.calls
        .filter(a => a.assigned.length === 0)
        .sort((a, b) => (a.callnumber.substring(4) > b.callnumber.substring(4) ? 1 : -1));
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

<style lang="scss">
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
  color: lightgray;
}
.table-info td {
  background-color: rgb(0, 0, 100);
  border: 1px solid white;
}

.darktabs .nav-tabs .nav-link.active,
.darktabs .nav-tabs .nav-item.show .nav-link {
  background-color: rgb(0, 0, 40) !important;
  color: lightgray;
}

.darktabs .nav-tabs .nav-link {
  color: lightgray;
  border: 1px solid darkgray;
}
</style>
