(() => {
  "use strict";

  const storageKey = "hataraku-tile:v1";
  const colors = ["coral", "blue", "green", "violet", "amber", "slate"];
  const todayDate = new Date();
  const today = localDate(todayDate);
  const currentMonth = today.slice(0, 7);

  function localDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function makeId() {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (digit) =>
      (
        Number(digit) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(digit) / 4)))
      ).toString(16),
    );
  }

  function dateInCurrentMonth(day) {
    const [year, month] = currentMonth.split("-").map(Number);
    const max = new Date(year, month, 0).getDate();
    return `${currentMonth}-${String(Math.min(day, max)).padStart(2, "0")}`;
  }

  function initialState() {
    const cafeId = "sample-cafe";
    const shopId = "sample-shop";
    return {
      activeWorkplace: cafeId,
      firstSeen: today,
      goals: { monthly: 90000, yearly: 1000000 },
      lastSeen: "",
      month: currentMonth,
      monthReady: [],
      sample: true,
      selectedDate: dateInCurrentMonth(6),
      sessionId: makeId(),
      shifts: [
        {
          breakMinutes: 30,
          date: dateInCurrentMonth(3),
          end: "14:00",
          id: "sample-1",
          note: "",
          start: "08:00",
          workplaceId: cafeId,
        },
        {
          breakMinutes: 45,
          date: dateInCurrentMonth(6),
          end: "22:00",
          id: "sample-2",
          note: "レジ締め",
          start: "16:00",
          workplaceId: cafeId,
        },
        {
          breakMinutes: 60,
          date: dateInCurrentMonth(10),
          end: "18:00",
          id: "sample-3",
          note: "",
          start: "10:00",
          workplaceId: shopId,
        },
        {
          breakMinutes: 30,
          date: dateInCurrentMonth(14),
          end: "15:00",
          id: "sample-4",
          note: "",
          start: "09:00",
          workplaceId: shopId,
        },
        {
          breakMinutes: 45,
          date: dateInCurrentMonth(19),
          end: "22:30",
          id: "sample-5",
          note: "",
          start: "16:00",
          workplaceId: cafeId,
        },
      ],
      version: 1,
      workplaces: [
        {
          color: "coral",
          hourly: 1250,
          id: cafeId,
          lateRate: 1.25,
          name: "カフェ",
          transit: 420,
        },
        {
          color: "blue",
          hourly: 1180,
          id: shopId,
          lateRate: 1.25,
          name: "書店",
          transit: 0,
        },
      ],
    };
  }

  function readState() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        stored &&
        stored.version === 1 &&
        Array.isArray(stored.workplaces) &&
        stored.workplaces.length > 0 &&
        Array.isArray(stored.shifts)
      ) {
        return {
          ...initialState(),
          ...stored,
          goals: { ...initialState().goals, ...stored.goals },
          monthReady: Array.isArray(stored.monthReady) ? stored.monthReady : [],
        };
      }
    } catch {
      // Start from a safe local sample if storage is blocked or corrupted.
    }
    return initialState();
  }

  let state = readState();

  function writeState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // The calendar remains usable for the current page session.
    }
  }

  function track(name) {
    fetch("/api/telemetry", {
      body: JSON.stringify({ name, sessionId: state.sessionId }),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    }).catch(() => undefined);
  }

  if (state.lastSeen && state.lastSeen !== today) {
    track("returned");
  }
  state.lastSeen = today;
  writeState();
  track("visited");

  const calendar = document.querySelector("#calendar-grid");
  if (!calendar) {
    return;
  }

  const elements = {
    calendar,
    calendarLegend: document.querySelector("#calendar-legend"),
    calendarTitle: document.querySelector("#calendar-title"),
    clearSample: document.querySelector("#clear-sample"),
    dayList: document.querySelector("#day-shift-list"),
    dayTitle: document.querySelector("#day-title"),
    dayTotal: document.querySelector("#day-total"),
    deleteWorkplace: document.querySelector("#delete-workplace"),
    entryTitle: document.querySelector("#entry-title"),
    exportCsv: document.querySelector("#export-csv"),
    exportIcs: document.querySelector("#export-ics"),
    exportJson: document.querySelector("#export-json"),
    goalBar: document.querySelector("#goal-bar"),
    importJson: document.querySelector("#import-json"),
    monthlyGoal: document.querySelector("#monthly-goal"),
    newWorkplace: document.querySelector("#new-workplace"),
    nextMonth: document.querySelector("#next-month"),
    previousMonth: document.querySelector("#previous-month"),
    resetShift: document.querySelector("#reset-shift-form"),
    sampleNote: document.querySelector("#sample-note"),
    shiftBreak: document.querySelector("#shift-break"),
    shiftDate: document.querySelector("#shift-date"),
    shiftEnd: document.querySelector("#shift-end"),
    shiftForm: document.querySelector("#shift-form"),
    shiftId: document.querySelector("#shift-id"),
    shiftNote: document.querySelector("#shift-note"),
    shiftPreview: document.querySelector("#shift-preview"),
    shiftPreviewHours: document.querySelector("#shift-preview-hours"),
    shiftStart: document.querySelector("#shift-start"),
    shiftWorkplace: document.querySelector("#shift-workplace"),
    summaryCount: document.querySelector("#summary-count"),
    summaryGoal: document.querySelector("#summary-goal"),
    summaryHours: document.querySelector("#summary-hours"),
    summaryPay: document.querySelector("#summary-pay"),
    summaryTransit: document.querySelector("#summary-transit"),
    templateRow: document.querySelector("#template-row"),
    todayMonth: document.querySelector("#today-month"),
    workplaceColors: document.querySelector("#workplace-colors"),
    workplaceCount: document.querySelector("#workplace-count"),
    workplaceForm: document.querySelector("#workplace-form"),
    workplaceHourly: document.querySelector("#workplace-hourly"),
    workplaceId: document.querySelector("#workplace-id"),
    workplaceLateRate: document.querySelector("#workplace-late-rate"),
    workplaceList: document.querySelector("#workplace-list"),
    workplaceName: document.querySelector("#workplace-name"),
    workplaceTransit: document.querySelector("#workplace-transit"),
    yearBars: document.querySelector("#year-bars"),
    yearGoalNote: document.querySelector("#year-goal-note"),
    yearlyGoal: document.querySelector("#yearly-goal"),
    yearTitle: document.querySelector("#year-title"),
    yearTotal: document.querySelector("#year-total"),
  };

  const money = new Intl.NumberFormat("ja-JP", {
    currency: "JPY",
    maximumFractionDigits: 0,
    style: "currency",
  });
  const monthLabel = new Intl.DateTimeFormat("ja-JP", { month: "long", year: "numeric" });
  const dayLabel = new Intl.DateTimeFormat("ja-JP", {
    day: "numeric",
    month: "long",
    weekday: "short",
  });

  function formatMoney(value) {
    return money.format(Math.round(Number.isFinite(value) ? value : 0));
  }

  function formatHours(minutes) {
    const hours = Math.max(0, minutes) / 60;
    return Number.isInteger(hours) ? `${hours}時間` : `${hours.toFixed(1)}時間`;
  }

  function timeMinutes(value) {
    const [hours, minutes] = String(value).split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return 0;
    }
    return hours * 60 + minutes;
  }

  function overlap(start, end, rangeStart, rangeEnd) {
    return Math.max(0, Math.min(end, rangeEnd) - Math.max(start, rangeStart));
  }

  function workplaceFor(id) {
    return state.workplaces.find((workplace) => workplace.id === id) || state.workplaces[0];
  }

  function estimateShift(shift) {
    const workplace = workplaceFor(shift.workplaceId);
    if (!workplace) {
      return { minutes: 0, pay: 0, transit: 0 };
    }
    const start = timeMinutes(shift.start);
    let end = timeMinutes(shift.end);
    if (end <= start) {
      end += 1440;
    }
    const duration = Math.max(0, end - start);
    const paidMinutes = Math.max(0, duration - Number(shift.breakMinutes || 0));
    let nightMinutes = 0;
    for (const [rangeStart, rangeEnd] of [
      [0, 300],
      [1320, 1740],
      [2760, 3180],
    ]) {
      nightMinutes += overlap(start, end, rangeStart, rangeEnd);
    }
    nightMinutes = Math.min(paidMinutes, nightMinutes);
    const basePay = (paidMinutes / 60) * Number(workplace.hourly || 0);
    const lateExtra =
      (nightMinutes / 60) *
      Number(workplace.hourly || 0) *
      Math.max(0, Number(workplace.lateRate || 1) - 1);
    const transit = Number(workplace.transit || 0);
    return { minutes: paidMinutes, pay: basePay + lateExtra + transit, transit };
  }

  function monthShifts(month = state.month) {
    return state.shifts.filter((shift) => shift.date.startsWith(month));
  }

  function totals(shifts) {
    return shifts.reduce(
      (result, shift) => {
        const estimate = estimateShift(shift);
        result.minutes += estimate.minutes;
        result.pay += estimate.pay;
        result.transit += estimate.transit;
        return result;
      },
      { minutes: 0, pay: 0, transit: 0 },
    );
  }

  function ratioClass(value, maximum, prefix) {
    const ratio = maximum > 0 ? Math.min(1, Math.max(0, value / maximum)) : 0;
    return `${prefix}-${Math.round(ratio * 10)}`;
  }

  function leaveSample() {
    if (!state.sample) {
      return;
    }
    state.sample = false;
    state.shifts = [];
    state.monthReady = [];
    state.selectedDate = today;
    elements.sampleNote.hidden = true;
  }

  function createText(tag, className, value) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    element.textContent = value;
    return element;
  }

  function renderWorkplaces() {
    const cards = state.workplaces.map((workplace) => {
      const button = document.createElement("button");
      button.className = "workplace-card";
      button.dataset.workplace = workplace.id;
      button.setAttribute("aria-pressed", String(state.activeWorkplace === workplace.id));
      button.type = "button";
      const color = createText("i", `tone-${workplace.color}`, "");
      const content = document.createElement("span");
      content.append(
        createText("strong", "", workplace.name),
        createText(
          "small",
          "",
          `${formatMoney(workplace.hourly)}/時 · 交通費 ${formatMoney(workplace.transit)}`,
        ),
      );
      const count = state.shifts.filter((shift) => shift.workplaceId === workplace.id).length;
      button.append(color, content, createText("em", "", `${count}`));
      button.addEventListener("click", () => {
        state.activeWorkplace = workplace.id;
        writeState();
        renderWorkplaces();
        populateWorkplaceForm(workplace);
        renderShiftOptions();
        elements.shiftWorkplace.value = workplace.id;
        updateShiftPreview();
      });
      return button;
    });
    elements.workplaceList.replaceChildren(...cards);
    elements.workplaceCount.textContent = `${state.workplaces.length}件`;
    elements.sampleNote.hidden = !state.sample;
    const active = workplaceFor(state.activeWorkplace);
    if (active) {
      populateWorkplaceForm(active);
    }
  }

  function populateWorkplaceForm(workplace) {
    elements.workplaceId.value = workplace.id;
    elements.workplaceName.value = workplace.name;
    elements.workplaceHourly.value = String(workplace.hourly);
    elements.workplaceTransit.value = String(workplace.transit);
    elements.workplaceLateRate.value = String(workplace.lateRate);
    const radio = elements.workplaceColors.querySelector(
      `input[value="${colors.includes(workplace.color) ? workplace.color : "coral"}"]`,
    );
    if (radio) {
      radio.checked = true;
    }
    elements.deleteWorkplace.hidden = state.workplaces.length <= 1;
  }

  function renderShiftOptions() {
    const selected = elements.shiftWorkplace.value || state.activeWorkplace;
    const options = state.workplaces.map((workplace) => {
      const option = document.createElement("option");
      option.value = workplace.id;
      option.textContent = workplace.name;
      return option;
    });
    elements.shiftWorkplace.replaceChildren(...options);
    elements.shiftWorkplace.value = workplaceFor(selected)?.id || state.workplaces[0]?.id || "";

    const templates = [
      { breakMinutes: 30, end: "14:00", label: "早番", start: "08:00" },
      { breakMinutes: 60, end: "18:00", label: "日中", start: "10:00" },
      { breakMinutes: 45, end: "22:00", label: "遅番", start: "16:00" },
      { breakMinutes: 60, end: "06:00", label: "夜勤", start: "22:00" },
    ].map((template) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${template.label} ${template.start}–${template.end}`;
      button.addEventListener("click", () => {
        elements.shiftStart.value = template.start;
        elements.shiftEnd.value = template.end;
        elements.shiftBreak.value = String(template.breakMinutes);
        updateShiftPreview();
      });
      return button;
    });
    elements.templateRow.replaceChildren(...templates);
  }

  function renderCalendar() {
    const [year, month] = state.month.split("-").map(Number);
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const days = new Date(year, month, 0).getDate();
    elements.calendarTitle.textContent = monthLabel.format(new Date(year, month - 1, 1));
    elements.yearTitle.textContent = `${year}年の見込み`;

    const cells = [];
    for (let index = 0; index < 42; index += 1) {
      const day = index - firstWeekday + 1;
      const cell = document.createElement("button");
      cell.className = "calendar-day";
      cell.type = "button";
      cell.setAttribute("role", "gridcell");
      if (day < 1 || day > days) {
        cell.classList.add("outside");
        cell.disabled = true;
        cells.push(cell);
        continue;
      }
      const date = `${state.month}-${String(day).padStart(2, "0")}`;
      const shifts = state.shifts
        .filter((shift) => shift.date === date)
        .sort((left, right) => left.start.localeCompare(right.start));
      cell.dataset.date = date;
      cell.classList.toggle("selected", state.selectedDate === date);
      cell.classList.toggle("today", date === today);
      cell.setAttribute("aria-label", `${day}日、${shifts.length}件`);
      const number = createText("span", "day-number", String(day));
      const stack = document.createElement("span");
      stack.className = "shift-stack";
      for (const shift of shifts.slice(0, 3)) {
        const workplace = workplaceFor(shift.workplaceId);
        stack.append(
          createText(
            "i",
            `shift-chip tone-${workplace?.color || "slate"}`,
            `${shift.start} ${workplace?.name || "勤務"}`,
          ),
        );
      }
      if (shifts.length > 3) {
        stack.append(createText("small", "", `ほか${shifts.length - 3}件`));
      }
      cell.append(number, stack);
      cell.addEventListener("click", () => {
        state.selectedDate = date;
        elements.shiftDate.value = date;
        writeState();
        renderCalendar();
        renderDayShifts();
      });
      cells.push(cell);
    }
    elements.calendar.replaceChildren(...cells);

    const legends = state.workplaces.map((workplace) => {
      const item = document.createElement("span");
      item.append(
        createText("i", `tone-${workplace.color}`, ""),
        document.createTextNode(workplace.name),
      );
      return item;
    });
    elements.calendarLegend.replaceChildren(...legends);
  }

  function renderSummary() {
    const shifts = monthShifts();
    const monthTotals = totals(shifts);
    const monthlyGoal = Number(state.goals.monthly || 0);
    const percent = monthlyGoal > 0 ? Math.round((monthTotals.pay / monthlyGoal) * 100) : 0;
    elements.summaryPay.textContent = formatMoney(monthTotals.pay);
    elements.summaryHours.textContent = formatHours(monthTotals.minutes);
    elements.summaryCount.textContent = `${shifts.length}件`;
    elements.summaryTransit.textContent = formatMoney(monthTotals.transit);
    elements.summaryGoal.textContent = monthlyGoal > 0 ? `${percent}%` : "未設定";
    elements.goalBar.className = ratioClass(monthTotals.pay, monthlyGoal, "progress");
  }

  function renderYear() {
    const year = Number(state.month.slice(0, 4));
    const monthly = Array.from({ length: 12 }, (_unused, index) => {
      const month = `${year}-${String(index + 1).padStart(2, "0")}`;
      return totals(monthShifts(month)).pay;
    });
    const total = monthly.reduce((sum, value) => sum + value, 0);
    const max = Math.max(...monthly, Number(state.goals.yearly || 0) / 12, 1);
    const bars = monthly.map((value, index) => {
      const item = document.createElement("span");
      const bar = document.createElement("i");
      bar.className = ratioClass(value, max, "bar");
      bar.title = `${index + 1}月 ${formatMoney(value)}`;
      item.append(bar, createText("small", "", String(index + 1)));
      return item;
    });
    elements.yearBars.replaceChildren(...bars);
    elements.yearTotal.textContent = formatMoney(total);
    const goal = Number(state.goals.yearly || 0);
    elements.yearGoalNote.textContent =
      goal > 0
        ? total <= goal
          ? `自分の目安まで ${formatMoney(goal - total)}`
          : `自分の目安を ${formatMoney(total - goal)} 上回る見込み`
        : "年の目安を設定すると、残りがここに表示されます。";
  }

  function renderDayShifts() {
    const date = new Date(`${state.selectedDate}T00:00:00`);
    elements.dayTitle.textContent = Number.isNaN(date.getTime())
      ? "日付を選択"
      : dayLabel.format(date);
    const shifts = state.shifts
      .filter((shift) => shift.date === state.selectedDate)
      .sort((left, right) => left.start.localeCompare(right.start));
    const nodes = shifts.map((shift) => {
      const workplace = workplaceFor(shift.workplaceId);
      const estimate = estimateShift(shift);
      const item = document.createElement("article");
      item.className = "day-shift";
      const color = createText("i", `tone-${workplace?.color || "slate"}`, "");
      const body = document.createElement("button");
      body.className = "edit-shift";
      body.type = "button";
      body.append(
        createText("strong", "", `${shift.start}–${shift.end} · ${workplace?.name || "勤務"}`),
        createText(
          "span",
          "",
          `${formatHours(estimate.minutes)} · ${formatMoney(estimate.pay)}${shift.note ? ` · ${shift.note}` : ""}`,
        ),
      );
      body.addEventListener("click", () => populateShiftForm(shift));
      const remove = document.createElement("button");
      remove.className = "remove-shift";
      remove.type = "button";
      remove.setAttribute("aria-label", `${shift.start}のシフトを削除`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        state.shifts = state.shifts.filter((candidate) => candidate.id !== shift.id);
        if (elements.shiftId.value === shift.id) {
          resetShiftForm();
        }
        writeState();
        renderAll();
      });
      item.append(color, body, remove);
      return item;
    });
    if (nodes.length === 0) {
      const empty = createText(
        "p",
        "empty-day",
        "カレンダーの日付を押して、シフトを追加できます。",
      );
      nodes.push(empty);
    }
    elements.dayList.replaceChildren(...nodes);
    elements.dayTotal.textContent = formatMoney(totals(shifts).pay);
  }

  function populateShiftForm(shift) {
    elements.shiftId.value = shift.id;
    elements.shiftDate.value = shift.date;
    elements.shiftWorkplace.value = shift.workplaceId;
    elements.shiftStart.value = shift.start;
    elements.shiftEnd.value = shift.end;
    elements.shiftBreak.value = String(shift.breakMinutes);
    elements.shiftNote.value = shift.note;
    elements.entryTitle.textContent = "シフトを編集";
    updateShiftPreview();
    elements.shiftStart.focus();
  }

  function resetShiftForm() {
    elements.shiftId.value = "";
    elements.shiftDate.value = state.selectedDate;
    elements.shiftWorkplace.value = workplaceFor(state.activeWorkplace)?.id || "";
    elements.shiftStart.value = "09:00";
    elements.shiftEnd.value = "14:00";
    elements.shiftBreak.value = "30";
    elements.shiftNote.value = "";
    elements.entryTitle.textContent = "シフトを追加";
    updateShiftPreview();
  }

  function shiftFromForm() {
    return {
      breakMinutes: Math.min(600, Math.max(0, Number(elements.shiftBreak.value || 0))),
      date: elements.shiftDate.value,
      end: elements.shiftEnd.value,
      id: elements.shiftId.value || makeId(),
      note: elements.shiftNote.value.trim().slice(0, 60),
      start: elements.shiftStart.value,
      workplaceId: elements.shiftWorkplace.value,
    };
  }

  function updateShiftPreview() {
    const estimate = estimateShift(shiftFromForm());
    elements.shiftPreview.textContent = formatMoney(estimate.pay);
    elements.shiftPreviewHours.textContent = formatHours(estimate.minutes);
  }

  function renderAll() {
    renderWorkplaces();
    renderShiftOptions();
    renderCalendar();
    renderSummary();
    renderYear();
    renderDayShifts();
    updateShiftPreview();
    elements.monthlyGoal.value = String(state.goals.monthly || 0);
    elements.yearlyGoal.value = String(state.goals.yearly || 0);
  }

  function changeMonth(offset) {
    const [year, month] = state.month.split("-").map(Number);
    const next = new Date(year, month - 1 + offset, 1);
    state.month = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
    state.selectedDate = `${state.month}-01`;
    elements.shiftDate.value = state.selectedDate;
    writeState();
    renderAll();
  }

  function download(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function csvValue(value) {
    let text = String(value ?? "");
    if (/^[=+\-@]/.test(text)) {
      text = `'${text}`;
    }
    return `"${text.replaceAll('"', '""')}"`;
  }

  function exportCsv() {
    const header = [
      "日付",
      "勤務先",
      "開始",
      "終了",
      "休憩分",
      "勤務時間",
      "見込み金額",
      "交通費",
      "メモ",
    ];
    const rows = state.shifts
      .slice()
      .sort((left, right) =>
        `${left.date}${left.start}`.localeCompare(`${right.date}${right.start}`),
      )
      .map((shift) => {
        const estimate = estimateShift(shift);
        return [
          shift.date,
          workplaceFor(shift.workplaceId)?.name || "",
          shift.start,
          shift.end,
          shift.breakMinutes,
          (estimate.minutes / 60).toFixed(2),
          Math.round(estimate.pay),
          estimate.transit,
          shift.note,
        ];
      });
    const csv = `\ufeff${[header, ...rows].map((row) => row.map(csvValue).join(",")).join("\r\n")}`;
    download(`hataraku-tile-${today}.csv`, csv, "text/csv;charset=utf-8");
    track("exported");
  }

  function icsText(value) {
    return String(value)
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  }

  function icsDate(date, time, nextDay = false) {
    const value = new Date(`${date}T${time}:00`);
    if (nextDay) {
      value.setDate(value.getDate() + 1);
    }
    return `${value.getFullYear()}${String(value.getMonth() + 1).padStart(2, "0")}${String(value.getDate()).padStart(2, "0")}T${String(value.getHours()).padStart(2, "0")}${String(value.getMinutes()).padStart(2, "0")}00`;
  }

  function exportIcs() {
    const events = monthShifts().map((shift) => {
      const workplace = workplaceFor(shift.workplaceId);
      const nextDay = timeMinutes(shift.end) <= timeMinutes(shift.start);
      return [
        "BEGIN:VEVENT",
        `UID:${shift.id}@hataraku-tile`,
        `DTSTAMP:${new Date()
          .toISOString()
          .replaceAll(/[-:]/g, "")
          .replace(/\.\d{3}Z$/, "Z")}`,
        `DTSTART:${icsDate(shift.date, shift.start)}`,
        `DTEND:${icsDate(shift.date, shift.end, nextDay)}`,
        `SUMMARY:${icsText(workplace?.name || "シフト")}`,
        shift.note ? `DESCRIPTION:${icsText(shift.note)}` : "",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\r\n");
    });
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hataraku Tile//JA",
      ...events,
      "END:VCALENDAR",
    ].join("\r\n");
    download(`hataraku-tile-${state.month}.ics`, ics, "text/calendar;charset=utf-8");
    track("exported");
  }

  function validImported(data) {
    if (
      !data ||
      data.version !== 1 ||
      !Array.isArray(data.workplaces) ||
      data.workplaces.length < 1 ||
      data.workplaces.length > 6 ||
      !Array.isArray(data.shifts) ||
      data.shifts.length > 2000
    ) {
      return null;
    }
    const workplaces = data.workplaces
      .map((workplace) => ({
        color: colors.includes(workplace.color) ? workplace.color : "slate",
        hourly: Math.min(100000, Math.max(0, Number(workplace.hourly || 0))),
        id: String(workplace.id || makeId()).slice(0, 64),
        lateRate: Math.min(3, Math.max(1, Number(workplace.lateRate || 1))),
        name: String(workplace.name || "")
          .trim()
          .slice(0, 24),
        transit: Math.min(100000, Math.max(0, Number(workplace.transit || 0))),
      }))
      .filter((workplace) => workplace.name);
    const ids = new Set(workplaces.map((workplace) => workplace.id));
    if (workplaces.length === 0 || ids.size !== workplaces.length) {
      return null;
    }
    const shifts = data.shifts
      .map((shift) => ({
        breakMinutes: Math.min(600, Math.max(0, Number(shift.breakMinutes || 0))),
        date: String(shift.date || ""),
        end: String(shift.end || ""),
        id: String(shift.id || makeId()).slice(0, 64),
        note: String(shift.note || "").slice(0, 60),
        start: String(shift.start || ""),
        workplaceId: String(shift.workplaceId || ""),
      }))
      .filter(
        (shift) =>
          /^\d{4}-\d{2}-\d{2}$/.test(shift.date) &&
          /^\d{2}:\d{2}$/.test(shift.start) &&
          /^\d{2}:\d{2}$/.test(shift.end) &&
          ids.has(shift.workplaceId),
      );
    return {
      ...initialState(),
      activeWorkplace: workplaces[0].id,
      goals: {
        monthly: Math.min(10000000, Math.max(0, Number(data.goals?.monthly || 0))),
        yearly: Math.min(100000000, Math.max(0, Number(data.goals?.yearly || 0))),
      },
      month: currentMonth,
      sample: false,
      selectedDate: today,
      shifts,
      workplaces,
    };
  }

  elements.clearSample.addEventListener("click", () => {
    leaveSample();
    writeState();
    resetShiftForm();
    renderAll();
  });
  elements.newWorkplace.addEventListener("click", () => {
    elements.workplaceId.value = "";
    elements.workplaceName.value = "";
    elements.workplaceHourly.value = "1200";
    elements.workplaceTransit.value = "0";
    elements.workplaceLateRate.value = "1.25";
    const defaultColor = elements.workplaceColors.querySelector('input[value="green"]');
    if (defaultColor) {
      defaultColor.checked = true;
    }
    elements.deleteWorkplace.hidden = true;
    elements.workplaceName.focus();
  });
  elements.workplaceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = elements.workplaceId.value || makeId();
    let existing = state.workplaces.findIndex((workplace) => workplace.id === id);
    if (existing < 0 && state.workplaces.length >= 6) {
      elements.workplaceName.setCustomValidity("勤務先は6件までです");
      elements.workplaceName.reportValidity();
      return;
    }
    elements.workplaceName.setCustomValidity("");
    const replaceSampleWorkplaces = state.sample && existing < 0;
    leaveSample();
    if (replaceSampleWorkplaces) {
      state.workplaces = [];
      existing = -1;
    }
    const workplace = {
      color:
        elements.workplaceColors.querySelector('input[name="workplace-color"]:checked')?.value ||
        "coral",
      hourly: Math.min(100000, Math.max(0, Number(elements.workplaceHourly.value))),
      id,
      lateRate: Math.min(3, Math.max(1, Number(elements.workplaceLateRate.value || 1))),
      name: elements.workplaceName.value.trim().slice(0, 24),
      transit: Math.min(100000, Math.max(0, Number(elements.workplaceTransit.value))),
    };
    if (!workplace.name) {
      return;
    }
    if (existing >= 0) {
      state.workplaces[existing] = workplace;
    } else {
      state.workplaces.push(workplace);
      track("workplace_added");
    }
    state.activeWorkplace = id;
    writeState();
    renderAll();
    elements.shiftWorkplace.value = id;
    updateShiftPreview();
  });
  elements.deleteWorkplace.addEventListener("click", () => {
    const id = elements.workplaceId.value;
    if (state.workplaces.length <= 1 || !id) {
      return;
    }
    const workplace = workplaceFor(id);
    if (!window.confirm(`${workplace?.name || "この勤務先"}と、そのシフトを削除しますか？`)) {
      return;
    }
    state.workplaces = state.workplaces.filter((candidate) => candidate.id !== id);
    state.shifts = state.shifts.filter((shift) => shift.workplaceId !== id);
    state.activeWorkplace = state.workplaces[0].id;
    writeState();
    renderAll();
    resetShiftForm();
  });
  for (const input of [elements.monthlyGoal, elements.yearlyGoal]) {
    input.addEventListener("input", () => {
      state.goals.monthly = Math.min(
        10000000,
        Math.max(0, Number(elements.monthlyGoal.value || 0)),
      );
      state.goals.yearly = Math.min(100000000, Math.max(0, Number(elements.yearlyGoal.value || 0)));
      writeState();
      renderSummary();
      renderYear();
    });
  }
  elements.previousMonth.addEventListener("click", () => changeMonth(-1));
  elements.nextMonth.addEventListener("click", () => changeMonth(1));
  elements.todayMonth.addEventListener("click", () => {
    state.month = currentMonth;
    state.selectedDate = today;
    elements.shiftDate.value = today;
    writeState();
    renderAll();
  });
  elements.resetShift.addEventListener("click", resetShiftForm);
  for (const input of [
    elements.shiftBreak,
    elements.shiftEnd,
    elements.shiftStart,
    elements.shiftWorkplace,
  ]) {
    input.addEventListener("input", updateShiftPreview);
  }
  elements.shiftDate.addEventListener("change", () => {
    state.selectedDate = elements.shiftDate.value;
    state.month = elements.shiftDate.value.slice(0, 7);
    writeState();
    renderCalendar();
    renderDayShifts();
  });
  elements.shiftForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const editing = Boolean(elements.shiftId.value);
    const shift = shiftFromForm();
    if (!shift.date || !shift.start || !shift.end || !workplaceFor(shift.workplaceId)) {
      return;
    }
    leaveSample();
    const index = state.shifts.findIndex((candidate) => candidate.id === shift.id);
    if (index >= 0) {
      state.shifts[index] = shift;
    } else {
      state.shifts.push(shift);
      if (!editing) {
        track("shift_added");
      }
    }
    state.month = shift.date.slice(0, 7);
    state.selectedDate = shift.date;
    if (monthShifts().length >= 5 && !state.monthReady.includes(state.month)) {
      state.monthReady.push(state.month);
      track("month_ready");
    }
    writeState();
    renderAll();
    resetShiftForm();
  });
  elements.exportCsv.addEventListener("click", exportCsv);
  elements.exportIcs.addEventListener("click", exportIcs);
  elements.exportJson.addEventListener("click", () => {
    download(
      `hataraku-tile-backup-${today}.json`,
      JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2),
      "application/json;charset=utf-8",
    );
    track("exported");
  });
  elements.importJson.addEventListener("change", async () => {
    const file = elements.importJson.files?.[0];
    if (!file || file.size > 200000) {
      elements.importJson.value = "";
      return;
    }
    try {
      const imported = validImported(JSON.parse(await file.text()));
      if (
        !imported ||
        !window.confirm("現在の端末データを、選んだバックアップで置き換えますか？")
      ) {
        elements.importJson.value = "";
        return;
      }
      state = imported;
      writeState();
      renderAll();
      resetShiftForm();
    } catch {
      // Invalid backups are ignored without changing current data.
    }
    elements.importJson.value = "";
  });

  elements.shiftDate.value = state.selectedDate;
  renderAll();
  resetShiftForm();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("/sw.js");
    });
  }
})();
