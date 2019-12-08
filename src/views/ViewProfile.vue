<template>
  <v-container fluid>
    <v-card md="8">
      <v-card-title class="d-flex justify-center" cols="12" md="8" outlined>
        Personal Information
      </v-card-title>
      <v-card-text>
        <v-row v-for="(value, propertyName) in editableFields" v-bind:key="propertyName">
          <v-col mx-2 class="text-right">
            <strong>{{ value }}:</strong>
          </v-col>
          <v-col>
            {{ user[propertyName] }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['user', 'editableFields']),
    outputFields () {
      return null
    }
  }
}
</script>
