import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, writeBatch, query, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from './firebase';
import type { Product } from '../types';

const productsCollectionRef = collection(db, "products");

// Function to seed initial products from constants.ts into Firestore
export const seedProducts = async (initialProducts: Product[]) => {
    const productsSnapshot = await getDoc(doc(db, "products_meta", "seeded"));
    if (productsSnapshot.exists()) {
        console.log("Database already seeded.");
        return;
    }

    const batch = writeBatch(db);
    initialProducts.forEach((product) => {
        const productRef = doc(db, "products", String(product.id));
        batch.set(productRef, product);
    });
    
    // Add a meta document to track that seeding has been done
    batch.set(doc(db, "products_meta", "seeded"), { seeded: true, date: new Date() });

    await batch.commit();
    console.log("Database seeded successfully with initial products.");
};

// Function to fetch all products from Firestore
export const getProducts = async (): Promise<Product[]> => {
    const data = await getDocs(productsCollectionRef);
    return data.docs.map(doc => ({ ...doc.data(), id: parseInt(doc.id) } as Product)).sort((a, b) => a.id - b.id);
};

// Function to upload an image to Firebase Storage
const uploadImage = async (imageFile: File): Promise<string> => {
    const imageRef = ref(storage, `products/${imageFile.name}-${Date.now()}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

// Function to save (create or update) a product
export const saveProduct = async (product: Product, imageFile: File | null): Promise<void> => {
    let imageUrl = product.imageUrl;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    const productData = { ...product, imageUrl };
    
    if (product.id) {
        // Update existing product
        const productRef = doc(db, "products", String(product.id));
        await updateDoc(productRef, productData);
    } else {
        // Create new product - find the next available ID
        const allProducts = await getProducts();
        const maxId = allProducts.reduce((max, p) => p.id > max ? p.id : max, 0);
        const newId = maxId + 1;
        productData.id = newId;

        const productRef = doc(db, "products", String(newId));
        await setDoc(productRef, productData);
    }
};

// Function to update an existing product (e.g., for adding reviews)
export const updateProduct = async (product: Product): Promise<void> => {
    const productRef = doc(db, "products", String(product.id));
    await updateDoc(productRef, { ...product });
};

// Function to delete a product
export const deleteProduct = async (productId: number): Promise<void> => {
    const productRef = doc(db, "products", String(productId));
    await deleteDoc(productRef);
};