import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useCatalog } from '../../context/CatalogContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltButton } from '../../components/common/VoltButton';
import { VoltInput } from '../../components/common/VoltInput';

export const AdminProductEditScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentRoute, goBack } = useNavigation();
  const { products, categories, addProduct, updateProduct } = useCatalog();

  const productId = currentRoute.params?.productId;
  const existing = productId ? products.find((p) => p.id === productId) : null;

  const [name, setName] = useState(existing?.name || '');
  const [brand, setBrand] = useState(existing?.brand || 'VoltTech');
  const [categoryId, setCategoryId] = useState(existing?.categoryId || categories[0]?.id || 'cat-laptops');
  const [tagline, setTagline] = useState(existing?.tagline || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [price, setPrice] = useState(existing?.price ? String(existing.price) : '');
  const [originalPrice, setOriginalPrice] = useState(existing?.originalPrice ? String(existing.originalPrice) : '');
  const [stockCount, setStockCount] = useState(existing?.stockCount ? String(existing.stockCount) : '15');
  const [imageUrl, setImageUrl] = useState(existing?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
  const [isFlashDeal, setIsFlashDeal] = useState<boolean>(existing?.isFlashDeal || false);
  const [isFeatured, setIsFeatured] = useState<boolean>(existing?.isFeatured ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'Product title and price are required.');
      return;
    }

    const priceNum = parseFloat(price) || 0;
    const origPriceNum = parseFloat(originalPrice) || priceNum;
    const stockNum = parseInt(stockCount, 10) || 10;
    const category = categories.find((c) => c.id === categoryId);

    setSaving(true);

    if (existing) {
      await updateProduct(existing.id, {
        name,
        brand,
        categoryId,
        categoryName: category?.name || 'General',
        tagline,
        description,
        price: priceNum,
        originalPrice: origPriceNum,
        stockCount: stockNum,
        inStock: stockNum > 0,
        images: [imageUrl],
        isFlashDeal,
        isFeatured,
      });
    } else {
      await addProduct({
        name,
        brand,
        categoryId,
        categoryName: category?.name || 'General',
        tagline: tagline || 'Flagship Engineering',
        description: description || 'High-performance commercial hardware.',
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercentage: Math.max(0, Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)),
        rating: 4.8,
        reviewCount: 1,
        stockCount: stockNum,
        inStock: stockNum > 0,
        images: [imageUrl],
        isFlashDeal,
        isFeatured,
        specs: [
          {
            group: 'Core Specifications',
            items: [
              { label: 'Manufacturer', value: brand },
              { label: 'Category', value: category?.name || 'Electronics' },
            ],
          },
        ],
      });
    }

    setSaving(false);
    goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <VoltHeader
        title={existing ? 'Edit Hardware' : 'New Hardware Item'}
        showLogo={false}
        showDelivery={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <VoltCard variant="glass" style={styles.formCard}>
          <VoltInput
            label="Product Title *"
            placeholder="e.g. AeroSound Pro Max ANC"
            value={name}
            onChangeText={setName}
          />

          <VoltInput
            label="Brand *"
            placeholder="e.g. Apple, Sony, VoltTech"
            value={brand}
            onChangeText={setBrand}
          />

          {/* Category Picker */}
          <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
            Category *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {categories.map((c) => {
              const isSelected = categoryId === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.7}
                  onPress={() => setCategoryId(c.id)}
                  style={[
                    styles.catPill,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceContainerLowest,
                      borderColor: isSelected ? colors.primary : colors.divider,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      Typography.labelSm,
                      { color: isSelected ? colors.onPrimaryContainer : colors.textSecondary, fontWeight: '700' },
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <View style={{ flex: 1 }}>
              <VoltInput
                label="Price (₹) *"
                placeholder="24999"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <VoltInput
                label="Original MRP (₹)"
                placeholder="32999"
                value={originalPrice}
                onChangeText={setOriginalPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <VoltInput
            label="Stock Quantity *"
            placeholder="15"
            value={stockCount}
            onChangeText={setStockCount}
            keyboardType="number-pad"
          />

          <VoltInput
            label="Image URL *"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChangeText={setImageUrl}
          />

          <VoltInput
            label="Tagline"
            placeholder="Ultra low-latency studio acoustics"
            value={tagline}
            onChangeText={setTagline}
          />

          <VoltInput
            label="Description"
            placeholder="Technical overview and product specifications"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={{ height: 72 }}
          />

          {/* Toggles */}
          <View style={styles.toggleRow}>
            <Text style={[Typography.bodyMd, { color: colors.textPrimary }]}>
              Mark as Flash Deal (Live Deal Bar)
            </Text>
            <Switch
              value={isFlashDeal}
              onValueChange={setIsFlashDeal}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
              thumbColor={colors.onPrimary}
            />
          </View>

          <View style={[styles.toggleRow, { marginTop: Spacing.sm }]}>
            <Text style={[Typography.bodyMd, { color: colors.textPrimary }]}>
              Show in Featured Recommendations
            </Text>
            <Switch
              value={isFeatured}
              onValueChange={setIsFeatured}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
              thumbColor={colors.onPrimary}
            />
          </View>

          <VoltButton
            title={existing ? 'Save Hardware Updates' : 'Publish Product to Store'}
            onPress={handleSave}
            loading={saving}
            style={{ marginTop: Spacing.lg }}
          />
        </VoltCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 48,
  },
  formCard: {
    padding: Spacing.md,
  },
  catScroll: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Roundness.full,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
});
