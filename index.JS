const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-12d8c-firebase-adminsdk-qv78c-5f636c51f3.json')
const databaseURL = 'https://fcm-12d8c.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-12d8c/messages:send'
const deviceToken =
  'fYI6AbDcenhb4dkE8AUTKo:APA91bGLLnBVaVYBkFvBZ46M9Tu8blKaWO2epeLDwRezegGuskNqGHdOrFAw4RFhR-vY6w-iubMo7H9JXML3erWTyXSGfomV77atu1FSyA0d2rhqfrHLGr_Ybr_FuwZ3f2nrDEty7AsC'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()