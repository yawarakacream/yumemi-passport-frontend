# yumemi-passport-frontend

![CI](https://github.com/yawarakacream/yumemi-passport-frontend/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/yawarakacream/yumemi-passport-frontend/actions/workflows/cd.yml/badge.svg)

人口構成グラフ  
ゆめみパスポート夏祭り（フロントエンド・2024 年 8 月）の答案実装

[ゆめみパスポート夏祭り](https://hrmos.co/pages/yumemi/jobs/101000000010)・[フロントエンドコーディング試験](https://yumemi.notion.site/0e9ef27b55704d7882aab55cc86c999d)  
課題「都道府県別の総人口推移グラフを表示する SPA（Single Page Application）を構築せよ」

## 開発

| コマンド               | 説明                             |
| :--------------------- | :------------------------------- |
| `npm run dev`          | 開発用サーバを起動する           |
| `npm run build`        | ビルドする                       |
| `npm run start`        | ビルドした成果物を起動する       |
| `npm run lint`         | リントを実行する                 |
| `npm run format:check` | フォーマットのチェックを実行する |
| `npm run test`         | テストを実行する                 |

### Quick Start

**依存関係をインストール**

```bash
npm ci
```

**環境変数を設定**

```bash
cp .env .env.local # .env.local に記述すればよい
```

**開発用サーバを起動**

```bash
npm run dev
```

**ソースコードをテスト**

```bash
npm run lint
npm run format:check
npm run test
```

**ビルド**

```bash
npm run build
```

**成果物を起動**

```bash
npm run start
```

## こだわりポイント

- 都道府県ボタンがカラフル
- グラフが見やすい
  - 都道府県ボタンの色と対応している
  - 端末幅が小さい場合は横スクロールになる
  - 予測値が点線で表示される
- ダークテーマ可能
- 静的サイトとしてビルド・GitHub Pages にデプロイされる
  - 都道府県や（年毎の）人口構成はあまり変わらないので、アクセスの度に RESAS-API を叩く必要はない
  - main ブランチへのプッシュ時に自動実行・任意のタイミングでの手動実行のほか、定期実行も行われる
    - RESAS-API の返答が更新されたとき世間的に許容できる時間を考え、定期実行の頻度はひとまず週に一度とした
  - API キーはビルド時に GitHub Actions の中で利用されるだけなので外部からは見られない
  - 表示が高速（人口構成データは十分小さい）

## 参考

- [ワイヤーフレーム](https://yumemi.notion.site/ab4a837f8e764dffb0fc93c7b1387af7)
- [ゆめみフロントエンド採用コーディング試験で確認しているポイントやよくある質問を公開](https://note.yumemi.co.jp/n/ned7429b59556)
- [RESAS-API](https://opendata.resas-portal.go.jp/)
