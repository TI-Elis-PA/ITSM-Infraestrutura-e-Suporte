"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, UserCheck, Clock, CheckCircle2, AlertTriangle, FileText, ArrowRight, X, Send, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
    const [activeTab, setActiveTab] = useState<'ativos' | 'historico'>('ativos');
    const [isNewOpen, setIsNewOpen] = useState(false);

    // Supabase States
    const [checkouts, setCheckouts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        asset_name: '', borrower_name: '', department: 'Administrativo', notes: ''
    });

    const fetchCheckouts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('checkout_loans')
            .select('*')
            .order('loan_date', { ascending: false });

        if (!error && data) {
            const mapped = data.map(c => {
                const dateIn = new Date(c.loan_date);
                const formatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
                const dateOut = c.return_date ? formatter.format(new Date(c.return_date)) : null;
                return {
                    ...c,
                    formattedLoanDate: formatter.format(dateIn),
                    formattedReturnDate: dateOut
                };
            });
            setCheckouts(mapped);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCheckouts();
    }, []);

    const handleCreateCheckout = async () => {
        if (!formData.asset_name || !formData.borrower_name) return;
        setIsSaving(true);
        const { error } = await supabase.from('checkout_loans').insert([{
            asset_name: formData.asset_name,
            borrower_name: formData.borrower_name,
            department: formData.department,
            notes: formData.notes,
            status: 'Ativo'
        }]);

        if (!error) {
            setFormData({ asset_name: '', borrower_name: '', department: 'Administrativo', notes: '' });
            setIsNewOpen(false);
            fetchCheckouts();
        }
        setIsSaving(false);
    };

    const handleReturn = async (id: string) => {
        if (!confirm('Confirmar devolução deste equipamento?')) return;
        setIsSaving(true);
        const { error } = await supabase
            .from('checkout_loans')
            .update({ status: 'Devolvido', return_date: new Date().toISOString() })
            .eq('id', id);

        if (!error) {
            fetchCheckouts();
        }
        setIsSaving(false);
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><CheckCircle2 size={24} /></div>
                        Checkout de Equipamentos
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Controle de empréstimos, notebooks reserva e coletores</p>
                </div>
                <button
                    onClick={() => setIsNewOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    Novo Empréstimo
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Painel Principal */}
                <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col relative overflow-hidden z-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-3xl -z-10 rounded-full pointer-events-none"></div>

                    <div className="flex items-center border-b border-slate-200 bg-slate-50/50">
                        <button
                            className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'ativos' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            onClick={() => setActiveTab('ativos')}
                        >
                            <Clock size={16} />
                            Empréstimos Ativos
                        </button>
                        <button
                            className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'historico' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            onClick={() => setActiveTab('historico')}
                        >
                            <CheckCircle2 size={16} />
                            Devoluções Recentes
                        </button>
                    </div>

                    <div className="p-0 overflow-y-auto max-h-[600px]">
                        <div className="divide-y divide-slate-100">
                            {isLoading ? (
                                <div className="p-12 text-center text-slate-500 w-full flex flex-col items-center justify-center">
                                    <Loader2 size={32} className="animate-spin text-emerald-500 mb-4" />
                                    Carregando empréstimos...
                                </div>
                            ) : checkouts.filter(c => activeTab === 'ativos' ? c.status === 'Ativo' : c.status === 'Devolvido').length === 0 ? (
                                <div className="p-12 text-center text-slate-500 w-full">
                                    Nenhum registro encontrado nesta aba.
                                </div>
                            ) : checkouts.filter(c => activeTab === 'ativos' ? c.status === 'Ativo' : c.status === 'Devolvido').map((checkout) => (
                                <div key={checkout.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
                                            <UserCheck size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{checkout.asset_name}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1">
                                                <span><strong className="font-medium text-slate-700">Para:</strong> {checkout.borrower_name} ({checkout.department})</span>
                                                <span className="flex items-center gap-1.5"><Clock size={14} /> Saída: {checkout.formattedLoanDate}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2">Motivo: {checkout.notes}</p>
                                        </div>
                                    </div>

                                    {checkout.status === 'Ativo' ? (
                                        <button
                                            onClick={() => handleReturn(checkout.id)}
                                            disabled={isSaving}
                                            className="w-full md:w-auto mt-4 md:mt-0 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:opacity-50"
                                        >
                                            Registrar Devolução
                                        </button>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-full md:w-auto mt-4 md:mt-0">
                                            <CheckCircle2 size={14} /> Devolvido em {checkout.formattedReturnDate}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gerador de Termo */}
                <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-xl shadow-lg flex flex-col h-fit">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-indigo-400" />
                        Termo de Responsabilidade
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Gere um termo digital instantâneo para coleta de assinatura via WhatsApp ou impressão quando emprestar um hardware de alto valor (ex: Notebooks e Coletores RT).
                    </p>

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6 font-mono text-xs text-slate-300">
                        "Eu, [NOME], me responsabilizo pela guarda e integridade do equipamento [HW] a mim confiado em [DATA]..."
                    </div>

                    <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors flex justify-center items-center gap-2">
                        Configurar Termo Padrão <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            {/* MODAL NOVO EMPRÉSTIMO */}
            {isNewOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">Registrar Empréstimo</h2>
                            <button onClick={() => setIsNewOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Equipamento (Ativo a emprestar)</label>
                                <input value={formData.asset_name} onChange={e => setFormData({ ...formData, asset_name: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ex: Notebook Positivo BXP-09" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nome do Solicitante</label>
                                    <input value={formData.borrower_name} onChange={e => setFormData({ ...formData, borrower_name: e.target.value })} type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Responsável local" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Setor/Área</label>
                                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white">
                                        <option value="Administrativo">Administrativo</option>
                                        <option value="Produção">Produção</option>
                                        <option value="Expedição">Expedição</option>
                                        <option value="Recebimento">Recebimento</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Motivo / Observações</label>
                                <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[100px] text-sm" placeholder="Ex: Equipamento de backup emprestado enquanto máquina principal da linha 2 gela no TI..."></textarea>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsNewOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition">Cancelar</button>
                            <button
                                onClick={handleCreateCheckout}
                                disabled={isSaving || !formData.asset_name || !formData.borrower_name}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition flex gap-2 items-center disabled:opacity-70"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                Efetivar Empréstimo
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
