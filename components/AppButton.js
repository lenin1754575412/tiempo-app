import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function AppButton({
  label,
  icon,
  onPress,
  disabled = false,
  color = COLORS.cyan,
  variant = 'filled',
  style,
}) {
  const outline = variant === 'outline';
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: outline ? 'transparent' : color,
          borderColor: outline ? color : 'transparent',
          opacity: disabled ? 0.35 : (pressed ? 0.75 : 1) },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <Text style={[styles.icon, { color: outline ? color : COLORS.bg }]}>{icon}</Text> : null}
        <Text style={[styles.text, { color: outline ? color : COLORS.bg }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 15, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 17, fontWeight: '800', marginRight: 8 },
  text: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
