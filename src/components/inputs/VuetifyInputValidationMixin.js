export const VuetifyInputValidationMixin = {
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: null
    },
    vid: {
      type: String
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    // Handles internal model changes.
    innerValue (newVal) {
      this.$emit('input', newVal)
    },
    // Handles external model changes.
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
