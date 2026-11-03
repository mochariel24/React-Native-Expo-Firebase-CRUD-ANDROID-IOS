import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Todo } from '../types/todo';

type TodoCardProps = {
  todo: Todo;
  index: number;
  deleting: boolean;
  onOpen: () => void;
  onDelete: () => void;
};

export function TodoCard({ todo, index, deleting, onOpen, onDelete }: TodoCardProps) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit todo: ${todo.heading}`}
        onPress={onOpen}
        style={({ pressed }) => [styles.openButton, pressed && styles.pressed]}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <View style={styles.textGroup}>
          <Text numberOfLines={2} style={styles.heading}>
            {todo.heading}
          </Text>
          <Text style={styles.hint}>Ketuk untuk mengedit</Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Hapus todo: ${todo.heading}`}
        disabled={deleting}
        onPress={onDelete}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}>
        <Text style={styles.deleteText}>{deleting ? '...' : 'HAPUS'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF3',
    shadowColor: '#24334D',
    shadowOpacity: 0.045,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
  openButton: {
    flex: 1,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  pressed: {
    opacity: 0.72,
  },
  numberBadge: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#EEF1FF',
  },
  numberText: {
    color: '#4256C7',
    fontSize: 13,
    fontWeight: '800',
  },
  textGroup: {
    flex: 1,
    paddingHorizontal: 12,
  },
  heading: {
    color: '#17243A',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  hint: {
    marginTop: 4,
    color: '#8590A3',
    fontSize: 11,
    fontWeight: '500',
  },
  deleteButton: {
    minWidth: 56,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFF0F1',
  },
  deletePressed: {
    backgroundColor: '#FDDCDD',
  },
  deleteText: {
    color: '#C9434F',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
