import fs from 'fs'
import { google } from 'googleapis'
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions'
import { Credentials } from 'google-auth-library/build/src/auth/credentials'
import { OAuth2Client } from 'google-auth-library'

// Functionsをデプロイするリージョンの設定 (↓はTokyoになってます)
const GCF_REGION = 'asia-northeast1'

// GCPプロジェクトIDの設定 (ご自身のプロジェクトIDに置き換えてください)
const GCLOUD_PROJECT = 'c16e-suin-playground'

// Pub/Subトピック名の設定
const PUBSUB_TOPIC = 'gmail-push-notification'
const topicName = `projects/${GCLOUD_PROJECT}/topics/${PUBSUB_TOPIC}`

// クライアントシークレットの読み込み
const clientSecretJson = JSON.parse(
  fs.readFileSync('./client_secret.json').toString(),
)

// OAuth2クライアントの初期化
const oauth2Client = new google.auth.OAuth2(
  clientSecretJson.web.client_id,
  clientSecretJson.web.client_secret,
  `https://${GCF_REGION}-${GCLOUD_PROJECT}.cloudfunctions.net/oauth2callback`,
)

// Gmail APIクライアントの初期化
const gmail = google.gmail('v1')

/**
 * OAuth 2.0認可コードをリクエストする
 */
export const oauth2init: HttpFunction = (req, res) => {
  // OAuth2スコープ(権限)の定義
  const scope = ['email', 'https://www.googleapis.com/auth/gmail.readonly']

  // 認可画面のURLを取得
  const authUrl = oauth2Client.generateAuthUrl({ access_type: 'online', scope })

  // 認可画面にリダイレクト
  res.redirect(authUrl)
}

/**
 * 認可コードからアクセストークンを取得して表示する
 */
export const oauth2callback: HttpFunction = async (req, res) => {
  // 認可コードを取得する
  const code = req.query.code as string

  try {
    // 認可コードでアクセストークンを取得する
    const token = await new Promise<Credentials>((resolve, reject) =>
      oauth2Client.getToken(code, (err, token) =>
        err ? reject(err) : resolve(token!),
      ),
    )

    // OAuthクライアントに↑で取得したアクセストークンをセットする
    oauth2Client.setCredentials(token)

    // pubsubの設定
    await setUpGmailPushNotifications(oauth2Client)

    res.send('OK')
  } catch (err) {
    console.error(err)
    res.status(500).send('Something went wrong; check the logs.')
  }
}

/**
 * Gmail APIのUsers:watchを設定する
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/watch
 */
const setUpGmailPushNotifications = (oauthClient: OAuth2Client) =>
  gmail.users.watch({
    userId: 'me',
    auth: oauthClient,
    requestBody: {
      labelIds: ['INBOX'],
      topicName: topicName,
    },
  })

/**
 * メール受信時に行う処理
 */
export const handleEmail: PubSubFunction = (event, context) => {
  const data: unknown = JSON.parse(Buffer.from(event.data, 'base64').toString())
  console.log(JSON.stringify({ event, context, data }))
}

type PubSubFunction = (
  event: {
    /**
     * A base64-encoded string.
     */
    readonly data: string
    readonly attributes: null | { readonly [k: string]: string }
  },
  context: {
    readonly eventId: string
    readonly timestamp: string
    readonly eventType: string
  },
) => void | Promise<void>
