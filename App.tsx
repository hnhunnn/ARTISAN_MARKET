import React, { useState, useEffect } from 'react';
// THÊM: import 'FirebaseAuthTypes'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import LoginScreen from './src/frontend/screens/LoginScreen';
import RegisterScreen from './src/frontend/screens/RegisterScreen';
import HomeScreen from './src/frontend/screens/HomeScreen';
// Import các màn hình khác của bạn (CartScreen, AddProductScreen...)

const Stack = createNativeStackNavigator();

// Stack cho các màn hình khi chưa đăng nhập
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Stack cho các màn hình chính của ứng dụng (khi đã đăng nhập)
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Thêm các màn hình khác ở đây */}
      {/* <Stack.Screen name="AddProduct" component={AddProductScreen} /> */}
      {/* <Stack.Screen name="Cart" component={CartScreen} /> */}
    </Stack.Navigator>
  );
}

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null); // Dòng này đã đúng

  // Hàm theo dõi trạng thái đăng nhập
  // THAY ĐỔI: Thêm kiểu cho 'userState'
  function onAuthStateChanged(userState: FirebaseAuthTypes.User | null) {
    setUser(userState); // userState sẽ là (null) nếu đăng xuất, hoặc là (object) nếu đăng nhập
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    // Đăng ký listener khi component mount
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // Hủy đăng ký khi component unmount
    return subscriber;
  }, []);

  // Hiển thị màn hình loading trong khi chờ Firebase kiểm tra
  if (initializing) {
    return null; // Hoặc hiển thị một màn hình Loading...
  }

  return (
    <NavigationContainer>
      {/* Nếu có user (đã đăng nhập) thì hiển thị AppStack, ngược lại hiển thị AuthStack */}
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;