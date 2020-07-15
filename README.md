# Google Cloud Functions で OAuth2 のアクセストークンを取得するデモ

## 概要

Google Cloud Platform の Functions で Gmail API のアクセストークンを取得するデモです。

Functions は TypeScript で実装されています。

## 準備

### 新しいプロジェクトを作る

GCP 管理画面で新しいプロジェクトを作る。プロジェクト ID を控えておく。

### リージョンとプロジェクトを固定する

gcloud コマンドでいちいち`--project`や`--region`を指定しなくてよいよう、プロジェクトとリージョンを設定しておく。

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

### OAuth 同意画面を作る

1. 「API とサービス」→「OAuth 同意画面」で同意画面を作っておく

### 認証情報を作る

1. 「API とサービス」→「認証情報」を開く
1. 「+認証情報を作成」ドロップダウンメニューで「OAuth クライアント ID」を開き以下の設定で埋める:
   - 「アプリケーションの種類」:「ウェブ アプリケーション」
   - 「名前」: 何でもいい。デフォルトの「ウェブ クライアント 1」のままでも OK
   - 「承認済みのリダイレクト URI」: `https://${GCF_REGION}-${GCLOUD_PROJECT}.cloudfunctions.net/oauth2callback`
1. 「作成」を押す
1. クライアント ID とクライアントシークレットが入った JSON をダウンロードし、`client_secret.json`というファイル名で保存する

### Gmail API を ON にする

※このサンプルでは実際には Gmail API を叩かないが、OAuth の認可画面でどの API を認可するかが出ていたほうが雰囲気が出るので Gmail API を ON にしておく。

1. 「API とサービス」→「ダッシュボード」→「+API とサービスを有効化」を開く
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

## ユーザとして OAuth を試す

1. `https://asia-northeast1-${プロジェクト名}.cloudfunctions.net/oauth2init`にブラウザでアクセスする。
1. 認可画面が出るので認可を済ませる
1. すると、GCP Functions にリダイレクトされ、そこにアクセストークンを含んだ JSON が表示されれば成功。

実際の実装では、得られたアクセストークンなどは Google Cloud Platform の Datastore などに保存するといいでしょう。

## 今後試したいこと

- リフレッシュトークンを取得して、アクセストークンの再取得を自動化してみたい。
