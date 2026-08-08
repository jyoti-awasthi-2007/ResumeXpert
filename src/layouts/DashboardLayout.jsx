import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { motion } from 'framer-motion'
import { Bell, Search, Menu } from 'lucide-react'

export default function DashboardLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-dark-900">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content - offset on large screens only */}
            <div className="lg:ml-[260px] transition-all duration-300">
                {/* Top Bar */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="sticky top-0 z-30 glass-card-strong border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3"
                    style={{ borderRadius: 0 }}
                >
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{title}</h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Search - hidden on very small screens */}
                        <div className="relative hidden sm:block">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-40 md:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <button className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                            JD
                        </div>
                    </div>
                </motion.header>

                {/* Main Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
