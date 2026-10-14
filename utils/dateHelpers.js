// Utilidades de hora local del dispositivo; sin bibliotecas externas.
const pad = (value) => String(value).padStart(2, '0');

function formatClock(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatDate(date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatHourMinute(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function greetingForHour(hour) {
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function parseAlarmDateTime(dateText, timeText) {
  // Entrada requerida: dd/mm/aaaa y HH:mm, en hora local.
  const dateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateText.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeText.trim());
  if (!dateMatch || !timeMatch) return null;

  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  if (year < 2000 || year > 9999 || month < 1 || month > 12 ||
      day < 1 || day > 31 || hours < 0 || hours > 23 ||
      minutes < 0 || minutes > 59) {
    return null;
  }

  const result = new Date(year, month - 1, day, hours, minutes, 0, 0);
  // Evita fechas inexistentes (31/02), horas inválidas y horas saltadas por DST.
  if (result.getFullYear() !== year || result.getMonth() !== month - 1 ||
      result.getDate() !== day || result.getHours() !== hours ||
      result.getMinutes() !== minutes) {
    return null;
  }
  return result;
}

function validateAlarm({ dateText, timeText, alarms, editingId, now = new Date() }) {
  if (!dateText.trim() || !timeText.trim()) {
    return 'Selecciona o escribe la fecha y la hora antes de guardar.';
  }
  const value = parseAlarmDateTime(dateText, timeText);
  if (!value) {
    return 'Fecha u hora inválida. Usa dd/mm/aaaa y HH:mm (formato de 24 horas).';
  }
  if (value.getTime() <= now.getTime()) {
    return 'No puedes registrar alarmas en una fecha u hora pasada.';
  }
  const duplicate = alarms.some((alarm) =>
    alarm.id !== editingId && alarm.timestamp === value.getTime()
  );
  if (duplicate) {
    return 'Ya existe una alarma con la misma fecha y hora.';
  }
  return null;
}

function formatElapsed(elapsedMilliseconds) {
  const totalSeconds = Math.floor(Math.max(0, elapsedMilliseconds) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

module.exports = {
  formatClock,
  formatDate,
  formatHourMinute,
  greetingForHour,
  parseAlarmDateTime,
  validateAlarm,
  formatElapsed,
};
