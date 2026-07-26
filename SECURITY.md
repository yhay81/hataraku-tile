# Security Policy

## Reporting

脆弱性は公開Issueへ書かず、GitHubリポジトリのPrivate vulnerability reportingから報告してください。勤務情報はサーバーに保持しないため、端末データの復旧依頼には対応できません。

## Baseline

- CSP、frame拒否、MIME sniffing拒否、最小権限のPermissions Policy
- Hono JSXによるHTMLエスケープ
- 匿名計測APIの同一サイト検査、厳密なschema、500 byte上限、rate limit
- セッションUUIDをSHA-256で一方向変換し、原値を保存しない
- D1イベントを35日で自動削除
- JSON復元の件数・型・長さ検査とCSV式注入対策
- 外部スクリプト、外部フォント、認証、ユーザー生成HTMLなし
- 依存関係、Cloudflare互換日付、CI検査を固定
