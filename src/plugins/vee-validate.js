/* eslint-disable camelcase */
import { required, email, min, between, max, confirmed } from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'
import moment from 'moment'

extend('required', {
  ...required,
  message: 'This field is required'
})

extend('min', {
  ...min,
  message: 'This field must be {length} characters or more'
})

extend('max', {
  ...max,
  message: 'This field must be no lonher {length} characters'
})

extend('between', {
  ...between,
  message: 'This field must be between {min} and {max} characters'
})

extend('email', {
  ...email,
  message: 'This field must be a valid email'
})

extend('confirmed', {
  ...confirmed,
  message: 'Password doesn\'t match'
})

extend('creditCardNumber', {
  validate (number) {
    const s = number.replace(/\s/g, '')
    return s.match(/\d{16,17}/g)
  },
  message: 'Invalid Credit card number'
})

extend('creditCardExpire', {
  params: ['year'],
  validate (month, { year }) {
    return moment('01/' + month + '/20' + year, 'DD/MM/YYYY').isSameOrAfter(moment(), 'month')
  },
  message: 'Your credit card has been expired',
  global: true
})
