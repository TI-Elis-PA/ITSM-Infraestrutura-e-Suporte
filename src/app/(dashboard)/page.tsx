"use client";

import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Server,
    Archive,
    ServerCrash,
    Activity,
    Wrench,
    FileText,
    Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WarRoomDashboard() {
    const [stats, setStats] = useState({
        activeAssets: 0,
        maintenanceAssets: 0,
        lowStockItems: 0
    });
    const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [networkHealth, setNetworkHealth] = useState({
        health: 99.9,
        status: 'Analisando...',
        latency: 0,
        isUp: true
    });

    useEffect(() => {
        const fetchNetworkHealth = async () => {
            try {
                const res = await fetch('/api/network');
                const data = await res.json();
                setNetworkHealth(data);
            } catch (error) {
                console.error("Erro ao checar rede", error);
            }
        };

        // Fetch inicial e depois a cada 5 segundos
        fetchNetworkHealth();
        const interval = setInterval(fetchNetworkHealth, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            const { count: activeCount } = await supabase
                .from('ativos')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Ativo');

            const { data: maintenanceData, count: maintenanceCount } = await supabase
                .from('ativos')
                .select('*', { count: 'exact' })
                .eq('status', 'Manutenção');

            const { data: lowStockData, count: lowStockCount } = await supabase
                .from('almoxarifado')
                .select('*', { count: 'exact' })
                .lte('qty', 5);

            setStats({
                activeAssets: activeCount || 0,
                maintenanceAssets: maintenanceCount || 0,
                lowStockItems: lowStockCount || 0
            });

            const alerts: any[] = [];
            if (maintenanceData) {
                maintenanceData.forEach(item => {
                    alerts.push({
                        id: `m_${item.id}`,
                        title: `Equipamento em Manutenção: ${item.name}`,
                        desc: `Categoria: ${item.category} | Obs: ${item.condition}`,
                        priority: 'Crítica'
                    });
                });
            }
            if (lowStockData) {
                lowStockData.filter(i => i.qty <= i.min_qty).forEach(item => {
                    alerts.push({
                        id: `s_${item.id}`,
                        title: `Estoque Baixo ou Zerado: ${item.name}`,
                        desc: `Apenas ${item.qty} ${item.unit} em estoque (Mínimo: ${item.min_qty}).`,
                        priority: 'Normal'
                    });
                });
            }

            setRecentAlerts(alerts);
            setIsLoading(false);
        };

        fetchDashboardData();
    }, []);

    const handleGenerateReport = async () => {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text("Report Executivo - ITSM", 20, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Data: ${new Date().toLocaleString('pt-BR')}`, 20, 28);
        
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 32, 190, 32);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Ativos em Operação: ${stats.activeAssets}`, 20, 45);
        doc.text(`Ativos em Manutenção: ${stats.maintenanceAssets}`, 20, 55);
        doc.text(`Almoxarifado (Estoque Baixo): ${stats.lowStockItems}`, 20, 65);
        doc.text(`Saúde da Rede: ${networkHealth.health.toFixed(1)}% (${networkHealth.status})`, 20, 75);
        
        doc.setFont('helvetica', 'bold');
        doc.text("Fila de Atenção (Top Pendências):", 20, 95);
        
        doc.setFont('helvetica', 'normal');
        let y = 105;
        if (recentAlerts.length === 0) {
            doc.text("Nenhuma pendência crítica. Operação nominal.", 20, y);
        } else {
            recentAlerts.forEach(alert => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                const text = `[${alert.priority}] ${alert.title} - ${alert.desc}`;
                const lines = doc.splitTextToSize(text, 170);
                doc.text(lines, 20, y);
                y += lines.length * 7;
            });
        }
        
        doc.save(`Report_Executivo_ITSM_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="p-8 space-y-8">

            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <Activity className="text-indigo-500" />
                        Dashboard de Operações
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Visão geral em tempo real da Planta Industrial Principal</p>
                </div>
                <button 
                    onClick={handleGenerateReport}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                    <FileText size={18} />
                    Gerar Report Executivo
                </button>
            </div>

            {/* KPIs Principais (Cards de Topo) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Ativos em Operação"
                    value={isLoading ? "..." : stats.activeAssets.toString()}
                    icon={<Server className="text-emerald-500" size={24} />}
                    trend="Estáveis e ativos"
                    trendColor="text-emerald-600"
                />
                <KPICard
                    title="Estoque Baixo/Crítico"
                    value={isLoading ? "..." : stats.lowStockItems.toString()}
                    icon={<Archive className="text-amber-500" size={24} />}
                    trend="Itens do almoxarifado"
                    trendColor="text-amber-600"
                    alert={stats.lowStockItems > 0}
                />
                <KPICard
                    title="Ativos em Manutenção"
                    value={isLoading ? "..." : stats.maintenanceAssets.toString()}
                    icon={<Wrench className="text-rose-600" size={24} />}
                    trend="Impacto operacional"
                    trendColor="text-rose-600"
                    alert={stats.maintenanceAssets > 0}
                />
                <KPICard
                    title="Saúde da Rede"
                    value={networkHealth.health.toFixed(1) + "%"}
                    icon={
                        <div className="relative">
                            <Activity className={networkHealth.isUp ? "text-indigo-500" : "text-rose-500"} size={24} />
                            {networkHealth.isUp && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                            )}
                        </div>
                    }
                    trend={networkHealth.status + (networkHealth.latency ? ` (${networkHealth.latency}ms)` : '')}
                    trendColor={networkHealth.isUp ? (networkHealth.health < 99 ? "text-amber-600" : "text-indigo-600") : "text-rose-600"}
                    alert={!networkHealth.isUp}
                />
            </div>

            {/* Corpo Principal: Painel de Alertas */}
            <div className="grid grid-cols-1 gap-6">

                {/* Fila de Atenção / Ação Imediata */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/5 blur-2xl -z-10 rounded-full pointer-events-none"></div>
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-5">
                        <AlertTriangle className="text-rose-500" size={20} />
                        Fila de Atenção
                    </h2>

                    <div className="space-y-3 flex-1">
                        {isLoading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
                        ) : recentAlerts.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm font-medium">Nenhum alerta de infraestrutura no momento! Operação nominal.</div>
                        ) : recentAlerts.map(alert => (
                            <AlertItem
                                key={alert.id}
                                icon={<AlertTriangle className={alert.priority === 'Crítica' ? "text-rose-500" : "text-amber-500"} size={18} />}
                                title={alert.title}
                                desc={alert.desc}
                                urgent={alert.priority === 'Crítica'}
                                warning={alert.priority === 'Normal'}
                            />
                        ))}
                    </div>

                    <button className="w-full mt-6 py-2.5 text-sm text-indigo-600 font-medium bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
                        Ver todas as pendências
                    </button>
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// Componentes Auxiliares
// --------------------------------------------------------

function KPICard({ title, value, icon, trend, trendColor, alert = false }: any) {
    return (
        <div className={`glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${alert ? 'ring-1 ring-rose-400/50 shadow-[0_0_20px_rgba(225,29,72,0.15)]' : 'hover:shadow-lg'}`}>
            {alert && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>}
            {!alert && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>}

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
                    <h3 className="text-4xl font-black text-slate-800 mt-2 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3.5 rounded-2xl shadow-sm ${alert ? 'bg-gradient-to-br from-rose-100 to-rose-200' : 'bg-gradient-to-br from-slate-100 to-slate-200'}`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>
            </div>
        </div>
    );
}

function AlertItem({ icon, title, desc, urgent = false, warning = false }: any) {
    let bgColors = "bg-slate-50 border-slate-100 hover:border-slate-200";
    let titleColor = "text-slate-700";

    if (urgent) {
        bgColors = "bg-rose-50/50 border-rose-200 hover:border-rose-300";
        titleColor = "text-rose-800";
    } else if (warning) {
        bgColors = "bg-amber-50/50 border-amber-200 hover:border-amber-300";
        titleColor = "text-amber-800";
    }

    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${bgColors} flex gap-4 items-start group hover:shadow-md hover:-translate-y-0.5`}>
            <div className={`mt-0.5 p-2 rounded-xl shadow-sm border ${urgent ? 'border-rose-200 bg-white' : warning ? 'border-amber-200 bg-white' : 'border-slate-200 bg-white'}`}>
                {icon}
            </div>
            <div>
                <p className={`text-sm font-bold ${titleColor}`}>{title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
