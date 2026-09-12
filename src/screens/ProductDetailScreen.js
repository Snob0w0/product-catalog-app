import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProductDetail } from '../hooks/useProductDetail';
import { LoadingView, ErrorView } from '../components/StateViews';

export function ProductDetailScreen({ route }) {
  const { productId } = route.params;
  const { product, status, error, retry } = useProductDetail(productId);

  if (status === 'loading') return <LoadingView />;
  if (status === 'error') return <ErrorView message={error} onRetry={retry} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {product.images.map((uri) => (
          <Image
            key={uri}
            source={{ uri }}
            style={styles.image}
            contentFit="cover"
            transition={150}
          />
        ))}
      </ScrollView>

      <View style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⭐ {product.rating}</Text>
          <Text style={styles.metaText}>{product.brand}</Text>
          <Text style={styles.metaText}>{product.category}</Text>
        </View>

        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const IMAGE_SIZE = 320;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 32 },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: '#f0f0f0',
  },
  body: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  price: { fontSize: 18, fontWeight: '600', color: '#2f6fed', marginTop: 6 },
  metaRow: { flexDirection: 'row', gap: 16, marginTop: 12, marginBottom: 16 },
  metaText: { fontSize: 14, color: '#666' },
  description: { fontSize: 15, lineHeight: 22, color: '#333' },
});
