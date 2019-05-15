<template>
  <div>
    <table class="table table-border-teal table-sm text-uppercase" style="margin-top: 1rem;">
      <thead>
        <tr>
          <th style="width: 10px;">&nbsp;</th>
          <th style="width: 100px;">CN</th>
          <th style="width: 50px;">RECV'D</th>
          <th>TYPE</th>
          <th>LOCATION</th>
          <th>DESCRIPTION</th>
          <th style="width: 100px;">ASSIGNED</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="dispatchInitial">
          <td colspan="7" class="text-center">
            <b-spinner style="height: 3rem; width: 3rem;" variant="primary"/>
          </td>
        </tr>
        <tr v-for="(call, i) in pending()" :key="call.callnumber" class="call-pending">
          <td>{{ getPendingShortcut(i) }}</td>
          <td
            @click="askArchive(call.callnumber)"
            class="hovercursor"
          >{{ call.callnumber.substring(4) }}</td>
          <td>{{ call.created_at.substring(11, 16) }}</td>
          <td @click="popupEdit(call.callnumber, 'type')" class="hovercursor">{{ call.type }}</td>
          <td @click="popupEdit(call.callnumber, 'address')" class="hovercursor">
            {{ call.address }}
            <br>
            {{ call.city }}
          </td>
          <td
            @click="popupEdit(call.callnumber, 'description')"
            class="hovercursor"
          >{{ call.description.substring(0, 300)}}{{ (call.description.length > 300) ? "..." : ""}}</td>
          <td>PENDING</td>
        </tr>
        <tr v-for="(call, i) in assigned()" :key="call.callnumber">
          <td>{{ getAssignedShortcut(i) }}</td>
          <td
            @click="askArchive(call.callnumber)"
            class="hovercursor"
          >{{ call.callnumber.substring(4) }}</td>
          <td>{{ call.created_at.substring(11, 16) }}</td>
          <td @click="popupEdit(call.callnumber, 'type')" class="hovercursor">{{ call.type }}</td>
          <td @click="popupEdit(call.callnumber, 'address')" class="hovercursor">
            {{ call.address }}
            <br>
            {{ call.city }}
          </td>
          <td
            @click="popupEdit(call.callnumber, 'description')"
            class="hovercursor"
          >{{ call.description.substring(0, 300)}}{{ (call.description.length > 300) ? "..." : ""}}</td>
          <td>{{ call.assigned.join(", ")}}</td>
        </tr>
        <tr>
          <td colspan="3">NEW CALL (F2)</td>
          <td>
            <input
              type="text"
              ref="newtype"
              class="input-darkblue"
              v-model="type"
              style="width: 100%;"
            >
          </td>
          <td>
            <input type="text" class="input-darkblue" v-model="address" style="width: 100%;">
            <br>
            <select v-model="city" class="input-darkblue text-uppercase" style="width: 100%;">
              <option v-for="c in cities" :key="c" :value="c.toUpperCase()">{{c}}</option>
            </select>
          </td>
          <td>
            <textarea style="width: 100%;" class="input-darkblue" rows="2" v-model="description"></textarea>
          </td>
          <td>
            <b-button variant="darkblue" @click="createCall" v-if="!isCreating">Create</b-button>
            <b-button variant="darkblue" v-else>
              <b-spinner small variant="light"/>
            </b-button>
          </td>
        </tr>
        <tr>
          <td colspan="2">CONSOLE (F1)</td>
          <td colspan="5">
            <input
              type="text"
              ref="console"
              class="input-darkblue"
              v-model="console"
              style="width: 100%;"
              v-on:keydown.tab="handleTab"
              v-on:keyup.enter="submitConsole"
            >
          </td>
        </tr>
        <tr>
          <td colspan="2">CONSOLE RET</td>
          <td colspan="5">{{ consoleRet }}</td>
        </tr>
      </tbody>
    </table>
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
    >{{ errorModalText }}</b-modal>
    <b-modal
      id="archive"
      size="md"
      title="Are you sure?"
      v-model="modelArchiveCall"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      ok-title="Yes"
      ok-variant="danger"
      cancel-title="No"
      @ok="doArchive"
    >Archive call #{{ archivecall }}?</b-modal>
    <b-modal
      id="callEdit"
      title="Edit Call"
      ref="calledit"
      :size="(callEdit.field === 'description') ? 'xl' : 'md'"
      v-model="callEdit.show"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      lazy
      @ok="doEdit"
    >
      <div v-if="callEdit.field === 'type'">
        <b-form-group class="col-md-12" label="Type" label-for="idnumber">
          <b-form-input v-model="callEdit.data" class="text-uppercase"/>
        </b-form-group>
      </div>
      <div v-if="callEdit.field === 'address'">
        <b-form-group class="col-md-12" label="Address" label-for="idnumber">
          <b-form-input v-model="callEdit.data.address" class="text-uppercase"/>
        </b-form-group>
        <b-form-group class="col-md-12" label="City" label-for="idnumber">
          <b-form-select v-model="callEdit.data.city">
            <option v-for="c in cities" :key="c">{{c.toUpperCase()}}</option>
          </b-form-select>
        </b-form-group>
      </div>
      <div v-if="callEdit.field === 'description'">
        <b-form-group class="col-md-12" label="Description" label-for="idnumber">
          <b-form-textarea v-model="callEdit.data" class="text-uppercase" rows="10"></b-form-textarea>
        </b-form-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable prefer-destructuring */
import { mapGetters } from "vuex";
import { cities } from "@/utils/commondata";
import { EventBus } from "@/EventBus";
import { CALL_CREATE } from "@/store/queries/calls";

export default {
  name: "CallBox",
  data() {
    return {
      pendingCalls: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L"
      ],
      assignedCalls: [
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      cities,
      consoleRet: "",
      modelErrorShow: false,
      errorModalText: undefined,
      modelArchiveCall: false,
      archivecall: undefined,
      isCreating: false,
      callEdit: {
        callnumber: null,
        field: null,
        data: null,
        show: false,
        unit: null
      }
    };
  },
  created() {
    EventBus.$on("focus-new-call", () => {
      this.$refs.newtype.focus();
    });
    EventBus.$on("focus-console", () => {
      this.$refs.console.focus();
    });
    EventBus.$on("console-return", msg => {
      this.consoleRet = msg.ret;
      if (!msg.override) this.console = "";
    });
  },
  computed: {
    ...mapGetters(["calls", "dispatchInitial"]),
    type: {
      get() {
        return this.$store.getters.forms.newcall.type;
      },
      set(value) {
        this.$store.commit("formnewcall", {
          type: value !== null ? value.toUpperCase() : null
        });
      }
    },
    address: {
      get() {
        return this.$store.getters.forms.newcall.address;
      },
      set(value) {
        this.$store.commit("formnewcall", {
          address: value !== null ? value.toUpperCase() : null
        });
      }
    },
    city: {
      get() {
        return this.$store.getters.forms.newcall.city;
      },
      set(value) {
        this.$store.commit("formnewcall", {
          city: value !== null ? value.toUpperCase() : null
        });
      }
    },
    description: {
      get() {
        return this.$store.getters.forms.newcall.description;
      },
      set(value) {
        this.$store.commit("formnewcall", {
          description: value !== null ? value.toUpperCase() : null
        });
      }
    },
    console: {
      get() {
        return this.$store.getters.forms.newcall.console;
      },
      set(value) {
        this.$store.commit("formnewcall", {
          console: value !== null ? value.toUpperCase() : null
        });
      }
    }
  },
  methods: {
    askArchive(callnumber) {
      this.modelArchiveCall = true;
      this.archivecall = callnumber;
    },
    doArchive() {
      EventBus.$emit("console-override", `${this.archivecall} X`);
      this.modelArchiveCall = false;
    },
    popupEdit(callnumber, field) {
      const [call] = this.calls.filter(c => c.callnumber === callnumber);
      this.callEdit.callnumber = call.callnumber;
      this.callEdit.field = field;
      switch (this.callEdit.field) {
        case "type":
          this.callEdit.data = call.type;
          break;
        case "address":
          this.callEdit.data = { address: call.address, city: call.city };
          break;
        case "description":
          this.callEdit.data = call.description;
          break;
        default:
          break;
      }
      this.callEdit.show = true;
    },
    doEdit() {
      let console;
      switch (this.callEdit.field) {
        case "type":
          console = `${
            this.callEdit.callnumber
          } T R ${this.callEdit.data.toUpperCase()}`;
          break;
        case "address":
          if (
            !this.callEdit.data.address.match(/(\d+) (.+)/g) &&
            !this.callEdit.data.address.match(
              /[A-Za-z 0-9]+ and [A-za-z 0-9]/g
            ) &&
            !this.callEdit.data.address.match(/Route|highway \d+ Mile \d+/g)
          ) {
            this.errorModalText = "The address is not formatted correctly";
            this.modelErrorShow = true;
            break;
          }
          console = `${
            this.callEdit.callnumber
          } AD R ${this.callEdit.data.address.toUpperCase()}///${
            this.callEdit.callnumber
          } C R ${this.callEdit.data.city}`;
          break;
        case "description":
          console = `${
            this.callEdit.callnumber
          } D R ${this.callEdit.data.toUpperCase()}`;
          break;
        default:
          break;
      }
      EventBus.$emit("console-override", console);
    },
    pending() {
      if (this.calls === undefined) {
        return [];
      }
      return this.calls
        .filter(c => c.assigned.length === 0)
        .sort((a, b) => (a.callnumber.substring(4) > b.callnumber.substring(4) ? 1 : -1));
    },
    assigned() {
      if (this.calls === undefined) {
        return [];
      }
      return this.calls
        .filter(c => c.assigned.length > 0)
        .sort((a, b) => (a.callnumber.substring(4) > b.callnumber.substring(4) ? 1 : -1));
    },
    getPendingShortcut(i) {
      return this.pendingCalls[i];
    },
    getAssignedShortcut(i) {
      return this.assignedCalls[i];
    },
    createCall() {
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
        this.type.length < 1 ||
        this.city === null ||
        this.description === null
      ) {
        this.errorModalText = "All boxes are required.";
        this.modelErrorShow = true;
        return;
      }
      this.isCreating = true;
      this.$apollo
        .mutate({
          mutation: CALL_CREATE,
          variables: {
            server_id: this.$store.getters.server.id,
            type: this.type,
            address: this.address,
            city: this.city,
            description: this.description,
            assigned: "[]",
            status: "live"
          }
        })
        .then(() => {
          this.type = null;
          this.address = null;
          this.city = null;
          this.description = null;
          this.isCreating = false;
          document.activeElement.blur();
        });
    },
    handleTab(e) {
      e.preventDefault();

      const { console } = this;
      const c = console.split("///");
      const shortcut = c[c.length - 1];
      let callnumber;
      if (this.pendingCalls.indexOf(shortcut.toUpperCase()) !== -1) {
        callnumber = this.pending()[
          this.pendingCalls.indexOf(shortcut.toUpperCase())
        ].callnumber;
      } else if (this.assignedCalls.indexOf(shortcut.toUpperCase()) !== -1) {
        callnumber = this.assigned()[
          this.assignedCalls.indexOf(shortcut.toUpperCase())
        ].callnumber;
      } else {
        let matched = -1;
        this.calls.forEach(v => {
          if (v.callnumber.indexOf(shortcut) && matched === -1) {
            matched = v.callnumber;
          }
        });
        if (matched === -1) {
          this.errorModalText = "Could not match your shortcut.";
          this.modelErrorShow = true;
          return;
        }
        callnumber = matched;
      }
      c[c.length - 1] = `${callnumber} `;
      this.console = c.join("///");
    },
    submitConsole() {
      this.consoleRet = "Running";
      EventBus.$emit("console-process");
    }
  }
};
</script>

<style lang="scss">
.hovercursor {
  cursor: pointer;
}
</style>

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
