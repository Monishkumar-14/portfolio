/* Pure state machine for the chatbot's contact flow. No React, no network.
   idle → collecting_name → collecting_email → collecting_subject → collecting_message
        → review → sending → success | error (→ review/sending again). */
import { validators } from "./contactApi";

export const FIELDS = ["name", "email", "subject", "message"];
export const STEP_OF = { name: "collecting_name", email: "collecting_email", subject: "collecting_subject", message: "collecting_message" };
export const FIELD_OF = Object.fromEntries(Object.entries(STEP_OF).map(([f, s]) => [s, f]));

export const emptyData = () => ({ name: "", email: "", subject: "", message: "" });
export const initialFlow = { step: "idle", data: emptyData(), error: null, returnToReview: false, choosingEdit: false, confirmCancel: false, detail: null };

export const isCollecting = (step) => step.startsWith("collecting_");
export const isFlowActive = (step) => step !== "idle" && step !== "success";
export const hasData = (state) => FIELDS.some((f) => state.data[f].trim() !== "");

export function flowReducer(state, action) {
  switch (action.type) {
    case "START":
      return state.step === "idle" || state.step === "success" ? { ...initialFlow, data: emptyData(), step: "collecting_name" } : state;

    case "SUBMIT_FIELD": {
      if (!isCollecting(state.step)) return state;
      const field = FIELD_OF[state.step];
      const value = String(action.value ?? "");
      const error = validators[field](value);
      if (error) return { ...state, error };
      const data = { ...state.data, [field]: value.trim() };
      let step;
      if (state.returnToReview) step = "review";
      else { const i = FIELDS.indexOf(field); step = i === FIELDS.length - 1 ? "review" : STEP_OF[FIELDS[i + 1]]; }
      return { ...state, data, step, error: null, returnToReview: false, confirmCancel: false };
    }

    case "CLEAR_ERROR":
      return state.error ? { ...state, error: null } : state;

    case "EDIT_REQUEST":
      return state.step === "review" || state.step === "error" ? { ...state, choosingEdit: true } : state;

    case "EDIT_FIELD":
      if (!(state.step === "review" || state.step === "error") || !STEP_OF[action.field]) return state;
      return { ...state, step: STEP_OF[action.field], returnToReview: true, choosingEdit: false, error: null };

    case "SEND_START":
      return state.step === "review" || state.step === "error"
        ? { ...state, step: "sending", error: null, choosingEdit: false, confirmCancel: false, detail: null } : state;

    case "SEND_OK":
      return state.step === "sending" ? { ...initialFlow, data: emptyData(), step: "success" } : state; // data cleared only after confirmed success

    case "SEND_FAIL":
      return state.step === "sending" ? { ...state, step: "error", detail: action.detail ?? null } : state; // data preserved

    case "CANCEL_REQUEST":
      if (!isFlowActive(state.step) || state.step === "sending") return state;
      return hasData(state) ? { ...state, confirmCancel: true } : { ...initialFlow, data: emptyData() };

    case "CANCEL_KEEP":
      return { ...state, confirmCancel: false };

    case "CANCEL_CONFIRM":
      return state.step === "sending" ? state : { ...initialFlow, data: emptyData() };

    default:
      return state;
  }
}