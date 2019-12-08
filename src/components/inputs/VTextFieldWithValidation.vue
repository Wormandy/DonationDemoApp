<template>
  <ValidationProvider :name="$attrs.label" :rules="rules" v-slot="{ errors, valid }" :vid="vid">
    <v-text-field
      v-model="innerValue"
      :error-messages="errors"
      :success="valid"
      v-bind="$attrs"
      v-on="$listeners">
      <template v-slot:progress>
        <slot name="progress">
        </slot>
      </template>
    </v-text-field>
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
