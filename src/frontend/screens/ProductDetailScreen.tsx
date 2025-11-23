import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // <--- Import Wishlist
import { Product } from '../../backend/productService';

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Lấy các hàm từ Context
  const { addToCart, cartItems } = useCart(); // Lấy cartItems để đếm số lượng
  const { toggleWishlist, isInWishlist } = useWishlist(); // Lấy hàm xử lý tim

  const { product } = route.params as { product: Product };
  const [quantity, setQuantity] = useState(1);

  // Kiểm tra xem sản phẩm này đã like chưa
  const isLiked = isInWishlist(product.id);

  // Tính tổng số lượng sản phẩm trong giỏ để hiện lên Badge
  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handleAddToCart = () => {
    const currentStock = product.quantity ?? 0;
    if (currentStock === 0) {
      Alert.alert('Thông báo', 'Sản phẩm này đã hết hàng!');
      return;
    }
    if (quantity > currentStock) {
      Alert.alert('Thông báo', `Chỉ còn ${currentStock} sản phẩm trong kho.`);
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    const currentStock = product.quantity ?? 0;
    if (quantity > currentStock || currentStock === 0) {
      Alert.alert('Thông báo', 'Sản phẩm không đủ số lượng.');
      return;
    }
    addToCart(product);
    (navigation as any).navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- HEADER ẢNH --- */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
          />

          {/* Nút Back (Góc trái) */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerIconText}>{'<'}</Text>
          </TouchableOpacity>

          {/* Nút Giỏ hàng (Góc phải) - MỚI */}
          <TouchableOpacity
            style={styles.cartButtonHeader}
            onPress={() => (navigation as any).navigate('Cart')}
          >
            <Text style={{ fontSize: 20 }}>🛒</Text>
            {/* Badge số lượng */}
            {totalCartItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* --- THÔNG TIN CHI TIẾT --- */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.categoryTag}>
              {product.category || 'Thủ công'}
            </Text>

            {/* KHU VỰC RATE & TRÁI TIM */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Đánh giá sao */}
              <View style={styles.ratingBox}>
                <Text style={{ color: '#FFD700' }}>⭐</Text>
                <Text style={styles.ratingText}>{product.rating || 5.0}</Text>
              </View>

              {/* Nút Trái Tim Yêu Thích - MỚI */}
              <TouchableOpacity
                style={styles.heartBox}
                onPress={() => toggleWishlist(product)}
              >
                {/* Nếu isLiked = true thì màu đỏ, ngược lại màu xám/trắng */}
                <Text style={{ fontSize: 18, color: isLiked ? 'red' : '#ccc' }}>
                  {isLiked ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.productPrice}>
              {product.price.toLocaleString('vi-VN')} đ
            </Text>
            <Text style={styles.stockText}>Kho: {product.quantity ?? 0}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>
            {product.description || 'Đang cập nhật...'}
          </Text>

          {/* Chọn số lượng */}
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Số lượng mua</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qButton}
                onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <Text style={styles.qText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qButton}
                onPress={() => setQuantity(prev => prev + 1)}
              >
                <Text style={styles.qText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartBtnText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyBtnText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  imageContainer: { width: '100%', height: 350, backgroundColor: '#f0f0f0' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Nút Back
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2,
  },

  // Nút Cart trên Header
  cartButtonHeader: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  detailsContainer: {
    flex: 1,
    marginTop: -30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTag: {
    color: '#FF6F00',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12,
  },

  // Box đánh giá
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: { marginLeft: 5, fontWeight: 'bold', color: '#333' },

  // Box trái tim
  heartBox: {
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: { fontSize: 26, fontWeight: 'bold', color: '#DB4437' },
  stockText: { fontSize: 14, color: '#777', fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },

  quantityContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  qButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  qValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 30,
  },
  cartBtn: {
    flex: 1,
    backgroundColor: '#FFE0B2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginRight: 10,
  },
  cartBtnText: { color: '#FF6F00', fontWeight: 'bold', fontSize: 16 },
  buyBtn: {
    flex: 1,
    backgroundColor: '#FF6F00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default ProductDetailScreen;
