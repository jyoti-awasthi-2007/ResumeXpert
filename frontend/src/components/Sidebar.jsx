import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    FileText,
    Database,
    Compass,
    Layers,
    Sparkles,
    Shield,
    BarChart3,
    User,
    Settings2,
    ChevronLeft,
    ChevronRight,
    LogOut,
    X,
} from 'lucide-react'
import logo from '../assets/image.png'

const sections = [
    {
        label: 'Main',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        ],
    },
    {
        label: 'Resume',
        items: [
            { name: 'Resume Analysis', icon: FileText, path: '/resume-analysis' },
        ],
    },
    {
        label: 'Skills',
        items: [
            { name: 'Skills', icon: Database, path: '/skills' },
        ],
    },
    {
        label: 'Career',
        items: [
            { name: 'Career Suggestions', icon: Compass, path: '/career-suggestions' },
            { name: 'Skill Gap', icon: Layers, path: '/skill-gap' },
            { name: 'Recommendations', icon: Sparkles, path: '/recommendations' },
        ],
    },
    {
        label: 'Assessment',
        items: [
            { name: 'Skill Assessment', icon: Shield, path: '/assessment' },
            { name: 'Assessment Results', icon: BarChart3, path: '/assessment/results' },
        ],
    },
    {
        label: 'Insights',
        items: [
            { name: 'Skill Confidence', icon: Sparkles, path: '/confidence' },
            { name: 'Claim vs Actual', icon: Shield, path: '/claim-vs-actual' },
            { name: 'Career Readiness', icon: Layers, path: '/career-readiness' },
            { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        ],
    },
    {
        label: 'Account',
        items: [
            { name: 'Profile', icon: User, path: '/profile' },
            { name: 'Settings', icon: Settings2, path: '/settings' },
        ],
    },
]

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
    const navigate = useNavigate()

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{
                    x: 0,
                    width: collapsed ? 88 : 280,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`fixed left-0 top-0 bottom-0 z-50 bg-surface border-r border-surface flex flex-col shadow-[8px_0_30px_rgba(28,91,125,0.06)]
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
                style={{ borderRadius: 0 }}
            >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-5 border-b border-surface`}>
                    {!collapsed && (
                        <div className="flex items-center gap-3 min-w-0">
                            <img src={logo} alt="ResumeXpert" className="w-40 h-auto object-contain" />
                            <div>
                                <p className="text-xs text-secondary">Career intelligence hub</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="lg:hidden w-9 h-9 rounded-xl bg-surface-secondary flex items-center justify-center text-secondary hover:text-primary transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex w-9 h-9 rounded-xl bg-surface-secondary items-center justify-center text-secondary hover:text-primary transition-colors"
                        >
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                    {sections.map((section) => (
                        <div key={section.label} className="space-y-3">
                            {!collapsed && <p className="px-3 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">{section.label}</p>}
                            <div className="space-y-1">
                                    {section.items.map((item, index) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={onClose}
                                        >
                                            {({ isActive }) => (
                                                <div className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors duration-200 ${isActive ? 'bg-surface-secondary text-primary shadow-sm' : 'text-secondary hover:bg-surface-secondary hover:text-primary'}`}>
                                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: isActive ? 'linear-gradient(90deg,var(--grad-1),var(--grad-2))' : 'var(--color-surface-secondary)' }}>
                                                        <item.icon size={16} className={isActive ? 'text-white' : 'text-primary'} />
                                                    </div>
                                                    {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                                                </div>
                                            )}
                                        </NavLink>
                                    ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-surface">
                    <button
                        onClick={() => { navigate('/login'); onClose?.() }}
                        className="flex items-center gap-3 px-3 py-3 w-full rounded-2xl text-secondary hover:text-red-600 hover:bg-surface-secondary transition-colors"
                    >
                        <LogOut size={18} />
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>
        </>
    )
}
