# study-tracker

学習管理アプリ（ポモドーロタイマー付き）。

## スタック

- **Next.js 15** (App Router, `src/` 構成)
- **TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Supabase** (Auth + PostgreSQL)
- **Prisma** (ORM, スキーマ: `prisma/schema.prisma`)
- **Recharts** (グラフ)
- **Bun** (パッケージマネージャ・実行環境)

## ディレクトリ構成

```
src/
  app/                  # ルート (App Router)
    (auth)/             # 認証不要ページ (login, signup)
    (dashboard)/        # 認証必須ページ
      page.tsx          # ダッシュボード
      timer/            # ポモドーロタイマー
      tasks/            # タスク管理
      subjects/         # 科目管理
      stats/            # 統計
      settings/         # 設定
    api/                # API Routes
    layout.tsx
  components/
    ui/                 # shadcn/ui コンポーネント
    timer/              # タイマー関連
    tasks/              # タスク関連
    subjects/           # 科目関連
    stats/              # 統計関連
  lib/
    supabase/           # Supabaseクライアント (client.ts, server.ts, middleware.ts)
    prisma.ts           # Prismaクライアントシングルトン
    utils.ts            # shadcn ユーティリティ
  types/                # 型定義
```

## 主要コマンド

```bash
bun dev              # 開発サーバー起動
bun build            # ビルド
bun lint             # ESLint
bunx prisma generate      # Prisma Client 生成
bunx prisma db push --url "$DIRECT_URL" --accept-data-loss  # スキーマ反映（DIRECT_URLを直接指定すること）
bunx prisma studio        # DB GUI
```

## 環境変数

`.env.local` に設定（`.env.example` 参照）:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

## 実装ルール

- Server Components デフォルト、インタラクティブな箇所のみ `"use client"`
- DB操作は必ず Server Actions または API Routes 経由
- Supabase Auth の `user.id` を各テーブルの `userId` に使用
- shadcn/ui コンポーネントを優先使用、カスタムUIは `src/components/` 配下

## 画面一覧

| パス | 概要 |
|------|------|
| `/` | ダッシュボード（今日の進捗・タイマー・タスク） |
| `/timer` | ポモドーロタイマー |
| `/tasks` | タスク一覧・管理 |
| `/subjects` | 科目管理 |
| `/stats` | 統計・グラフ |
| `/settings` | タイマー設定・目標設定 |

## DBスキーマ概要

`prisma/schema.prisma` 参照。テーブル: `subjects`, `tasks`, `sessions`, `goals`
