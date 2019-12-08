<template>
  <v-container fluid>
    <v-card xs="12" md="8">
      <v-card-title class="d-flex justify-center" cols="12" md="8" outlined>
        Manage Your Recurring
      </v-card-title>
      <v-card-text>
        <recurring-edit-form
          v-if="userCard.number"
          v-bind:recurring="recurring"
          @onSave="onSaveRecurring"
          @onDelete="onDeleteRecurring"
          ref="recurringForm"/>
        <div v-else>
          <h3>You can't to create recurring Donations without credit card stored in you profile</h3>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RecurringEditForm from '@/components/RecurringEditForm'

export default {
  data () {
    return {
    }
  },
  components: {
    'recurring-edit-form': RecurringEditForm
  },
  computed: {
    ...mapGetters('donation', ['recurring']),
    ...mapGetters('user', ['userCard'])
  },
  methods: {
    ...mapActions('donation', ['saveRecurring', 'deleteRecurring']),
    onSaveRecurring (payload) {
      this.saveRecurring(payload)
        .then(() => this.$refs.recurringForm.setMessage('Recurring succesfully saved'))
        .catch((error) => this.$refs.recurringForm.setError(error))
        .finally(() => {
          this.$refs.recurringForm.stopLoading()
          this.$refs.recurringForm.updateInnerData()
        })
    },
    onDeleteRecurring () {
      this.deleteRecurring()
        .then(() => this.$refs.recurringForm.setMessage('Recurring succesfully deleted'))
        .catch((error) => this.$refs.recurringForm.setError(error))
        .finally(() => {
          this.$refs.recurringForm.stopLoading()
          this.$refs.recurringForm.updateInnerData()
        })
    }
  }
}
</script>
