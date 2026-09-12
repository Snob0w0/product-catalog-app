import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function LoadingView() {
  return (
    <View style={styles.center} testID="loading-view">
      <ActivityIndicator size="large" color="#2f6fed" />
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center} testID="error-view">
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

export function EmptyView({ message = 'No products found' }) {
  return (
    <View style={styles.center} testID="empty-view">
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1a1a1a',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2f6fed',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
  },
});
