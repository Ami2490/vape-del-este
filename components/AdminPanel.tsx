import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveProduct, deleteProduct as removeProduct } from '../services/productService';
import type { Product, Order, User } from '../types';
import { 
    DashboardIcon, BoxIcon, ClipboardListIcon, UsersIcon, SettingsIcon, 
    BellIcon, LogoutIcon, PlusIcon, PencilIcon, TrashIcon, XIcon, ChartBarIcon, CameraIcon
} from './IconComponents';

interface AdminPanelProps {
  onLogout: () => void;
  products: Product[];
  refetchProducts: () => void;
}

type AdminView = 'dashboard' | 'products' | 'orders' | 'customers' | 'sales' | 'notifications' | 'settings';

const LOW_STOCK_THRESHOLD = 10;

// --- MOCK DATA ---
const mockOrders: Order[] = [
    // This data is now for illustrative purposes as real orders would be stored in Firebase.
];

const mockCustomers: (User & { totalSpent: number })[] = [
    { name: 'Carlos Vega', email: 'carlos.v@example.com', avatar: 'https://ui-avatars.com/api/?name=Carlos+V&background=8e44ad&color=FFFFFF', orders: [], totalSpent: 12500 },
    { name: 'Ana Garcia', email: 'ana.g@example.com', avatar: 'https://ui-avatars.com/api/?name=Ana+G&background=3498db&color=FFFFFF', orders: [], totalSpent: 8800 },
    { name: 'Martín Rojas', email: 'martin.r@example.com', avatar: 'https://ui-avatars.com/api/?name=Martin+R&background=2980b9&color=FFFFFF', orders: [], totalSpent: 21000 },
    { name: 'Lucía Fernández', email: 'lucia.f@example.com', avatar: 'https://ui-avatars.com/api/?name=Lucia+F&background=e74c3c&color=FFFFFF', orders: [], totalSpent: 5600 },
];

const initialNotifications = [
    { id: 1, type: 'order', message: 'Nuevo pedido #A87FF2 recibido de Ana Garcia.', time: 'hace 5 minutos', read: false },
    { id: 3, type: 'user', message: 'Nuevo usuario registrado: Lucía Fernández.', time: 'hace 3 horas', read: true },
    { id: 4, type: 'order', message: 'El pedido #C34B1A ha sido marcado como "Enviado".', time: 'ayer', read: true },
];
// --- FIN MOCK DATA ---

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-dark-secondary p-6 rounded-lg border border-gray-700 flex items-center gap-4">
        <div className="bg-gray-800 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const statusColors: { [key in Order['status']]: string } = {
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Shipped: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const ProductModal: React.FC<{ product: Product | null; onClose: () => void; onSave: (product: Product, imageFile: File | null) => void; }> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState<Product | null>(product ? { ...product } : { id: 0, name: '', category: '', price: '$U 0', stock: 0, imageUrl: '', description: '', features: [] });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
    const [isSaving, setIsSaving] = useState(false);

    if (!formData) return null;
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: name === 'stock' ? parseInt(value) || 0 : value } : null);
    };

    const handleSave = async () => {
        if (formData) {
            setIsSaving(true);
            await onSave(formData, imageFile);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
            <div className="bg-dark-primary rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{product?.id ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-gray-500 hover:text-white" /></button>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                         <label className="text-sm text-gray-400 block mb-1">Imagen del Producto</label>
                         <div className="w-40 h-40 bg-dark-secondary rounded border-2 border-dashed border-gray-600 flex items-center justify-center relative group">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded"/>
                            ) : (
                                <span className="text-xs text-gray-500">Subir imagen</span>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <CameraIcon className="w-8 h-8 text-white"/>
                            </div>
                         </div>
                    </div>
                    <div className="flex-1 space-y-3">
                         <div>
                            <label className="text-sm text-gray-400">Nombre del Producto</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark-secondary p-2 rounded mt-1 border border-gray-600 focus:ring-brand-purple focus:border-brand-purple" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm text-gray-400">Categoría</label>
                                <input name="category" value={formData.category} onChange={handleChange} className="w-full bg-dark-secondary p-2 rounded mt-1 border border-gray-600 focus:ring-brand-purple focus:border-brand-purple" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Precio</label>
                                <input name="price" value={formData.price} onChange={handleChange} className="w-full bg-dark-secondary p-2 rounded mt-1 border border-gray-600 focus:ring-brand-purple focus:border-brand-purple" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Stock</label>
                                <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="w-full bg-dark-secondary p-2 rounded mt-1 border border-gray-600 focus:ring-brand-purple focus:border-brand-purple" />
                            </div>
                        </div>
                    </div>
                </div>
                 <div>
                    <label className="text-sm text-gray-400">Descripción</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-dark-secondary p-2 rounded mt-1 border border-gray-600 focus:ring-brand-purple focus:border-brand-purple" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" disabled={isSaving}>Cancelar</button>
                    <button onClick={handleSave} className="bg-brand-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, products, refetchProducts }) => {
    const { user } = useAuth();
    const [view, setView] = useState<AdminView>('dashboard');
    
    const [orders, setOrders] = useState<Order[]>(() => {
        const userOrders = user?.orders || [];
        const combined = [...mockOrders, ...userOrders];
        return combined.filter((order, index, self) => index === self.findIndex(o => o.id === order.id));
    });

    const [customers, setCustomers] = useState<User[]>(user ? [user, ...mockCustomers] : mockCustomers);
    
    const [notifications, setNotifications] = useState(() => {
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
        const lowStockNotifications = lowStockProducts.map((p, i) => ({
            id: 100 + i,
            type: 'stock_low' as const,
            message: `El producto "${p.name}" tiene solo ${p.stock} unidades restantes.`,
            time: 'justo ahora',
            read: false,
        }));
        const outOfStockProducts = products.filter(p => p.stock === 0);
        const outOfStockNotifications = outOfStockProducts.map((p, i) => ({
             id: 200 + i,
            type: 'stock_out' as const,
            message: `El producto "${p.name}" se ha quedado sin stock.`,
            time: 'hace 1 hora',
            read: false,
        }));
        return [...lowStockNotifications, ...outOfStockNotifications, ...initialNotifications];
    });

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const stats = useMemo(() => {
        const validOrders = orders.filter(o => o.status !== 'Cancelled');
        const totalRevenue = validOrders.reduce((sum, order) => sum + order.total, 0);
        const outOfStock = products.filter(p => p.stock === 0).length;
        return {
            totalRevenue,
            totalOrders: orders.length,
            totalCustomers: customers.length,
            outOfStock,
        };
    }, [orders, products, customers]);

    const handleSaveProduct = async (updatedProduct: Product, imageFile: File | null) => {
        try {
            await saveProduct(updatedProduct, imageFile);
            refetchProducts(); // Refetch all products to get the latest state
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Error al guardar el producto.");
        } finally {
            setEditingProduct(null);
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await removeProduct(productId);
                refetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Error al eliminar el producto.");
            }
        }
    };

    const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const viewTitles: Record<AdminView, string> = {
        dashboard: 'Panel de Control',
        products: 'Productos',
        orders: 'Pedidos',
        customers: 'Clientes',
        sales: 'Ventas',
        notifications: 'Notificaciones',
        settings: 'Ajustes'
    };
    
    const renderView = () => {
        switch (view) {
            case 'dashboard':
                const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Ingresos Totales" value={`$U ${stats.totalRevenue.toLocaleString('es-UY')}`} icon={<DashboardIcon className="w-6 h-6 text-brand-blue-light" />} />
                            <StatCard title="Pedidos Totales" value={stats.totalOrders.toString()} icon={<ClipboardListIcon className="w-6 h-6 text-brand-purple" />} />
                            <StatCard title="Clientes Totales" value={stats.totalCustomers.toString()} icon={<UsersIcon className="w-6 h-6 text-green-400" />} />
                            <StatCard title="Productos sin Stock" value={stats.outOfStock.toString()} icon={<BoxIcon className="w-6 h-6 text-red-500" />} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                               <h3 className="text-xl font-bold text-white mb-4">Pedidos Recientes</h3>
                               <div className="bg-dark-primary rounded-lg border border-gray-700 overflow-hidden">
                                    <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-400 uppercase bg-dark-secondary">
                                            <tr>
                                                <th className="px-6 py-3">ID Pedido</th><th className="px-6 py-3">Cliente</th><th className="px-6 py-3">Total</th><th className="px-6 py-3">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 5).map(order => (
                                                <tr key={order.id} className="border-b border-gray-700 hover:bg-dark-secondary/50">
                                                    <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                                    <td className="px-6 py-4">{order.customerName}</td>
                                                    <td className="px-6 py-4">$U {order.total.toLocaleString('es-UY')}</td>
                                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[order.status]}`}>{order.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </div>
                               </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Alertas de Stock Bajo</h3>
                                <div className="bg-dark-primary rounded-lg border border-gray-700 p-4 space-y-3 max-h-96 overflow-y-auto">
                                    {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                                        <div key={p.id} className="flex justify-between items-center text-sm p-2 bg-dark-secondary rounded">
                                            <span className="truncate pr-2">{p.name}</span>
                                            <span className="font-bold text-yellow-400">{p.stock} unidades</span>
                                        </div>
                                    )) : <p className="text-sm text-gray-500 text-center py-4">No hay alertas de stock.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div className="bg-dark-primary p-6 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-white">Productos ({products.length})</h2>
                            <button onClick={() => setEditingProduct({} as Product)} className="bg-brand-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"><PlusIcon className="w-5 h-5"/>Añadir Producto</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-dark-secondary">
                                    <tr>
                                        <th className="px-6 py-3"></th>
                                        <th className="px-6 py-3">Nombre del Producto</th>
                                        <th className="px-6 py-3">Categoría</th>
                                        <th className="px-6 py-3">Precio</th>
                                        <th className="px-6 py-3">Stock</th>
                                        <th className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id} className="border-b border-gray-700 hover:bg-dark-secondary/50">
                                            <td className="px-6 py-4"><img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain rounded bg-white p-1" /></td>
                                            <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                            <td className="px-6 py-4">{product.category}</td>
                                            <td className="px-6 py-4">{product.price}</td>
                                            <td className={`px-6 py-4 font-bold ${product.stock > LOW_STOCK_THRESHOLD ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-500'}`}>{product.stock > 0 ? product.stock : 'Sin Stock'}</td>
                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <button onClick={() => setEditingProduct(product)} className="text-brand-blue-light hover:text-white"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'orders':
                 return (
                    <div className="bg-dark-primary p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold text-white mb-4">Pedidos ({orders.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-dark-secondary">
                                    <tr>
                                        <th className="px-6 py-3">ID Pedido</th><th className="px-6 py-3">Cliente</th><th className="px-6 py-3">Fecha</th><th className="px-6 py-3">Total</th><th className="px-6 py-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-700 hover:bg-dark-secondary/50">
                                            <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                            <td className="px-6 py-4">{order.customerName}<br/><span className="text-xs text-gray-400">{order.customerEmail}</span></td>
                                            <td className="px-6 py-4">{order.date}</td>
                                            <td className="px-6 py-4">$U {order.total.toLocaleString('es-UY')}</td>
                                            <td className="px-6 py-4">
                                                <select value={order.status} onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])} className={`w-full bg-dark-secondary p-2 rounded border ${statusColors[order.status].replace('bg-', 'border-').replace('/20', '')}`}>
                                                    <option value="Pending">Pendiente</option>
                                                    <option value="Shipped">Enviado</option>
                                                    <option value="Delivered">Entregado</option>
                                                    <option value="Cancelled">Cancelado</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'sales':
                const salesLast7Days = [{day:'Lun',s:1250},{day:'Mar',s:1800},{day:'Mié',s:1500},{day:'Jue',s:2100},{day:'Vie',s:3200},{day:'Sáb',s:4500},{day:'Dom',s:4100}];
                const topSellingProducts = useMemo(() => {
                    const productCounts: { [key: string]: { product: Product, count: number } } = {};
                    orders.forEach(order => {
                        if (order.status !== 'Cancelled') {
                            order.items.forEach(item => {
                                if (productCounts[item.product.name]) {
                                    productCounts[item.product.name].count += item.quantity;
                                } else {
                                    productCounts[item.product.name] = { product: item.product, count: item.quantity };
                                }
                            });
                        }
                    });
                    return Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 5);
                }, [orders]);
                const validOrders = orders.filter(o => o.status !== 'Cancelled');
                const ticketPromedio = validOrders.length > 0 ? stats.totalRevenue / validOrders.length : 0;
                
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Ventas Hoy" value="$U 8.600" icon={<ChartBarIcon className="w-6 h-6 text-brand-blue-light" />} />
                            <StatCard title="Ventas del Mes" value={`$U ${stats.totalRevenue.toLocaleString('es-UY')}`} icon={<ChartBarIcon className="w-6 h-6 text-brand-purple" />} />
                            <StatCard title="Ticket Promedio" value={`$U ${ticketPromedio.toFixed(0)}`} icon={<ChartBarIcon className="w-6 h-6 text-green-400" />} />
                        </div>
                         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-3 bg-dark-primary p-6 rounded-lg border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-4">Ventas Últimos 7 Días</h3>
                                <div className="flex justify-between items-end h-64 bg-dark-secondary p-4 rounded-md">
                                    {salesLast7Days.map(d => (
                                        <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                                            <div className="text-xs text-white bg-brand-purple/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity -mt-8">${d.s}</div>
                                            <div className="w-3/4 bg-brand-blue-light hover:bg-brand-blue-dark rounded-t-sm" style={{ height: `${(d.s / 5000) * 100}%` }}></div>
                                            <span className="text-xs text-gray-400">{d.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-2 bg-dark-primary p-6 rounded-lg border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-4">Productos Más Vendidos</h3>
                                <ul className="space-y-3">
                                    {topSellingProducts.map(({ product, count }) => (
                                        <li key={product.id} className="flex items-center gap-3 text-sm">
                                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain rounded bg-white p-1" />
                                            <span className="flex-1 truncate">{product.name}</span>
                                            <span className="font-bold text-white">{count} vendidos</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 'customers':
                return (
                    <div className="bg-dark-primary p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold text-white mb-4">Clientes ({customers.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-dark-secondary">
                                    <tr>
                                        <th className="px-6 py-3">Cliente</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Pedidos Totales</th>
                                        <th className="px-6 py-3">Gasto Total</th>
                                        <th className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, index) => (
                                        <tr key={index} className="border-b border-gray-700 hover:bg-dark-secondary/50">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full" />
                                                <span className="font-medium text-white">{customer.name}</span>
                                            </td>
                                            <td className="px-6 py-4">{customer.email}</td>
                                            <td className="px-6 py-4">{customer.orders?.length || 0}</td>
                                            <td className="px-6 py-4">$U {(customer as any).totalSpent?.toLocaleString('es-UY') || 0}</td>
                                            <td className="px-6 py-4"><button className="text-brand-blue-light hover:underline text-xs">Ver Perfil</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'notifications':
                 return (
                    <div className="bg-dark-primary p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold text-white mb-4">Notificaciones</h2>
                        <div className="space-y-4">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-4 rounded-lg flex items-start gap-4 border ${n.read ? 'bg-dark-secondary border-gray-700' : 'bg-brand-purple/20 border-brand-purple/40'}`}>
                                    <div className="mt-1">
                                        {n.type === 'order' && <ClipboardListIcon className="w-5 h-5 text-brand-blue-light"/>}
                                        {n.type === 'stock_low' && <BoxIcon className="w-5 h-5 text-yellow-400"/>}
                                        {n.type === 'stock_out' && <BoxIcon className="w-5 h-5 text-red-500"/>}
                                        {n.type === 'user' && <UsersIcon className="w-5 h-5 text-green-400"/>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white">{n.message}</p>
                                        <p className="text-xs text-gray-400">{n.time}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!n.read && <button className="text-xs text-gray-300 hover:underline">Marcar como leída</button>}
                                        <button className="text-xs text-red-500 hover:underline">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'settings':
                 return (
                    <div className="space-y-6">
                        <div className="bg-dark-primary p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Información de la Tienda</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Nombre de la Tienda</label>
                                    <input defaultValue="Vape del Este" className="w-full bg-dark-secondary p-2 rounded mt-1 border border-gray-600 focus:ring-brand-purple focus:border-brand-purple" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Email de Contacto</label>
                                    <input defaultValue="contacto@vapedeleste.com" className="w-full bg-dark-secondary p-2 rounded mt-1 border border-gray-600 focus:ring-brand-purple focus:border-brand-purple" />
                                </div>
                            </div>
                        </div>
                         <div className="bg-dark-primary p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Ajustes Generales</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white">Modo Mantenimiento</p>
                                    <p className="text-sm text-gray-400">Desactiva temporalmente la tienda para el público.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" value="" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    const NavItem: React.FC<{ viewName: AdminView; label: string; icon: React.ReactNode }> = ({ viewName, label, icon }) => (
         <button onClick={() => setView(viewName)} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${view === viewName ? 'bg-brand-purple/20 text-brand-purple' : 'text-gray-400 hover:bg-dark-secondary hover:text-white'}`}>
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

  return (
    <div className="min-h-screen bg-dark-secondary font-sans text-dark-text flex">
        {editingProduct !== null && <ProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSaveProduct} />}
        {/* Sidebar */}
        <aside className="w-64 bg-dark-primary p-4 border-r border-gray-800 flex flex-col fixed h-full">
            <div className="flex items-center gap-2 mb-8 px-2">
                <img src="https://firebasestorage.googleapis.com/v0/b/zona-clic-admin.firebasestorage.app/o/vape%20del%20este%2FWhatsApp_Image_2025-09-07_at_12.56.29_PM-removebg-preview.png?alt=media&token=ee1cd9e3-7bf7-448c-a418-3b3133ef1097" alt="Logo" className="h-10 w-auto" />
                <span className="text-lg font-bold text-white">Panel Admin</span>
            </div>
            <nav className="flex-1 space-y-2">
                <NavItem viewName="dashboard" label="Panel de Control" icon={<DashboardIcon className="w-6 h-6"/>} />
                <NavItem viewName="sales" label="Ventas" icon={<ChartBarIcon className="w-6 h-6"/>} />
                <NavItem viewName="orders" label="Pedidos" icon={<ClipboardListIcon className="w-6 h-6"/>} />
                <NavItem viewName="products" label="Productos" icon={<BoxIcon className="w-6 h-6"/>} />
                <NavItem viewName="customers" label="Clientes" icon={<UsersIcon className="w-6 h-6"/>} />
                <NavItem viewName="notifications" label="Notificaciones" icon={<BellIcon className="w-6 h-6"/>} />
                <NavItem viewName="settings" label="Ajustes" icon={<SettingsIcon className="w-6 h-6"/>} />
            </nav>
            <div className="mt-auto">
                 <button onClick={onLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-red-500/20 hover:text-red-400">
                    <LogoutIcon className="w-6 h-6"/>
                    <span className="font-semibold">Cerrar Sesión</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
             <header className="bg-dark-primary/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-800">
                <div className="px-8 h-20 flex items-center justify-between">
                     <h1 className="text-2xl font-bold text-white capitalize">{viewTitles[view]}</h1>
                     <div className="flex items-center gap-4">
                        <span className="text-gray-300 hidden sm:inline">¡Bienvenido, Admin!</span>
                        <img src={user?.avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-brand-purple" />
                     </div>
                </div>
             </header>
             <div className="p-8">
                {renderView()}
             </div>
        </main>
    </div>
  );
};