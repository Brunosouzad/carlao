"use client";

import { useState } from "react";
import { useSiteSettings, SiteSettings } from "@/store/SiteSettingsContext";
import { Save, Plus, Trash2, RotateCcw, Image as ImageIcon, Layout, Type } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminConfiguracoes() {
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"banner" | "layout">("banner");

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addHeroImage = () => {
    if (!newImageUrl.trim()) return;
    set("heroImages", [...form.heroImages, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const removeHeroImage = (idx: number) =>
    set("heroImages", form.heroImages.filter((_, i) => i !== idx));

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `banner-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        if (publicUrl) {
          set("heroImages", [...form.heroImages, publicUrl]);
        }
      }
    } catch (error: any) {
      console.error('Error uploading banner:', error);
      alert(`Erro no Supabase (Banner): ${error.message || "Erro desconhecido"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Resetar todas as configurações para o padrão?")) {
      resetSettings();
      window.location.reload();
    }
  };

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  const tabs = [
    { key: "banner", label: "Banner / Hero", icon: ImageIcon },
    { key: "layout", label: "Layout da Home", icon: Layout },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Configurações do Site</h1>
          <p className="text-slate-500 text-sm mt-1">Personalize o banner e o layout da página principal.</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-red-50 hover:text-red-500 border border-slate-200 rounded-xl transition-colors cursor-pointer text-sm"
        >
          <RotateCcw size={16} /> Resetar padrões
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              activeTab === key ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── BANNER / HERO ── */}
      {activeTab === "banner" && (
        <div className="space-y-6">
          {/* Texto do Hero */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
              <Type size={18} /> Textos do Banner
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Título Principal</label>
                <input
                  className={inputClass}
                  placeholder="Ex: Encontre o seu **imóvel ideal**"
                  value={form.heroTitle}
                  onChange={e => set("heroTitle", e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Use <code className="bg-slate-100 px-1 rounded">**palavra**</code> para destacar em laranja. Ex: <code className="bg-slate-100 px-1 rounded">Encontre o seu **imóvel ideal**</code>
                </p>
              </div>
              <div>
                <label className={labelClass}>Subtítulo</label>
                <textarea
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="Frase de apoio abaixo do título..."
                  value={form.heroSubtitle}
                  onChange={e => set("heroSubtitle", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Intervalo de Troca (segundos)</label>
                <input
                  className={inputClass}
                  type="number"
                  min={2}
                  max={30}
                  value={form.heroSlideInterval}
                  onChange={e => set("heroSlideInterval", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Imagens do Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-2">
              <ImageIcon size={18} /> Imagens do Banner (Slideshow)
            </h2>
            <p className="text-xs text-slate-400 mb-6">Adicione as URLs das imagens que aparecem em sequência no banner principal.</p>

            <div className="flex gap-2 mb-6">
              <input
                className={`${inputClass} flex-1`}
                placeholder="https://exemplo.com/banner.jpg"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addHeroImage())}
              />
              <button
                type="button"
                onClick={addHeroImage}
                className="px-4 py-3 bg-primary text-white rounded-xl flex items-center gap-2 font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus size={16} /> Adicionar URL
              </button>
              <label className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap text-sm font-bold border border-slate-200">
                <Plus size={18} />
                {uploading ? "Subindo..." : "Subir do Computador"}
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleBannerUpload} disabled={uploading} />
              </label>
            </div>

            <div className="space-y-3">
              {form.heroImages.map((img, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                    <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide {idx + 1}</span>
                    <p className="text-sm text-slate-600 truncate">{img}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHeroImage(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {form.heroImages.length === 0 && (
                <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  Nenhuma imagem. Adicione URLs acima.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT DA HOME ── */}
      {activeTab === "layout" && (
        <div className="space-y-6">
          {/* Cards por linha */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
              <Layout size={18} /> Quantidade de Cards por Linha
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {([3, 4] as const).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("homeCardsPerRow", n)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                    form.homeCardsPerRow === n
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-primary/30"
                  }`}
                >
                  {/* Mini grid preview */}
                  <div className={`grid gap-1.5 mb-4 ${n === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                    {Array.from({ length: n }).map((_, i) => (
                      <div key={i} className={`h-10 rounded-lg ${form.homeCardsPerRow === n ? "bg-primary/20" : "bg-slate-100"}`} />
                    ))}
                  </div>
                  <span className={`font-bold text-lg block ${form.homeCardsPerRow === n ? "text-primary" : "text-slate-600"}`}>
                    {n} cards
                  </span>
                  <span className="text-xs text-slate-400">{n === 3 ? "Cards maiores, mais destaque" : "Mais imóveis visíveis"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade máxima */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
              <Layout size={18} /> Quantidade Máxima na Home
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Imóveis à Venda</label>
                <select className={inputClass} value={form.homeMaxVenda} onChange={e => set("homeMaxVenda", Number(e.target.value))}>
                  {[3, 4, 6, 8].map(n => <option key={n} value={n}>{n} imóveis</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Imóveis para Alugar</label>
                <select className={inputClass} value={form.homeMaxAluguel} onChange={e => set("homeMaxAluguel", Number(e.target.value))}>
                  {[3, 4, 6, 8].map(n => <option key={n} value={n}>{n} imóveis</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Títulos das seções */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
              <Type size={18} /> Títulos das Seções
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Rótulo — Seção Venda</label>
                <input className={inputClass} placeholder="Imóveis para Venda" value={form.homeVendaSubtitle} onChange={e => set("homeVendaSubtitle", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Título — Seção Venda</label>
                <input className={inputClass} placeholder="Melhores Oportunidades" value={form.homeVendaTitle} onChange={e => set("homeVendaTitle", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Rótulo — Seção Aluguel</label>
                <input className={inputClass} placeholder="Imóveis para Alugar" value={form.homeAluguelSubtitle} onChange={e => set("homeAluguelSubtitle", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Título — Seção Aluguel</label>
                <input className={inputClass} placeholder="Destaques de Locação" value={form.homeAluguelTitle} onChange={e => set("homeAluguelTitle", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer salvar */}
      <div className="mt-8 flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
        {saved ? (
          <span className="text-emerald-600 font-semibold text-sm flex items-center gap-2">
            ✓ Configurações salvas com sucesso!
          </span>
        ) : (
          <span className="text-xs text-slate-400">As alterações são aplicadas imediatamente ao site.</span>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/20"
        >
          <Save size={18} />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
