import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCatalog } from '../../context/CatalogContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';

export const AdminProductsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { products, deleteProduct } = useCatalog();

  const [search, setSearch] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Product', `Are you sure you want to remove "${name}" from the store catalog?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader
        title={`Hardware Inventory (${products.length})`}
        showLogo={false}
        showDelivery={false}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('admin_product_edit')}
            style={[styles.addBtn, { backgroundColor: colors.primaryContainer }]}
          >
            <Ionicons name="add" size={18} color={colors.onPrimaryContainer} />
            <Text style={[Typography.labelSm, { color: colors.onPrimaryContainer, fontWeight: '700', marginLeft: 2 }]}>
              New
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {filtered.map((item) => (
            <VoltCard key={item.id} variant="glass" style={styles.itemCard}>
              <Image source={{ uri: item.images[0] }} style={styles.itemImage} resizeMode="contain" />

              <View style={styles.itemInfo}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={[Typography.labelLg, { color: colors.textPrimary, fontWeight: '700' }]}>
                      {item.name}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                      {item.brand} • {item.categoryName}
                    </Text>
                  </View>

                  <VoltBadge
                    label={`${item.stockCount} in stock`}
                    variant={item.stockCount > 5 ? 'emerald' : 'error'}
                    size="sm"
                  />
                </View>

                <View style={styles.priceAndActions}>
                  <Text style={[Typography.priceCard, { color: colors.primary }]}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </Text>

                  <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => navigate('admin_product_edit', { productId: item.id })}
                      style={[styles.actionBtn, { backgroundColor: colors.surfaceContainerHigh }]}
                    >
                      <Ionicons name="create-outline" size={16} color={colors.primary} />
                      <Text style={[Typography.labelSm, { color: colors.primary, marginLeft: 4 }]}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleDelete(item.id, item.name)}
                      style={[styles.actionBtn, { backgroundColor: colors.surfaceContainerHigh }]}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </VoltCard>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Roundness.sm,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  list: {
    gap: Spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  itemImage: {
    width: 68,
    height: 68,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  priceAndActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Roundness.xs,
  },
});
