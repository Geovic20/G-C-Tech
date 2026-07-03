import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ChevronLeft, Smartphone, Laptop, Tablet, Headphones, Watch, Package } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { fetchBrands, fetchCategories, Brand, Category } from '@/src/lib/catalog';
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  slugify,
  AdminProduct,
  ProductInput,
} from '@/src/lib/admin';

// Category-specific technical spec fields (keys are stored as-is in `specs`).
const SPEC_FIELDS: Record<string, string[]> = {
  smartphones: ['Chip', 'Display', 'Camera', 'Battery', 'RAM', 'Storage'],
  computers: ['Chip', 'RAM', 'Storage', 'Display', 'GPU'],
  tablets: ['Chip', 'Display', 'Storage', 'Battery'],
  headphones: ['Connectivity', 'Battery Life', 'Noise Canceling', 'Driver Size'],
  earphones: ['Connectivity', 'Battery Life', 'Noise Canceling'],
  smartwatches: ['Display', 'Battery', 'Water Resistant', 'GPS', 'Connectivity'],
};

const CATEGORY_ICONS: Record<string, any> = {
  smartphones: Smartphone,
  computers: Laptop,
  tablets: Tablet,
  headphones: Headphones,
  earphones: Headphones,
  smartwatches: Watch,
};

const EMPTY: ProductInput = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  rating: 0,
  reviews: 0,
  image: '',
  brand_id: null,
  category_id: '',
  type: '',
  in_stock: true,
  colors: [],
  specs: {},
};

export default function AdminProducts() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<'category' | 'form'>('category');
  const [formCategory, setFormCategory] = useState<Category | null>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError('');
    try {
      const [p, b, c] = await Promise.all([adminListProducts(), fetchBrands(), fetchCategories()]);
      setProducts(p);
      setBrands(b);
      setCategories(c);
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create: start on the category-picker step.
  const openCreate = () => {
    setEditing(null);
    setFormCategory(null);
    setForm(EMPTY);
    setStep('category');
    setShowForm(true);
  };

  const pickCategory = (cat: Category) => {
    setFormCategory(cat);
    setForm({ ...EMPTY, category_id: cat.id });
    setStep('form');
  };

  // Edit: category already known → go straight to the form.
  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setFormCategory(categories.find((c) => c.id === p.category_id) ?? null);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description ?? '',
      price: p.price,
      rating: p.rating,
      reviews: p.reviews,
      image: p.image ?? '',
      brand_id: p.brand_id,
      category_id: p.category_id,
      type: p.type ?? '',
      in_stock: p.in_stock,
      colors: p.colors ?? [],
      specs: p.specs ?? {},
    });
    setStep('form');
    setShowForm(true);
  };

  const setName = (name: string) => {
    setForm((f) => ({ ...f, name, slug: editing ? f.slug : slugify(name) }));
  };

  const setSpec = (key: string, value: string) => {
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.category_id) {
      setError(fr ? 'Choisissez une catégorie.' : 'Pick a category.');
      return;
    }
    setSaving(true);
    // Drop empty spec values so we don't store blanks.
    const cleanSpecs = Object.fromEntries(
      Object.entries(form.specs).filter(([, v]) => v && String(v).trim() !== '')
    );
    const payload: ProductInput = { ...form, slug: form.slug || slugify(form.name), specs: cleanSpecs };
    const result = editing
      ? await adminUpdateProduct(editing.id, payload)
      : await adminCreateProduct(payload);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setShowForm(false);
    await load();
  };

  const handleDelete = async (p: AdminProduct) => {
    if (!window.confirm(fr ? `Supprimer « ${p.name} » ?` : `Delete "${p.name}"?`)) return;
    const result = await adminDeleteProduct(p.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    await load();
  };

  const specKeys = formCategory ? SPEC_FIELDS[formCategory.slug] ?? [] : [];

  return (
    <AdminLayout title={fr ? 'Produits' : 'Products'}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">
          {loading ? '…' : `${products.length} ${fr ? 'produits' : 'products'}`}
        </p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#007bff] text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> {fr ? 'Nouveau produit' : 'New product'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">{error}</div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left font-bold px-5 py-3">{fr ? 'Produit' : 'Product'}</th>
                <th className="text-left font-bold px-5 py-3 hidden md:table-cell">{fr ? 'Marque' : 'Brand'}</th>
                <th className="text-left font-bold px-5 py-3 hidden md:table-cell">{fr ? 'Catégorie' : 'Category'}</th>
                <th className="text-right font-bold px-5 py-3">{fr ? 'Prix' : 'Price'}</th>
                <th className="text-center font-bold px-5 py-3 hidden sm:table-cell">{fr ? 'Stock' : 'Stock'}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {p.image && <img src={p.image} alt="" className="w-full h-full object-contain" />}
                      </div>
                      <span className="font-bold text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{p.brands?.name ?? '—'}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell capitalize">{p.categories?.slug ?? '—'}</td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${p.in_stock ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-[#007bff] hover:bg-blue-50 rounded-xl transition-all">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    {fr ? 'Aucun produit.' : 'No products.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8">
            {/* Step 1: choose category */}
            {step === 'category' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900">{fr ? 'Type de produit' : 'Product type'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  {fr ? 'Choisissez la catégorie du produit à ajouter :' : 'Choose the category of the product to add:'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] ?? Package;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => pickCategory(cat)}
                        className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-gray-100 hover:border-[#007bff] hover:bg-blue-50/40 transition-all"
                      >
                        <div className="w-12 h-12 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center">
                          <Icon size={24} />
                        </div>
                        <span className="font-bold text-gray-900 text-sm text-center">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Step 2: the category-aware form */
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {!editing && (
                      <button onClick={() => setStep('category')} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl" title={fr ? 'Changer de catégorie' : 'Change category'}>
                        <ChevronLeft size={20} />
                      </button>
                    )}
                    <div>
                      <h2 className="text-xl font-black text-gray-900">
                        {editing ? (fr ? 'Modifier le produit' : 'Edit product') : (fr ? 'Nouveau produit' : 'New product')}
                      </h2>
                      <p className="text-xs font-bold text-[#007bff] uppercase tracking-wider">{formCategory?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label={fr ? 'Nom' : 'Name'}>
                      <input required value={form.name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Slug">
                      <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
                  </Field>

                  <Field label={fr ? "URL de l'image" : 'Image URL'}>
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="https://..." />
                  </Field>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label={fr ? 'Prix (F)' : 'Price (F)'}>
                      <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
                    </Field>
                    <Field label={fr ? 'Note' : 'Rating'}>
                      <input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputCls} />
                    </Field>
                    <Field label={fr ? 'Avis' : 'Reviews'}>
                      <input type="number" min={0} value={form.reviews} onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })} className={inputCls} />
                    </Field>
                    <Field label={fr ? 'Sous-type' : 'Sub-type'}>
                      <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls} placeholder="Phones…" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label={fr ? 'Marque' : 'Brand'}>
                      <select value={form.brand_id ?? ''} onChange={(e) => setForm({ ...form, brand_id: e.target.value || null })} className={inputCls}>
                        <option value="">{fr ? '— Aucune —' : '— None —'}</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={fr ? 'Couleurs (hex, séparées par des virgules)' : 'Colors (hex, comma-separated)'}>
                      <input
                        value={form.colors.join(', ')}
                        onChange={(e) => setForm({ ...form, colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean) })}
                        className={inputCls}
                        placeholder="#000000, #E3E2DE"
                      />
                    </Field>
                  </div>

                  {/* Category-specific specs */}
                  {specKeys.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        {fr ? 'Caractéristiques' : 'Specifications'} — {formCategory?.name}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specKeys.map((key) => (
                          <div key={key} className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{key}</label>
                            <input
                              value={form.specs[key] ?? ''}
                              onChange={(e) => setSpec(key, e.target.value)}
                              className={inputCls}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <label className="flex items-center gap-3 pt-2">
                    <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="w-4 h-4 accent-[#007bff]" />
                    <span className="text-sm font-bold text-gray-700">{fr ? 'En stock' : 'In stock'}</span>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" disabled={saving} className="flex-1 py-3.5 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-60">
                      {saving ? '…' : editing ? (fr ? 'Enregistrer' : 'Save') : (fr ? 'Créer' : 'Create')}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all">
                      {fr ? 'Annuler' : 'Cancel'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const inputCls =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007bff] font-medium text-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
