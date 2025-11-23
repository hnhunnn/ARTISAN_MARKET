import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  writeBatch,
  DocumentData,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
// --- HÀM MỚI: Tạo đơn hàng ---
export const createOrder = async (orderData: {
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  items: any[];
}) => {
  try {
    await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending', // Mặc định là Chờ xử lý
      date: serverTimestamp(), // Lấy giờ server
    });
    return true;
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    return false;
  }
};

// 1. THÊM TRƯỜNG description VÀO INTERFACE
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  category: string;
  quantity: number;
  description?: string; // <--- MỚI
}

export const fetchProductsFromFirestore = async (
  categoryId: string = 'all',
): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, 'products');
    let productsQuery: any = productsCollection;

    if (categoryId && categoryId !== 'all') {
      productsQuery = query(
        productsCollection,
        where('category', '==', categoryId),
      );
    }

    const productSnapshot = await getDocs(productsQuery);

    if (productSnapshot.empty) return [];

    const productsList: Product[] = productSnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        name: data.name || 'Sản phẩm không tên',
        price: data.price || 0,
        imageUrl: data.imageUrl || 'https://via.placeholder.com/150',
        rating: data.rating || 5.0,
        category: data.category || 'other',
        quantity: data.quantity !== undefined ? data.quantity : 100,
        // Lấy mô tả từ Firebase, nếu không có thì hiện câu mặc định
        description:
          data.description ||
          'Sản phẩm thủ công mỹ nghệ tinh xảo, chất lượng cao, mang đậm nét văn hóa truyền thống.',
      };
    });

    return productsList;
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    return [];
  }
};

export const getUserInfo = async (uid: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
  } catch (error) {
    console.error('Lỗi lấy user:', error);
  }
  return null;
};

// 2. CẬP NHẬT DỮ LIỆU MẪU VỚI MÔ TẢ CHI TIẾT
export const seedDatabase = async () => {
  try {
    const dummyData = [
      {
        name: 'Bình Gốm Lục Bình Hoa',
        price: 350000,
        imageUrl: 'https://picsum.photos/200/300?random=1',
        rating: 4.8,
        category: 'ceramics',
        quantity: 50,
        description:
          'Lục bình gốm sứ được nung ở nhiệt độ 1300 độ C, loại bỏ hoàn toàn tạp chất. Họa tiết hoa văn được vẽ tay tỉ mỉ bởi các nghệ nhân Bát Tràng, mang lại vẻ đẹp sang trọng cho không gian phòng khách.',
      },
      {
        name: 'Thảm Dệt Sợi Mây Tre',
        price: 180000,
        imageUrl: 'https://picsum.photos/200/300?random=2',
        rating: 4.5,
        category: 'weaving',
        quantity: 30,
        description:
          'Thảm được dệt từ 100% sợi mây tre tự nhiên đã qua xử lý chống mối mọt. Sản phẩm thân thiện với môi trường, tạo cảm giác mát mẻ, thoáng khí, rất phù hợp với khí hậu nhiệt đới.',
      },
      {
        name: 'Tranh Sơn Dầu Phong Cảnh',
        price: 720000,
        imageUrl: 'https://picsum.photos/200/300?random=3',
        rating: 5.0,
        category: 'painting',
        quantity: 10,
        description:
          'Bức tranh tái hiện khung cảnh làng quê Việt Nam yên bình với gam màu tươi sáng. Chất liệu sơn dầu cao cấp trên vải canvas bền màu theo thời gian.',
      },
      {
        name: 'Vòng Tay Đá Thạch Anh',
        price: 250000,
        imageUrl: 'https://picsum.photos/200/300?random=4',
        rating: 4.2,
        category: 'jewelry',
        quantity: 100,
        description:
          'Vòng tay đá thạch anh xanh tự nhiên, mang ý nghĩa phong thủy tốt lành, thu hút tài lộc và may mắn cho người đeo. Chuỗi hạt được xâu chắc chắn bằng dây thun lụa siêu bền.',
      },
      {
        name: 'Bát Sứ Tráng Men Mộc',
        price: 120000,
        imageUrl: 'https://picsum.photos/200/300?random=5',
        rating: 4.9,
        category: 'ceramics',
        quantity: 60,
        description:
          'Bộ bát đĩa tráng men mộc phong cách Nhật Bản. Lớp men lì chống trầy xước, chịu được nhiệt độ cao trong lò vi sóng và máy rửa bát.',
      },
      {
        name: 'Khăn Choàng Len Đan Tay',
        price: 320000,
        imageUrl: 'https://picsum.photos/200/300?random=6',
        rating: 4.7,
        category: 'weaving',
        quantity: 25,
        description:
          'Khăn len được đan tay thủ công từng mũi kim. Chất len lông cừu mềm mịn, không gây ngứa, giữ ấm cực tốt trong những ngày đông lạnh giá.',
      },
    ];

    const batch = writeBatch(db);
    dummyData.forEach(item => {
      const newDocRef = doc(collection(db, 'products'));
      batch.set(newDocRef, item);
    });

    await batch.commit();
    console.log('Đã nạp dữ liệu mẫu mới thành công!');
    return true;
  } catch (error) {
    console.error('Lỗi nạp dữ liệu:', error);
    return false;
  }
};

export const updateAllProductsQuantity = async (
  defaultQuantity: number = 50,
) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(docSnapshot => {
      const docRef = doc(db, 'products', docSnapshot.id);
      batch.update(docRef, { quantity: defaultQuantity });
    });
    await batch.commit();
    return true;
  } catch (error) {
    return false;
  }
};

export const addProductToFirestore = async (productData: any) => {
  try {
    await addDoc(collection(db, 'products'), {
      ...productData,
      rating: 5.0,
    });
    return true;
  } catch (error) {
    return false;
  }
};
