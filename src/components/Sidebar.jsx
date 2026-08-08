import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
    LayoutDashboard, Upload, FileCheck, Brain, ClipboardCheck,
    ShieldCheck, BarChart3, UserCheck, Users, ChevronLeft,
    ChevronRight, LogOut, Shield, X
} from 'lucide-react'

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Upload Resume', icon: Upload, path: '/upload-resume' },
    { name: 'Certificates', icon: FileCheck, path: '/certificate-analysis' },
    { name: 'AI Interview', icon: Brain, path: '/ai-interview' },
    { name: 'Skill Test', icon: ClipboardCheck, path: '/skill-test' },
    { name: 'Integrity', icon: ShieldCheck, path: '/integrity-monitor' },
    { name: 'Results', icon: BarChart3, path: '/results' },
    { name: 'Profile', icon: UserCheck, path: '/profile' },
    { name: 'Recruiter', icon: Users, path: '/recruiter' },
]

export default function Sidebar({ open, onClose }) {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{
                    x: 0,
                    width: collapsed ? 80 : 260,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`fixed left-0 top-0 bottom-0 z-50 glass-card-strong border-r border-white/5 flex flex-col
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
                style={{ borderRadius: 0 }}
            >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-white/5`}>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-lg gradient-text">VerifyAI</span>
                        </motion.div>
                    )}
                    <div className="flex items-center gap-1">
                        {/* Mobile close button */}
                        <button
                            onClick={onClose}
                            className="lg:hidden w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                        {/* Desktop collapse button */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-1">
                    {menuItems.map((item, i) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                                    ? 'bg-primary/20 text-white shadow-[0_0_20px_rgba(108,92,231,0.15)]'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                } ${collapsed ? 'lg:justify-center' : ''}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-linear-to-b from-primary to-accent rounded-r-full"
                                        />
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <item.icon size={20} />
                                    </motion.div>
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="text-sm font-medium whitespace-nowrap"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-white/5">
                    <button
                        onClick={() => { navigate('/login'); onClose?.() }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full cursor-pointer ${collapsed ? 'lg:justify-center' : ''}`}
                    >
                        <LogOut size={20} />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>
        </>
    )
}
