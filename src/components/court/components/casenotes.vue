<template>
  <div>
    <b-list-group>
      <b-list-group-item>
        <h3>Case #{{lcase.id}} - {{lcase.title}}</h3>
        <b-form-group label-cols-md="1" label="Title" label-for="title">
          <b-input-group>
            <b-form-input id="title" v-model="title"/>
            <b-input-group-append>
              <b-button variant="success" @click="saveTitle">Save</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-form-group label-cols-md="1" label="Status" label-for="status">
          <b-input-group>
            <b-select class="select-small" v-model="status" @change="doBlur">
              <option>Open</option>
              <option>Closed</option>
              <option>Cold</option>
            </b-select>
            <b-input-group-append>
              <b-button variant="success" @click="saveStatus">Save</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <p>
          Opened by: {{ lcase.created_by }} on
          {{
          `${(new Date(lcase.created_at)).getMonth()+1}/${(new Date(lcase.created_at)).getDate()}/${(new Date(lcase.created_at)).getYear()+1900}`
          }}
        </p>
      </b-list-group-item>
      <b-list-group-item v-for="note in lcase.notes" :key="note.id">
        <b-card
          :header="`Posted ${(new Date(note.created_at)).getMonth()+1}/${(new Date(note.created_at)).getDate()}/${(new Date(note.created_at)).getYear()+1900} by ${note.created_by}`"
          header-tag="header"
        >
          <template v-for="(line, i) in note.body.split('\n')">
            {{line}}
            <br :key="i">
          </template>
        </b-card>
      </b-list-group-item>
      <b-list-group-item>
        <b-form-group cols-md="12" label="New Entry" label-for="entry">
          <b-textarea rows="10" id="entry" v-model="entry"/>
        </b-form-group>
        <b-button variant="primary" @click="addEntry">Add Entry</b-button>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { EDIT_CASE, CASE_ADD_ENTRY } from "@/store/queries/cases";

export default {
  name: "CaseNotes",
  props: ["id"],
  data() {
    return {};
  },
  computed: {
    lcase: {
      get() {
        return this.$store.getters.cases.find(
          c => c.id === parseInt(this.id, 10)
        );
      }
    },
    title: {
      get() {
        return this.$store.state.forms.cases.title;
      },
      set(value) {
        this.$store.commit("formcases", { title: value });
      }
    },
    status: {
      get() {
        return this.$store.state.forms.cases.status;
      },
      set(value) {
        this.$store.commit("formcases", { status: value });
      }
    },
    entry: {
      get() {
        return this.$store.state.forms.cases.entry;
      },
      set(value) {
        this.$store.commit("formcases", { entry: value });
      }
    },
    created_by: {
      get() {
        return `${this.$store.getters.signon.session_identifier} - ${
          this.$store.getters.signon.session_name
        }`;
      }
    }
  },
  created() {
    this.$store.commit("formcases", {
      title: this.lcase.title,
      status: this.lcase.status
    });
  },
  methods: {
    saveTitle() {
      this.$apollo.mutate({
        mutation: EDIT_CASE,
        variables: {
          id: this.lcase.id,
          title: this.title
        }
      });
    },
    saveStatus() {
      this.$apollo.mutate({
        mutation: EDIT_CASE,
        variables: {
          id: this.lcase.id,
          status: this.status
        }
      });
    },
    doBlur() {
      document.activeElement.blur();
    },
    addEntry() {
      this.$apollo
        .mutate({
          mutation: CASE_ADD_ENTRY,
          variables: {
            case_id: this.lcase.id,
            created_by: this.created_by,
            body: this.entry
          }
        })
        .then(() => {
          this.entry = "";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-group-item {
  background-color: rgb(20, 20, 20);
  color: #fff;
}
.card-header,
.card-footer {
  background-color: rgb(0, 0, 60);
  color: #fff;
}
.card {
  background: rgb(40, 40, 40);
}
textarea,
textarea:focus,
input,
input:focus,
select,
select:focus {
  background: unset;
  color: #fff;
}
select:focus {
  color: #000;
}
</style>
