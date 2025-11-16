import firebase from '@react-native-firebase/app';
import React, { useEffect } from 'react'; // 1. Import thêm useEffect
import LoginScreen from './frontend/screens/LoginScreen'; // 2. Đường dẫn đúng từ lần trước

// console.log(firebase.app().name); // <-- XÓA DÒNG NÀY Ở ĐÂY

const App = () => {
  // 3. Đặt logic của bạn vào trong useEffect
  useEffect(() => {
    // Code này sẽ chạy một cách an toàn SAU KHI app đã khởi động
    // và Firebase đã được khởi tạo
    console.log(firebase.app().name); // Sẽ in ra "[DEFAULT]"
  }, []); // Dấu ngoặc vuông [] đảm bảo nó chỉ chạy 1 lần

  return <LoginScreen />;
};

export default App;
