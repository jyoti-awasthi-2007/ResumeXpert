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
    Bot,
    ChevronLeft,
    ChevronRight,
    LogOut,
    X,
} from 'lucide-react'
import BrandLockup from './BrandLockup'

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
    { name: 'Resume Analysis', icon: FileText, path: '/resume-analysis' },
    { name: 'Skills', icon: Database, path: '/skills' },
    { name: 'Career Suggestions', icon: Compass, path: '/career-suggestions' },
    { name: 'Skill Gap', icon: Layers, path: '/skill-gap' },
    { name: 'Recommendations', icon: Sparkles, path: '/recommendations' },
    { name: 'Skill Assessment', icon: Shield, path: '/assessment' },
    { name: 'Assessment Results', icon: BarChart3, path: '/assessment/results' },
    { name: 'Skill Confidence', icon: Sparkles, path: '/confidence' },
    { name: 'Career Readiness', icon: Layers, path: '/career-readiness' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Profile', icon: User, path: '/profile' },
]

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse, onLogout }) {
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
                    width: collapsed ? 76 : 240,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`fixed left-0 top-0 bottom-0 z-50 bg-surface border-r border-surface flex flex-col shadow-[8px_0_30px_rgba(28,91,125,0.06)]
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
                style={{ borderRadius: 0 }}
            >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-5 border-b border-surface`}>
                    {!collapsed && (
                        <BrandLockup compact />
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

                <nav className="flex-1 overflow-y-auto py-3 px-2">
                    <div className="space-y-1">
                                    {navItems.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={onClose}
                                        >
                                            {({ isActive }) => (
                                                    <div className={`flex items-center gap-3 px-2.5 py-2 rounded-xl transition-colors duration-200 ${isActive ? 'bg-surface-secondary text-primary shadow-sm' : 'text-secondary hover:bg-surface-secondary hover:text-primary'}`}>
                                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: isActive ? 'linear-gradient(90deg,var(--grad-1),var(--grad-2))' : 'var(--color-surface-secondary)' }}>
                                                        <item.icon size={16} className={isActive ? 'text-white' : 'text-primary'} />
                                                    </div>
                                                    {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                                                </div>
                                            )}
                                        </NavLink>
                                    ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-surface">
                    <button
                        onClick={async () => { await onLogout?.(); navigate('/login'); onClose?.() }}
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
