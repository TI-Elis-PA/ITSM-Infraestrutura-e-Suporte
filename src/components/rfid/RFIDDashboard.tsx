/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Search, ChevronDown, Radio, Server, Smartphone, ScanLine, Wifi, Cpu, FileText, CheckCircle2, ChevronRight, MessageSquare, Plus, CheckCircle, BrainCircuit } from "lucide-react";
import { GUIDES_DB, TROUBLESHOOTING_DB, CHAT_KB, HARDWARE_DB } from "@/lib/rfidData";

export default function RFIDDashboard() {
    const [view, setView] = useState<'dashboard' | 'guides' | 'hardware' | 'troubleshooting' | 'guideViewer' | 'ai'>('dashboard');
    const [currentGuide, setCurrentGuide] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <RFIDHome setView={setView} setCurrentGuide={setCurrentGuide} />;
            case 'guides':
                return <RFIDGuides searchQuery={searchQuery} setSearchQuery={setSearchQuery} setView={setView} setCurrentGuide={setCurrentGuide} />;
            case 'hardware':
                return <RFIDHardware />;
            case 'troubleshooting':
                return <RFIDTroubleshooting />;
            case 'guideViewer':
                return <GuideViewer guideId={currentGuide} setView={setView} />;
            case 'ai':
                return <RFIDAssistant />;
            default:
                return <RFIDHome setView={setView} setCurrentGuide={setCurrentGuide} />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">
            {/* Sidebar for RFID */}
            <div className="w-full md:w-64 bg-slate-900 rounded-xl p-4 text-white shadow-lg border border-slate-800 flex flex-col gap-2">
                <div className="mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><ScanLine className="text-indigo-400" /> Sistema RFID</h2>
                    <p className="text-slate-400 text-xs mt-1">Conhecimento e Implantação</p>
                </div>

                <SidebarBtn icon={<Radio size={18} />} label="Painel Principal" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <SidebarBtn icon={<FileText size={18} />} label="Manuais e Guias" active={view === 'guides' || view === 'guideViewer'} onClick={() => setView('guides')} />
                <SidebarBtn icon={<Cpu size={18} />} label="Hardware Homologado" active={view === 'hardware'} onClick={() => setView('hardware')} />
                <SidebarBtn icon={<Server size={18} />} label="Troubleshooting" active={view === 'troubleshooting'} onClick={() => setView('troubleshooting')} />
                <SidebarBtn icon={<BrainCircuit size={18} />} label="Assistente Inteligente" active={view === 'ai'} onClick={() => setView('ai')} />
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto max-h-[800px]">
                {renderView()}
            </div>
        </div>
    );
}

function SidebarBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
            {icon} {label}
        </button>
    );
}

function RFIDHome({ setView, setCurrentGuide }: any) {
    const [diagnosticRunning, setDiagnosticRunning] = useState(false);
    const [diagnosticSteps, setDiagnosticSteps] = useState<string[]>([]);

    const runDiagnostic = () => {
        setDiagnosticRunning(true);
        setDiagnosticSteps(['Conectando ao Middleware via SSH (10.40.50.1)...']);
        
        const sequence = [
            { time: 1000, text: 'Middleware online. Buscando leitores na sub-rede 10.40.50.x...' },
            { time: 2000, text: 'Leitor FX9600 detectado — IP: 10.40.50.122 | Firmware: LNC3.14.0800' },
            { time: 3000, text: 'Testando potência RF — Antena 1 (Esquerda)...' },
            { time: 4000, text: 'Antena 1: Potência de retorno estável — 31.5 dBm ✓' },
            { time: 5000, text: 'Executando inventário de teste (20 tags de referência)...' },
            { time: 6000, text: 'PASSED — Taxa de leitura: 100% | Portal operando dentro do padrão Zero-Defects Elis.' },
        ];

        sequence.forEach((step, idx) => {
            setTimeout(() => {
                setDiagnosticSteps(prev => [...prev, step.text]);
            }, step.time);
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">Visão Geral RFID</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col gap-2">
                    <span className="text-slate-500 font-medium text-sm">Leitores Online</span>
                    <span className="text-3xl font-bold text-indigo-700">42</span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col gap-2">
                    <span className="text-slate-500 font-medium text-sm">Acuracidade Média</span>
                    <span className="text-3xl font-bold text-emerald-700">99.4%</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col gap-2">
                    <span className="text-slate-500 font-medium text-sm">Alertas Críticos</span>
                    <span className="text-3xl font-bold text-amber-700">3</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><ScanLine size={18} className="text-indigo-500"/> Manuais Recentes</h4>
                    <ul className="space-y-3 mt-4">
                        {GUIDES_DB.slice(0, 3).map(g => (
                            <li key={g.id} className="flex justify-between items-center text-sm cursor-pointer hover:bg-slate-50 p-2 rounded" onClick={() => { setCurrentGuide(g.id); setView('guideViewer'); }}>
                                <span className="font-medium text-slate-700">{g.title}</span>
                                <ChevronRight size={14} className="text-slate-400" />
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setView('guides')} className="mt-4 text-sm text-indigo-600 font-medium hover:underline">Ver todos os manuais →</button>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition bg-slate-50">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Radio size={18} className="text-indigo-500"/> Simulação de Diagnóstico</h4>
                    <p className="text-xs text-slate-500 mb-4">Execute um teste simulado em um portal de expedição.</p>
                    
                    {!diagnosticRunning ? (
                        <button onClick={runDiagnostic} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full shadow-sm hover:bg-indigo-700 transition">
                            Executar Diagnóstico de Portal
                        </button>
                    ) : (
                        <div className="bg-slate-900 rounded p-4 text-xs text-green-400 font-mono h-48 overflow-y-auto flex flex-col gap-2">
                            {diagnosticSteps.map((s, i) => (
                                <span key={i} className={s.includes('PASSED') ? 'text-green-300 font-bold text-sm mt-2' : ''}>{'>'} {s}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RFIDGuides({ searchQuery, setSearchQuery, setView, setCurrentGuide }: any) {
    const filteredGuides = GUIDES_DB.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Manuais e SOPs</h3>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar manuais..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {filteredGuides.map(guide => (
                    <div key={guide.id} onClick={() => { setCurrentGuide(guide.id); setView('guideViewer'); }} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm cursor-pointer transition group">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{guide.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{guide.category}</span>
                                    <span>• {guide.readTime}</span>
                                    <span>• Dificuldade: {guide.difficulty}</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition" />
                    </div>
                ))}
                {filteredGuides.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        Nenhum manual encontrado para "{searchQuery}".
                    </div>
                )}
            </div>
        </div>
    );
}

function GuideViewer({ guideId, setView }: any) {
    const guide = GUIDES_DB.find(g => g.id === guideId);
    if (!guide) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setView('guides')} className="text-sm text-indigo-600 font-medium mb-4 flex items-center gap-1 hover:underline">
                <ChevronRight className="rotate-180" size={16} /> Voltar para Manuais
            </button>
            
            <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{guide.category}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-800">{guide.title}</h2>
                <p className="text-slate-600 mt-3 text-lg">{guide.content.intro}</p>
                
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
                    <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Autor: {guide.author}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Tempo: {guide.readTime}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Atualizado: {guide.updated}</span>
                </div>
            </div>

            <div className="space-y-8">
                {guide.content.phases.map((phase, pIdx) => (
                    <div key={pIdx} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                        <h4 className="text-xl font-bold text-slate-800 mb-4">{phase.title}</h4>
                        <div className="space-y-3">
                            {phase.checks.map((check, cIdx) => (
                                <label key={cIdx} className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                                    <span className="text-slate-700 group-hover:text-slate-900 leading-relaxed">{check}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 flex justify-end">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-slate-800 transition">
                    Concluir Checklist
                </button>
            </div>
        </div>
    );
}

function RFIDHardware() {
    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Hardware Homologado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HARDWARE_DB.map((hw, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition group bg-white">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition group-hover:bg-indigo-600 group-hover:text-white">
                            <Cpu size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-2">{hw.name}</h4>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{hw.desc}</p>
                        
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                            {hw.specs.map((spec, sIdx) => (
                                <div key={sIdx} className="flex justify-between text-xs">
                                    <span className="text-slate-500">{spec.label}</span>
                                    <span className="font-bold text-slate-700">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RFIDTroubleshooting() {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Resolução de Problemas (Troubleshooting)</h3>
            <div className="space-y-3">
                {TROUBLESHOOTING_DB.map(item => (
                    <div key={item.id} className={`border rounded-xl overflow-hidden transition-all duration-300 ${openId === item.id ? 'border-indigo-300 shadow-md bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <button 
                            className="w-full flex items-center justify-between p-4 focus:outline-none"
                            onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-black tracking-wider px-2 py-1 rounded uppercase ${item.severity === 'CRÍTICO' ? 'bg-rose-100 text-rose-700' : item.severity === 'MÉDIO' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {item.severity}
                                </span>
                                <h4 className="font-bold text-slate-800 text-left">{item.title}</h4>
                            </div>
                            <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {openId === item.id && (
                            <div className="p-4 pt-0 border-t border-slate-100/50">
                                <p className="text-slate-600 text-sm leading-relaxed mt-4">{item.solution}</p>
                                <div className="flex gap-2 mt-4">
                                    {item.tags.map(t => (
                                        <span key={t} className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded">{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function RFIDAssistant() {
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
        { role: 'ai', text: 'Olá! Sou o Assistente de Conhecimento RFID. Pergunte-me sobre instalações, troubleshooting, hardware e configurações.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        
        const userText = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const lower = userText.toLowerCase();
            let response = '';

            for (const [keyword, answer] of Object.entries(CHAT_KB)) {
                if (lower.includes(keyword)) {
                    response = answer;
                    break;
                }
            }

            if (!response) {
                const guideMatch = GUIDES_DB.find(g =>
                    lower.includes(g.title.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase()) ||
                    g.category.toLowerCase().includes(lower)
                );
                if (guideMatch) {
                    response = `Encontrei o manual **"${guideMatch.title}"** que pode ajudar. ${guideMatch.description}. Você pode encontrá-lo na seção de Manuais.`;
                } else {
                    response = 'Não encontrei essa informação na base local. Tente reformular sua pergunta com termos como: **FX9600**, **antena**, **expurgo**, **interferência**, **TC26** ou **middleware**.';
                }
            }

            setMessages(prev => [...prev, { role: 'ai', text: response }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[500px]">
            <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2"><BrainCircuit className="text-indigo-500"/> Assistente Inteligente</h3>
            <p className="text-slate-500 text-sm mb-6">Consulte o acervo técnico conversando com a IA.</p>
            
            <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-slate-50">
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                                {/* Simple markdown bold parse for UI */}
                                {msg.text.split('**').map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 text-slate-500 p-3 rounded-2xl rounded-tl-sm text-xs flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Digite sua dúvida técnica..." 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button onClick={handleSend} className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition">
                        <MessageSquare size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
