# ToDo アプリ

期限と優先度を管理できる、自分1人用のシンプルな ToDo アプリです。データはブラウザ内で扱い、外部サービスへ送信しません。

> [ui-ux-driven-development](https://github.com/doraemon-python/agent-skills/tree/master/skills/ui-ux-driven-development)を用いて、簡単なToDoアプリを作成したらどうなるかの検証用リポジトリです。

## 主な機能

- タスクの追加（タイトル・期限・優先度）
- 完了 / 完了の取り消し
- 削除（確認ダイアログあり）
- 未完了と完了済みの分割表示
- 読み込み中・エラー・0件・大量データの表示

## 起動

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173/ を開きます。

## コマンド

| コマンド                  | 内容                                |
| ------------------------- | ----------------------------------- |
| `npm run dev`             | 開発サーバー                        |
| `npm run build`           | 型チェック + 本番ビルド             |
| `npm run preview`         | ビルド結果のプレビュー              |
| `npm run typecheck`       | 型チェック                          |
| `npm run lint`            | Oxlint                              |
| `npm test`                | Vitest（1回実行）                   |
| `npm run test:watch`      | Vitest（監視）                      |
| `npm run format`          | Prettier                            |
| `npm run storybook`       | Storybook（http://localhost:6006/） |
| `npm run build-storybook` | Storybook の静的ビルド              |

## モックデータの切り替え

UI の状態確認用に、URL パラメータでモックの挙動を変えられます。

| パラメータ  | 例                                      | 内容                           |
| ----------- | --------------------------------------- | ------------------------------ |
| `mockDelay` | `?mockDelay=1500`                       | 読み込み・操作の遅延（ミリ秒） |
| `mockError` | `?mockError=1`                          | 一覧の読み込みを失敗させる     |
| `mockError` | `?mockError=create,setCompleted,remove` | 指定した操作を失敗させる       |
| `mockEmpty` | `?mockEmpty=1`                          | 0件の状態で開始                |
| `mockCount` | `?mockCount=200`                        | 指定件数のサンプルデータで開始 |

複数指定する場合は `?mockDelay=1000&mockError=1` のように `&` でつなぎます。

## 構成

```text
src/
  App.tsx                    画面とデータ層の接続
  components/                UI コンポーネントと Storybook ストーリー
  constants/                 優先度の定義
  data/                      リポジトリ契約・モック実装・モックデータ
  storage/                   localStorage 実装（Step7・8で追加）
  types/                     型定義
  test/                      テスト設定とアクセシビリティテスト
docs/
  decisions/                 技術判断の記録（ADR）
  intent.md                  目的・利用シーン・非機能要件
  logic-spec.md              ロジック仕様
  ui-principles.md           UI/UX の原則
  progress.md                開発の進捗
```

## 現在の保存状態

現時点ではモック実装のため、リロードするとタスクは初期データに戻ります。localStorage への永続化は Step7・8 で実装します。
