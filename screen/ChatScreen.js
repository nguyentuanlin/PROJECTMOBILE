import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const initialMessages = [
  { id: '1', text: 'Xin chào anh/chị! 😊 Em có thể giúp gì cho anh/chị ạ?', sender: 'employee' },
];

const autoReplies = [
  { text: "Cà phê của chúng em được tuyển chọn từ những hạt cà phê thượng hạng, đảm bảo hương vị đặc trưng khó quên. ☕️" },
  { text: "Quán hiện có nhiều loại cà phê đặc biệt như Arabica, Robusta, và Cold Brew. Anh/chị muốn thử loại nào ạ?" },
  { text: "Em khuyên anh/chị thử Cold Brew, một trong những món được yêu thích nhất tại quán đó ạ! ❄️" },
  { text: "Nếu anh/chị muốn tìm kiếm cà phê không chứa caffeine, quán em cũng có các lựa chọn phù hợp." },
  { text: "Em có thể tư vấn thêm về cách thưởng thức cà phê tại nhà nếu anh/chị quan tâm ạ." },
];

const imageReplies = {
  americano: {
    image: require('../assets/amiricano2.jpeg'), // Đảm bảo đường dẫn hình ảnh đúng
    caption: 'Americano - Hương vị đậm đà từ những hạt cà phê nguyên chất!'
  },
};

const thankYouReply = {
  text: "Cảm ơn anh/chị đã quan tâm! Chúc quý khách có một trải nghiệm tuyệt vời với cà phê của chúng em. ☕️😊",
};

const ChatScreen = ({ route }) => {
  const { barista } = route.params;
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Kiểm tra nội dung tin nhắn để quyết định trả lời
      setTimeout(() => handleAutoReply(inputText.toLowerCase()), 1000);
    }
  };

  const handleAutoReply = (userMessage) => {
    // Kiểm tra nếu tin nhắn là câu kết thúc
    if (userMessage.includes('ok tôi hiểu rồi') || userMessage.includes('hiểu rồi') || userMessage.includes('cảm ơn')) {
      const thankYouMessage = { id: Date.now().toString(), text: thankYouReply.text, sender: 'employee' };
      setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
    } else if (imageReplies[userMessage]) {
      // Trả lời bằng hình ảnh nếu có
      const { image, caption } = imageReplies[userMessage];
      const autoReplyMessage = { id: Date.now().toString(), image, caption, sender: 'employee' };
      setMessages((prevMessages) => [...prevMessages, autoReplyMessage]);
    } else {
      // Trả lời ngẫu nhiên
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const autoReplyMessage = { id: Date.now().toString(), text: randomReply.text, sender: 'employee' };
      setMessages((prevMessages) => [...prevMessages, autoReplyMessage]);
    }
  };

  const renderMessage = ({ item }) => {
    const isEmployee = item.sender === 'employee';
    return (
      <View style={[styles.messageContainer, isEmployee ? styles.employeeMessage : styles.userMessage]}>
        {item.image ? (
          <>
            <Image source={item.image} style={styles.messageImage} />
            <Text style={styles.messageCaption}>{item.caption}</Text>
          </>
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{barista.name}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nhập tin nhắn..."
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfc',
  },
  header: {
    backgroundColor: '#6c63ff',
    padding: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chatContent: {
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  employeeMessage: {
    backgroundColor: '#d4e6ff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  userMessage: {
    backgroundColor: '#a1e0b4',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  messageCaption: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatScreen;
