# Hataraku Tile

複数の勤務先とシフトを色分けした月間カレンダーへ並べ、勤務時間・交通費・給与の見込みを端末内でまとめるWebアプリです。

## できること

- 勤務先を6件まで登録し、時給・交通費・22時以降の倍率・色を設定
- 日付を押してシフトを追加し、月間カレンダーで一覧
- 日をまたぐ勤務、休憩、深夜時間を含む勤務時間と金額の概算
- 月と年の見込み、自分で設定した目安との比較
- CSV、カレンダー用ICS、JSONバックアップの書き出し
- インストール可能なPWAと、既に開いた画面のオフライン利用

勤務先名、シフト、時給、金額、メモはブラウザのlocalStorageへ保存し、APIへ送信しません。正式な給与・税・保険の計算は行いません。

## 開発

Node.js 24 LTSとnpmを使用します。

```powershell
npm ci
npx wrangler d1 migrations apply hataraku-tile --local
npm run check
npm test
npm run build
npm run dev
```

## 運用

```powershell
npm run metrics
npm run deploy
npm run indexnow
```

技術構成は[STACK.md](./STACK.md)、検証判断は[EXPERIMENT.md](./EXPERIMENT.md)、データ境界は[PRIVACY.md](./PRIVACY.md)を参照してください。
