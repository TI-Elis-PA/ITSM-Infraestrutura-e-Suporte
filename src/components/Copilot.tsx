"use client";

import React, { useState } from 'react';
import { Bot, X, Send, Cpu, Zap, ServerCrash, ShieldCheck, Wrench } from 'lucide-react';

export default function Copilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Olá, Admin! Sou o seu Copiloto de Infraestrutura. Como posso ajudar com a operação hoje?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        // Adiciona a msg do usuário
        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Mock AI answer
        setTimeout(() => {
            let reply = "Estou escaneando as dependências. Um momento...";
            if (input.toLowerCase().includes('ping') || input.toLowerCase().includes('offline')) {
                reply = "Detectei que o RACK PRODUÇÃO (SW2) no Galpão 3 está inacessível. O tempo de resposta (Ping) falhou às 14:02. Recomendo abrir chamado de prioridade Crítica para a equipe de Manutenção Elétrica verificar a energia no quadro local.";
            } else if (input.toLowerCase().includes('nobreak') || input.toLowerCase().includes('bateria')) {
                reply = "Verifiquei que o SLA de troca de bateria do Nobreak Central (TI) venceu há 3 dias. Deseja que eu gere uma requisição de serviço para a TecnoService automaticamente?";
            } else if (input.toLowerCase().includes('impressora')) {
                reply = "As zebras da Expedição (Global Print) estão consumindo 20% a mais de ribbon nesta semana. Sugiro verificar a calibragem do sensor térmico no próximo turno.";
            }

            setMessages(prev => [...prev, { role: 'ai', text: reply }]);
        }, 1200);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Botão de Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-105 ${isOpen ? 'bg-slate-800' : 'bg-gradient-to-br from-indigo-600 to-purple-600 animate-pulse-glow shadow-[0_0_20px_rgba(99,102,241,0.5)]'}`}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </button>

            {/* Painel do Chat */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-300 mb-4 border border-indigo-500/20">

                    {/* Header do Bot */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-wide">ITSM Copilot</h3>
                            <p className="text-[10px] text-indigo-100 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online & Monitorando
                            </p>
                        </div>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'ai' ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Prompts Sugeridos */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                            <PromptPill icon={<ServerCrash size={12} />} text="Verificar links offline" onClick={() => setInput("Quais equipamentos estão offline?")} />
                            <PromptPill icon={<Wrench size={12} />} text="Status Nobreaks" onClick={() => setInput("Analisar baterias dos Nobreaks")} />
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Pergunte ao Copiloto..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                        <button
                            onClick={handleSend}
                            className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shrink-0"
                        >
                            <Send size={16} className="ml-0.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function PromptPill({ text, icon, onClick }: { text: string, icon: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-indigo-100 transition-colors"
        >
            {icon} {text}
        </button>
    );
}
