
export default {
  users: [
    { id: '1',
      enabled: '1',
      first_name: 'John',
      last_name: 'Snow',
      is_company: false,
      company: '',
      email: 'test@test.com',
      password: 'test',
      phone1: '555555555',
      street1: '555 Winterfel',
      street2: '',
      city: 'Winterfel',
      province: 'MB',
      province_other: '',
      zipcode: 'W3F 2H5',
      country: 'Canada',
      home_location: 'Canada',
      guest: '0',
      subscription: {
        'id': '1',
        'member_id': '1',
        'account_id': '1',
        'total': '0.10',
        'type': '1',
        'active': '0',
        'startedAt': '2019-12-04 00:00:00',
        'createdAt': '2019-12-03 13:57:31',
        'nextPaymentAt': '2019-12-11',
        'categories': [{ 'category_id': '21', 'amount': '0.10' }],
        'logs': [
        ],
        'member': { 'id': '1', 'first_name': 'John', 'last_name': 'Snow', 'company': '', 'email': 'test@test.com', 'phone1': '555555555', 'arena_id': '1' }
      },
      'ProfileID': 'Found',
      beanstream_profile: {
        card: { 'name': 'John Snow', 'number': '54321XXXXXXX5555', 'expiry_month': '10', 'expiry_year': '20', 'card_type': 'MC' },
        billing: { 'name': 'John Snow', 'address_line1': '555 Winterfel', 'address_line2': '', 'city': 'Winterfel', 'province': 'MB', 'country': 'CA', 'postal_code': 'R3T 2H5', 'phone_number': '555555555', 'email_address': 'test@test.com' }
      }
    }
  ],
  maxUserId: 1,

  login (loginCredentials) {
    var users = this.users
    return new Promise(
      function (resolve, reject) {
        const user = users.find(user => user.email === loginCredentials.email && user.password === loginCredentials.password)
        if (user) {
          setTimeout(() => resolve(user), 1000)
        } else {
          setTimeout(() => reject(new Error('Email or Password is incorrect', 'LoginFailed')), 1000)
        }
      }
    )
  },

  forgotPassword (email) {
    var users = this.users
    return new Promise(
      function (resolve, reject) {
        const user = users.find(user => user.email === email)
        if (user) {
          resolve(true)
        } else {
          reject(new Error('No user with this email'))
        }
      }
    )
  },

  register (payload) {
    var users = this.users
    var maxUserId = this.maxUserId
    return new Promise(
      function (resolve, reject) {
        const userExists = users.find(user => user.email === payload.email)
        if (userExists) {
          setTimeout(() => reject(new Error('User with this email already exists')), 1000)
        } else {
          maxUserId++
          payload.id = maxUserId
          users.push(payload)
          setTimeout(() => resolve(maxUserId), 1000)
        }
      }
    )
  },

  save (payload) {
    var users = this.users
    return new Promise((resolve, reject) => {
      let user = users.find(u => u.id === payload.id)
      user.first_name = payload.first_name
      user.last_name = payload.last_name
      user.is_company = payload.is_company
      user.company = payload.company
      user.phone1 = payload.phone1
      user.street1 = payload.street1
      user.street2 = payload.street2
      user.city = payload.city
      user.province = payload.province
      user.province_other = payload.province_other
      user.zipcode = payload.zipcode
      user.country = payload.country
      user.home_location = payload.home_location
      user.beanstream_profile.billing = { ...payload.beanstream_profile.billing }
      user.beanstream_profile.card = { ...payload.beanstream_profile.card }
      user.beanstream_profile.card.number = this.hideCreditCardNumber(user.beanstream_profile.card.number)
      setTimeout(() => resolve(), 1000)
    })
  },

  detachCard (userId) {
    var user = this.users.find((item) => item.id === userId)
    user.beanstream_profile.card = {}
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 1000)
    })
  },

  hideCreditCardNumber (number) {
    return number.substr(0, 5) + 'XXXXXXX' + number.substr(-4)
  }
}
