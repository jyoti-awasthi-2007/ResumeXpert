import { createContext, useContext, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { motion } from 'framer-motion'
import { Bell, Search, Menu, ChevronDown, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const DashboardLayoutContext = createContext(false)

export default function DashboardLayout({ children, title }) {
    const isNestedLayout = useContext(DashboardLayoutContext)
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const { signOut, user, profile, notifications } = useAuth()
    const [accountOpen, setAccountOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const initials = displayName.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

    if (isNestedLayout) {
        return children
    }

    const pageTitle = title || ({
        '/dashboard': 'Dashboard',
        '/ai-assistant': 'AI Career Assistant',
        '/resume-analysis': 'Resume Analysis',
        '/skills': 'Your Skills',
        '/career-suggestions': 'Career Suggestions',
        '/careers': 'Career Suggestions',
        '/skill-gap': 'Skill Gap Analysis',
        '/recommendations': 'Skill Recommendations',
        '/assessment': 'AI Career Skill Assessment',
        '/assessment/results': 'Assessment Results',
        '/confidence': 'Skill Confidence',
        '/career-readiness': 'Career Readiness',
        '/analytics': 'Results & Analytics',
    })[location.pathname] || ''

    return (
        <DashboardLayoutContext.Provider value>
            <div className="min-h-screen" style={{ background: 'var(--color-surface-secondary)' }}>
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
                    onLogout={signOut}
                />

                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-19' : 'lg:ml-60'}`}>
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="sticky top-0 z-30 bg-surface px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3"
                        style={{ borderRadius: 0, boxShadow: '0 6px 18px rgba(23,32,51,0.04)' }}
                    >
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden w-10 h-10 rounded-xl bg-surface-secondary hover:bg-surface shadow-sm flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-2xl font-semibold text-primary truncate">{pageTitle}</h1>
                                <p className="text-xs text-secondary">ResumeXpert workspace</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative hidden sm:block">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search pages..."
                                    className="w-40 md:w-64 pl-10 pr-4 py-2 bg-surface-secondary border border-surface rounded-xl text-sm text-primary placeholder-secondary focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <button onClick={() => setNotificationsOpen((value) => !value)} className="relative w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface shadow-sm flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer" aria-label="Notifications">
                                <Bell size={18} />
                                {notifications.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">{Math.min(notifications.length, 9)}</span>}
                            </button>
                            <div className="relative"><button onClick={() => setAccountOpen((value) => !value)} title={displayName} className="flex h-9 items-center gap-1 rounded-full bg-primary px-2 text-xs font-semibold text-white shadow-sm"><span>{initials}</span><ChevronDown size={12} /></button>{accountOpen && <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl border border-surface bg-white p-2 shadow-xl"><p className="truncate px-3 py-2 text-xs text-secondary">{user?.email}</p><button onClick={async () => { await signOut(); setAccountOpen(false) }} className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-primary hover:bg-surface-secondary">Log out</button></div>}</div>
                        </div>
                        {notificationsOpen && <div className="absolute right-4 top-16 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-surface bg-white p-4 shadow-xl"><div className="mb-3 flex items-center justify-between"><strong className="text-sm text-primary">Recent activity</strong><button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={15} className="text-secondary" /></button></div>{notifications.length ? <div className="space-y-2">{notifications.map((item) => <div key={item.id} className="rounded-xl bg-surface-secondary px-3 py-2"><p className="text-xs font-semibold text-primary">{item.activity_type.replaceAll('_', ' ')}</p><p className="mt-1 text-[10px] text-secondary">{new Date(item.created_at).toLocaleString()}</p></div>)}</div> : <p className="text-xs text-secondary">Your resume, profile, and assessment updates will appear here.</p>}</div>}
                    </motion.header>

                    <main className="page-shell p-3 sm:p-5 lg:p-6">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </DashboardLayoutContext.Provider>
    )
}
