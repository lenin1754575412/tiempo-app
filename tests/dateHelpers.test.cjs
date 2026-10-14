const test = require('node:test');
const assert = require('node:assert/strict');
const {
  formatClock, formatDate, greetingForHour, parseAlarmDateTime,
  validateAlarm, formatElapsed,
} = require('../utils/dateHelpers');

test('El reloj muestra HH:mm:ss y fecha dd/mm/yyyy', () => {
  const value = new Date(2026, 9, 13, 7, 4, 2);
  assert.equal(formatClock(value), '07:04:02');
  assert.equal(formatDate(value), '13/10/2026');
});

test('Saludo justo en las tres franjas horarias', () => {
  assert.equal(greetingForHour(0), 'Buenos días');
  assert.equal(greetingForHour(11), 'Buenos días');
  assert.equal(greetingForHour(12), 'Buenas tardes');
  assert.equal(greetingForHour(17), 'Buenas tardes');
  assert.equal(greetingForHour(18), 'Buenas noches');
  assert.equal(greetingForHour(23), 'Buenas noches');
});

test('Fechas y horas inexistentes son rechazadas', () => {
  assert.equal(parseAlarmDateTime('31/02/2027', '12:00'), null);
  assert.equal(parseAlarmDateTime('10/10/2027', '25:15'), null);
  assert.equal(parseAlarmDateTime('10/10/2027', '19:60'), null);
  assert.equal(parseAlarmDateTime('10-10-2027', '19:00'), null);
  assert.ok(parseAlarmDateTime('29/02/2028', '19:00') instanceof Date);
});

test('Se rechazan formularios vacíos y fechas pasadas', () => {
  const now = new Date(2026, 9, 13, 11, 0);
  assert.match(validateAlarm({ dateText: '', timeText: '', alarms: [], editingId: null, now }), /Selecciona/);
  assert.match(validateAlarm({ dateText: '13/10/2026', timeText: '10:59', alarms: [], editingId: null, now }), /pasada/);
  assert.match(validateAlarm({ dateText: '13/10/2026', timeText: '11:00', alarms: [], editingId: null, now }), /pasada/);
  assert.equal(validateAlarm({ dateText: '14/10/2026', timeText: '11:00', alarms: [], editingId: null, now }), null);
});

test('No permite fecha/hora duplicada, excepto la misma alarma al editar', () => {
  const now = new Date(2026, 9, 13, 9, 0);
  const timestamp = new Date(2026, 9, 14, 9, 30).getTime();
  const alarms = [{ id: 'a1', timestamp }];
  const details = { dateText: '14/10/2026', timeText: '09:30', alarms, now };
  assert.match(validateAlarm({ ...details, editingId: null }), /existe/);
  assert.match(validateAlarm({ ...details, editingId: 'a2' }), /existe/);
  assert.equal(validateAlarm({ ...details, editingId: 'a1' }), null);
});

test('El cronómetro usa HH:mm:ss con tiempo acumulado', () => {
  assert.equal(formatElapsed(0), '00:00:00');
  assert.equal(formatElapsed(62000), '00:01:02');
  assert.equal(formatElapsed(3661000), '01:01:01');
});
