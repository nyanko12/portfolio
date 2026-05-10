# ポートフォリオ兼学習ログシステム 仕様書

---

## 1. システム概要

本システムは、ポートフォリオ公開機能と学習ログ管理機能を提供するWebアプリケーションである。
公開機能は未認証ユーザでも閲覧可能、管理機能は認証ユーザのみ利用可能とする。

---

## 2. 技術仕様

### 2.1 フロントエンド

* React または Next.js
* 状態管理：useState / useEffect

### 2.2 バックエンド

* Node.js（Express）

### 2.3 データベース

* MongoDB

### 2.4 外部API

* GitHub REST API

---

## 3. データ構造

### 3.1 学習ログ（logs）

```json
{
  "_id": "string",
  "date": "YYYY-MM-DD",
  "content": "string",
  "tags": ["string"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

### 3.2 制作物（works）

```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "technologies": ["string"],
  "reason": "string",
  "effort": "string",
  "difficulty": "string",
  "improvement": "string",
  "githubUrl": "string",
  "demoUrl": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

### 3.3 ユーザ（users）

```json
{
  "_id": "string",
  "username": "string",
  "password": "hashed string"
}
```

---

## 4. API仕様

### 4.1 認証

#### POST /auth/login

**リクエスト**

```json
{
  "username": "string",
  "password": "string"
}
```

**レスポンス**

```json
{
  "token": "jwt_token"
}
```

---

### 4.2 学習ログAPI

#### POST /logs

* ログ登録

#### GET /logs

* ログ一覧取得（クエリでタグ指定可能）

例：

```
/logs?tag=React
```

---

#### PUT /logs/:id

* ログ更新

#### DELETE /logs/:id

* ログ削除

---

### 4.3 制作物API

#### POST /works

* 制作物登録

#### GET /works

* 一覧取得

#### GET /works/:id

* 詳細取得

#### PUT /works/:id

* 更新

#### DELETE /works/:id

* 削除

---

### 4.4 GitHub連携API

#### GET /github/repos

* リポジトリ一覧取得

#### GET /github/commits

* 最新コミット取得

---

## 5. 画面仕様

---

### 5.1 トップページ

**表示内容**

* 名前
* 技術スタック
* 制作物（最大3件）

---

### 5.2 制作物一覧ページ

**仕様**

* カード形式で表示
* クリックで詳細画面へ遷移

---

### 5.3 制作物詳細ページ

**表示内容**

* タイトル
* 概要
* 使用技術
* 制作理由
* 工夫点
* 苦労した点
* 改善点
* GitHubリンク
* デモリンク

---

### 5.4 ログイン画面

**入力項目**

* ユーザ名
* パスワード

---

### 5.5 学習ログ一覧画面

**仕様**

* 時系列表示（新しい順）
* タグフィルタあり

---

### 5.6 学習ログ登録画面

**入力項目**

* 日付（デフォルト：当日）
* 学習内容
* タグ（複数選択）

---

### 5.7 制作物管理画面

**機能**

* 登録
* 編集
* 削除

---

## 6. 認証仕様

* JWTを使用
* 管理系APIは認証必須
* トークンはヘッダに付与

```
Authorization: Bearer <token>
```

---

## 7. バリデーション仕様

### 学習ログ

* content：必須
* date：必須

### 制作物

* title：必須
* description：必須

---

## 8. エラー処理

* 400：不正な入力
* 401：認証エラー
* 404：データなし
* 500：サーバエラー

---

## 9. 今後の拡張

* 習得率算出ロジック追加
* 学習ログのグラフ表示
* 自己分析機能追加

---

## 10. 開発優先順位

1. 学習ログ機能
2. 制作物管理機能
3. 公開ポートフォリオ
4. GitHub連携
5. 拡張機能

---
