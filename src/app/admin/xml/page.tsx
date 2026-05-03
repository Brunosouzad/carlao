"use client";

import { useState, useRef, useCallback } from "react";
import {
  Download, Upload, FileCode, CheckCircle2, AlertCircle,
  Loader2, X, FileText, RefreshCw, ExternalLink, Copy, Check,
  Building, Tag, MapPin, DollarSign, Eye
} from "lucide-react";
import { useProperties } from "@/store/PropertiesContext";
import { formatPrice } from "@/utils/format";
import { useToast } from "@/store/ToastContext";

type ImportStatus = "idle" | "parsing" | "preview" | "importing" | "done" | "error";
type ExportFilter = "todos" | "Venda" | "Aluguel";

interface PreviewImovel {
  code: string;
  title: string;
  type: string;
  category: string;
  price: string;
  city: string;
  neighborhood: string;
  beds: number;
  baths: number;
  area: number;
  image: string;
}

interface ImportResult {
  total: number;
  importados: number;
  atualizados: number;
  erros: string[];
}

export default function AdminXML() {
  const { properties } = useProperties();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"exportar" | "importar">("exportar");

  // ── EXPORT ──────────────────────────────────────────────
  const [exportFilter, setExportFilter] = useState<ExportFilter>("todos");
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const feedUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/xml/export`
      : "/api/xml/export";

  const filteredCount =
    exportFilter === "todos"
      ? properties.length
      : properties.filter((p) => p.type === exportFilter).length;

  const handleExport = async () => {
    setExporting(true);
    try {
      const param = exportFilter !== "todos" ? `?tipo=${exportFilter}` : "";
      const res = await fetch(`/api/xml/export${param}`);
      if (!res.ok) throw new Error("Erro ao gerar XML");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `imoveis-carlao-${Date.now()}.xml`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error("Erro ao gerar XML", e.message);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── IMPORT ──────────────────────────────────────────────
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewImovel[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetImport = () => {
    setImportStatus("idle");
    setSelectedFile(null);
    setPreviewData([]);
    setImportResult(null);
    setImportError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFilePick = useCallback(async (file: File) => {
    if (!file.name.endsWith(".xml")) {
      setImportError("Selecione um arquivo .xml válido.");
      return;
    }
    setSelectedFile(file);
    setImportError("");
    await doPreview(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFilePick(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFilePick(file);
  };

  const doPreview = async (file: File) => {
    setImportStatus("parsing");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/xml/import", { method: "PUT", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no parse");
      setPreviewData(data.imoveis || []);
      setImportStatus("preview");
    } catch (e: any) {
      setImportError(e.message);
      setImportStatus("error");
    }
  };

  const doImport = async () => {
    if (!selectedFile) return;
    setImportStatus("importing");
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      const res = await fetch("/api/xml/import", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na importação");
      setImportResult(data);
      setImportStatus("done");
    } catch (e: any) {
      setImportError(e.message);
      setImportStatus("error");
    }
  };

  // ── STYLES ──────────────────────────────────────────────
  const tabs = [
    { key: "exportar", label: "Exportar XML", icon: Download },
    { key: "importar", label: "Importar XML", icon: Upload },
  ] as const;

  const filterOptions: { value: ExportFilter; label: string; color: string }[] = [
    { value: "todos", label: "Todos os imóveis", color: "border-slate-300 text-slate-700" },
    { value: "Venda", label: "Apenas Venda", color: "border-amber-300 text-amber-700" },
    { value: "Aluguel", label: "Apenas Aluguel", color: "border-blue-300 text-blue-700" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <FileCode size={22} />
          </div>
          <h1 className="text-3xl font-bold text-primary">Integração XML</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Exporte seus imóveis no padrão VRSync para portais como Viva Real, ZAP, OLX e Imovelweb, ou importe imóveis de outros sistemas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
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

      {/* ── ABA EXPORTAR ── */}
      {activeTab === "exportar" && (
        <div className="space-y-6">
          {/* Filtro */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-4">
              <FileText size={18} /> O que exportar?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {filterOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setExportFilter(value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    exportFilter === value
                      ? "border-primary bg-primary/5"
                      : `border-slate-200 hover:${color}`
                  }`}
                >
                  <span className={`font-bold text-sm block ${exportFilter === value ? "text-primary" : "text-slate-700"}`}>
                    {label}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {value === "todos"
                      ? `${properties.length} imóveis`
                      : `${properties.filter((p) => p.type === value).length} imóveis`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Botão de Download */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-2">
              <Download size={18} /> Baixar Arquivo XML
            </h2>
            <p className="text-slate-400 text-xs mb-6">
              Gera um arquivo <code className="bg-slate-100 px-1 rounded">.xml</code> com{" "}
              <strong className="text-primary">{filteredCount} imóvel(is)</strong> no padrão VRSync, pronto para upload manual nos portais.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting || filteredCount === 0}
              className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
              {exporting ? "Gerando XML..." : `Baixar XML (${filteredCount} imóveis)`}
            </button>
          </div>

          {/* Feed URL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-2">
              <ExternalLink size={18} /> URL do Feed XML (Integração Automática)
            </h2>
            <p className="text-slate-400 text-xs mb-4">
              Alguns portais permitem que você cadastre uma URL de feed para que eles puxem os imóveis automaticamente.
              Cole a URL abaixo no portal desejado.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs text-slate-600 break-all">
                {feedUrl}
                {exportFilter !== "todos" ? `?tipo=${exportFilter}` : ""}
              </div>
              <button
                onClick={handleCopyUrl}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all cursor-pointer whitespace-nowrap ${
                  copied
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copiado!" : "Copiar URL"}
              </button>
            </div>

            {/* Portais */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Como usar nos portais</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Viva Real / ZAP", hint: "Configurações → Feed de Imóveis → Adicionar URL" },
                  { name: "OLX Pro", hint: "Imóveis → Importação automática → XML Feed" },
                  { name: "Imovelweb", hint: "Conta → Integrações → Feed VRSync" },
                  { name: "Chaves na Mão", hint: "Painel → Importar Imóveis → URL XML" },
                ].map((p) => (
                  <div key={p.name} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building size={14} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-xs">{p.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview da listagem */}
          {properties.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-4">
                <Eye size={18} /> Prévia dos Imóveis no XML
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {properties
                  .filter((p) => exportFilter === "todos" || p.type === exportFilter)
                  .slice(0, 20)
                  .map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Building size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{p.code}</span>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.type === "Venda" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {p.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 truncate">{p.title}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin size={10} />
                          {p.location}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-primary flex-shrink-0">{formatPrice(p.price)}</p>
                    </div>
                  ))}
                {filteredCount > 20 && (
                  <p className="text-xs text-center text-slate-400 py-2">
                    + {filteredCount - 20} imóveis não exibidos
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ABA IMPORTAR ── */}
      {activeTab === "importar" && (
        <div className="space-y-6">
          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText size={16} />
            </div>
            <div>
              <p className="font-bold text-blue-800 text-sm mb-1">Como funciona a importação?</p>
              <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
                <li>Aceita arquivos <strong>.xml</strong> no padrão VRSync</li>
                <li>Se o código do imóvel já existir → os dados serão <strong>atualizados</strong></li>
                <li>Se o código não existir → um novo imóvel será <strong>criado</strong></li>
                <li>Você verá uma prévia antes de confirmar a importação</li>
              </ul>
            </div>
          </div>

          {/* Upload Area */}
          {(importStatus === "idle" || importStatus === "error") && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-primary flex items-center gap-2 mb-4">
                <Upload size={18} /> Selecione o Arquivo XML
              </h2>

              {importError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {importError}
                </div>
              )}

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                }`}
              >
                <Upload
                  size={40}
                  className={`mx-auto mb-4 transition-colors ${dragOver ? "text-primary" : "text-slate-300"}`}
                />
                <p className="font-bold text-slate-700 mb-1">
                  {dragOver ? "Solte o arquivo aqui" : "Arraste o arquivo XML aqui"}
                </p>
                <p className="text-sm text-slate-400 mb-4">ou clique para selecionar</p>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">
                  <Upload size={14} /> Selecionar Arquivo
                </span>
                <p className="text-xs text-slate-300 mt-3">Somente arquivos .xml (padrão VRSync)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
            </div>
          )}

          {/* Parsing */}
          {importStatus === "parsing" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
              <p className="font-bold text-slate-700">Analisando o arquivo XML...</p>
              <p className="text-sm text-slate-400 mt-1">Validando e mapeando os imóveis</p>
            </div>
          )}

          {/* Preview */}
          {importStatus === "preview" && previewData.length > 0 && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-primary flex items-center gap-2">
                    <Eye size={18} /> Prévia da Importação
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                      {previewData.length} imóvel(is) detectado(s)
                    </span>
                    <button
                      onClick={resetImport}
                      className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Cancelar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 mb-6">
                  {previewData.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Building size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{p.code}</span>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.type === "Venda" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {p.type}
                          </span>
                          <span className="text-[10px] text-slate-400">{p.category}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 truncate">{p.title || "(sem título)"}</p>
                        <p className="text-xs text-slate-400">
                          {p.neighborhood && `${p.neighborhood}, `}{p.city}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary">
                          {p.price ? formatPrice(p.price) : "—"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {p.area}m² · {p.beds}q · {p.baths}bh
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={resetImport}
                    className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <X size={16} /> Cancelar
                  </button>
                  <button
                    onClick={doImport}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/20"
                  >
                    <Upload size={16} /> Confirmar Importação ({previewData.length} imóveis)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Importing spinner */}
          {importStatus === "importing" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
              <p className="font-bold text-slate-700">Importando imóveis...</p>
              <p className="text-sm text-slate-400 mt-1">
                Cadastrando e atualizando no banco de dados
              </p>
            </div>
          )}

          {/* Result */}
          {importStatus === "done" && importResult && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Importação concluída!</h2>
                  <p className="text-sm text-slate-500">
                    Processados {importResult.total} imóveis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{importResult.importados}</p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Novos importados</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{importResult.atualizados}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-1">Atualizados</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-700">{importResult.erros.length}</p>
                  <p className="text-xs font-semibold text-red-600 mt-1">Erros</p>
                </div>
              </div>

              {importResult.erros.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="font-bold text-red-700 text-sm mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> Erros encontrados:
                  </p>
                  <ul className="space-y-1">
                    {importResult.erros.map((e, i) => (
                      <li key={i} className="text-xs text-red-600 font-mono">• {e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={resetImport}
                className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Nova Importação
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
