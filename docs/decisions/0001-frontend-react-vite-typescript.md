---
id: '0001'
title: フロントエンドを React + Vite + TypeScript で構成する
status: accepted
date: 2026-11-13
supersedes: []
superseded_by: []
tags: [frontend, framework, build, typescript]
code: [package.json, vite.config.ts, src/main.tsx, src/App.tsx]
revisit_if: 画面数が増えて React の状態管理が複雑になった場合、またはサーバー保存・認証が必要になった場合
---

# 0001. フロントエンドを React + Vite + TypeScript で構成する

## 背景

個人用の ToDo アプリ。1人・PC 中心・ブラウザ内保存・サーバー認証不要という前提がある。UI を先に作り、操作感を見ながら仕様を固める進め方をするため、画面をコンポーネント単位で切り替えて確認できる構成が向いている。

## 決定

React 19 + Vite 8 + TypeScript で SPA を構成する。

## 検討した選択肢

### A. React + Vite + TypeScript（採用）

小規模 SPA に十分。コンポーネント単位で UI を確認でき、Storybook と相性が良い。Vite で初期化が速く、ビルド後の静的ファイルをローカルで動かせる。React 19.3 / Vite 8.3 は 2026-11-13 時点で活発にメンテナンスされている（npm で確認）。

### B. Vanilla TypeScript + Vite（不採用）

依存最小だが、状態管理・コンポーネント化・カタログ連携を自前で整える必要がある。今後の編集・フィルタ追加で DOM 更新が煩雑になりやすい。

### C. Next.js（不採用）

サーバー機能が不要な今回の要件には過剰。静的 SPA からの移行も考慮すると構成が重い。

## 結果・影響

- コンポーネント単位で UI を作り、Storybook で状態を確認できる。
- 依存は React / React DOM / Vite / TypeScript 程度に抑える。
- サーバー保存や認証が必要になったら、この決定を見直す。
- 初期化時に `package.json`、`vite.config.ts`、`src/main.tsx`、`src/App.tsx` を用意する。
