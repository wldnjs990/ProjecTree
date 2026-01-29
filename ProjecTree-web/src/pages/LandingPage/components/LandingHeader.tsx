import { motion } from "framer-motion"
import { TreeDeciduous } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function LandingHeader() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl"
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200 transition-all duration-300 group-hover:bg-emerald-200"
                        style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.15)" }}
                    >
                        <TreeDeciduous className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-lg font-bold text-zinc-900 tracking-tight">ProjecTree</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="#features" className="text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors">
                        기능 소개
                    </Link>
                    <Link to="#pricing" className="text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors">
                        가격 정책
                    </Link>
                    <Link to="#docs" className="text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors">
                        문서
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Link to="/login">
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
                            로그인
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button
                            size="sm"
                            className="bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-200/50"
                        >
                            시작하기
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.header>
    )
}
