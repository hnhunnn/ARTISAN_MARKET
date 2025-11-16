// src/backend/productService.ts

import { 
  collection, 
  getDocs, 
  query, 
  where, 
  DocumentData 
} from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import db từ file cấu hình

// Định nghĩa kiểu dữ liệu cho Sản phẩm
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  category: string;
}

/**
 * Lấy danh sách sản phẩm từ Firestore, có thể lọc theo danh mục.
 * @param categoryId ID của danh mục (ví dụ: 'ceramics'). Truyền 'all' để lấy tất cả.
 * @returns Mảng Product
 */
export const fetchProductsFromFirestore = async (categoryId: string): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, 'products'); // 'products' là tên collection trong Firestore
    let productsQuery: any = productsCollection;

    // Nếu categoryId KHÔNG phải là 'all', thêm điều kiện lọc
    if (categoryId && categoryId !== 'all') {
      productsQuery = query(productsCollection, where('category', '==', categoryId));
    }

    // Thực hiện truy vấn
    const productSnapshot = await getDocs(productsQuery);
    
    // Ánh xạ (map) dữ liệu từ snapshot sang mảng Product
    const productsList: Product[] = productSnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        name: data.name || 'Sản phẩm không tên',
        price: data.price || 0,
        imageUrl: data.imageUrl || '',
        rating: data.rating || 0,
        category: data.category || '',
      };
    });
    
    return productsList;

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm từ Firestore: ", error);
    // Trong trường hợp lỗi, trả về mảng rỗng hoặc xử lý lỗi tùy ý
    throw new Error("Không thể kết nối hoặc lấy dữ liệu sản phẩm.");
  }
};