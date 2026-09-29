import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';
import { useAddress } from '../../context/AddressContext';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';
import { VoltBadge } from '../../components/common/VoltBadge';
import { VoltButton } from '../../components/common/VoltButton';
import { VoltInput } from '../../components/common/VoltInput';
import { Address, AddressType } from '../../types';

export const AddressManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const { goBack } = useNavigation();
  const {
    addresses,
    selectedAddress,
    selectAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [type, setType] = useState<AddressType>('HOME');
  const [isDefault, setIsDefault] = useState(false);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setFullName('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setLandmark('');
    setCity('Bengaluru');
    setState('Karnataka');
    setPincode('');
    setType('HOME');
    setIsDefault(addresses.length === 0);
    setFormError('');
    setModalVisible(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setType(addr.type);
    setIsDefault(addr.isDefault);
    setFormError('');
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !pincode.trim()) {
      setFormError('Please fill in all mandatory address fields');
      return;
    }

    if (editingId) {
      await updateAddress(editingId, {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        pincode,
        type,
        isDefault,
      });
    } else {
      await addAddress({
        userId: 'user-default',
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        pincode,
        type,
        isDefault,
      });
    }

    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader
        title="Delivery Address"
        showLogo={false}
        showDelivery={false}
        rightAction={
          <TouchableOpacity activeOpacity={0.7} onPress={openAddModal}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfoRow}>
          <Text style={[Typography.bodyMd, { color: colors.textSecondary }]}>
            Select where you want your hardware delivered
          </Text>
        </View>

        {/* Address Cards List */}
        <View style={styles.addressList}>
          {addresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;

            return (
              <VoltCard
                key={addr.id}
                variant="glass"
                style={[
                  styles.addressCard,
                  {
                    borderColor: isSelected ? colors.primary : colors.divider,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                ]}
                onPress={() => selectAddress(addr.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: isSelected ? colors.primary : colors.outline,
                          backgroundColor: isSelected ? colors.primary : 'transparent',
                        },
                      ]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
                    </View>

                    <Text
                      style={[
                        Typography.headlineSm,
                        { color: colors.textPrimary, fontWeight: '700', marginLeft: Spacing.sm },
                      ]}
                    >
                      {addr.fullName}
                    </Text>

                    <VoltBadge
                      label={addr.type}
                      variant={addr.type === 'HOME' ? 'cyan' : 'violet'}
                      size="sm"
                      style={{ marginLeft: Spacing.sm }}
                    />

                    {addr.isDefault && (
                      <VoltBadge label="DEFAULT" variant="emerald" size="sm" style={{ marginLeft: 4 }} />
                    )}
                  </View>

                  <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => openEditModal(addr)}>
                      <Ionicons name="create-outline" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    {addresses.length > 1 && (
                      <TouchableOpacity activeOpacity={0.7} onPress={() => deleteAddress(addr.id)}>
                        <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <Text
                  style={[
                    Typography.bodyMd,
                    { color: colors.textPrimary, marginTop: Spacing.sm, lineHeight: 20 },
                  ]}
                >
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                </Text>

                {addr.landmark ? (
                  <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 2 }]}>
                    Landmark: {addr.landmark}
                  </Text>
                ) : null}

                <Text style={[Typography.bodyMd, { color: colors.textPrimary, marginTop: 2 }]}>
                  {addr.city}, {addr.state} - {addr.pincode}
                </Text>

                <View style={styles.phoneRow}>
                  <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: 4 }]}>
                    {addr.phone}
                  </Text>
                </View>

                {!addr.isDefault && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setDefaultAddress(addr.id)}
                    style={{ marginTop: Spacing.sm }}
                  >
                    <Text style={[Typography.labelSm, { color: colors.primary }]}>
                      Set as Default Address
                    </Text>
                  </TouchableOpacity>
                )}
              </VoltCard>
            );
          })}
        </View>

        {/* Add New Address Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openAddModal}
          style={[
            styles.addNewBtn,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.primary,
            },
          ]}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={[Typography.labelLg, { color: colors.primary, fontWeight: '700', marginLeft: 6 }]}>
            Add New Delivery Address
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Done / Continue Button */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderTopColor: colors.divider,
          },
        ]}
      >
        <VoltButton
          title="Confirm Delivery Address"
          onPress={() => goBack()}
          icon={<Ionicons name="checkmark-circle" size={18} color={colors.onPrimaryContainer} />}
        />
      </View>

      {/* Add / Edit Address Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.surfaceContainerLowest, borderTopColor: colors.divider },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
                {editingId ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
              {formError ? (
                <Text style={[Typography.bodySm, { color: colors.error, marginBottom: Spacing.sm }]}>
                  {formError}
                </Text>
              ) : null}

              <VoltInput
                label="Full Name *"
                placeholder="Recipient name"
                value={fullName}
                onChangeText={setFullName}
                leftIcon="person-outline"
              />

              <VoltInput
                label="Mobile Number *"
                placeholder="10-digit mobile"
                value={phone}
                onChangeText={setPhone}
                leftIcon="call-outline"
                keyboardType="phone-pad"
              />

              <VoltInput
                label="Pin Code *"
                placeholder="6-digit PIN code (e.g. 560103)"
                value={pincode}
                onChangeText={setPincode}
                leftIcon="location-outline"
                keyboardType="number-pad"
              />

              <VoltInput
                label="Flat, House no., Building, Company *"
                placeholder="Building name, flat number"
                value={addressLine1}
                onChangeText={setAddressLine1}
                leftIcon="home-outline"
              />

              <VoltInput
                label="Area, Street, Sector"
                placeholder="Street address, colony"
                value={addressLine2}
                onChangeText={setAddressLine2}
              />

              <VoltInput
                label="Landmark (Optional)"
                placeholder="Nearby landmark or tech park"
                value={landmark}
                onChangeText={setLandmark}
              />

              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <VoltInput
                    label="City *"
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <VoltInput
                    label="State *"
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                  />
                </View>
              </View>

              {/* Address Type Selector */}
              <Text style={[Typography.labelMd, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
                Address Type
              </Text>
              <View style={styles.typeSelectorRow}>
                {(['HOME', 'WORK', 'OTHER'] as AddressType[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    activeOpacity={0.7}
                    onPress={() => setType(t)}
                    style={[
                      styles.typePill,
                      {
                        backgroundColor:
                          type === t ? colors.primaryContainer : colors.surfaceContainer,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.labelSm,
                        {
                          color: type === t ? colors.onPrimaryContainer : colors.textSecondary,
                          fontWeight: type === t ? '800' : '500',
                        },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsDefault(!isDefault)}
                style={styles.defaultCheckboxRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isDefault ? colors.primary : colors.outline,
                      backgroundColor: isDefault ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isDefault && <Ionicons name="checkmark" size={13} color={colors.onPrimary} />}
                </View>
                <Text style={[Typography.bodySm, { color: colors.textPrimary, marginLeft: Spacing.sm }]}>
                  Set as default delivery address
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={{ marginTop: Spacing.md }}>
              <VoltButton title="Save Address" onPress={handleSaveAddress} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  topInfoRow: {
    marginBottom: Spacing.md,
  },
  addressList: {
    gap: Spacing.md,
  },
  addressCard: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Roundness.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: Spacing.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    borderTopWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: Roundness.xl,
    borderTopRightRadius: Roundness.xl,
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Roundness.sm,
  },
  defaultCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
