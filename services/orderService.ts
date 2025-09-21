import { collection, doc, setDoc, onSnapshot, query, where, getDoc, updateDoc, Unsubscribe, orderBy } from "firebase/firestore";
import { db } from './firebase';
import type { Order } from '../types';

const ordersCollectionRef = collection(db, "orders");

// Create an order with a specific ID
export const createOrder = async (order: Order): Promise<void> => {
    const orderRef = doc(db, "orders", order.id);
    await setDoc(orderRef, order);
};

// This function will be used by the webhook and admin panel
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
    const orderRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(orderRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as Order;
    }
    return null;
}

export const listenToUserOrders = (userEmail: string, callback: (orders: Order[]) => void): Unsubscribe => {
    const q = query(ordersCollectionRef, where("customerEmail", "==", userEmail), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orders = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        callback(orders);
    });
    return unsubscribe;
};

export const listenToAllOrders = (callback: (orders: Order[]) => void): Unsubscribe => {
    const q = query(ordersCollectionRef, orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orders = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        callback(orders);
    });
    return unsubscribe;
};
