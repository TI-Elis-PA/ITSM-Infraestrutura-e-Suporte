"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Monitor, Server, Wifi, Printer, MoreVertical, X, HardDrive, Cpu, Activity, History, QrCode, Loader2 } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';

export default function AtivosPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Supabase States
    const [assets, setAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '', category: 'Computador', brand: '', model: '',
        mac_address: '', ip_address: '', condition: 'Novo', location: ''
    });

    // Fetch Assets
    const fetchAssets = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('ativos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar ativos:', error);
        } else {
            setAssets(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    // Handle Save
    const handleSaveAsset = async () => {
        if (!formData.name || !formData.category) return;
        setIsSaving(true);
        const { data, error } = await supabase
            .from('ativos')
            .insert([{
                name: formData.name,
                category: formData.category,
                brand: formData.brand,
                model: formData.model,
                mac_address: formData.mac_address,
                ip_address: formData.ip_address,
                condition: formData.condition,
                location: formData.location,
                status: 'Ativo'
            }])
            .select();

        if (error) {
            console.error('Erro ao salvar:', error);
            alert('Falha ao salvar ativo.');
        } else {
            setFormData({ name: '', category: 'Computador', brand: '', model: '', mac_address: '', ip_address: '', condition: 'Novo', location: '' });
            setIsAddModalOpen(false);
            fetchAssets(); // Refresh list
        }
        setIsSaving(false);
    };

    // Filter Logic
    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (asset.ip_address && asset.ip_address.includes(searchTerm)) ||
            (asset.mac_address && asset.mac_address.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === "" || asset.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <Server className="text-indigo-500" />
                        Inventário de Ativos
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestão de Hardware, Modelos e Conservação</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    Cadastrar Ativo
                </button>
            </div>

            {/* FILTERS */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-6 relative z-10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, IP, MAC ou Endereço..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium cursor-pointer"
                    >
                        <option value="">Todas as Categorias</option>
                        <option value="Computador">Computador</option>
                        <option value="Switch">Switch</option>
                        <option value="Nobreak">Nobreak</option>
                        <option value="Coletor">Coletor</option>
                        <option value="Impressora">Impressora</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-6 items-start">
                {/* TABLE LIST */}
                <div className={`flex-1 glass-panel rounded-2xl overflow-hidden transition-all duration-300 relative z-0 ${selectedAsset ? 'hidden lg:block' : 'block'}`}>
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 blur-3xl -z-10 rounded-full pointer-events-none"></div>
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Equipamento</th>
                                    <th className="px-6 py-4 font-semibold">Rede</th>
                                    <th className="px-6 py-4 font-semibold">Localização</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            <Loader2 size={24} className="animate-spin mx-auto text-indigo-500 mb-2" />
                                            Carregando ativos do Supabase...
                                        </td>
                                    </tr>
                                ) : filteredAssets.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            Nenhum ativo encontrado.
                                        </td>
                                    </tr>
                                ) : filteredAssets.map((asset) => (
                                    <tr
                                        key={asset.id}
                                        onClick={() => setSelectedAsset(asset)}
                                        className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                                    {getCategoryIcon(asset.category)}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold transition-colors ${selectedAsset?.id === asset.id ? 'text-indigo-600' : 'text-slate-800'}`}>{asset.name}</p>
                                                    <p className="text-xs text-slate-500">{asset.brand} {asset.model}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-700">{asset.ip_address || '-'}</p>
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">{asset.mac_address}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-700">{asset.location}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColors(asset.status || 'Ativo')}`}>
                                                {asset.status || 'Ativo'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SIDE DETAILS PANEL */}
                {selectedAsset && (
                    <div className="w-full lg:w-[400px] glass-panel rounded-2xl flex flex-col animate-in slide-in-from-right duration-300 relative overflow-hidden">
                        <div className="p-5 border-b border-slate-200/50 flex justify-between items-center bg-white/50 rounded-t-2xl">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <HardDrive size={18} className="text-indigo-500" /> Detalhes do Ativo
                            </h2>
                            <button onClick={() => setSelectedAsset(null)} className="p-1 hover:bg-slate-200 rounded-md text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">

                            <div className="text-center pb-4 border-b border-slate-100 relative">
                                <div className="absolute right-0 top-0 opacity-20 pointer-events-none grayscale">
                                    <QRCodeSVG value={`itsm://asset/${selectedAsset.id}`} size={64} />
                                </div>
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-600 shadow-inner">
                                    {getCategoryIcon(selectedAsset.category)}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedAsset.name}</h3>
                                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColors(selectedAsset.status)}`}>
                                    {selectedAsset.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Especificações</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Categoria" value={selectedAsset.category} />
                                    <DetailItem label="Marca" value={selectedAsset.brand} />
                                    <DetailItem label="Modelo" value={selectedAsset.model} />
                                    <DetailItem label="S/N" value={selectedAsset.serial_number} />
                                    <DetailItem label="IP" value={selectedAsset.ip_address} />
                                    <DetailItem label="MAC" value={selectedAsset.mac_address} />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ciclo de Vida</h4>
                                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Local Atual</span>
                                        <span className="font-medium text-slate-800">{selectedAsset.location}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Conservação</span>
                                        <span className="font-medium text-slate-800">{selectedAsset.condition}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Última Review</span>
                                        <span className="font-medium text-slate-800">{selectedAsset.last_maintenance || 'Sem registro'}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex gap-3">
                            <button
                                onClick={() => {
                                    alert(`Imprimindo etiqueta QR Code para: ${selectedAsset.name}`);
                                }}
                                className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2"
                            >
                                <QrCode size={16} /> Print Etiqueta
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md">
                                Editar Info
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL NOVO ATIVO */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">Cadastro de Hardware</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Hostname / Nome</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Ex: PC-PROD-05" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Categoria</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                        <option value="Computador">Computador / Notebook</option>
                                        <option value="Switch">Switch / Roteador</option>
                                        <option value="Nobreak">Nobreak / UPS</option>
                                        <option value="Coletor">Coletor de Dados</option>
                                        <option value="Impressora">Impressora</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Marca</label>
                                    <input value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Dell" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Modelo Exato</label>
                                    <input value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Optiplex 3080" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">MAC Address</label>
                                    <input value={formData.mac_address} onChange={e => setFormData({ ...formData, mac_address: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm" placeholder="00:00:00:00:00:00" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">IP (Fixo se houver)</label>
                                    <input value={formData.ip_address} onChange={e => setFormData({ ...formData, ip_address: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="192.168.x.x" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Estado de Conservação</label>
                                    <select value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                        <option value="Novo">Novo (Na caixa)</option>
                                        <option value="Bom">Bom (Uso diário leve)</option>
                                        <option value="Marcas de Uso">Marcas de Uso / Desgastado</option>
                                        <option value="Danificado">Danificado (Para sucata/peças)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Setor/Localização</label>
                                    <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Recebimento Doca 1" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition">Cancelar</button>
                            <button
                                onClick={handleSaveAsset}
                                disabled={isSaving}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 text-white font-medium rounded-lg transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSaving && <Loader2 size={16} className="animate-spin" />}
                                Salvar Ativo
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

// === Funções Auxiliares ===

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800 break-all">{value || '-'}</p>
    </div>
);

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Computador': return <Monitor size={20} />;
        case 'Switch': return <Server size={20} />;
        case 'Nobreak': return <Activity size={20} />;
        case 'Impressora': return <Printer size={20} />;
        default: return <Cpu size={20} />;
    }
};

const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
        case 'ativo': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
        case 'estoque': return 'bg-slate-100 text-slate-700 border border-slate-200';
        case 'manutenção': return 'bg-amber-100 text-amber-700 border border-amber-200';
        case 'sucata': return 'bg-rose-100 text-rose-700 border border-rose-200';
        default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
};
