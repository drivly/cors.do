import { json } from 'https://pkg.do/itty-router-extras'

export default {
  fetch: ({url}) => json({url})
}
