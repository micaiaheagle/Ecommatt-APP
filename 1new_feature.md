# New Feature: Smart Guided Event Reporting (Auto-Structured Updates)

This feature ensures that when a worker submits an update (e.g., **farrowing, feeding, death report, vaccination, fostered litter, movement**, etc.), the app forces them to fill required fields before submitting — so updates are complete, consistent, and meaningful.

---

## 💡 How it Works

When someone selects:

> **Event Type → Farrowing / New Litter Report**

The app auto-generates smart mandatory fields:

| Field | Type | Required |
|-------|------|----------|
| Sow ID | auto-select from database | ✔ |
| Expected farrowing date | auto-filled | — |
| Actual farrowing time | time picker | ✔ |
| Number born alive | number input | ✔ |
| Number stillborn | number input | ✔ |
| Average piglet birth weight (optional) | input | — |
| Interventions (fostering, manual assist, oxytocin, etc.) | dropdown + notes | ✔ |
| Post-care checklist (✔ iodine, ✔ teeth clipping, ✔ ear notching, ✔ vaccination schedule assigned) | dynamic checklist | ✔ |
| Photos (optional but encouraged) | upload | — |

---

Instead of a vague WhatsApp message like:

> "Got 10 piglets. Now suckling."

It becomes:

---

## 📌 Example of Auto‑Generated Report

### Farrowing Event Logged

🐖 **Sow:** `#S-023 / Landrace × Large White`  
📆 **Expected Farrowing:** `03 Dec 2025`  
⏱ **Actual Time:** `09:15`  
👶 **Total Piglets:** `10`

- 🟩 **9 alive**
- 🟥 **1 stillborn**

#### ⚕ Interventions:
- ✔ Fostering attempted (reason: low udder access)
- ✔ Assisted suckling

#### 🧪 Post-Birth Checklist:
- ✔ Umbilical iodine
- ✔ Teeth clipping
- ✔ Ear notching scheduled
- ✔ Vaccination added to calendar

📸 **2 photos attached**

---

### 🔔 Automatic Follow-Ups

- Weighing in **7 days**
- Iron injection alert in **48 hrs**
- Weaning date countdown **activated**

---

## 🧠 Smart Submission Rules

If the worker tries to submit only:

> “Got 10 piglets”

The system will:

- ❌ **Block submission**  
- ⚠ **Show message:**  
  > “This report is incomplete. Please fill required fields before submitting.”

---

## 📈 Output to Management

The CEO receives a clean formatted summary via:

- App notification  
- WhatsApp message  
- Email

Includes:

✔ Next actions & alerts  
✔ Performance comparison against farm averages  
✔ Follow‑up tasks automatically scheduled

---

## 💬 Why This Matters

This feature solves:

- Incomplete worker reporting
- Lost livestock history
- Unreliable manual updates
- CEO frustration from missing details
- Lack of standard operating reporting

It aligns with the project objective:

> “Digitize and centralize all pig records and enforce structured, guided reporting with alerts.”

---

## 🔧 Module Location

📍 **Database → Pig Profile → Event Logging Form**

Role Access:

| Role | Can Log Event? | Can Approve? |
|------|---------------|--------------|
| Worker | ✔ | — |
| Supervisor | ✔ | ✔ |
| Vet | ✔ | ✔ |
| CEO | 🔍 View only | ✔ |

---

## 🏁 Final Result

This system replaces casual messages with:

> **Professional, consistent, actionable livestock records — without needing to remind or ask for details.**

