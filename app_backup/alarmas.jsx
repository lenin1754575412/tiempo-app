import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAlarms } from '../components/AlarmsContext';
import {
  Alert, KeyboardAvoidingView, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';
import { formatDate, formatHourMinute, parseAlarmDateTime, validateAlarm } from '../utils/dateHelpers';

function Field({ label, value, onChangeText, placeholder, maxLength }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessible
        accessibilityLabel={label}
        style={styles.field}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#778AA4"
        keyboardType="numbers-and-punctuation"
        autoCorrect={false}
        autoCapitalize="none"
        maxLength={maxLength}
        selectionColor={COLORS.cyan}
      />
    </View>
  );
}

export default function AlarmsScreen() {
  const router = useRouter();
  const onBack = () => router.replace('/');
  const { alarms, setAlarms } = useAlarms();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dateText, setDateText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const sortedAlarms = useMemo(
    () => [...alarms].sort((a, b) => a.timestamp - b.timestamp),
    [alarms]
  );

  function openCreate() {
    setEditingId(null);
    setDateText('');
    setTimeText('');
    setError('');
    setModalVisible(true);
  }

  function openEdit(alarm) {
    const value = new Date(alarm.timestamp);
    setEditingId(alarm.id);
    setDateText(formatDate(value));
    setTimeText(formatHourMinute(value));
    setError('');
    setModalVisible(true);
  }

  function saveAlarm() {
    const validationError = validateAlarm({
      dateText, timeText, alarms, editingId, now: new Date(),
    });
    if (validationError) {
      setError(validationError);
      Alert.alert('No se pudo guardar', validationError);
      return;
    }
    const timestamp = parseAlarmDateTime(dateText, timeText).getTime();
    if (editingId !== null) {
      setAlarms((previous) => previous.map((alarm) =>
        alarm.id === editingId ? { ...alarm, timestamp } : alarm
      ));
    } else {
      // Fecha + aleatorio evita colisiones de identificadores al crear rápido.
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setAlarms((previous) => [...previous, { id, timestamp }]);
    }
    setModalVisible(false);
    setError('');
  }

  function deleteAlarm(alarm) {
    Alert.alert('Eliminar alarma', '¿Seguro que deseas quitar esta alarma?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: () => setAlarms((previous) => previous.filter((item) => item.id !== alarm.id)),
      },
    ]);
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader number="2" title="Gestión de alarmas" subtitle="Registro, edición y eliminación" onBack={onBack} />
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>ALARMAS REGISTRADAS</Text>
            <Text style={styles.summaryNumber}>{alarms.length}</Text>
          </View>
          <Text style={styles.summaryIcon}>◷</Text>
        </View>

        <AppButton label="Agregar alarma" icon="+" color={COLORS.purple} onPress={openCreate} />

        <View style={styles.listHeading}>
          <Text style={styles.listTitle}>Mis alarmas</Text>
          <Text style={styles.sortNote}>Ordenadas por fecha y hora ↑</Text>
        </View>

        {sortedAlarms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>◷</Text>
            <Text style={styles.emptyTitle}>Aún no tienes alarmas</Text>
            <Text style={styles.emptyText}>Pulsa “Agregar alarma” e indica una fecha y hora futuras.</Text>
          </View>
        ) : (
          sortedAlarms.map((alarm, index) => {
            const date = new Date(alarm.timestamp);
            const expired = alarm.timestamp <= now.getTime();
            return (
              <View key={alarm.id} style={styles.alarmCard}>
                <View style={styles.alarmTop}>
                  <View style={styles.alarmMain}>
                    <Text style={styles.index}>ALARMA {index + 1}</Text>
                    <Text style={styles.alarmTime}>{formatHourMinute(date)}</Text>
                    <Text style={styles.alarmDate}>{formatDate(date)}</Text>
                  </View>
                  <View style={[styles.statusBadge, expired && styles.expiredBadge]}>
                    <Text style={[styles.statusText, expired && styles.expiredText]}>
                      {expired ? 'VENCIDA' : 'PROGRAMADA'}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionRow}>
                  <View style={styles.actionHalf}>
                    <AppButton label="Editar" icon="✎" onPress={() => openEdit(alarm)}
                      color={COLORS.cyan} variant="outline" />
                  </View>
                  <View style={styles.actionHalf}>
                    <AppButton label="Eliminar" icon="×" onPress={() => deleteAlarm(alarm)}
                      color={COLORS.red} variant="outline" />
                  </View>
                </View>
              </View>
            );
          })
        )}
        <Text style={styles.explanation}>
          Las alarmas se mantienen durante esta sesión. No generan sonidos ni notificaciones del dispositivo.
        </Text>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.dialog}>
              <View style={styles.modalTop}>
                <Text style={styles.modalTitle}>{editingId === null ? 'Nueva alarma' : 'Editar alarma'}</Text>
                <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}
                  accessibilityRole="button" accessibilityLabel="Cerrar formulario">
                  <Text style={styles.closeText}>×</Text>
                </Pressable>
              </View>
              <Text style={styles.modalHint}>Escribe la fecha y la hora en formato de 24 horas.</Text>
              <Field label="FECHA (dd/mm/aaaa)" placeholder="DD/MM/AAAA"
                value={dateText} maxLength={10}
                onChangeText={(value) => { setDateText(value); setError(''); }} />
              <Field label="HORA (HH:mm)" placeholder="08:30"
                value={timeText} maxLength={5}
                onChangeText={(value) => { setTimeText(value); setError(''); }} />
              {error ? <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text> : null}
              <View style={styles.tip}>
                <Text style={styles.tipText}>✓ No se permiten duplicados.</Text>
                <Text style={styles.tipText}>✓ Solo se aceptan fechas y horas futuras.</Text>
                <Text style={styles.tipText}>✓ Al editar, puedes conservar la misma fecha y hora.</Text>
              </View>
              <AppButton label={editingId === null ? 'Guardar alarma' : 'Guardar cambios'}
                onPress={saveAlarm} color={COLORS.purple} />
              <View style={styles.cancelWrap}>
                <AppButton label="Cancelar" onPress={() => setModalVisible(false)}
                  color={COLORS.muted} variant="outline" />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 44 },
  summaryCard: { backgroundColor: '#28244D', borderRadius: 19, padding: 23,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderColor: '#504184', borderWidth: 1, marginBottom: 17 },
  summaryLabel: { color: '#D0C5FF', fontSize: 11, fontWeight: '900', letterSpacing: 1.3 },
  summaryNumber: { color: COLORS.text, fontWeight: '900', fontSize: 44, marginTop: 7 },
  summaryIcon: { color: COLORS.purple, fontSize: 52 },
  listHeading: { marginTop: 28, marginBottom: 14 },
  listTitle: { color: COLORS.text, fontWeight: '900', fontSize: 20 },
  sortNote: { color: COLORS.muted, fontSize: 12, marginTop: 5 },
  emptyState: { borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.border,
    backgroundColor: COLORS.surface, borderRadius: 19, padding: 29, alignItems: 'center' },
  emptyIcon: { color: COLORS.muted, fontSize: 46, marginBottom: 10 },
  emptyTitle: { color: COLORS.text, fontWeight: '900', fontSize: 17, textAlign: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 8 },
  alarmCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 18, padding: 17, marginBottom: 12 },
  alarmTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 17 },
  alarmMain: { flex: 1 },
  index: { color: COLORS.purple, fontSize: 10, letterSpacing: 1.1, fontWeight: '900' },
  alarmTime: { color: COLORS.text, fontWeight: '900', fontSize: 28, marginTop: 3 },
  alarmDate: { color: COLORS.muted, fontSize: 13, marginTop: 2 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#173B35', borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 7 },
  statusText: { color: COLORS.green, fontWeight: '900', fontSize: 9 },
  expiredBadge: { backgroundColor: '#3A303D' },
  expiredText: { color: COLORS.red },
  actionRow: { flexDirection: 'row' },
  actionHalf: { flex: 1, marginHorizontal: 4 },
  explanation: { color: COLORS.muted, fontSize: 11, lineHeight: 17, marginTop: 18 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' },
  modalScroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 17, paddingVertical: 30 },
  dialog: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderWidth: 1,
    borderRadius: 23, padding: 21, width: '100%', maxWidth: 470, alignSelf: 'center' },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: COLORS.text, fontWeight: '900', fontSize: 22 },
  closeButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight, borderRadius: 12 },
  closeText: { color: COLORS.muted, fontSize: 29, lineHeight: 32 },
  modalHint: { color: COLORS.muted, fontSize: 12, lineHeight: 19, marginTop: 9, marginBottom: 23 },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { color: COLORS.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 9 },
  field: { backgroundColor: COLORS.bg, borderColor: COLORS.border, borderWidth: 1, borderRadius: 13,
    color: COLORS.text, fontSize: 18, paddingHorizontal: 15, paddingVertical: 14 },
  errorText: { color: COLORS.red, fontSize: 12, lineHeight: 19, marginBottom: 12 },
  tip: { backgroundColor: '#1B3145', borderRadius: 13, padding: 13, marginBottom: 17 },
  tipText: { color: '#BED7ED', fontSize: 11, lineHeight: 20 },
  cancelWrap: { marginTop: 10 },
});
