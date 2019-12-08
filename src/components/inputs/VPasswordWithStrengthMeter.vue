<template>
  <v-text-field-with-validator
    v-model="innerValue"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    :hint="(passwordStrength < 2) ? 'Too weak': (passwordStrength < 3) ? 'Good' : 'Strong'"
    @click:append="showPassword = !showPassword"
    loading
    v-bind="$attrs"
    v-on="$listeners"
    :type="showPassword ? 'text' : 'password'"
    :vid="vid">
    <template v-slot:progress>
      <v-progress-linear
      :value="passwordStrength*25"
      :color="strengthColors[passwordStrength]"
      absolute
      height="7"/>
    </template>
  </v-text-field-with-validator>
</template>

<script>
import zxcvbn from 'zxcvbn'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'

export default {
  props: {
    value: {
      type: null
    },
    vid: {
      type: String
    }
  },
  components: {
    'v-text-field-with-validator': VTextFieldWithValidation
  },
  data () {
    return {
      showPassword: false,
      innerValue: '',
      strengthColors: [
        'red',
        'red',
        'orange',
        'yellow',
        'green'
      ]
    }
  },
  computed: {
    passwordStrength () {
      return zxcvbn(this.innerValue).score
    }
  },
  watch: {
    innerValue (newVal) {
      this.$emit('input', newVal)
    },
    value (newVal) {
      this.innerValue = newVal
    }
  },
  created () {
    if (this.value) {
      this.innerValue = this.value
    }
  }

}
</script>
