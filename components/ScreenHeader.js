import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function ScreenHeader({ number, title, subtitle, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} accessibilityLabel="Volver al menú principal"
        accessibilityRole="button" style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>HERRAMIENTA {number}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 25 },
  back: { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center', marginRight: 13,
    borderWidth: 1, borderColor: COLORS.border },
  backText: { color: COLORS.text, fontSize: 35, lineHeight: 40, marginTop: -4 },
  heading: { flex: 1 },
  eyebrow: { color: COLORS.cyan, letterSpacing: 2, fontSize: 10, fontWeight: '800', marginBottom: 4 },
  title: { color: COLORS.text, fontSize: 25, fontWeight: '900', letterSpacing: -0.6 },
  subtitle: { color: COLORS.muted, fontSize: 13, marginTop: 3, lineHeight: 18 },
});
