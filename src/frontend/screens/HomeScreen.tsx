import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', name: 'Tất cả', icon: '🔥' },
  { id: 'ceramics', name: 'Gốm sứ', icon: '💡' },
  { id: 'weaving', name: 'Đan lát', icon: '🧺' },
  { id: 'painting', name: 'Tranh vẽ', icon: '🖼️' },
  { id: 'jewelry', name: 'Trang sức', icon: '💎' },
];

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
    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
      {name}
    </Text>
  </TouchableOpacity>
);

const ProductCard: React.FC<{ product: any }> = ({ product }) => (
  <View style={styles.productCard}>
    <Image
      source={{
        uri:
          product.imageUrl ||
          'https://placehold.co/600x400/FF6F00/white?text=Artisan',
      }}
      style={styles.productImage}
    />
    <Text style={styles.productName}>{product.name || 'Tên sản phẩm'}</Text>
    <Text style={styles.productPrice}>
      {(product.price || 0).toLocaleString('vi-VN')} VNĐ
    </Text>
  </View>
);

const HomeScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const [userName, setUserName] = useState('Khách');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        },
      },
    ]);
  };

  useEffect(() => {
    const currentUser = auth().currentUser;

    let userSubscriber: (() => void) | undefined;
    if (currentUser !== null) {
      userSubscriber = firestore()
        .collection('users')
        .doc(currentUser.uid)
        .onSnapshot(
          (documentSnapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
            if (documentSnapshot.exists) {
              setUserName(
                (documentSnapshot.data() as { hoTen: string })?.hoTen ||
                  'Khách',
              );
            } else {
              setUserName(currentUser.displayName || 'Khách');
            }
          },
        );
    } else {
      setUserName('Khách');
    }

    const productSubscriber = firestore()
      .collection('products')
      .onSnapshot(
        (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
          const productsArray: any[] = [];
          querySnapshot.forEach(documentSnapshot => {
            productsArray.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });

          setProducts(productsArray);
          if (loading) setLoading(false);
        },
        error => {
          console.error('Lỗi khi lấy sản phẩm: ', error);
          setLoading(false);
        },
      );

    return () => {
      if (userSubscriber) userSubscriber();
      if (productSubscriber) productSubscriber();
    };
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require('../../assets/logo_1.png')}
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>Chưa có sản phẩm</Text>
      <Text style={styles.emptyStateSubtitle}>
        Hãy trở thành người đầu tiên thêm sản phẩm!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.userInfoRow}>
          <TouchableOpacity style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.greetingText}>Xin chào,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => console.log('Thông báo')}
            >
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Text style={styles.iconText}>📜</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.mainTitle}>
          Chào mừng đến với thế giới thủ công
        </Text>
        <Text style={styles.subTitle}>
          Khám phá những tác phẩm nghệ thuật độc đáo
        </Text>

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

      <ScrollView style={styles.contentScrollView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContainer}
        >
          {categories.map(cat => (
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bộ Sưu Tập Đặc Biệt</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF6F00"
            style={{ marginTop: 50 }}
          />
        ) : products.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.productListContainer}>
            {products.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabTextActive}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>🛒</Text>
          <Text style={styles.tabText}>Giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
  emptyStateIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateIconText: {
    fontSize: 40,
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
  addProductButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addProductButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    color: '#FF6F00',
    marginHorizontal: 10,
    marginBottom: 10,
    fontWeight: '500',
  },
});

export default HomeScreen;
