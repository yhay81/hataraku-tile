# Experiment

## User and job

- Target user: 複数のアルバイト・短時間勤務を自分で管理し、月の予定と収入見込みを同時に把握したい人
- Job to be done: 勤務先ごとの条件を反映し、ひと月のシフト・時間・概算金額を一画面で確認する
- Current workaround: カレンダー、メモ、電卓、給与管理アプリへ同じ情報を分けて入力する

## Hypothesis

勤務先の色、月間カレンダー、金額見込み、素早い入力が一画面に揃い、データを端末外へ出さなければ、複数勤務先を持つ利用者は月5件以上のシフトを登録して再訪する。

## Method

- Recruitment channel: Tool Shelf、GitHub、検索流入
- Duration: 公開から30日
- Comparison: 訪問、勤務先追加、シフト追加、月5件到達、書き出し、別日再訪の匿名集計
- Scope: 手入力と端末内計算。OCR、雇用主連携、給与・税・保険の正式判定は追加しない

## Decision

- Success signal: 30日以内に20人以上が訪問し、10人以上がシフト追加、5人以上が月5件到達、3人以上が書き出し、3人以上が別日に再訪
- Improve signal: シフト追加はあるが月5件到達率が25%未満なら、入力速度とテンプレートを見直す
- Failure signal: 運営者以外とみなせる月5件到達が30日で3件未満
- Deadline: 2026-08-26
- Maximum monthly infrastructure cost: Cloudflare無料枠内

## Guardrails

- 勤務先名、時給、日付、時間、金額、メモをサーバーへ送信しない。
- 概算を給与明細・税・保険の正式計算として表示しない。
- 利用数のために匿名性、35日削除、CSP、rate limitを弱めない。
- 検証条件や競合への言及をサービス画面へ表示しない。
