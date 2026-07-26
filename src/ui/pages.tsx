import { product } from "../config/product";
import { Layout } from "./layout";

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

export function HomePage() {
  return (
    <Layout>
      <section class="workspace-intro">
        <span class="app-symbol" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <div>
          <h1>{product.headline}</h1>
          <p>勤務先を選び、日付を押して追加。時間と金額が月ごとにまとまります。</p>
        </div>
        <span class="local-badge">予定と金額は端末内だけ</span>
      </section>

      <section class="summary-strip" aria-label="今月の集計">
        <div>
          <span>見込み</span>
          <strong id="summary-pay">¥0</strong>
        </div>
        <div>
          <span>勤務時間</span>
          <strong id="summary-hours">0時間</strong>
        </div>
        <div>
          <span>シフト</span>
          <strong id="summary-count">0件</strong>
        </div>
        <div>
          <span>交通費</span>
          <strong id="summary-transit">¥0</strong>
        </div>
        <div class="goal-summary">
          <span>月の目安</span>
          <strong id="summary-goal">0%</strong>
          <i>
            <b id="goal-bar"></b>
          </i>
        </div>
      </section>

      <div class="shift-workbench">
        <aside class="workplace-panel" aria-label="勤務先と設定">
          <header class="panel-header">
            <div>
              <h2>勤務先</h2>
            </div>
            <output id="workplace-count">2件</output>
          </header>
          <div class="sample-note" id="sample-note">
            <span>シフト例を表示中</span>
            <button id="clear-sample" type="button">
              例を消す
            </button>
          </div>
          <div class="workplace-list" id="workplace-list"></div>
          <button class="dashed-button" id="new-workplace" type="button">
            ＋ 勤務先を追加
          </button>

          <form class="workplace-form" id="workplace-form">
            <input id="workplace-id" type="hidden" />
            <label class="field">
              <span>名前</span>
              <input id="workplace-name" maxlength={24} placeholder="例: カフェ" required />
            </label>
            <div class="two-fields">
              <label class="field">
                <span>時給</span>
                <span class="input-unit">
                  <i>¥</i>
                  <input id="workplace-hourly" max="100000" min="0" required type="number" />
                </span>
              </label>
              <label class="field">
                <span>1勤務の交通費</span>
                <span class="input-unit">
                  <i>¥</i>
                  <input id="workplace-transit" max="100000" min="0" required type="number" />
                </span>
              </label>
            </div>
            <div class="two-fields">
              <label class="field">
                <span>22時以降の倍率</span>
                <input id="workplace-late-rate" max="3" min="1" step="0.05" type="number" />
              </label>
              <fieldset class="color-field">
                <legend>色</legend>
                <div id="workplace-colors">
                  {["coral", "blue", "green", "violet", "amber", "slate"].map((color, index) => (
                    <label>
                      <input
                        checked={index === 0}
                        name="workplace-color"
                        type="radio"
                        value={color}
                      />
                      <i class={`color-${color}`}></i>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <div class="form-actions">
              <button
                class="secondary-button danger-button"
                hidden
                id="delete-workplace"
                type="button"
              >
                削除
              </button>
              <button class="primary-small" type="submit">
                勤務先を保存
              </button>
            </div>
          </form>

          <section class="target-box" aria-labelledby="target-title">
            <header>
              <h3 id="target-title">自分の目安</h3>
              <span>見込み比較用</span>
            </header>
            <label class="field">
              <span>月の金額</span>
              <span class="input-unit">
                <i>¥</i>
                <input id="monthly-goal" max="10000000" min="0" type="number" />
              </span>
            </label>
            <label class="field">
              <span>年の金額</span>
              <span class="input-unit">
                <i>¥</i>
                <input id="yearly-goal" max="100000000" min="0" type="number" />
              </span>
            </label>
            <p>税・保険の判定ではありません。自分で決めた比較値です。</p>
          </section>
        </aside>

        <section class="calendar-panel" aria-labelledby="calendar-title">
          <header class="calendar-heading">
            <button aria-label="前の月" id="previous-month" type="button">
              ‹
            </button>
            <div>
              <h2 id="calendar-title">—</h2>
            </div>
            <button class="today-button" id="today-month" type="button">
              今月
            </button>
            <button aria-label="次の月" id="next-month" type="button">
              ›
            </button>
          </header>
          <div class="weekday-row" aria-hidden="true">
            {weekdays.map((weekday) => (
              <span>{weekday}</span>
            ))}
          </div>
          <div class="calendar-grid" id="calendar-grid" role="grid"></div>
          <div class="calendar-legend" id="calendar-legend"></div>
          <section class="year-progress" aria-labelledby="year-title">
            <header>
              <div>
                <h3 id="year-title">年の見込み</h3>
              </div>
              <output id="year-total">¥0</output>
            </header>
            <div class="year-bars" id="year-bars"></div>
            <p id="year-goal-note">年の目安を設定すると、残りがここに表示されます。</p>
          </section>
        </section>

        <aside class="entry-panel" aria-label="シフト入力">
          <header class="panel-header">
            <div>
              <h2 id="entry-title">シフトを追加</h2>
            </div>
            <button id="reset-shift-form" type="button">
              クリア
            </button>
          </header>
          <div class="template-row" id="template-row"></div>
          <form id="shift-form">
            <input id="shift-id" type="hidden" />
            <label class="field">
              <span>日付</span>
              <input id="shift-date" required type="date" />
            </label>
            <label class="field">
              <span>勤務先</span>
              <select id="shift-workplace" required></select>
            </label>
            <div class="time-row">
              <label class="field">
                <span>開始</span>
                <input id="shift-start" required type="time" />
              </label>
              <span aria-hidden="true">→</span>
              <label class="field">
                <span>終了</span>
                <input id="shift-end" required type="time" />
              </label>
            </div>
            <label class="field">
              <span>休憩</span>
              <span class="input-unit suffix-unit">
                <input id="shift-break" max="600" min="0" step="5" type="number" />
                <i>分</i>
              </span>
            </label>
            <label class="field">
              <span>メモ</span>
              <input id="shift-note" maxlength={60} placeholder="任意: 研修、レジ締めなど" />
            </label>
            <div class="pay-preview">
              <span>このシフトの見込み</span>
              <strong id="shift-preview">¥0</strong>
              <small id="shift-preview-hours">0時間</small>
            </div>
            <button class="add-shift-button" type="submit">
              カレンダーへ追加
            </button>
          </form>

          <section class="day-shifts" aria-labelledby="day-title">
            <header>
              <div>
                <h3 id="day-title">—</h3>
              </div>
              <output id="day-total">¥0</output>
            </header>
            <div id="day-shift-list"></div>
          </section>

          <section class="data-actions" aria-labelledby="data-title">
            <header>
              <h3 id="data-title">書き出し・復元</h3>
            </header>
            <div>
              <button id="export-ics" type="button">
                今月の .ics
              </button>
              <button id="export-csv" type="button">
                全件CSV
              </button>
              <button id="export-json" type="button">
                バックアップ
              </button>
              <label>
                復元
                <input accept="application/json,.json" id="import-json" type="file" />
              </label>
            </div>
          </section>
          <p class="estimate-note">
            金額は入力した時給・倍率・交通費による概算です。給与明細と勤務先の規定を正本にしてください。
          </p>
        </aside>
      </div>
    </Layout>
  );
}

export function PrivacyPage() {
  return (
    <Layout page="privacy" title={`プライバシー | ${product.name}`}>
      <article class="prose">
        <p class="prose-kicker">PRIVACY</p>
        <h1>シフトと金額は、この端末の中で扱います</h1>
        <h2>サーバーへ送らないもの</h2>
        <p>
          勤務先名、日付、開始・終了時刻、休憩、時給、交通費、目安金額、メモ、書き出したデータはサーバーへ送信しません。ブラウザのlocalStorageへ保存し、サイトデータを消すと削除できます。
        </p>
        <h2>匿名で集計するもの</h2>
        <p>
          閲覧、勤務先追加、シフト追加、月5件到達、書き出し、別日再訪を、匿名識別子を一方向変換して日単位で記録します。日付、金額、勤務時間、勤務先名、メモ、IPアドレスはD1へ保存しません。
        </p>
        <h2>保持期間</h2>
        <p>
          匿名集計は35日後に自動削除します。外部解析SDK、広告Cookie、OCR、AI
          API、認証サービスは使用しません。金額表示は税・保険・正式な給与計算ではなく、利用者が入力した条件による概算です。
        </p>
      </article>
    </Layout>
  );
}

export function NotFoundPage() {
  return (
    <Layout page="not-found" title={`見つかりません | ${product.name}`}>
      <section class="not-found">
        <span aria-hidden="true">▦</span>
        <h1>ページが見つかりません</h1>
        <p>カレンダーへ戻って、今月のシフトを確認できます。</p>
        <a href="/">カレンダーへ戻る</a>
      </section>
    </Layout>
  );
}
