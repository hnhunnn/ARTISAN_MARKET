import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image, // Thêm Import Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Thêm Navigation
import { useCart } from '../context/CartContext'; // Thêm Context

const { width } = Dimensions.get('window'); // Sửa lỗi cú pháp dòng này

// Component Card Sản phẩm trong Giỏ hàng
const CartItemCard: React.FC<any> = ({ item }) => {
  // Lấy hàm xử lý từ Context
  const { addToCart, removeFromCart } = useCart();

  const handleQuantityChange = (delta: number) => {
    if (delta > 0) {
      addToCart(item); // Tăng số lượng
    } else {
      // Hiện tại context chưa có hàm giảm 1 đơn vị, bạn có thể bổ sung sau
      console.log('Chức năng giảm đang phát triển');
    }
  };

  const handleRemoveItem = () => {
    removeFromCart(item.id); // Gọi hàm xóa thật
  };

  const formattedPrice = item.price.toLocaleString('vi-VN');

  return (
    <View style={styles.itemCard}>
      {/* SỬA: Hiển thị ảnh thật thay vì icon text */}
      <Image source={item.image} style={styles.itemImage} />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {/* Nếu không có detail thì hiển thị tạm category hoặc ẩn đi */}
        <Text style={styles.itemDetail}>{item.category || 'Sản phẩm'}</Text>
        <Text style={styles.itemPrice}>{formattedPrice} đ</Text>
      </View>

      <View style={styles.itemActions}>
        {/* Nút Giảm số lượng */}
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(-1)}
          disabled={item.quantity <= 1}
        >
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>

        {/* Số lượng */}
        <Text style={styles.quantityDisplay}>{item.quantity}</Text>

        {/* Nút Tăng số lượng */}
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(1)}
        >
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>

        {/* Nút Xóa */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemoveItem}
        >
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Component Giỏ hàng chính
const CartScreen: React.FC = () => {
  // KẾT NỐI DATA THẬT
  const { cartItems, getTotalPrice } = useCart();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack(); // Quay lại trang trước
  };

  const handleCheckout = () => {
    console.log('Đã nhấn MUA NGAY');
    // Logic thanh toán
  };

  // Tính tổng tiền từ hàm có sẵn hoặc tính trực tiếp
  const totalAmount = getTotalPrice();
  const formattedTotal = totalAmount.toLocaleString('vi-VN');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Màu Cam Đậm */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ Hàng</Text>
        </View>

        {/* Nội dung Giỏ hàng */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {cartItems.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
              Giỏ hàng đang trống
            </Text>
          ) : (
            cartItems.map(item => <CartItemCard key={item.id} item={item} />)
          )}
          {/* Tổng kết tạm thời */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>Tổng tiền tạm tính:</Text>
            <Text style={styles.totalPriceText}>{formattedTotal} đ</Text>
          </View>
          <View style={{ height: 120 }} /> {/* Tạo khoảng trống cuối trang */}
        </ScrollView>

        {/* NÚT MUA NGAY (CỐ ĐỊNH) */}
        <TouchableOpacity
          style={styles.fixedCheckoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>MUA NGAY</Text>
        </TouchableOpacity>

        {/* Bottom Tab Bar */}
        <View style={styles.bottomTabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <Text style={styles.tabIcon}>🏠</Text>
            <Text style={styles.tabText}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabIcon}>🛒</Text>
            <Text style={styles.tabTextActive}>Giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF6F00',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    backgroundColor: '#DB4437',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    paddingRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  // SỬA: Style cho ảnh sản phẩm
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetail: {
    fontSize: 14,
    color: '#777',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DB4437', // Màu giá
    marginTop: 5,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  quantityDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#FFEBEE', // Màu nền nhẹ cho nút xóa
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DB4437',
  },
  summaryBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    color: '#333',
  },
  totalPriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DB4437',
  },
  // NÚT MUA NGAY (Cố định)
  fixedCheckoutButton: {
    backgroundColor: '#FF6F00', // Màu cam
    width: '90%',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Cố định vị trí
    bottom: 70, // Đặt ngay trên Bottom Tab Bar (60px height + 10px margin)
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Bottom Tab Bar Styles
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    padding: 5,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabText: {
    fontSize: 12,
    color: '#777',
  },
  tabTextActive: {
    fontSize: 12,
    color: '#FF6F00',
    fontWeight: 'bold',
  },
});

export default CartScreen;
