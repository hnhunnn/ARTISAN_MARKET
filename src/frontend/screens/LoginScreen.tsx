import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image, // Đã sử dụng component Image
} from 'react-native';

const LoginScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Phần Header Màu Cam */}
        <View style={styles.header}>
          {/* Đã cập nhật để dùng Image component */}
          <Image
            source={require('../../assets/logo_1.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>Artisan Market</Text>
          <Text style={styles.tagline}>Khám phá nghệ thuật thủ công</Text>
        </View>

        {/* Phần Form Đăng Nhập */}
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Đăng Nhập</Text>

          {/* Input Email */}
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Input Mật Khẩu */}
          <Text style={styles.inputLabel}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
          />

          {/* Nút Đăng Nhập */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => console.log('Đăng nhập')}
          >
            <Text style={styles.loginButtonText}>Đăng Nhập</Text>
          </TouchableOpacity>

          {/* Link Đăng Ký */}
          <TouchableOpacity onPress={() => console.log('Đăng ký')}>
            <Text style={styles.registerText}>
              <Text style={styles.boldText}>Chưa có tài khoản?</Text> Đăng ký
              ngay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tiếp tục với tư cách khách */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => console.log('Tiếp tục với tư cách khách')}
        >
          <Text style={styles.guestButtonText}>Tiếp tục với tư cách khách</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF6F00', // Màu nền cam chính
  },
  container: {
    flex: 1,
    backgroundColor: '#FF6F00', // Màu nền cam chính
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  // Đã thêm style cho logo thật
  logo: {
    width: 90, // Kích thước logo
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
    // Thêm borderRadius: 45 nếu bạn muốn logo hình tròn
  },

  // *** Đã xóa logoPlaceholder và logoText cũ ***

  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: 'white',
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 8,
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
    width: '90%',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#FF6F00',
    width: '90%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 15,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  guestButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  guestButtonText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
