import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isFirebaseConfigured } from '../../config/firebase';
import { TodoCard } from '../components/TodoCard';
import { useTodos } from '../hooks/useTodos';
import { createTodo, deleteTodo, getFirebaseErrorMessage } from '../services/todos';
import type { Todo } from '../types/todo';

export default function HomeScreen() {
  const { todos, loading, error } = useTodos();
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    const heading = draft.trim();
    if (!heading || !isFirebaseConfigured || saving) return;

    setSaving(true);
    try {
      await createTodo(heading);
      setDraft('');
      Keyboard.dismiss();
    } catch (saveError) {
      Alert.alert('Todo belum tersimpan', getFirebaseErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const performDelete = async (todo: Todo) => {
    setDeletingId(todo.id);
    try {
      await deleteTodo(todo.id);
    } catch (deleteError) {
      Alert.alert('Todo belum terhapus', getFirebaseErrorMessage(deleteError));
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (todo: Todo) => {
    Alert.alert('Hapus todo?', `“${todo.heading}” akan dihapus dari Firestore.`, [
      { text: 'BATAL', style: 'cancel' },
      {
        text: 'HAPUS',
        style: 'destructive',
        onPress: () => {
          void performDelete(todo);
        },
      },
    ]);
  };

  const listHeader = (
    <View>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PERSONAL WORKSPACE</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Todos App</Text>
          <View style={styles.crudBadge}>
            <Text style={styles.crudBadgeText}>CRUD</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Atur hal penting, satu tugas dalam satu waktu.</Text>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>DAFTAR TUGAS</Text>
          <Text style={styles.summaryCaption}>Tersimpan di Cloud Firestore</Text>
        </View>
        <Text style={styles.summaryCount}>{String(todos.length).padStart(2, '0')}</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Tambah todo</Text>
        <View style={styles.formRow}>
          <TextInput
            accessibilityLabel="Judul todo baru"
            editable={isFirebaseConfigured && !saving}
            maxLength={140}
            onChangeText={setDraft}
            onSubmitEditing={() => {
              void handleAdd();
            }}
            placeholder="Contoh: Selesaikan tugas mobile"
            placeholderTextColor="#9AA4B3"
            returnKeyType="done"
            style={styles.input}
            value={draft}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tambah todo"
            disabled={!isFirebaseConfigured || saving || draft.trim().length === 0}
            onPress={() => {
              void handleAdd();
            }}
            style={({ pressed }) => [
              styles.addButton,
              (!isFirebaseConfigured || saving || draft.trim().length === 0) && styles.addButtonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.addButtonText}>{saving ? '...' : 'TAMBAH'}</Text>
          </Pressable>
        </View>
        <Text style={styles.formHint}>Judul maksimal 140 karakter.</Text>
      </View>

      {!isFirebaseConfigured ? (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Hubungkan Firebase terlebih dahulu</Text>
          <Text style={styles.noticeText}>
            Salin <Text style={styles.inlineCode}>.env.example</Text> menjadi{' '}
            <Text style={styles.inlineCode}>.env</Text>, isi konfigurasi Firebase, lalu mulai ulang Expo.
          </Text>
        </View>
      ) : null}

      {isFirebaseConfigured && error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Firestore belum dapat diakses</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.listHeadingRow}>
        <Text style={styles.listTitle}>Todo kamu</Text>
        <Text style={styles.listCount}>{todos.length} ITEM</Text>
      </View>
    </View>
  );

  const emptyState = loading ? (
    <View style={styles.emptyState}>
      <ActivityIndicator color="#4256C7" />
      <Text style={styles.emptyTitle}>Mengambil data</Text>
      <Text style={styles.emptyText}>Menghubungkan daftar todo ke Firestore...</Text>
    </View>
  ) : isFirebaseConfigured && !error ? (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>✓</Text>
      </View>
      <Text style={styles.emptyTitle}>Belum ada todo</Text>
      <Text style={styles.emptyText}>Tambahkan tugas pertama melalui kolom di atas.</Text>
    </View>
  ) : null;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={todos}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        ListEmptyComponent={emptyState ?? undefined}
        ListFooterComponent={
          todos.length > 0 ? (
            <Text style={styles.footer}>Data tersinkron otomatis saat berubah.</Text>
          ) : undefined
        }
        ListHeaderComponent={listHeader}
        renderItem={({ item, index }) => (
          <TodoCard
            deleting={deletingId === item.id}
            index={index}
            onDelete={() => confirmDelete(item)}
            onOpen={() =>
              router.push({
                pathname: '/detail',
                params: { id: item.id, heading: item.heading },
              })
            }
            todo={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  listContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  header: { marginBottom: 20 },
  eyebrow: { color: '#6D78A6', fontSize: 10, fontWeight: '800', letterSpacing: 1.7 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  title: { color: '#17243A', fontSize: 31, fontWeight: '800', letterSpacing: -0.8 },
  crudBadge: { marginLeft: 11, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, backgroundColor: '#E9EDFF' },
  crudBadgeText: { color: '#4055C7', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  subtitle: { marginTop: 5, color: '#788398', fontSize: 14, lineHeight: 20 },
  summaryCard: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 19,
    borderRadius: 19,
    backgroundColor: '#273B83',
    marginBottom: 16,
  },
  summaryLabel: { color: '#D8E0FF', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  summaryCaption: { marginTop: 7, color: '#C1CCF4', fontSize: 12 },
  summaryCount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  formCard: {
    padding: 16,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF3',
    marginBottom: 16,
  },
  formTitle: { marginBottom: 12, color: '#1C2940', fontSize: 15, fontWeight: '800' },
  formRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E5E9F1',
    backgroundColor: '#F8F9FC',
    color: '#17243A',
    fontSize: 13,
  },
  addButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 9,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: '#4256C7',
  },
  addButtonDisabled: { backgroundColor: '#AAB3D8' },
  buttonPressed: { opacity: 0.78 },
  addButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  formHint: { marginTop: 9, color: '#8993A5', fontSize: 11 },
  noticeCard: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#F2D994',
    marginBottom: 18,
  },
  noticeTitle: { color: '#725416', fontSize: 13, fontWeight: '800' },
  noticeText: { marginTop: 5, color: '#806C43', fontSize: 12, lineHeight: 18 },
  inlineCode: { color: '#5D4A20', fontWeight: '800' },
  errorCard: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#FFF0F1',
    borderWidth: 1,
    borderColor: '#F6CDD0',
    marginBottom: 18,
  },
  errorTitle: { color: '#A9313C', fontSize: 13, fontWeight: '800' },
  errorText: { marginTop: 5, color: '#8D4A51', fontSize: 12, lineHeight: 18 },
  listHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 1,
    marginBottom: 12,
  },
  listTitle: { color: '#1C2940', fontSize: 17, fontWeight: '800' },
  listCount: { color: '#8C96A8', fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  separator: { height: 10 },
  emptyState: { flex: 1, minHeight: 175, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  emptyIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#E9EDFF' },
  emptyIconText: { color: '#4256C7', fontSize: 20, fontWeight: '800' },
  emptyTitle: { marginTop: 12, color: '#2A354A', fontSize: 15, fontWeight: '800' },
  emptyText: { maxWidth: 245, marginTop: 6, color: '#8791A3', fontSize: 12, lineHeight: 18, textAlign: 'center' },
  footer: { paddingTop: 18, color: '#9AA3B2', fontSize: 11, textAlign: 'center' },
});
