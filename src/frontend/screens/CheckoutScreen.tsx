import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  // Thêm LinearGradient nếu bạn muốn gradient thực sự
  // import LinearGradient from 'react-native-linear-gradient';
} from 'react-native';

const { width } = Dimensions.get('window');

// Để đảm bảo code chạy, tôi sẽ tạm dùng Text cho Icon mũi tên
const BackIcon = () => (
  <Text style={styles.backIcon}>{'<'}</Text>
);

const CheckoutScreen: React.FC = ({ navigation }: any) => {
  const [shippingName, setShippingName] = React.useState('Nguyễn Văn A');
  const [shippingPhone, setShippingPhone] = React.useState('0123 456 789');
  const [shippingAddress, setShippingAddress] = React.useState('Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố');
  const [deliveryNote, setDeliveryNote] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('cod'); // cod, bankTransfer, momo, zalopay

  const handleGoBack = () => {
    // Nếu có navigation: navigation.goBack();
    console.log('Quay lại Giỏ hàng');
  };

  const handlePlaceOrder = () => {
    console.log('Đã nhấn ĐẶT HÀNG NGAY');
    console.log('Thông tin giao hàng:', { shippingName, shippingPhone, shippingAddress, deliveryNote });
    console.log('Phương thức thanh toán:', paymentMethod);
    // Logic xử lý đặt hàng
  };

  // Dữ liệu đơn hàng giả định
  const orderSummary = {
    items: [
      { id: 1, name: 'Bảo Phạm', quantity: 1, price: 1000, icon: '🏺' },
    ],
    total: 1000,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header (Sử dụng View với gradient màu tím) */}
        {/* Nếu dùng LinearGradient, sẽ thay thế View này */}
        <View style={styles.header}> 
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Thanh Toán</Text>
            <Text style={styles.headerSubtitle}>Hoàn tất đơn hàng của bạn</Text>
          </View>
        </View>

        {/* Nội dung Form Thanh toán (có thể cuộn) */}
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Tóm Tắt Đơn Hàng */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📄</Text>
              <Text style={styles.cardTitle}>Tóm Tắt Đơn Hàng</Text>
            </View>
            {orderSummary.items.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.orderItemIcon}>{item.icon}</Text>
                <View style={styles.orderItemDetails}>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemQuantity}>Số lượng: {item.quantity}</Text>
                </View>
                <Text style={styles.orderItemPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
              </View>
            ))}
            <View style={styles.orderTotal}>
              <Text style={styles.orderTotalText}>Tổng cộng:</Text>
              <Text style={styles.orderTotalPrice}>{orderSummary.total.toLocaleString('vi-VN')} đ</Text>
            </View>
          </View>

          {/* Thông Tin Giao Hàng */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🚚</Text>
              <Text style={styles.cardTitle}>Thông Tin Giao Hàng</Text>
            </View>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nguyễn Văn A"
              value={shippingName}
              onChangeText={setShippingName}
            />
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="0123 456 789"
              keyboardType="phone-pad"
              value={shippingPhone}
              onChangeText={setShippingPhone}
            />
            <Text style={styles.label}>Địa chỉ giao hàng</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              multiline
              numberOfLines={3}
              value={shippingAddress}
              onChangeText={setShippingAddress}
            />
            <Text style={styles.label}>Ghi chú cho người giao hàng</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Ghi chú cho người giao hàng..."
              multiline
              numberOfLines={2}
              value={deliveryNote}
              onChangeText={setDeliveryNote}
            />
          </View>

          {/* Phương Thức Thanh Toán */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💳</Text>
              <Text style={styles.cardTitle}>Phương Thức Thanh Toán</Text>
            </View>
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected]} 
              onPress={() => setPaymentMethod('cod')}
            >
              <View style={styles.radio}>
                {paymentMethod === 'cod' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.paymentMethodIcon}>💵</Text>
              <View>
                <Text style={styles.paymentMethodTitle}>Thanh toán khi nhận hàng (COD)</Text>
                <Text style={styles.paymentMethodSubtitle}>Thanh toán bằng tiền mặt khi nhận hàng</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'bankTransfer' && styles.paymentOptionSelected]} 
              onPress={() => setPaymentMethod('bankTransfer')}
            >
              <View style={styles.radio}>
                {paymentMethod === 'bankTransfer' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.paymentMethodIcon}>🏦</Text>
              <View>
                <Text style={styles.paymentMethodTitle}>Chuyển khoản ngân hàng</Text>
                <Text style={styles.paymentMethodSubtitle}>Chuyển khoản qua ATM hoặc Internet Banking</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'momo' && styles.paymentOptionSelected]} 
              onPress={() => setPaymentMethod('momo')}
            >
              <View style={styles.radio}>
                {paymentMethod === 'momo' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.paymentMethodIcon}>📱</Text>
              <View>
                <Text style={styles.paymentMethodTitle}>Ví điện tử MoMo</Text>
                <Text style={styles.paymentMethodSubtitle}>Thanh toán qua ứng dụng MoMo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'zalopay' && styles.paymentOptionSelected]} 
              onPress={() => setPaymentMethod('zalopay')}
            >
              <View style={styles.radio}>
                {paymentMethod === 'zalopay' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.paymentMethodIcon}>💙</Text>
              <View>
                <Text style={styles.paymentMethodTitle}>ZaloPay</Text>
                <Text style={styles.paymentMethodSubtitle}>Thanh toán qua ứng dụng ZaloPay</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={{ height: 120 }} /> {/* Khoảng trống cho nút Đặt hàng và Tab Bar */}
        </ScrollView>

        {/* NÚT ĐẶT HÀNG NGAY (CỐ ĐỊNH) */}
        <TouchableOpacity 
          style={styles.fixedPlaceOrderButton} 
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderButtonText}>Đặt Hàng Ngay</Text>
        </TouchableOpacity>
        
        {/* Bottom Tab Bar */}
        <View style={styles.bottomTabBar}>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabIcon}>🏠</Text>
            <Text style={styles.tabText}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabIcon}>🛒</Text>
            <Text style={styles.tabTextActive}>Giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabIcon}>📦</Text>
            <Text style={styles.tabText}>Đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Màu nền cho SafeArea
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    // Thay thế bằng LinearGradient nếu muốn hiệu ứng gradient thực
    backgroundColor: '#6A1B9A', // Màu tím đậm (màu bắt đầu của gradient)
    // Các style cho gradient
    // start: { x: 0, y: 0 },
    // end: { x: 1, y: 0 },
    // colors: ['#6A1B9A', '#9C27B0'], // Từ tím đậm đến tím nhạt
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 150, // Chiều cao của header
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0BFEA', // Màu nhạt hơn cho subtitle
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20, // Khoảng trống cuối cùng trước nút cố định
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderItemIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#777',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DB4437', // Màu giá
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  orderTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTotalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A1B9A', // Màu tím cho tổng tiền
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 80,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  paymentOptionSelected: {
    borderColor: '#6A1B9A', // Viền tím khi được chọn
    backgroundColor: '#F3E5F5', // Nền tím nhạt khi được chọn
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6A1B9A', // Màu tím khi được chọn
  },
  paymentMethodIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentMethodSubtitle: {
    fontSize: 13,
    color: '#777',
  },
  // NÚT ĐẶT HÀNG NGAY (Cố định)
  fixedPlaceOrderButton: {
    backgroundColor: '#6A1B9A', // Màu tím
    width: '90%', 
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    bottom: 70, // Đặt ngay trên Bottom Tab Bar
    alignSelf: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10, 
  },
  placeOrderButtonText: {
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
    flex: 1,
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
    color: '#6A1B9A', // Màu tím cho tab active
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;