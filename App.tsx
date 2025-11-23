import React, { useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Các màn hình hiện tại của bạn
import LoginScreen from './src/frontend/screens/LoginScreen';
import RegisterScreen from './src/frontend/screens/RegisterScreen';
import HomeScreen from './src/frontend/screens/HomeScreen';
import ProductDetailScreen from './src/frontend/screens/ProductDetailScreen'; // Đã import
import WishlistScreen from './src/frontend/screens/WishlistScreen';
import { WishlistProvider } from './src/frontend/context/WishlistContext'; // <--- MỚI
// --- THÊM MỚI: Import Giỏ hàng ---
import CartScreen from './src/frontend/screens/CartScreen';
import { CartProvider } from './src/frontend/context/CartContext';
// --------------------------------

const Stack = createNativeStackNavigator();

// Stack cho các màn hình khi chưa đăng nhập (GIỮ NGUYÊN)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Stack cho các màn hình chính (ĐÃ SỬA: Thêm ProductDetail và ẩn Header mặc định)
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Màn hình Trang chủ */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Màn hình Giỏ hàng */}
      <Stack.Screen name="Cart" component={CartScreen} />

      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      {/* THÊM MỚI: Màn hình Chi tiết sản phẩm */}
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Hàm theo dõi trạng thái đăng nhập (GIỮ NGUYÊN)
  function onAuthStateChanged(userState: FirebaseAuthTypes.User | null) {
    setUser(userState);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  // (ĐÃ SỬA: Bọc CartProvider ra ngoài cùng NavigationContainer)
  return (
    <CartProvider>
      <WishlistProvider>
        <NavigationContainer>
          {/* Logic kiểm tra user giữ nguyên */}
          {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;
