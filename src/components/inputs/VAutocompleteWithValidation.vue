<template>
  <ValidationProvider :name="$attrs.label" :rules="rules">
    <v-autocomplete
      slot-scope="{ errors, valid }"
      v-model="innerValue"
      :success="valid"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-autocomplete>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { VuetifyInputValidationMixin } from '@/components/inputs/VuetifyInputValidationMixin'

export default {
  components: {
    ValidationProvider
  },
  mixins: [VuetifyInputValidationMixin]
}
</script>
