import fs from 'fs'
import { google } from 'googleapis'
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions'
import { Credentials } from 'google-auth-library/build/src/auth/credentials'

// Functionsをデプロイするリージョンの設定 (↓はTokyoになってます)
const GCF_REGION = 'asia-northeast1'

// GCPプロジェクトIDの設定 (ご自身のプロジェクトIDに置き換えてください)
const GCLOUD_PROJECT = 'c16e-suin-playground'

const clientSecretJson = JSON.parse(
  fs.readFileSync('./client_secret.json').toString(),
)
const oauth2Client = new google.auth.OAuth2(
  clientSecretJson.web.client_id,
  clientSecretJson.web.client_secret,
  `https://${GCF_REGION}-${GCLOUD_PROJECT}.cloudfunctions.net/oauth2callback`,
)

/**
 * OAuth 2.0認可コードをリクエストする
 */
export const oauth2init: HttpFunction = (req, res) => {
  // OAuth2スコープ(権限)の定義
  const scope = ['https://www.googleapis.com/auth/gmail.readonly']

  // 認可画面のURLを取得
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // リフレッシュトークンを取得するのに必要
    prompt: 'consent', // リフレッシュトークンを取得するのに必要
    scope,
  })

  // 認可画面にリダイレクト
  res.redirect(authUrl)
}

/**
 * 認可コードからアクセストークンとリフレッシュトークンを取得して表示する
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

    // アクセストークンとリフレッシュトークンを表示する
    res.header('content-type', 'application/json')
    res.send(JSON.stringify(token))
  } catch (err) {
    console.error(err)
    res.status(500).send('Something went wrong; check the logs.')
  }
}
