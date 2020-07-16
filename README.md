# Gmail でメール受信時に Functions を実行する

## 概要

Gmail でメールを受信したとき、GCP の Functions で何らかの処理をするデモです。

Gmail API の Push Notification(Users::watch)を使って、メールボックスのポーリングなしにイベントドリブンに関数を起動します。

Functions は TypeScript で実装されています。

## シーケンス

連携時

[![](https://mermaid.ink/img/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gIOODpuODvOOCti0-PkZ1bmN0aW9uOiAvb2F1dGgyaW5pdOOBq-OCouOCr-OCu-OCuVxuICBGdW5jdGlvbi0tPj7jg6bjg7zjgrY6IOiqjeWPr-eUu-mdouOBq-ODquODgOOCpOODrOOCr-ODiFxuICDjg6bjg7zjgrYtPj5Hb29nbGXoqo3lj6_nlLvpnaI6IOiqjeWPr1xuICBHb29nbGXoqo3lj6_nlLvpnaItLT4-44Om44O844K2OiAvb2F1dGgyY2FsbGJhY2vjgavjg6rjg4DjgqTjg6zjgq_jg4hcbiAg44Om44O844K2LT4-RnVuY3Rpb246IC9vYXV0aDJjYWxsYmFja-OBq-OCouOCr-OCu-OCuVxuICBGdW5jdGlvbi0-PkdtYWlsIEFQSTog44Ki44Kv44K744K544OI44O844Kv44Oz44KS5L2_44Gj44GmUHVzaCBOb3RpZmljYXRpb27jgpLmnInlirnljJZcbiAgR21haWwgQVBJLT4-UHViL1N1Yjog44OI44OU44OD44Kv44Gr44OR44OW44Oq44OD44K344Oj44Go44GX44Gm55m76YyyXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gIOODpuODvOOCti0-PkZ1bmN0aW9uOiAvb2F1dGgyaW5pdOOBq-OCouOCr-OCu-OCuVxuICBGdW5jdGlvbi0tPj7jg6bjg7zjgrY6IOiqjeWPr-eUu-mdouOBq-ODquODgOOCpOODrOOCr-ODiFxuICDjg6bjg7zjgrYtPj5Hb29nbGXoqo3lj6_nlLvpnaI6IOiqjeWPr1xuICBHb29nbGXoqo3lj6_nlLvpnaItLT4-44Om44O844K2OiAvb2F1dGgyY2FsbGJhY2vjgavjg6rjg4DjgqTjg6zjgq_jg4hcbiAg44Om44O844K2LT4-RnVuY3Rpb246IC9vYXV0aDJjYWxsYmFja-OBq-OCouOCr-OCu-OCuVxuICBGdW5jdGlvbi0-PkdtYWlsIEFQSTog44Ki44Kv44K744K544OI44O844Kv44Oz44KS5L2_44Gj44GmUHVzaCBOb3RpZmljYXRpb27jgpLmnInlirnljJZcbiAgR21haWwgQVBJLT4-UHViL1N1Yjog44OI44OU44OD44Kv44Gr44OR44OW44Oq44OD44K344Oj44Go44GX44Gm55m76YyyXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

メール受信時

[![](https://mermaid.ink/img/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gIEdtYWlsLT4-UHViL1N1YjogZ21haWwtcHVzaC1ub3RpZmljYXRpb27jg4jjg5Tjg4Pjgq_jgavjg6Hjg4Pjgrvjg7zjgrjjgpLnmbvpjLJcbiAgUHViL1N1Yi0-PkZ1bmN0aW9uOiBoYW5kbGVFbWFpbOmWouaVsOOCkui1t-WLlVxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gIEdtYWlsLT4-UHViL1N1YjogZ21haWwtcHVzaC1ub3RpZmljYXRpb27jg4jjg5Tjg4Pjgq_jgavjg6Hjg4Pjgrvjg7zjgrjjgpLnmbvpjLJcbiAgUHViL1N1Yi0-PkZ1bmN0aW9uOiBoYW5kbGVFbWFpbOmWouaVsOOCkui1t-WLlVxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

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

### Pub/Sub トピックを作る

1. 「Pub/Sub」→「+トピックの作成」を開く
1. 「トピック ID」に`gmail-push-notification`と入力し、「トピックを作成」をクリック
1. 作成したトピックを開き「情報パネルを表示」を押し、情報パネルを開く

Gmail ユーザが Pub/Sub にメッセージを投げられるよう権限を与える

1. そこの「権限」タブを開き「メンバーを追加」を押す
1. 「新しいメンバー」の欄に`allAuthenticatedUsers`を入力する。(G Suite の場合、`craftsman-software.com`のような組織ドメインでも OK)
1. 「ロールを選択」の欄は「Pub/Sub パブリッシャー」を選ぶ → 保存

## デプロイ

認可画面へリダイレクトする関数をデプロイする:

```bash
yarn deploy:oauth2init
```

認可画面から戻ってきたときの関数をデプロイする:

```bash
yarn deploy:oauth2callback
```

メール受信時に起動する関数をデプロイする:

```bash
yarn deploy:handleEmail
```

## ユーザとして試す

連携

1. `https://asia-northeast1-${プロジェクト名}.cloudfunctions.net/oauth2init`にブラウザでアクセスする。
1. 認可画面が出るので認可を済ませる
1. すると、GCP Functions にリダイレクトされ、OK が表示されれば Gmail API Push Notification→Pub/Sub への連携が完了。

メールを送る

1. 認可した Google アカウントのメールアドレスに何かメールを送る
1. GCP Functions 管理画面の`handleEmail`のログにプッシュ通知のペイロードが表示される

※プッシュ通知に含まれるのは`historyId`とメールアドレスだけなので、メールの内容を得るには`historyId`を使ってメールを GET する必要があります。
