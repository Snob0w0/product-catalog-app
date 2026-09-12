import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { SearchBar } from '../components/SearchBar';
import { ProductListItem } from '../components/ProductListItem';
import { LoadingView, ErrorView, EmptyView } from '../components/StateViews';

export function ProductListScreen({ navigation }) {
  const {
    items,
    status,
    error,
    query,
    setQuery,
    hasMore,
    loadMore,
    loadingMore,
    retry,
    refreshing,
    refresh,
  } = useProducts();

  const openDetail = (product) =>
    navigation.navigate('ProductDetail', { productId: product.id });

  const renderBody = () => {
    if (status === 'loading') return <LoadingView />;
    if (status === 'error') return <ErrorView message={error} onRetry={retry} />;
    if (items.length === 0) return <EmptyView />;

    return (
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductListItem product={item} onPress={() => openDetail(item)} />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={hasMore ? loadMore : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footerSpinner} color="#2f6fed" />
          ) : null
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  footerSpinner: { marginVertical: 16 },
});
