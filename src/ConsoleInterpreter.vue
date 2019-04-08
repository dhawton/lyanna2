<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";
import { EventBus } from "./EventBus";
import { split } from "./utils/tools";
import {
  CHANGE_STATUS,
  CHANGE_SIGNON,
  CHANGE_IDENTIFIER,
  SIGNOFF
} from "@/store/queries/user";
import { CALL_EDIT } from "@/store/queries/calls";
import { cities } from "@/utils/commondata";

export default {
  name: "ConsoleInterpreter",
  data() {
    return {};
  },
  computed: {
    console: {
      get() {
        return this.$store.getters.forms.newcall.console;
      },
      set(value) {
        this.$store.commit("formnewcall", {
          console: value !== null ? value.toUpperCase() : null
        });
      }
    },
    ...mapGetters(["calls", "units"])
  },
  created() {
    EventBus.$on("console-process", () => {
      this.processConsole(this.console.split("///"));
    });
    EventBus.$on("console-override", msg => {
      this.processConsole(msg.split("///"), true);
    });
  },
  methods: {
    processConsole(toProcess, override = false) {
      const msgs = [];

      toProcess.forEach(line => {
        const args = split(line, " ", 2);
        /*                      <option value="ALL">ALL</option>
              <option value="LSPD">LSPD</option>
              <option value="BCSO">BCSO</option>
              <option value="SASP">SASP</option>
              <option value="FIRE">SAFR</option>
              <option value="SADI">SADI</option>
              <option value="OOS">OOS</option> */
        if (args[0] === "F" || args[0] === "FILTER") {
          if (
            ["ALL", "OOS", "SADI", "LSPD", "BCSO", "SASP", "FIRE"].includes(
              args[1]
            )
          ) {
            EventBus.$emit("unit-filter", args[1]);
            msgs.push(`[${line}] Filter changed`);
          } else {
            msgs.push(`[${line}] Invalid filter option ${args[1]}`);
          }
        } else if (args[0] === "VC" || args[0] === "28") {
          this.$store.commit("forms", {
            vehiclecheck: {
              licenseplate: args[1],
              make: null,
              model: null,
              color: null
            }
          });
          this.$router.push({ path: "/cad/vc" });
        } else if (args[0] === "PC" || args[1] === "27") {
          this.$store.commit("forms", {
            personcheck: {
              idnumber: null,
              firstname: args[1],
              lastname: args[2],
              dob: null
            }
          });
          this.$router.push({ path: "/cad/pc" });
        } else if (
          this.units.filter(a => a.session_identifier === args[0]).length > 0
        ) {
          // this is a unit request
          if (args[1] === "S" || args[1] === "STATUS") {
            let newstatus = "BUSY";
            switch (args[2]) {
              case "A":
              case "AVAILABLE":
                newstatus = "Available";
                break;
              case "B":
              case "BUSY":
                newstatus = "Busy";
                break;
              case "O":
              case "OOS":
              case "OUT OF SERVICE":
                newstatus = "Out of Service";
                break;
              case "E":
              case "ENROUTE":
              case "EN-ROUTE":
                newstatus = "En-Route";
                break;
              case "ARR":
              case "ARRIVED":
              case "ON SCENE":
                newstatus = "On Scene";
                break;
              default:
                newstatus = "Busy";
                break;
            }
            this.$apollo.mutate({
              mutation: CHANGE_STATUS,
              variables: {
                identifier: args[0],
                status: newstatus
              }
            });
            msgs.push(`[${line}] OK!`);
          } else if (
            args[1] === "D" ||
            args[1] === "DEPT" ||
            args[1] === "DEPARTMENT"
          ) {
            let department;
            switch (args[2]) {
              case "LSPD":
              case "PD":
              case "POLICE":
                department = "police";
                break;
              case "BCSO":
              case "BC":
              case "SHERIFF":
                department = "sheriff";
                break;
              case "SASP":
              case "SP":
              case "STATE":
              case "HIGHWAY":
                department = "highway";
                break;
              case "DI":
              case "INTEL":
              case "SADI":
                department = "intel";
                break;
              default:
                department = "police";
                break;
            }
            this.$apollo.mutate({
              mutation: CHANGE_SIGNON,
              variables: {
                id: this.units.filter(u => u.session_identifier === args[0])[0]
                  .id,
                identifier: args[0],
                dept: department
              }
            });
            msgs.push(`[${line}] OK!`);
          } else if (args[1] === "SO" || args[1] === "SIGNOFF") {
            let id = 0;
            this.units.forEach(v => {
              if (v.session_identifier === args[0]) {
                // eslint-disable-next-line prefer-destructuring
                id = v.identifier;
              }
            });
            if (!id) {
              msgs.push(`[${line}] Problem getting signon id`);
            } else {
              this.$apollo.mutate({
                mutation: SIGNOFF,
                variables: {
                  identifier: id
                }
              });
              msgs.push(`[${line}] OK!`);
            }
          } else if (
            args[1] === "I" ||
            args[1] === "IDENT" ||
            args[1] === "IDENTIFIER"
          ) {
            let id = 0;
            this.units.forEach(v => {
              if (v.session_identifier === args[0]) {
                // eslint-disable-next-line prefer-destructuring
                id = v.identifier;
              }
            });
            if (!id) {
              msgs.push(`[${line}] Problem getting signon id`);
            } else {
              this.$apollo.mutate({
                mutation: CHANGE_IDENTIFIER,
                variables: {
                  identifier: id,
                  new_identifier: args[2]
                }
              });
            }
          } else {
            msgs.push(`[${line}] Unknown command1`);
          }
        } else if (
          this.calls.filter(c => c.callnumber === args[0]).length > 0
        ) {
          let arg2 = null;
          if (args[2] !== undefined) {
            arg2 = split(args[2], " ", 1);
          }
          const call = this.calls.filter(c => c.callnumber === args[0])[0];
          if (args[1] === "T" || args[1] === "TYPE") {
            if (
              arg2[0] === "A" ||
              arg2[0] === "APPEND" ||
              arg2[0] === "R" ||
              arg2[0] === "REPLACE"
            ) {
              this.$apollo.mutate({
                mutation: CALL_EDIT,
                variables: {
                  callnumber: args[0],
                  type:
                    arg2[0] === "A" || arg2[0] === "APPEND"
                      ? `${call.type} // ${arg2[1]}`
                      : arg2[1]
                }
              });
              msgs.push(`[${line}] OK!`);
            } else {
              msgs.push(`[${line}] Unknown command ${arg2[0]}`);
            }
          } else if (args[1] === "AD" || args[1] === "ADDRESS") {
            if (arg2[0] === "R" || arg2[0] === "REPLACE") {
              if (
                !arg2[1].match(/(\d+) (.+)/g) &&
                !arg2[1].match(/[A-Za-z 0-9]+ and [A-za-z 0-9]/g) &&
                !arg2[1].match(/Route|highway \d+ Mile \d+/g)
              ) {
                msgs.push(`[${line}] Invalid address, check format`);
              } else {
                this.$apollo.mutate({
                  mutation: CALL_EDIT,
                  variables: {
                    callnumber: args[0],
                    address: arg2[1]
                  }
                });
                msgs.push(`[${line}] OK!`);
              }
            } else {
              msgs.push(`[${line}] Unknown command ${arg2[0]}`);
            }
          } else if (args[1] === "C" || args[1] === "CITY") {
            if (arg2[0] === "R" || arg2[0] === "REPLACE") {
              let matched = false;
              cities.forEach(v => {
                if (v.toUpperCase() === arg2[1].toUpperCase()) matched = true;
              });
              if (matched) {
                this.$apollo.mutate({
                  mutation: CALL_EDIT,
                  variables: {
                    callnumber: args[0],
                    city: arg2[1]
                  }
                });
                msgs.push(`[${line}] OK!`);
              } else {
                msgs.push(`[${line}] Unknown city passed: ${arg2[1]}`);
              }
            } else {
              msgs.push(`[${line}] Unknown command ${arg2[0]}`);
            }
          } else if (
            args[1] === "D" ||
            args[1] === "DESCRIPTION" ||
            args[1] === "DESC"
          ) {
            if (
              arg2[0] === "A" ||
              arg2[0] === "APPEND" ||
              arg2[0] === "R" ||
              arg2[0] === "REPLACE"
            ) {
              this.$apollo.mutate({
                mutation: CALL_EDIT,
                variables: {
                  callnumber: args[0],
                  description:
                    arg2[0] === "A" || arg2[0] === "APPEND"
                      ? `${call.description} // ${arg2[1]}`
                      : arg2[1]
                }
              });
              msgs.push(`[${line}] OK!`);
            } else {
              msgs.push(`[${line}] Unknown command ${arg2[0]}`);
            }
          } else if (args[1] === "A" || args[1] === "ASSIGN") {
            let msg = `[${line}] `;
            const list = args[2].split(/,[ ]?/);
            list.forEach(v => {
              if (call.assigned.includes(v)) {
                msg += `${v} already assigned. `;
              } else if (
                this.units.filter(u => u.session_identifier === v).length === 0
              ) {
                msg += `${v} is not on duty. `;
              } else {
                call.assigned.push(v);
                msg += `${v} assigned. `;
              }
            });
            msgs.push(msg.trim());
            this.$apollo.mutate({
              mutation: CALL_EDIT,
              variables: {
                callnumber: args[0],
                assigned: JSON.stringify(call.assigned)
              }
            });
          } else if (args[1] === "U" || args[1] === "UNASSIGN") {
            let msg = `[${line}] `;
            const list = args[2].split(/,[ ]?/);
            list.forEach(v => {
              if (call.assigned.filter(u => u === v).length === 0) {
                msg += `${v} is not assigned. `;
              } else {
                call.assigned = call.assigned.filter(u => u !== v);
                msg += `${v} unassigned. `;
              }
            });
            msgs.push(msg.trim());
            this.$apollo.mutate({
              mutation: CALL_EDIT,
              variables: {
                callnumber: args[0],
                assigned: JSON.stringify(call.assigned)
              }
            });
          } else if (args[1] === "X" || args[1] === "ARCHIVE") {
            this.$apollo.mutate({
              mutation: CALL_EDIT,
              variables: {
                callnumber: args[0],
                assigned: "[]",
                status: "archived"
              }
            });
            msgs.push(`[${line}] OK!`);
          } else if (
            args[1] === "SA" ||
            args[1] === "STATUS" ||
            args[1] === "STATUSALL"
          ) {
            let msg = `[${line}] `;
            let newstatus = null;
            switch (args[2]) {
              case "A":
              case "AVAILABLE":
                newstatus = "Available";
                break;
              case "B":
              case "BUSY":
                newstatus = "Busy";
                break;
              case "O":
              case "OOS":
              case "OUT OF SERVICE":
                newstatus = "Out of Service";
                break;
              case "E":
              case "ENROUTE":
              case "EN-ROUTE":
                newstatus = "En-Route";
                break;
              case "ARR":
              case "ARRIVED":
              case "ON SCENE":
                newstatus = "On Scene";
                break;
              default:
                newstatus = "Busy";
                break;
            }
            call.assigned.forEach(v => {
              if (
                this.units.filter(u => u.session_identifier === v)[0].status !==
                newstatus
              ) {
                this.$apollo.mutate({
                  mutation: CHANGE_STATUS,
                  variables: {
                    identifier: v,
                    status: newstatus
                  }
                });
                msg += `${v} changed. `;
              }
            });
            msgs.push(msg.trim());
          } else {
            msgs.push(`[${line}] Unknown command ${args[1]}`);
          }
        } else {
          msgs.push(`[${line}] ${args[0]} is neither a unit nor a call.`);
        }
      });

      EventBus.$emit("console-return", {
        ret: msgs.join(" // "),
        override
      });
    }
  }
};
</script>

<style>
</style>
