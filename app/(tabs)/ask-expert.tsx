import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { Send, User, Bot, Image as ImageIcon, Brain, Microscope, Sprout, FlaskRound as Flask } from 'lucide-react-native';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  expertName?: string;
  expertTitle?: string;
  attachedImage?: string;
};

const experts = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Agricultural Scientist',
    expertise: ['Crop Disease', 'Soil Health'],
    online: true,
    icon: Microscope,
    color: '#8b5cf6',
  },
  {
    id: '2',
    name: 'Prof. Rodriguez',
    title: 'Agronomist',
    expertise: ['Sustainable Farming', 'Irrigation'],
    online: false,
    icon: Sprout,
    color: '#ec4899',
  },
  {
    id: '3',
    name: 'Dr. Thompson',
    title: 'Plant Pathologist',
    expertise: ['Disease Control', 'Organic Farming'],
    online: true,
    icon: Flask,
    color: '#f59e0b',
  },
];

export default function AskExpert() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Smart Farming Assistant! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      expertName: 'AI Assistant',
      expertTitle: 'Smart Farming Guide',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const expert = experts.find((e) => e.id === (selectedExpert || '1'));
      const isAIResponse = !selectedExpert;
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: isAIResponse
          ? `Based on my analysis, ${inputText.toLowerCase()} typically indicates ${generateAIResponse()}`
          : `Thank you for your question about ${inputText.toLowerCase()}. Based on my expertise in ${
              expert?.expertise.join(' and ')
            }, I recommend...`,
        isUser: false,
        timestamp: new Date(),
        expertName: isAIResponse ? 'AI Assistant' : expert?.name,
        expertTitle: isAIResponse ? 'Smart Farming Guide' : expert?.title,
      };
      
      setMessages((prev) => [...prev, response]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const generateAIResponse = () => {
    const responses = [
      'a common issue that can be addressed with proper irrigation and soil management.',
      'an opportunity to implement sustainable farming practices.',
      'a situation where crop rotation might be beneficial.',
      'a challenge that can be overcome with organic farming methods.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1920' }}
      style={styles.container}
      imageStyle={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={100}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Expert Consultation</Text>
          </View>

          <View style={styles.expertsContainer}>
            <View style={styles.expertGrid}>
              <TouchableOpacity
                style={[
                  styles.expertButton,
                  !selectedExpert && styles.expertButtonSelected,
                  { backgroundColor: '#10b981' },
                ]}
                onPress={() => setSelectedExpert(null)}>
                <View style={[styles.expertIcon, { backgroundColor: '#059669' }]}>
                  <Brain size={24} color="#ffffff" />
                </View>
                <View style={styles.expertInfo}>
                  <Text style={styles.expertName}>AI Assistant</Text>
                  <Text style={styles.expertTitle}>Quick Responses</Text>
                </View>
                <View style={[styles.onlineIndicator, { backgroundColor: '#059669' }]} />
              </TouchableOpacity>

              {experts.map((expert) => (
                <TouchableOpacity
                  key={expert.id}
                  style={[
                    styles.expertButton,
                    selectedExpert === expert.id && styles.expertButtonSelected,
                    { backgroundColor: expert.color },
                  ]}
                  onPress={() => setSelectedExpert(expert.id)}>
                  <View style={[styles.expertIcon, { backgroundColor: `${expert.color}dd` }]}>
                    <expert.icon size={24} color="#ffffff" />
                  </View>
                  <View style={styles.expertInfo}>
                    <Text style={styles.expertName}>{expert.name}</Text>
                    <Text style={styles.expertTitle}>{expert.title}</Text>
                  </View>
                  <View
                    style={[
                      styles.onlineIndicator,
                      { backgroundColor: expert.online ? '#22c55e' : '#6b7280' },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chatContainer}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.isUser ? styles.userMessage : styles.expertMessage,
                  ]}>
                  {message.isUser ? (
                    <View style={styles.userIcon}>
                      <User size={20} color="#ffffff" />
                    </View>
                  ) : (
                    <View style={[styles.messageExpertIcon, { backgroundColor: selectedExpert ? experts.find(e => e.name === message.expertName)?.color || '#10b981' : '#10b981' }]}>
                      <Bot size={20} color="#ffffff" />
                    </View>
                  )}
                  <View style={styles.messageContent}>
                    {!message.isUser && (
                      <View style={styles.expertInfo}>
                        <Text style={styles.expertMessageName}>
                          {message.expertName}
                        </Text>
                        <Text style={styles.expertMessageTitle}>
                          {message.expertTitle}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.messageText}>
                      {message.text}
                    </Text>
                    {message.attachedImage && (
                      <View style={styles.attachedImagePlaceholder}>
                        <ImageIcon size={24} color="#6b7280" />
                        <Text style={styles.attachedImageText}>Image Attachment</Text>
                      </View>
                    )}
                    <Text style={styles.timestamp}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton}>
                <ImageIcon size={24} color="#6b7280" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your farming question..."
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText}>
                <Send
                  size={24}
                  color={inputText ? '#ffffff' : '#a1a1aa'}
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    textAlign: 'center',
  },
  expertsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  expertGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  expertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    width: '48%',
    position: 'relative',
  },
  expertButtonSelected: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  expertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  expertTitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  expertMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  messageExpertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertMessageName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  expertMessageTitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
    marginTop: 4,
  },
  attachedImagePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  attachedImageText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  sendIcon: {
    transform: [{ rotate: '45deg' }],
  },
});