import { motion } from "framer-motion"
import { TreeDeciduous } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingFooter() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative border-t border-zinc-200 bg-white"
        >
            {/* Subtle glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] rounded-full bg-emerald-100/50 blur-[100px]" />

            <div className="relative mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200"
                            style={{ boxShadow: "0 0 15px rgba(16, 185, 129, 0.1)" }}
                        >
                            <TreeDeciduous className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-lg font-bold text-zinc-900">ProjecTree</span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-8 text-sm text-zinc-500 font-medium">
                        <span>SSAFY 14기 공통프로젝트 D107 We Are Groot</span>
                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-zinc-100 text-center text-sm text-zinc-400">
                    2026 ProjecTree. All rights reserved.
                </div>
            </div>
        </motion.footer>
    )
}
