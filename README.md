# Google Cloud Functions: console.log で「ロギング」にログを出す

Google Cloud Functions で`console.log`を使い、GCP の「ロギング」にログを出すデモです。

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

## デプロイ

関数をデプロイする:

```bash
yarn deploy:logging
```

## 関数を呼び出してロギングを試す

GCP のコンソールで、デプロイした関数のログビューアを表示する。

関数を呼び出してロギングを試す:

```bash
project=$(gcloud config get-value project)

# console.logを実行する
curl -H 'X-Mode: log' https://asia-northeast1-${project}.cloudfunctions.net/logging

# console.infoを実行する
curl -H 'X-Mode: info' https://asia-northeast1-${project}.cloudfunctions.net/logging

# console.warnを実行する
curl -H 'X-Mode: warn' https://asia-northeast1-${project}.cloudfunctions.net/logging

# console.errorを実行する
curl -H 'X-Mode: error' https://asia-northeast1-${project}.cloudfunctions.net/logging

# console.traceを実行する
curl -H 'X-Mode: trace' https://asia-northeast1-${project}.cloudfunctions.net/logging

# throw new Error
curl -H 'X-Mode: exception' https://asia-northeast1-${project}.cloudfunctions.net/logging
```

ログビューアにログが出るまで「現在の位置に移動」を何度か押す。ログが出るまで数十秒のタイムラグがある。
