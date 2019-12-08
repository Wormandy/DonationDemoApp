export const messagable = {
  data () {
    return {
      error: '',
      message: '',
      warning: ''
    }
  },
  methods: {
    setError (error) {
      this.error = error
    },
    setMessage (message) {
      this.message = message
    },
    setWarning (warning) {
      this.warning = warning
    },
    onDismissed (type) {
      this.error = (undefined === type || type === 'error') ? '' : this.error
      this.message = (undefined === type || type === 'message') ? '' : this.message
      this.warning = (undefined === type || type === 'warning') ? '' : this.warning
    }
  }
}
