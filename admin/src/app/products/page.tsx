"use client";

import { useState, useEffect } from "react";
import { Edit2, Copy, Trash2, X } from "lucide-react";
import { API_BASE, getAuthHeaders } from "@/lib/api";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { ProductRow, Product } from "@/components/ui/ProductRow";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState<"CREATE" | "EDIT">("CREATE");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: 0, stock: 0, category: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // NestJS expects multipart/form-data for image uploads via Cloudinary
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", String(formData.price));
    payload.append("stock", String(formData.stock));
    payload.append("category", formData.category);

    if (selectedFile) {
      payload.append("images", selectedFile);
    }

    try {
      const isCreate = formType === "CREATE";
      const res = await fetch(`${API_BASE}/products${isCreate ? "" : `/${currentId}`}`, {
        method: isCreate ? "POST" : "PATCH",
        headers: getAuthHeaders(),
        body: payload, // Browser automatically sets Content-Type to multipart/form-data with boundary
      });

      if (res.ok) {
        setModalOpen(false);
        fetchProducts();
      } else {
        console.error("Backend validation failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`${API_BASE}/products/${productToDelete}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchProducts();
      } else {
        const text = await res.text();
        alert(`Failed to delete: HTTP ${res.status} - ${text}`);
      }
    } catch (error: any) {
      alert(`Network error during deletion: ${error.message}`);
      console.error(error);
    } finally {
      setProductToDelete(null);
    }
  };

  const openCreateModal = () => {
    setFormType("CREATE");
    setFormData({ name: "", description: "", price: 0, stock: 0, category: "" });
    setSelectedFile(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setFormType("EDIT");
    setCurrentId(p.id);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
    });
    setSelectedFile(null);
    setModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      <AdminHeader breadcrumbs={["Archive", "Products"]} />

      <div className="p-12 space-y-12 max-w-7xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-2">PRODUCT INVENTORY</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold">CURATED ENGINEERING ARCHIVE</p>
          </div>
          <Button onClick={openCreateModal} size="lg">
            + ADD NEW PRODUCT
          </Button>
        </div>

        <div className="bg-white p-6 flex justify-between items-center outline outline-1 outline-neutral-100 shadow-sm">
          <input type="text" placeholder="SEARCH BY NAME..." className="text-[11px] font-bold uppercase tracking-widest text-black border-0 border-b border-neutral-200 focus:ring-0 focus:border-black w-96 px-0 py-2 placeholder:text-neutral-300" />
          <div className="flex gap-16">
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mb-1">CATEGORY</p>
              <select className="text-[11px] font-bold bg-transparent border-0 px-0 py-1 focus:ring-0">
                <option>All Archives</option>
                <option>Rackets</option>
                <option>Shoes</option>
              </select>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mb-1">STOCK STATUS</p>
              <select className="text-[11px] font-bold bg-transparent border-0 px-0 py-1 focus:ring-0">
                <option>Global Status</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white outline outline-1 outline-neutral-100">
          <div className="grid grid-cols-[80px_3fr_2fr_1fr_1fr_1fr_100px] gap-6 p-6 border-b border-neutral-100 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
            <span>IMG</span>
            <span>PRODUCT INFO</span>
            <span>CATEGORY</span>
            <span>PRICE</span>
            <span>STOCK</span>
            <span>STATUS</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs font-bold text-neutral-400 tracking-widest uppercase">Fetching Datacore...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-neutral-400 tracking-widest uppercase">Archive Empty</div>
          ) : products.map((item: any) => (
            <ProductRow key={item.id} item={item} onEdit={openEditModal} onDelete={requestDelete} />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white outline outline-1 outline-neutral-200 shadow-2xl p-8 w-[600px] relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-8 right-8 text-neutral-400 hover:text-black">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-8">{formType} PRODUCT</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <Input 
                required 
                label="Item Name" 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="E.g. ASTROX 100ZZ" 
              />
              <div className="grid grid-cols-2 gap-6">
                <Input 
                  required 
                  label="Price ($)" 
                  min="0" step="0.01" 
                  type="number" 
                  value={formData.price} 
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} 
                />
                <Input 
                  required 
                  label="Stock (Units)" 
                  type="number" min="0" 
                  value={formData.stock} 
                  onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Input 
                  required 
                  label="Category" 
                  type="text" 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })} 
                  placeholder="E.g. Rackets" 
                />
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2">Image Upload</label>
                  <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm p-2 border border-neutral-200 focus:outline-none focus:border-black font-medium text-neutral-500 file:mr-4 file:py-1 file:px-4 file:border-0 file:text-[9px] file:font-bold file:uppercase file:bg-neutral-100 file:text-black hover:file:bg-neutral-200 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2">Description</label>
                <textarea rows={3} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full text-sm p-3 border border-neutral-200 focus:outline-none focus:border-black font-medium outline-none" />
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>CANCEL</Button>
                <Button type="submit" isLoading={isSubmitting}>SAVE DATA</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!productToDelete}
        title="Delete Archive"
        description="This catastrophic deletion cannot be undone. Are you sure you want to proceed?"
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
