import { collection, doc, setDoc, onSnapshot, Unsubscribe, query, where, orderBy } from "firebase/firestore";
import { db } from './firebase';
import type { Order } from '../types';

const ordersCollectionRef = collection(db, "orders");

// Create a new order in Firestore
export const createOrderInFirestore = async (order: Order): Promise<void> => {
    const orderRef = doc(db, "orders", order.id);
    await setDoc(orderRef, order);
};

// Update an order's status
export const updateOrderStatusInFirestore = async (orderId: string, status: Order['status']): Promise<void> => {
    const orderRef = doc(db, "orders", orderId);
    await setDoc(orderRef, { status: status }, { merge: true });
};

// Get all orders for the admin panel with a real-time listener
export const listenToAllOrders = (callback: (orders: Order[]) => void): Unsubscribe => {
    const q = query(ordersCollectionRef, orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orders = querySnapshot.docs.map(doc => doc.data() as Order);
        callback(orders);
    });
    return unsubscribe;
};

// Get orders for a specific user with a real-time listener
export const listenToUserOrders = (userEmail: string, callback: (orders: Order[]) => void): Unsubscribe => {
    const q = query(ordersCollectionRef, where("customerEmail", "==", userEmail), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orders = querySnapshot.docs.map(doc => doc.data() as Order);
        callback(orders);
    });
    return unsubscribe;
};