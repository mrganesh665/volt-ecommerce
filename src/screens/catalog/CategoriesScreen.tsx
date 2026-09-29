import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCatalog } from '../../context/CatalogContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';

export const CategoriesScreen: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { categories, products } = useCatalog();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader title="Hardware Categories" showLogo={false} showDelivery={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.bodyMd, { color: colors.textSecondary, marginBottom: Spacing.md }]}>
          Explore premium computing, acoustics, displays & mobile electronics
        </Text>

        <View style={styles.list}>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;

            return (
              <VoltCard
                key={cat.id}
                variant="glass"
                style={styles.categoryCard}
                onPress={() => navigate('product_list', { categoryId: cat.id, title: cat.name })}
              >
                <View style={styles.topRow}>
                  <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
                    <MaterialIcons name={cat.iconName as any} size={28} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: Spacing.md }}>
                    <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                      {cat.name}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 2 }]}>
                      {count} Flagship Products
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </View>

                {/* Subcategories tags */}
                <View style={styles.subcategoriesRow}>
                  {cat.subcategories.map((sub) => (
                    <TouchableOpacity
                      key={sub}
                      activeOpacity={0.7}
                      onPress={() =>
                        navigate('product_list', {
                          categoryId: cat.id,
                          title: `${cat.name} • ${sub}`,
                          query: sub,
                        })
                      }
                      style={[styles.subPill, { backgroundColor: colors.surfaceContainerLow }]}
                    >
                      <Text style={[Typography.labelSm, { color: colors.textSecondary }]}>
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </VoltCard>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  list: {
    gap: Spacing.md,
  },
  categoryCard: {
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcategoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  subPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Roundness.xs,
  },
});
