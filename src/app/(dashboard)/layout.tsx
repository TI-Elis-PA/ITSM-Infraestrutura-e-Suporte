import Link from "next/link";
import {
    Server,
    Headset,
    Home,
    FileText,
    Book,
    Handshake,
    ShieldAlert,
    Calendar,
    Archive
} from "lucide-react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen bg-slate-50/50">
            {/* Siderbar - Premium Dark Tech */}
            <aside className="w-72 glass-dark flex flex-col text-slate-300 relative overflow-hidden z-20">
                {/* Tech Glowing Orb */}
                <div className="absolute top-0 left-0 w-full h-40 bg-indigo-600/20 blur-3xl -z-10 pointer-events-none"></div>

                {/* Logo Area */}
                <div className="p-6 border-b border-slate-700/50 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            <Server className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">ITSM<span className="text-indigo-400">Pro</span></h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">Control Center</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
                    <SidebarLink href="/" icon={<Home size={20} />} label="Dashboard Principal" />
                    <SidebarLink href="/ativos" icon={<Server size={20} />} label="Inventário & Hardware" />
                    <SidebarLink href="/chamados" icon={<Headset size={20} />} label="Helpdesk Central" />
                    <SidebarLink href="/checkout" icon={<Handshake size={20} />} label="Gestão de Empréstimos" />
                    <SidebarLink href="/almoxarifado" icon={<Archive size={20} />} label="Almoxarifado TI" />
                    <SidebarLink href="/wiki" icon={<Book size={20} />} label="Base de Conhecimento" />
                    <SidebarLink href="/slas" icon={<Calendar size={20} />} label="Contratos & Lifecycle" />
                    <SidebarLink href="/automações" icon={<ShieldAlert size={20} />} label="Centro de Alertas & IA" />

                    <div className="pt-4 pb-2">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Relatórios</p>
                    </div>
                    <SidebarLink href="/relatorios" icon={<FileText size={20} />} label="Report Executivo" />
                </nav>

                {/* Status Server Inline */}
                <div className="mx-4 mb-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-emerald-400">All Systems Normal</p>
                        <p className="text-[10px] text-slate-400">Planta Industrial v1.2</p>
                    </div>
                </div>

                {/* Bottom User Area */}
                <div className="p-4 m-4 mt-0 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-3 hover:bg-slate-800 transition-colors cursor-pointer relative z-10 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all">
                        TI
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-200">Admin Local</p>
                        <p className="text-xs text-indigo-400 font-medium tracking-wide">SysAdmin</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative z-10 transition-all">
                <div className="max-w-[1600px] mx-auto min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-indigo-500/10 hover:text-white group border border-transparent hover:border-indigo-500/20"
        >
            <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">
                {icon}
            </div>
            <span className="font-medium text-sm tracking-wide">{label}</span>
        </Link>
    );
}
