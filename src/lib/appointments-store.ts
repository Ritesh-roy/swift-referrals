import type { Appointment } from "@/lib/mock-data";

const KEY = "refera.appointments.v1";

function read(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Appointment[]) : [];
  } catch {
    return [];
  }
}

function write(list: Appointment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("refera:appointments-changed"));
}

export function getStoredAppointments(): Appointment[] {
  return read();
}

export function addStoredAppointment(a: Appointment) {
  const list = read();
  list.unshift(a);
  write(list);
}

export function subscribeAppointments(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("refera:appointments-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("refera:appointments-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
