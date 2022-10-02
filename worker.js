import { json } from 'https://pkg.do/apis.do'

export default {
  fetch: ({url}) => json({url})
}
