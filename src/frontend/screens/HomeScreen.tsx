import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  Alert, 
} from 'react-native';

import auth from '@react-native-firebase/auth'; 
import { Product, fetchProductsFromFirestore } from '../../backend/productService'; 

const { width } = Dimensions.get('window');

// --- 1. DỮ LIỆU GIẢ ĐỊNH ---

// Dữ liệu giả định cho sản phẩm (sử dụng kiểu Product đã import)
const dummyProducts: Product[] = [
  { id: 'p1', name: 'Bình Gốm Lục Bình Hoa', price: 350000, imageUrl: 'https://picsum.photos/200/300?random=1', rating: 4.8, category: 'ceramics' },
  { id: 'p2', name: 'Thảm Dệt Sợi Mây Tre', price: 180000, imageUrl: 'https://picsum.photos/200/300?random=2', rating: 4.5, category: 'weaving' },
  { id: 'p3', name: 'Tranh Sơn Dầu Phong Cảnh', price: 720000, imageUrl: 'https://picsum.photos/200/300?random=3', rating: 5.0, category: 'painting' },
  { id: 'p4', name: 'Vòng Tay Đá Thạch Anh Xanh', price: 250000, imageUrl: 'https://picsum.photos/200/300?random=4', rating: 4.2, category: 'jewelry' },
  { id: 'p5', name: 'Bát Sứ Tráng Men Mộc', price: 120000, imageUrl: 'https://picsum.photos/200/300?random=5', rating: 4.9, category: 'ceramics' },
  { id: 'p6', name: 'Khăn Choàng Len Đan Tay', price: 320000, imageUrl: 'https://picsum.photos/200/300?random=6', rating: 4.7, category: 'weaving' },
];

// Dữ liệu giả định cho thanh danh mục
const categories = [
  { id: 'all', name: 'Tất cả', icon: '🔥' },
  { id: 'ceramics', name: 'Gốm sứ', icon: '💡' },
  { id: 'weaving', name: 'Đan lát', icon: '🧺' },
  { id: 'painting', name: 'Tranh vẽ', icon: '🖼️' },
  { id: 'jewelry', name: 'Trang sức', icon: '💎' },
];

// --- 2. CÁC COMPONENT PHỤ TRỢ ---

const CategoryCard: React.FC<{
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  onPressCategory: (id: string) => void;
}> = ({ id, name, icon, isActive, onPressCategory }) => (
  <TouchableOpacity
    style={[styles.categoryCard, isActive && styles.categoryCardActive]}
    onPress={() => onPressCategory(id)}
  >
    <Text style={styles.categoryIcon}>{icon}</Text>
    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{name}</Text>
  </TouchableOpacity>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <TouchableOpacity style={styles.productCard}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>
          {product.price.toLocaleString('vi-VN')} đ
        </Text>
        <View style={styles.productRating}>
          <Text style={{ color: '#FFD700', marginRight: 4 }}>⭐</Text>
          <Text style={styles.productRatingText}>{product.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- 3. MAIN COMPONENT (HOMESCREEN) ---

const HomeScreen: React.FC = () => {
  // ✅ 1. KHAI BÁO TẤT CẢ HOOKS LÊN ĐẦU
  const [userName, setUserName] = useState('Khách'); 
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 💡 HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  // Hàm mô phỏng việc lấy dữ liệu
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await fetchProductsFromFirestore(activeCategory);
      setProducts(fetchedProducts);
    } catch (e) {
      console.error("Lỗi tải sản phẩm từ Firebase:", e);
      const fallbackProducts = activeCategory === 'all'
        ? dummyProducts
        : dummyProducts.filter(p => p.category === activeCategory);
      setProducts(fallbackProducts); 
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, setIsLoading, setProducts]); 

  // ✅ useEffect
  useEffect(() => {
    loadProducts(); 
    const user = auth().currentUser;
    if (user) {
        setUserName(user.displayName || user.email || 'Người dùng');
    }
  }, [activeCategory, loadProducts]); 
  
  // Phần hiển thị khi không có sản phẩm
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image 
        source={require('../../assets/logo_1.png')} 
        style={styles.emptyStateImage} 
      />
      <Text style={styles.emptyStateTitle}>Không có sản phẩm trong danh mục này</Text>
      <Text style={styles.emptyStateSubtitle}>
        Hãy thử tìm kiếm danh mục khác hoặc quay lại sau!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header (Phần màu cam) */}
      <View style={styles.headerContainer}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.greetingText}>Xin chào,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>

          {/* ✅ NÚT ĐĂNG XUẤT Ở GÓC TRÊN BÊN PHẢI */}
          <View style={styles.headerIcons}>
            {/* 1. Nút Thông báo */}
            <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Thông báo')}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            {/* 2. Nút Giỏ hàng */}
            <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Giỏ hàng')}>
              <Text style={styles.iconText}>🛒</Text>
            </TouchableOpacity>
            {/* 3. NÚT ĐĂNG XUẤT */}
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Text style={styles.iconText}>🚪</Text> 
            </TouchableOpacity>
          </View>
          
        </View>

        <Text style={styles.mainTitle}>Chào mừng đến với thế giới thủ công</Text>
        <Text style={styles.subTitle}>Khám phá những tác phẩm nghệ thuật độc đáo</Text>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#C0C0C0"
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Text style={styles.searchIconText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Phần Nội dung có thể cuộn */}
      <ScrollView style={styles.contentScrollView}>
        
        {/* Thanh Danh mục */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContainer}
        >
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              name={cat.name}
              icon={cat.icon}
              isActive={cat.id === activeCategory}
              onPressCategory={setActiveCategory}
            />
          ))}
        </ScrollView>

        {/* Danh sách Sản phẩm */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Sản Phẩm {categories.find(c => c.id === activeCategory)?.name || 'Nổi Bật'}
          </Text>
        </View>

        {isLoading ? (
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productListContainer}
            scrollEnabled={false} 
          />
        ) : (
          renderEmptyState()
        )}

        <View style={{ height: 80 }} /> 
      </ScrollView>
      
      {/* Bottom Tab Bar (Đã khôi phục tab Cá nhân) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabTextActive}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>❤️</Text>
          <Text style={styles.tabText}>Yêu thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>🛒</Text>
          <Text style={styles.tabText}>Giỏ hàng</Text>
        </TouchableOpacity>
        {/* ✅ TAB CÁ NHÂN (Khôi phục) */}
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabText}>Cá nhân</Text> 
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

// --- 4. STYLESHEET (Giữ nguyên) ---
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: 'white',
    },
    headerContainer: {
      backgroundColor: '#FF6F00',
      padding: 20,
      paddingTop: 50,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingBottom: 80,
    },
    userInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 20,
    },
    avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FF8800',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
      borderWidth: 2,
      borderColor: 'white',
    },
    avatarText: {
      fontSize: 20,
    },
    greetingText: {
      color: 'white',
      fontSize: 14,
    },
    userName: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerIcons: {
      flexDirection: 'row',
      position: 'absolute',
      right: 0,
    },
    iconButton: {
      marginLeft: 15,
      padding: 5,
    },
    iconText: {
      fontSize: 22,
      color: 'white',
    },
    mainTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 10,
    },
    subTitle: {
      fontSize: 14,
      color: '#FFE0B2',
      marginBottom: 15,
    },
    searchBox: {
      position: 'absolute',
      bottom: -25,
      width: width - 40,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 15,
      paddingHorizontal: 15,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 8,
      height: 50,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    searchIcon: {
      padding: 5,
    },
    searchIconText: {
      fontSize: 18,
      color: '#FF6F00',
    },
    contentScrollView: {
      flex: 1,
      paddingTop: 40,
    },
    categoryScrollContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 10,
    },
    categoryCard: {
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryCardActive: {
      backgroundColor: '#FF6F00',
      borderColor: '#FF6F00',
    },
    categoryIcon: {
      fontSize: 18,
      marginRight: 5,
    },
    categoryText: {
      fontSize: 16,
      color: '#333',
      fontWeight: '500',
    },
    categoryTextActive: {
      color: 'white',
      fontWeight: 'bold',
    },
    sectionHeader: {
      paddingHorizontal: 20,
      marginTop: 10,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
    },
    emptyStateContainer: {
      alignItems: 'center',
      padding: 30,
      marginTop: 50,
    },
    emptyStateImage: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    emptyStateSubtitle: {
      fontSize: 16,
      color: '#777',
      textAlign: 'center',
      marginBottom: 30,
    },
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
    productListContainer: {
      paddingHorizontal: 10,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    productCard: {
      width: (width / 2) - 30,
      backgroundColor: 'white',
      borderRadius: 15,
      marginBottom: 20,
      marginHorizontal: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    productImage: {
      width: '100%',
      height: 150,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      resizeMode: 'cover',
    },
    productInfo: {
      padding: 10,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 5,
      minHeight: 40,
    },
    productPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FF6F00',
      marginBottom: 5,
    },
    productRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    productRatingText: {
      fontSize: 14,
      color: '#777',
      marginLeft: 0,
    },
    loadingText: {
      textAlign: 'center', 
      padding: 30, 
      fontSize: 16, 
      color: '#777'
    },
});

export default HomeScreen;