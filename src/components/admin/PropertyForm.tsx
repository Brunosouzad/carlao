"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/data/properties";
import { useProperties } from "@/store/PropertiesContext";
import { supabase } from "@/lib/supabase";
import {
  Save, X, Plus, Trash2, Image as ImageIcon, Video, Tag,
  BedDouble, Bath, Square, Home, DollarSign, MapPin, FileText, CheckSquare
} from "lucide-react";

const DEFAULT_FEATURES = [
  "Aquecimento a gás", "Churrasqueira", "Espaço Gourmet",
  "Infraestrutura para água quente", "Interfone", "Jardim",
  "Piscina", "Portão eletrônico", "Sacada", "Varanda",
  "Academia", "Playground", "Salão de Festas", "Home Office",
  "Adega", "Energia Solar", "Gerador", "Alarme", "CFTV"
];

interface PropertyFormProps {
  property?: Property;
  mode: "create" | "edit";
}

export default function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter();
  const { addProperty, updateProperty } = useProperties();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [states, setStates] = useState<{ sigla: string, nome: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [state, setStateSigla] = useState("");

  // Fetch States from IBGE
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?ordenar=nome")
      .then(res => res.json())
      .then(data => setStates(data.map((s: any) => ({ sigla: s.sigla, nome: s.nome }))))
      .catch(err => console.error("Erro ao carregar estados:", err));
  }, []);

  // Fetch Cities from IBGE when state changes
  useEffect(() => {
    if (!state) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?ordenar=nome`)
      .then(res => res.json())
      .then(data => {
        setCities(data.map((c: any) => c.nome));
        setLoadingCities(false);
      })
      .catch(err => {
        console.error("Erro ao carregar cidades:", err);
        setLoadingCities(false);
      });
  }, [state]);

  // CEP Lookup via ViaCEP
  const handleCepBlur = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      
      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          zipCode: cep
        }));
        setStateSigla(data.uf);
      }
    } catch (err) {
      console.error("Erro no CEP:", err);
    }
  };

  const [form, setForm] = useState<Omit<Property, "id">>({
    code: property?.code || "",
    title: property?.title || "",
    location: property?.location || "",
    city: property?.city || "",
    neighborhood: property?.neighborhood || "",
    street: property?.street || "",
    number: property?.number || "",
    complement: property?.complement || "",
    zipCode: property?.zipCode || "",
    price: property?.price || "",
    beds: property?.beds ?? 0,
    baths: property?.baths ?? 0,
    garages: property?.garages ?? 0,
    area: property?.area ?? 0,
    type: property?.type || "Venda",
    category: property?.category || "Casa",
    image: property?.image || "",
    images: property?.images || [],
    features: property?.features || [],
    tag: property?.tag || "",
    description: property?.description || "",
    videoUrl: property?.videoUrl || "",
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [customFeature, setCustomFeature] = useState("");
  const [activeTab, setActiveTab] = useState<"basico" | "midia" | "caracteristicas">("basico");

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    set("images", [...(form.images || []), newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const removeImage = (idx: number) =>
    set("images", (form.images || []).filter((_, i) => i !== idx));

  const toggleFeature = (f: string) => {
    const current = form.features || [];
    set("features", current.includes(f) ? current.filter((x) => x !== f) : [...current, f]);
  };

  const addCustomFeature = () => {
    if (!customFeature.trim()) return;
    const current = form.features || [];
    if (!current.includes(customFeature.trim())) {
      set("features", [...current, customFeature.trim()]);
    }
    setCustomFeature("");
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `imoveis/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Erro no Supabase: ${error.message || "Erro desconhecido"}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "image" | "gallery") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log(`Iniciando upload de ${files.length} arquivos para: ${target}`);

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      console.log("Resultado do upload:", url);
      
      if (url) {
        if (target === "image") {
          console.log("Definindo foto de capa:", url);
          set("image", url);
          break; // Only one for cover
        } else {
          console.log("Adicionando à galeria:", url);
          setForm(prev => ({
            ...prev,
            images: [...(prev.images || []), url]
          }));
        }
      }
    }
    
    // Limpa o input para permitir subir o mesmo arquivo novamente se necessário
    e.target.value = "";
  };

  const getYoutubeEmbedId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      alert("Preencha os campos obrigatórios: Título, Localização e Preço.");
      return;
    }

    setSaving(true);
    (async () => {
      try {
        if (mode === "create") {
          await addProperty(form);
        } else if (property) {
          await updateProperty({ ...form, id: property.id });
        }
        router.push("/admin/imoveis");
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    })();
  };

  const tabs = [
    { key: "basico", label: "Dados Básicos", icon: Home },
    { key: "midia", label: "Fotos & Vídeo", icon: ImageIcon },
    { key: "caracteristicas", label: "Características", icon: CheckSquare },
  ] as const;

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {mode === "create" ? "Novo Imóvel" : "Editar Imóvel"}
          </h1>
          {property && (
            <p className="text-slate-500 text-sm mt-1">
              Código: <span className="font-bold text-secondary">{property.code}</span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/imoveis")}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <X size={18} /> Cancelar
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
              activeTab === key
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-primary"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── ABA: DADOS BÁSICOS ── */}
        {activeTab === "basico" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
                <FileText size={18} /> Informações Gerais
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Código *</label>
                  <input className={inputClass} placeholder="Ex: CV-001" value={form.code} onChange={e => set("code", e.target.value)} required />
                </div>
                <div>
                  <label className={labelClass}>Tipo *</label>
                  <select className={inputClass} value={form.type} onChange={e => set("type", e.target.value as "Venda" | "Aluguel")}>
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Categoria *</label>
                  <select className={inputClass} value={form.category} onChange={e => set("category", e.target.value as any)}>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Área">Área</option>
                    <option value="Barracão">Barracão</option>
                    <option value="Casa">Casa</option>
                    <option value="Chácara">Chácara</option>
                    <option value="Fazenda">Fazenda</option>
                    <option value="Galpão">Galpão</option>
                    <option value="Loja">Loja</option>
                    <option value="Lote">Lote</option>
                    <option value="Prédio">Prédio</option>
                    <option value="Sala">Sala</option>
                    <option value="Sítio">Sítio</option>
                    <option value="Quitinete">Quitinete</option>
                    <option value="Pousada">Pousada</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Título *</label>
                  <input className={inputClass} placeholder="Ex: Casa de Alto Padrão no Belvedere" value={form.title} onChange={e => set("title", e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>CEP</label>
                    <input 
                      className={inputClass} 
                      placeholder="00000-000" 
                      value={form.zipCode} 
                      onChange={e => set("zipCode", e.target.value)}
                      onBlur={e => handleCepBlur(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Estado *</label>
                    <select 
                      className={inputClass} 
                      value={state} 
                      onChange={e => setStateSigla(e.target.value)}
                      required
                    >
                      <option value="">Selecione...</option>
                      {states.map(s => (
                        <option key={s.sigla} value={s.sigla}>{s.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Cidade *</label>
                    <select 
                      className={inputClass} 
                      value={form.city} 
                      onChange={e => set("city", e.target.value)}
                      disabled={!state || loadingCities}
                      required
                    >
                      <option value="">{loadingCities ? "Carregando..." : "Selecione..."}</option>
                      {cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      {/* Fallback for existing city if not in list yet */}
                      {form.city && !cities.includes(form.city) && (
                        <option value={form.city}>{form.city}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bairro *</label>
                    <input className={inputClass} placeholder="Ex: Belvedere" value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <label className={labelClass}>Logradouro (Rua/Av) *</label>
                    <input className={inputClass} placeholder="Ex: Rua das Flores" value={form.street} onChange={e => set("street", e.target.value)} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Número</label>
                    <input className={inputClass} placeholder="Ex: 123" value={form.number} onChange={e => set("number", e.target.value)} />
                  </div>
                  <div className="md:col-span-4">
                    <label className={labelClass}>Complemento</label>
                    <input className={inputClass} placeholder="Ex: Apt 101, Fundos..." value={form.complement} onChange={e => set("complement", e.target.value)} />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={labelClass}><MapPin size={12} className="inline mr-1" />Endereço Completo (Exibição no Site) *</label>
                  <div className="relative">
                    <input 
                      className={`${inputClass} bg-slate-50 font-medium`} 
                      placeholder="Será gerado automaticamente..." 
                      value={form.location} 
                      onChange={e => set("location", e.target.value)} 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const parts = [
                          form.street, 
                          form.number ? `, ${form.number}` : '',
                          form.complement ? ` - ${form.complement}` : '',
                          form.neighborhood ? ` - ${form.neighborhood}` : '',
                          form.city ? `, ${form.city}` : ''
                        ].join('').replace(/^ - /, '').replace(/^, /, '');
                        set("location", parts);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg text-primary hover:bg-slate-50 transition-colors"
                    >
                      Gerar Texto
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Este é o texto que os clientes verão. Você pode editar manualmente se desejar.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
                <DollarSign size={18} /> Valor e Destaque
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preço (R$) *</label>
                  <input className={inputClass} type="number" placeholder="Ex: 1850000" value={form.price} onChange={e => set("price", e.target.value)} required />
                </div>
                <div>
                  <label className={labelClass}><Tag size={12} className="inline mr-1" />Tag de Destaque</label>
                  <input className={inputClass} placeholder="Ex: Destaque, Novo, Exclusivo..." value={form.tag || ""} onChange={e => set("tag", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
                <BedDouble size={18} /> Detalhes do Imóvel
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}><BedDouble size={12} className="inline mr-1" />Quartos</label>
                  <input className={inputClass} type="number" min={0} value={form.beds} onChange={e => set("beds", Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}><Bath size={12} className="inline mr-1" />Banheiros</label>
                  <input className={inputClass} type="number" min={0} value={form.baths} onChange={e => set("baths", Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}>Vagas</label>
                  <input className={inputClass} type="number" min={0} value={form.garages} onChange={e => set("garages", Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}><Square size={12} className="inline mr-1" />Área (m²)</label>
                  <input className={inputClass} type="number" min={0} value={form.area} onChange={e => set("area", Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-6">
                <FileText size={18} /> Descrição
              </h2>
              <textarea
                className={`${inputClass} h-40 resize-none`}
                placeholder="Descreva o imóvel com detalhes atrativos para o cliente..."
                value={form.description || ""}
                onChange={e => set("description", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── ABA: FOTOS & VÍDEO ── */}
        {activeTab === "midia" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-2">
                <ImageIcon size={18} /> Foto de Capa
              </h2>
              <p className="text-xs text-slate-400 mb-4">URL da imagem principal exibida nos cards e no topo da página.</p>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={form.image}
                  onChange={e => set("image", e.target.value)}
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap text-xs font-bold border border-slate-200">
                  <Plus size={14} />
                  {uploading ? "Subindo..." : "Upload"}
                  <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, "image")} disabled={uploading} />
                </label>
              </div>
              {form.image && (
                <div className="mt-4 rounded-xl overflow-hidden h-48 bg-slate-100">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-2">
                <ImageIcon size={18} /> Galeria de Imagens
              </h2>
              <p className="text-xs text-slate-400 mb-4">Adicione URLs das fotos que aparecerão na galeria com thumbnails.</p>

              <div className="flex gap-2 mb-4">
                <input
                  className={`${inputClass} flex-1`}
                  placeholder="https://exemplo.com/foto2.jpg"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImage())}
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap text-xs font-bold border border-slate-200">
                  <Plus size={14} />
                  {uploading ? "Subindo..." : "Subir Fotos"}
                  <input type="file" className="hidden" accept="image/*" multiple onChange={e => handleFileUpload(e, "gallery")} disabled={uploading} />
                </label>
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-3 bg-primary text-white rounded-xl flex items-center gap-2 font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Plus size={16} /> URL
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(form.images || []).map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden h-32 bg-slate-100">
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
                {(form.images || []).length === 0 && (
                  <div className="col-span-3 py-10 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    Nenhuma foto na galeria. Adicione URLs acima.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-2">
                <Video size={18} /> Vídeo do YouTube
              </h2>
              <p className="text-xs text-slate-400 mb-4">Cole o link do vídeo do YouTube (ex: https://youtube.com/watch?v=XXXXXXXXXXX)</p>
              <input
                className={inputClass}
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.videoUrl || ""}
                onChange={e => set("videoUrl", e.target.value)}
              />
              {form.videoUrl && getYoutubeEmbedId(form.videoUrl) && (
                <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-slate-100">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYoutubeEmbedId(form.videoUrl!)}`}
                    title="Preview do Vídeo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {form.videoUrl && !getYoutubeEmbedId(form.videoUrl) && (
                <p className="mt-2 text-xs text-red-500">Link do YouTube inválido. Verifique a URL.</p>
              )}
            </div>
          </div>
        )}

        {/* ── ABA: CARACTERÍSTICAS ── */}
        {activeTab === "caracteristicas" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-2">
                <CheckSquare size={18} /> Amenidades e Características
              </h2>
              <p className="text-xs text-slate-400 mb-6">Selecione as características que este imóvel possui. Elas aparecem na página de detalhes como tags clicáveis de busca.</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {DEFAULT_FEATURES.map(f => {
                  const selected = (form.features || []).includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all cursor-pointer border ${
                        selected
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      <span className={`inline-block w-4 h-4 rounded border mr-2 align-middle text-center leading-none text-[10px] ${
                        selected ? "bg-primary border-primary text-white" : "border-slate-300"
                      }`}>
                        {selected ? "✓" : ""}
                      </span>
                      {f}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className={labelClass}>Adicionar Característica Personalizada</label>
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    placeholder="Ex: Pé-direito duplo, Piso aquecido..."
                    value={customFeature}
                    onChange={e => setCustomFeature(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomFeature())}
                  />
                  <button
                    type="button"
                    onClick={addCustomFeature}
                    className="px-4 py-3 bg-primary text-white rounded-xl flex items-center gap-2 font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
              </div>

              {(form.features || []).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(form.features || []).map(f => (
                    <span key={f} className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full">
                      {f}
                      <button type="button" onClick={() => toggleFeature(f)} className="hover:text-red-500 transition-colors cursor-pointer">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer de ação */}
        <div className="mt-8 flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-xs text-slate-400">
            * Campos obrigatórios: Título, Localização e Preço
          </p>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-70 shadow-lg shadow-primary/20"
          >
            <Save size={18} />
            {saving ? "Salvando..." : mode === "create" ? "Criar Imóvel" : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
