import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';

export default function ChatScreen({ user, client }) {
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConnections();
  }, []);

  useEffect(() => {
    if (selectedConnection) {
      loadMessages();
    }
  }, [selectedConnection]);

  const loadConnections = async () => {
    try {
      // Load user connections
      const connectionsResult = await client.models.Connection.list({
        filter: {
          or: [
            { fromUserId: { eq: user.userId } },
            { toUserId: { eq: user.userId } }
          ]
        }
      });
      
      setConnections(connectionsResult.data);
    } catch (error) {
      console.error('Error loading connections:', error);
      // Use mock data for demo
      setConnections(generateMockConnections());
    }
  };

  const generateMockConnections = () => [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: '👩🏽',
        lastSeen: '2 minutes ago',
        country: 'Kenya',
      },
      lastMessage: 'Excited about our Tanzania trip!',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
      commonInterests: ['Safari', 'Photography', 'Wildlife'],
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Ahmed Hassan',
        avatar: '👨🏿',
        lastSeen: '1 hour ago',
        country: 'Morocco',
      },
      lastMessage: 'Have you been to Marrakech before?',
      lastMessageTime: '9:15 AM',
      unreadCount: 0,
      commonInterests: ['Culture', 'Food', 'History'],
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: 'Grace Mbeki',
        avatar: '👩🏾',
        lastSeen: '3 hours ago',
        country: 'South Africa',
      },
      lastMessage: 'Cape Town is amazing this time of year',
      lastMessageTime: 'Yesterday',
      unreadCount: 1,
      commonInterests: ['Wine Tasting', 'Hiking', 'Beach'],
    },
  ];

  const generateMockMessages = (connectionId) => [
    {
      id: '1',
      senderId: connectionId === '1' ? 'user1' : user.userId,
      content: 'Hey! I saw you\'re planning a trip to Tanzania too!',
      timestamp: '2024-01-15T09:00:00Z',
      isRead: true,
    },
    {
      id: '2',
      senderId: connectionId === '1' ? user.userId : 'user1',
      content: 'Yes! I\'m so excited. Are you planning to visit Serengeti?',
      timestamp: '2024-01-15T09:05:00Z',
      isRead: true,
    },
    {
      id: '3',
      senderId: connectionId === '1' ? 'user1' : user.userId,
      content: 'Absolutely! I\'ve heard the Great Migration is incredible this time of year. Would you like to coordinate our trips?',
      timestamp: '2024-01-15T09:10:00Z',
      isRead: true,
    },
    {
      id: '4',
      senderId: connectionId === '1' ? user.userId : 'user1',
      content: 'That sounds perfect! I\'d love to meet up there.',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
    },
  ];

  const loadMessages = async () => {
    try {
      const messagesResult = await client.models.Message.list({
        filter: {
          or: [
            {
              and: [
                { senderId: { eq: user.userId } },
                { receiverId: { eq: selectedConnection.user.id } }
              ]
            },
            {
              and: [
                { senderId: { eq: selectedConnection.user.id } },
                { receiverId: { eq: user.userId } }
              ]
            }
          ]
        }
      });
      
      setMessages(messagesResult.data.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      ));
    } catch (error) {
      console.error('Error loading messages:', error);
      // Use mock data for demo
      setMessages(generateMockMessages(selectedConnection.id));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConnection) return;

    try {
      const messageData = {
        senderId: user.userId,
        receiverId: selectedConnection.user.id,
        content: newMessage.trim(),
        messageType: 'Text',
        isRead: false,
      };

      await client.models.Message.create(messageData);
      
      // Add to local state immediately for better UX
      setMessages(prev => [...prev, {
        ...messageData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }]);
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderConnectionItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.connectionItem,
        selectedConnection?.id === item.id && styles.selectedConnection
      ]}
      onPress={() => setSelectedConnection(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.user.avatar}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.connectionInfo}>
        <View style={styles.connectionHeader}>
          <Text style={styles.connectionName}>{item.user.name}</Text>
          <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        <View style={styles.connectionDetails}>
          <Text style={styles.country}>📍 {item.user.country}</Text>
          <Text style={styles.interests}>
            {item.commonInterests.slice(0, 2).join(', ')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user.userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.theirMessage
      ]}>
        <Text style={[
          styles.messageText,
          isMyMessage ? styles.myMessageText : styles.theirMessageText
        ]}>
          {item.content}
        </Text>
        <Text style={styles.messageTime}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  if (!selectedConnection) {
    return (
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search connections..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#7F8C8D"
          />
        </View>

        {/* Connections List */}
        <FlatList
          data={connections.filter(conn => 
            conn.user.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderConnectionItem}
          keyExtractor={(item) => item.id}
          style={styles.connectionsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Empty State */}
        {connections.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No connections yet</Text>
            <Text style={styles.emptySubtitle}>
              Start exploring and connecting with fellow travelers!
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setSelectedConnection(null)}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>
            {selectedConnection.user.name}
          </Text>
          <Text style={styles.chatHeaderStatus}>
            {selectedConnection.user.lastSeen}
          </Text>
        </View>
        <View style={styles.chatHeaderAvatar}>
          <Text style={styles.avatar}>{selectedConnection.user.avatar}</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted
      />

      {/* Message Input */}
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          placeholderTextColor="#7F8C8D"
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  connectionsList: {
    flex: 1,
  },
  connectionItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  selectedConnection: {
    backgroundColor: '#FFF5F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    fontSize: 40,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  connectionInfo: {
    flex: 1,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  messageTime: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  lastMessage: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  connectionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  country: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  interests: {
    fontSize: 12,
    color: '#4ECDC4',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FF6B35',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  chatHeaderAvatar: {
    marginLeft: 15,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 2,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B35',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#2C3E50',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
});
