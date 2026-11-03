import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isFirebaseConfigured } from '../../config/firebase';
import { getFirebaseErrorMessage, updateTodo } from '../services/todos';

function readParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default function DetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[]; heading?: string | string[] }>();
  const id = readParam(params.id);
  const originalHeading = readParam(params.heading);
  const [heading, setHeading] = useState(originalHeading);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const changed = heading.trim() !== originalHeading.trim();

  const handleSave = async () => {
    const normalizedHeading = heading.trim();
    if (!id || !normalizedHeading || !changed || !isFirebaseConfigured || saving) return;

    setSaving(true);
    setError(null);
    try {
      await updateTodo(id, normalizedHeading);
      router.back();
    } catch (saveError) {
      setError(getFirebaseErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>KEMBALI</Text>
          </Pressable>

          <View style={styles.headingBlock}>
            <Text style={styles.eyebrow}>TODO DETAIL</Text>
            <Text style={styles.title}>Edit tugas</Text>
            <Text style={styles.subtitle}>Perbarui judul, lalu simpan perubahan ke Firestore.</Text>
          </View>

          <View style={styles.editorCard}>
            <Text style={styles.label}>JUDUL TODO</Text>
            <TextInput
              accessibilityLabel="Judul todo"
              autoCapitalize="sentences"
              autoCorrect
              editable={isFirebaseConfigured && !saving}
              maxLength={140}
              multiline
              onChangeText={(value) => {
                setHeading(value);
                setError(null);
              }}
              placeholder="Tulis judul todo"
              placeholderTextColor="#9AA4B3"
              style={styles.input}
              textAlignVertical="top"
              value={heading}
            />
            <Text style={styles.counter}>{heading.length}/140 karakter</Text>

            {!isFirebaseConfigured ? (
              <View style={styles.setupNotice}>
                <Text style={styles.setupText}>Isi konfigurasi Firebase di file .env sebelum menyimpan.</Text>
              </View>
            ) : null}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              disabled={!isFirebaseConfigured || !id || !heading.trim() || !changed || saving}
              onPress={() => {
                void handleSave();
              }}
              style={({ pressed }) => [
                styles.saveButton,
                (!isFirebaseConfigured || !id || !heading.trim() || !changed || saving) && styles.saveButtonDisabled,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.saveButtonText}>{saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
              <Text style={styles.cancelButtonText}>BATAL</Text>
            </Pressable>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Tips</Text>
            <Text style={styles.tipText}>Todo kosong tidak dapat disimpan. Judul harus berisi paling banyak 140 karakter.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 13, paddingBottom: 28 },
  backButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', minHeight: 40, paddingRight: 12 },
  backArrow: { marginRight: 7, color: '#4256C7', fontSize: 30, lineHeight: 31, fontWeight: '400' },
  backText: { color: '#53617A', fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  pressed: { opacity: 0.72 },
  headingBlock: { marginTop: 24, marginBottom: 22 },
  eyebrow: { color: '#6D78A6', fontSize: 10, fontWeight: '800', letterSpacing: 1.7 },
  title: { marginTop: 8, color: '#17243A', fontSize: 30, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { marginTop: 6, color: '#788398', fontSize: 13, lineHeight: 20 },
  editorCard: { padding: 18, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF3' },
  label: { marginBottom: 10, color: '#5D6980', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  input: {
    minHeight: 132,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E7F0',
    backgroundColor: '#F8F9FC',
    color: '#17243A',
    fontSize: 16,
    lineHeight: 23,
  },
  counter: { marginTop: 8, color: '#929BAC', fontSize: 11, textAlign: 'right' },
  setupNotice: { marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: '#FFF8E8' },
  setupText: { color: '#725416', fontSize: 12, lineHeight: 18 },
  errorText: { marginTop: 12, color: '#B63843', fontSize: 12, lineHeight: 18 },
  saveButton: { height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 22, borderRadius: 14, backgroundColor: '#1C9A70' },
  saveButtonDisabled: { backgroundColor: '#A7C8BB' },
  saveButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.7 },
  cancelButton: { height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8, borderRadius: 14, backgroundColor: '#F0F2F7' },
  cancelButtonText: { color: '#68748A', fontSize: 11, fontWeight: '800', letterSpacing: 0.7 },
  tipCard: { marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: '#EEF1FF' },
  tipTitle: { color: '#4055C7', fontSize: 12, fontWeight: '800' },
  tipText: { marginTop: 5, color: '#647099', fontSize: 12, lineHeight: 18 },
});
