# Privacy

## 端末内だけで扱うデータ

勤務先名、時給、交通費、深夜倍率、色、シフトの日付・時間・休憩・メモ、自分で設定した金額の目安はブラウザのlocalStorageへ保存します。これらをHataraku TileのAPIへ送信しません。ブラウザのサイトデータを消すと削除できます。

CSV、ICS、JSONは利用者が操作したときにブラウザ内で生成します。JSONバックアップの復元もブラウザ内だけで処理します。

## サーバーで扱うデータ

閲覧、勤務先追加、シフト追加、同月5件到達、書き出し、別日再訪のイベント名を、匿名UUIDのSHA-256ハッシュと日付に結び付けてD1へ保存します。入力値、選択日、IPアドレスはD1へ保存しません。イベントは35日後に日次処理で削除します。

Cloudflareは配信と濫用防止のためにリクエストを処理します。外部解析SDK、広告Cookie、OCR、AI API、認証サービスは使用しません。

## 管理

- Operator: `yhay81`
- Security reports: GitHubのPrivate vulnerability reporting
- Source: https://github.com/yhay81/hataraku-tile
