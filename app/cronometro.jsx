import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';
import { formatElapsed } from '../utils/dateHelpers';

export default function StopwatchScreen() {
  const router = useRouter();
  const onBack = () => router.replace('/');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const accumulatedRef = useRef(0);
  const startedAtRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    const update = () => {
      if (startedAtRef.current === null) return;
      setElapsedMs(accumulatedRef.current + (Date.now() - startedAtRef.current));
    };
    update();
    const interval = setInterval(update, 150);
    return () => clearInterval(interval);
  }, [running]);

  const play = () => {
    if (running) return; // No permitir iniciar dos temporizadores.
    startedAtRef.current = Date.now();
    setRunning(true);
  };
  const pause = () => {
    if (!running) return; // Pause solamente en ejecución.
    accumulatedRef.current += Date.now() - startedAtRef.current;
    startedAtRef.current = null;
    setElapsedMs(accumulatedRef.current);
    setRunning(false);
  };
  const stop = () => {
    startedAtRef.current = null;
    accumulatedRef.current = 0;
    setElapsedMs(0);
    setRunning(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader number="3" title="Cronómetro" subtitle="Controla el tiempo transcurrido" onBack={onBack} />
      <View style={styles.timerCard}>
        <Text style={[styles.status, { color: running ? COLORS.green : COLORS.muted }]}>
          {running ? '● CONTANDO' : elapsedMs > 0 ? '● EN PAUSA' : '● LISTO PARA INICIAR'}
        </Text>
        <Text style={styles.timer} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {formatElapsed(elapsedMs)}
        </Text>
        <Text style={styles.timerLegend}>HORAS       MINUTOS      SEGUNDOS</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.left}><AppButton label="Play" icon="▶" onPress={play}
          disabled={running} color={COLORS.green} /></View>
        <View style={styles.middle}><AppButton label="Pause" icon="Ⅱ" onPress={pause}
          disabled={!running} color={COLORS.amber} /></View>
        <View style={styles.right}><AppButton label="Stop" icon="■" onPress={stop}
          color={COLORS.red} /></View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
        <Text style={styles.infoText}>▶ Play inicia y reanuda desde el tiempo guardado.</Text>
        <Text style={styles.infoText}>Ⅱ Pause congela el tiempo acumulado.</Text>
        <Text style={styles.infoText}>■ Stop detiene y vuelve a 00:00:00.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  timerCard: { borderRadius: 22, paddingHorizontal: 17, paddingVertical: 45,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  status: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 25 },
  timer: { width: '100%', textAlign: 'center', color: COLORS.text,
    fontSize: 52, fontWeight: '900', fontVariant: ['tabular-nums'], letterSpacing: 1 },
  timerLegend: { color: COLORS.muted, fontSize: 9, fontWeight: '700', marginTop: 16, letterSpacing: 1.2 },
  controls: { flexDirection: 'row', marginTop: 19 },
  left: { flex: 1, marginRight: 6 },
  middle: { flex: 1, marginHorizontal: 5 },
  right: { flex: 1, marginLeft: 6 },
  infoCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 18, padding: 20, marginTop: 25 },
  infoTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginBottom: 12 },
  infoText: { color: COLORS.muted, fontSize: 13, lineHeight: 20, marginBottom: 9 },
});
