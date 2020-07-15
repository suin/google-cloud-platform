# Google Cloud FunctionsでOAuth2のアクセストークンを取得するデモ

## 概要

Google Cloud PlatformのFunctionsでGmail APIのアクセストークンを取得するデモです。

FunctionsはTypeScriptで実装されています。

## 準備

### 新しいプロジェクトを作る

GCP管理画面で新しいプロジェクトを作る。プロジェクトIDを控えておく。

### リージョンとプロジェクトを固定する

gcloudコマンドでいちいち`--project`や`--region`を指定しなくてよいよう、プロジェクトとリージョンを設定しておく。

```bash
# プロジェクト用の設定を作る
gcloud config configurations create $プロジェクト名

# 認証しておく
gcloud auth login

# プロジェクトをセットしておく
gcloud config set project $プロジェクト名

# functionsのリージョンをTokyoに固定しておく
gcloud config set functions/region asia-northeast1
```

### OAuth同意画面を作る

1. 「APIとサービス」→「OAuth同意画面」で同意画面を作っておく

### 認証情報を作る

1. 「APIとサービス」→「認証情報」を開く
1. 「+認証情報を作成」ドロップダウンメニューで「OAuth クライアント ID」を開き以下の設定で埋める:
    * 「アプリケーションの種類」:「ウェブ アプリケーション」
    * 「名前」: 何でもいい。デフォルトの「ウェブ クライアント 1」のままでもOK
    * 「承認済みのリダイレクト URI」: `https://${GCF_REGION}-${GCLOUD_PROJECT}.cloudfunctions.net/oauth2callback`
1. 「作成」を押す
1. クライアントIDとクライアントシークレットが入ったJSONをダウンロードし、`client_secret.json`というファイル名で保存する

### Gmail APIをONにする

※このサンプルでは実際にはGmail APIを叩かないが、OAuthの認可画面でどのAPIを認可するかが出ていたほうが雰囲気が出るのでGmail APIをONにしておく。

1. 「APIとサービス」→「ダッシュボード」→「+APIとサービスを有効化」を開く
1. 「Gmail」でサービスを検索し、「有効にする」を押す

## デプロイ

認可画面へリダイレクトする関数をデプロイする:

```bash
yarn deploy:oauth2init
```

認可画面から戻ってきたときの関数をデプロイする:

```bash
yarn deploy:oauth2callback
```

## ユーザとしてOAuthを試す

1. `https://asia-northeast1-${プロジェクト名}.cloudfunctions.net/oauth2init`にブラウザでアクセスする。
1. 認可画面が出るので認可を済ませる
1. すると、GCP Functionsにリダイレクトされ、そこにアクセストークンを含んだJSONが表示されれば成功。

実際の実装では、得られたアクセストークンなどはGoogle Cloud PlatformのDatastoreなどに保存するといいでしょう。

## 今後試したいこと

* リフレッシュトークンを取得して、アクセストークンの再取得を自動化してみたい。
