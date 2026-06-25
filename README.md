# Portfolio & Learning Log System（ギーク道場）

ポートフォリオ公開と学習ログ管理を行うWebアプリケーション。
AIを活用した学習クイズ機能「ギーク道場」を備え、認証済みユーザーが問題生成・筆記採点・学習履歴管理を行える。

## 主な機能

- **ポートフォリオ公開** — 制作物（Works）の一覧・登録・編集
- **学習ログ管理** — カレンダーUIでの学習記録の閲覧・記録
- **スキル管理** — 習得スキルの登録・管理
- **GitHub連携** — リポジトリ・コミット情報の取得
- **ギーク道場（AIクイズ）** — Claude APIによる問題生成・筆記採点（部分点対応）、正答率・レベル管理、苦手分野分析

## 技術スタック

| 領域 | 技術 |
|------|------|
| フロントエンド | Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 |
| バックエンド | Node.js (18+) / Express 5 |
| データベース | MongoDB (Mongoose) |
| 認証 | JWT / bcryptjs |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| デプロイ | フロントエンド: Vercel / バックエンド: Railway |

## ディレクトリ構成

```
portfolio/
├── frontend/          # Next.js フロントエンド
│   └── src/
│       ├── app/       # ページ (admin / logs / works / login)
│       ├── components/
│       ├── context/
│       ├── lib/
│       └── types/
├── backend/           # Express バックエンド
│   └── src/
│       ├── config/    # DB接続
│       ├── lib/       # claude / github 連携
│       ├── middleware/# 認証
│       ├── models/    # Mongoose モデル
│       └── routes/    # APIルート
├── docs/              # 仕様書
└── logs/              # 学習ログ
```

## セットアップ

### 前提
- Node.js 18 以上
- MongoDB

### フロントエンド

```bash
cd frontend
npm install
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
```

`.env.local.example` をコピーして `.env.local` を作成し、必要な環境変数を設定する。

### バックエンド

```bash
cd backend
npm install
npm run dev      # 開発サーバー起動 (node --watch)
npm start        # 本番起動
npm test         # テスト実行 (Jest)
```

#### 環境変数（backend/.env）

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
CLAUDE_HAIKU_MODEL=claude-haiku-4-5-20251001
CLAUDE_SONNET_MODEL=claude-sonnet-4-6
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret
```

## API エンドポイント

| ベースパス | 主なルート |
|-----------|-----------|
| `/auth` | `POST /login` |
| `/logs` | `GET /` `GET /:id` `POST /` `PUT /:id` `DELETE /:id` |
| `/works` | `GET /` `GET /:id` `POST /` `PUT /:id` `DELETE /:id` |
| `/skills` | `GET /` `POST /` `PUT /:id` `DELETE /:id` |
| `/github` | `GET /repos` `GET /commits` |
| `/quiz` | `POST /generate` `POST /grade` `POST /sessions` `GET /sessions` `GET /stats` `GET /subjects` `POST /subjects` `DELETE /subjects/:id` |

## デプロイ

- **フロントエンド**: `main` への push で Vercel に自動デプロイ
- **バックエンド**: Railway（`railway.toml` で設定、`rootDirectory = backend`）

## ドキュメント

詳細な仕様は [`docs/geek_dojo_spec_final.md`](docs/geek_dojo_spec_final.md) を参照。
