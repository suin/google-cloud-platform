# Google Cloud Functions: console.log で構造化されたログを「ロギング」に出す

Google Cloud Functions で`console.log`を使い、構造化されたログを GCP の「ロギング」にログを出すデモです。

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
yarn deploy:structuredLogging
```

## 関数を呼び出してロギングを試す

GCP のコンソールで、デプロイした関数のログビューアを表示する。

関数を呼び出してロギングを試す:

```bash
project=$(gcloud config get-value project)
curl -H 'X-Demo: 1' https://asia-northeast1-${project}.cloudfunctions.net/structuredLogging
curl -H 'X-Demo: 2' https://asia-northeast1-${project}.cloudfunctions.net/structuredLogging
curl -H 'X-Demo: 3' https://asia-northeast1-${project}.cloudfunctions.net/structuredLogging
curl -H 'X-Demo: 4' https://asia-northeast1-${project}.cloudfunctions.net/structuredLogging
curl -H 'X-Demo: 5' https://asia-northeast1-${project}.cloudfunctions.net/structuredLogging
```

ログビューアにログが出るまで「現在の位置に移動」を何度か押す。ログが出るまで数十秒のタイムラグがある。
