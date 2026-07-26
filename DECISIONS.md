# Decisions

## 2026-07-26 — 月間カレンダーを中心に公開

- Status: active pilot
- Evidence: 既存のシフト管理サービスには、複数勤務先、カレンダー、素早い入力、給与見込みを求める継続需要がある。
- Decision: OCRや雇用主連携を作らず、勤務先の色・月間カレンダー・概算金額・入力パネルが一目でつながるローカルファーストの作業画面を提供する。
- Privacy boundary: 勤務情報はlocalStorageだけ。サーバーは匿名イベント名と日付だけ。
- Authentication: 所有者データや複数端末同期がないためBetter Authは使わない。
- Design: 大きな見出しや検証説明を置かず、カレンダーと色分けされた勤務タイルを主役にする。
- Next review: 2026-08-26
