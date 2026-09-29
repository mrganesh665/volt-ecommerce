import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, Roundness } from '../../theme';
import { supportService } from '../../services/support.service';
import { SupportChatMessage } from '../../types';
import { VoltHeader } from '../../components/common/VoltHeader';
import { VoltCard } from '../../components/common/VoltCard';

export const HelpSupportScreen: React.FC = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'faqs' | 'chat'>('faqs');

  // FAQs
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [faqs, setFaqs] = useState(supportService.getInitialChatMessages());

  // Interactive Support Chat
  const [messages, setMessages] = useState<SupportChatMessage[]>(supportService.getInitialChatMessages());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: SupportChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const botResponse = await supportService.sendChatMessage(text);
    setIsTyping(false);
    setMessages((prev) => [...prev, botResponse]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoltHeader title="Help & Hardware Support" showLogo={false} showDelivery={false} />

      {/* Tabs Switcher */}
      <View
        style={[
          styles.tabsRow,
          { backgroundColor: colors.surfaceContainerLowest, borderBottomColor: colors.divider },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('faqs')}
          style={[
            styles.tabBtn,
            { borderBottomColor: activeTab === 'faqs' ? colors.primary : 'transparent' },
          ]}
        >
          <Text
            style={[
              Typography.labelMd,
              {
                color: activeTab === 'faqs' ? colors.primary : colors.textTertiary,
                fontWeight: activeTab === 'faqs' ? '700' : '500',
              },
            ]}
          >
            Knowledge Base & FAQs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('chat')}
          style={[
            styles.tabBtn,
            { borderBottomColor: activeTab === 'chat' ? colors.primary : 'transparent' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[
                Typography.labelMd,
                {
                  color: activeTab === 'chat' ? colors.primary : colors.textTertiary,
                  fontWeight: activeTab === 'chat' ? '700' : '500',
                },
              ]}
            >
              24/7 AI Concierge Chat
            </Text>
            <View style={[styles.liveIndicator, { backgroundColor: colors.tertiary }]} />
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === 'faqs' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Support Channels Banner */}
          <VoltCard variant="elevated" style={styles.channelsCard}>
            <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700' }]}>
              Dedicated VIP Hardware Concierge
            </Text>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
              Official pan-India service & Razorpay payment resolutions
            </Text>

            <View style={styles.contactRow}>
              <View style={[styles.contactPill, { backgroundColor: colors.surfaceContainerLow }]}>
                <Ionicons name="call" size={16} color={colors.primary} />
                <Text style={[Typography.labelSm, { color: colors.textPrimary, marginLeft: 6 }]}>
                  1800-VOLT-TECH
                </Text>
              </View>

              <View style={[styles.contactPill, { backgroundColor: colors.surfaceContainerLow }]}>
                <Ionicons name="mail" size={16} color={colors.secondary} />
                <Text style={[Typography.labelSm, { color: colors.textPrimary, marginLeft: 6 }]}>
                  vip@volttech.io
                </Text>
              </View>
            </View>
          </VoltCard>

          {/* FAQs Accordion */}
          <Text style={[Typography.headlineSm, { color: colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm }]}>
            Frequently Asked Questions
          </Text>

          {[
            {
              id: 'faq-1',
              q: 'How do I track my delivery status in real-time?',
              a: 'You can track your order directly inside the Order History section under Account. Click on any active order to see real-time updates from our express air logistics network.',
            },
            {
              id: 'faq-2',
              q: 'What Razorpay payment methods are accepted?',
              a: 'We accept all Razorpay-powered payment options including UPI (Google Pay, PhonePe, Paytm, Custom VPA), Credit & Debit cards (Visa, MasterCard, RuPay, Amex), Net Banking with over 50+ banks, No-Cost EMI, and Cash on Delivery.',
            },
            {
              id: 'faq-3',
              q: 'Is the official brand warranty valid across India?',
              a: 'Yes, 100% of products sold on VoltTech come with authentic manufacturer invoices and official pan-India brand warranty honored at any authorized service center.',
            },
            {
              id: 'faq-4',
              q: 'What is the 7-day replacement guarantee?',
              a: 'If your hardware arrives with any manufacturing defect, transit damage, or mismatch, simply raise a replacement request within 7 days from the order details screen for doorstep pickup.',
            },
          ].map((item) => {
            const isExpanded = expandedFaq === item.id;

            return (
              <VoltCard
                key={item.id}
                variant="glass"
                style={styles.faqCard}
                onPress={() => setExpandedFaq(isExpanded ? null : item.id)}
              >
                <View style={styles.faqHeader}>
                  <Text
                    style={[
                      Typography.labelLg,
                      { color: isExpanded ? colors.primary : colors.textPrimary, fontWeight: '700', flex: 1 },
                    ]}
                  >
                    {item.q}
                  </Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={isExpanded ? colors.primary : colors.textTertiary}
                  />
                </View>

                {isExpanded && (
                  <Text
                    style={[
                      Typography.bodyMd,
                      { color: colors.textSecondary, marginTop: Spacing.sm, lineHeight: 22 },
                    ]}
                  >
                    {item.a}
                  </Text>
                )}
              </VoltCard>
            );
          })}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatContainer}
        >
          <ScrollView
            contentContainerStyle={styles.chatScroll}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubbleWrapper,
                    { alignItems: isUser ? 'flex-end' : 'flex-start' },
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      {
                        backgroundColor: isUser
                          ? colors.primaryContainer
                          : colors.surfaceContainerHigh,
                        borderBottomRightRadius: isUser ? 2 : Roundness.md,
                        borderBottomLeftRadius: !isUser ? 2 : Roundness.md,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.bodyMd,
                        { color: isUser ? colors.onPrimaryContainer : colors.textPrimary },
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <Text
                      style={[
                        Typography.bodySm,
                        {
                          color: isUser ? 'rgba(0, 31, 38, 0.7)' : colors.textTertiary,
                          fontSize: 10,
                          alignSelf: 'flex-end',
                          marginTop: 4,
                        },
                      ]}
                    >
                      {msg.timestamp}
                    </Text>
                  </View>

                  {/* Quick Replies */}
                  {msg.quickReplies && (
                    <View style={styles.quickRepliesContainer}>
                      {msg.quickReplies.map((reply) => (
                        <TouchableOpacity
                          key={reply}
                          activeOpacity={0.7}
                          onPress={() => handleSendMessage(reply)}
                          style={[styles.quickReplyPill, { backgroundColor: colors.surfaceContainer }]}
                        >
                          <Text style={[Typography.labelSm, { color: colors.primary }]}>{reply}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.typingBubble, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  VoltTech AI is typing...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Chat Input Bar */}
          <View
            style={[
              styles.chatInputBar,
              {
                backgroundColor: colors.surfaceContainerLowest,
                borderTopColor: colors.divider,
              },
            ]}
          >
            <TextInput
              placeholder="Ask about orders, refunds, warranties..."
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage()}
              style={[
                styles.chatInput,
                Typography.bodyMd,
                {
                  backgroundColor: colors.surfaceContainer,
                  color: colors.textPrimary,
                  borderColor: colors.divider,
                },
              ]}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSendMessage()}
              style={[styles.sendBtn, { backgroundColor: colors.primaryContainer }]}
            >
              <Ionicons name="send" size={16} color={colors.onPrimaryContainer} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  channelsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  contactRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  contactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Roundness.full,
  },
  faqCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatContainer: {
    flex: 1,
  },
  chatScroll: {
    padding: Spacing.md,
    paddingBottom: 20,
  },
  messageBubbleWrapper: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  messageBubble: {
    maxWidth: '82%',
    padding: Spacing.md,
    borderRadius: Roundness.md,
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  quickReplyPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Roundness.full,
  },
  typingBubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Roundness.full,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    height: 42,
    borderRadius: Roundness.full,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
});
