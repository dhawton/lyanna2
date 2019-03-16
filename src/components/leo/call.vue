<template>
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
          <br>
          <br>
          <b>DESCRIPTION:</b>
          {{ assignedCall.description }}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button class="btn btn-darkblue" @click="clearCall" v-if="!clearing">Clear Call</button>
          <button class="btn btn-darkblue" disabled v-if="clearing">
            <b-spinner variant="primary"/>
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CALL_CLEAR } from "@/store/queries/calls";

export default {
  name: "MDTCall",
  data() {
    return {
      clearing: false
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
    }
  }
};
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
