# Portfolio & Learning Log System

## 仕様書

* docs/geek_dojo_spec_final.md を参照（必要に応じて読むこと）

---

## プロジェクト概要

ポートフォリオ公開と学習ログ管理を行うWebアプリケーション

---

## コマンド

* 開発: `npm run dev`
* ビルド: `npm run build`
* テスト: `npm run test`

---

## ディレクトリ構成（簡易）

* `/frontend` : フロントエンド
* `/backend` : バックエンド
* `/docs` : ドキュメント

---

## 開発ルール

* 小さく実装し、段階的に機能追加すること

---

## ワークフロー

* 実装完了後はGigHubにpushする，リポジトリがない場合は作成してからpushする
* pushするとフロントエンドは自動でVercelにデプロイされる，バックエンドはExpressで分離されているため必要に応じて更新する
