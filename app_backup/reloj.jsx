import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';
import { formatClock, formatDate, greetingForHour } from '../utils/dateHelpers';

export default function ClockScreen() {
  const router = useRouter();
  const onBack = () => router.replace('/');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting = greetingForHour(now.getHours());
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader number="1" title="Reloj digital" subtitle="Hora local actualizada automáticamente" onBack={onBack} />
      <View style={styles.clockCard}>
        <Text style={styles.live}>● EN TIEMPO REAL</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}
          style={styles.clock} accessibilityLabel={`Hora ${formatClock(now)}`}>
          {formatClock(now)}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>FECHA DE HOY</Text>
        <Text style={styles.date}>{formatDate(now)}</Text>
      </View>
      <View style={styles.greetingCard}>
        <Text style={styles.greetingIcon}>☀</Text>
        <View style={styles.greetingContent}>
          <Text style={styles.greetingLabel}>SALUDO AUTOMÁTICO</Text>
          <Text style={styles.greetingTitle}>{greeting}</Text>
          <Text style={styles.greetingBody}>Cambia según la hora local de tu dispositivo.</Text>
        </View>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Horarios del saludo</Text>
        <Text style={styles.detailText}>Antes de 12:00: Buenos días</Text>
        <Text style={styles.detailText}>12:00 a 17:59: Buenas tardes</Text>
        <Text style={styles.detailText}>Desde 18:00: Buenas noches</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  clockCard: { backgroundColor: COLORS.surface, paddingHorizontal: 22, paddingVertical: 28,
    borderRadius: 22, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  live: { color: COLORS.green, fontWeight: '900', fontSize: 11, letterSpacing: 1.5 },
  clock: { fontSize: 52, color: COLORS.text, fontWeight: '900', fontVariant: ['tabular-nums'],
    letterSpacing: 0.5, marginTop: 22, marginBottom: 23, textAlign: 'center', width: '100%' },
  divider: { backgroundColor: COLORS.border, width: '100%', height: 1, marginBottom: 22 },
  sectionLabel: { color: COLORS.muted, fontWeight: '800', fontSize: 10, letterSpacing: 1.8 },
  date: { color: COLORS.cyan, fontWeight: '800', fontSize: 26, marginTop: 8 },
  greetingCard: { backgroundColor: '#E7F0FF', borderColor: '#D7E5FA', borderWidth: 1,
    borderRadius: 20, padding: 19, marginTop: 18, flexDirection: 'row', alignItems: 'center' },
  greetingIcon: { color: COLORS.amber, fontSize: 38, marginRight: 17 },
  greetingContent: { flex: 1 },
  greetingLabel: { color: COLORS.amber, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  greetingTitle: { color: COLORS.text, fontWeight: '900', fontSize: 23, marginTop: 5 },
  greetingBody: { color: COLORS.muted, fontSize: 12, marginTop: 5, lineHeight: 18 },
  detailCard: { marginTop: 19, padding: 18, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 18 },
  detailTitle: { color: COLORS.text, fontSize: 14, fontWeight: '800', marginBottom: 10 },
  detailText: { color: COLORS.muted, fontSize: 12, marginBottom: 7 },
});
