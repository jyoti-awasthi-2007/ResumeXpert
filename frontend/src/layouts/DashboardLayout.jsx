import { createContext, useContext, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { motion } from 'framer-motion'
import { Bell, Search, Menu } from 'lucide-react'

const DashboardLayoutContext = createContext(false)

export default function DashboardLayout({ children, title }) {
    const isNestedLayout = useContext(DashboardLayoutContext)
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    if (isNestedLayout) {
        return children
    }

    const pageTitle = title || ({
        '/dashboard': 'Dashboard',
        '/resume-analysis': 'Resume Analysis',
        '/skills': 'Your Skills',
        '/career-suggestions': 'Career Suggestions',
        '/careers': 'Career Suggestions',
        '/skill-gap': 'Skill Gap Analysis',
        '/recommendations': 'Skill Recommendations',
        '/assessment': 'AI Career Skill Assessment',
        '/assessment/results': 'Assessment Results',
        '/confidence': 'Skill Confidence',
        '/claim-vs-actual': 'Resume Claim vs Actual Skill',
        '/career-readiness': 'Career Readiness',
        '/analytics': 'Results & Analytics',
        '/settings': 'Settings',
    })[location.pathname] || 'CareerLens AI'

    return (
        <DashboardLayoutContext.Provider value>
            <div className="min-h-screen" style={{ background: 'var(--color-surface-secondary)' }}>
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
                />

                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-22' : 'lg:ml-70'}`}>
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="sticky top-0 z-30 bg-surface px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3"
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
                                <p className="text-sm text-secondary">ResumeXpert workspace</p>
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
                            <button className="relative w-10 h-10 rounded-xl bg-surface-secondary hover:bg-surface shadow-sm flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer">
                                <Bell size={18} />
                            </button>
                            <div className="w-9 h-9 rounded-xl bg-surface-secondary flex items-center justify-center text-primary font-semibold text-sm">
                                JD
                            </div>
                        </div>
                    </motion.header>

                    <main className="page-shell p-4 sm:p-6 lg:p-8">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </DashboardLayoutContext.Provider>
    )
}
