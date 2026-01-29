import { motion } from "framer-motion"
import { TreeDeciduous, Github, Twitter } from "lucide-react"
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
                        <Link to="#" className="hover:text-emerald-600 transition-colors">개인정보처리방침</Link>
                        <Link to="#" className="hover:text-emerald-600 transition-colors">이용약관</Link>
                        <Link to="#" className="hover:text-emerald-600 transition-colors">문의하기</Link>
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="#"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                        >
                            <Github className="h-4 w-4" />
                        </Link>
                        <Link
                            to="#"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                        >
                            <Twitter className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-zinc-100 text-center text-sm text-zinc-400">
                    2024 ProjecTree. All rights reserved.
                </div>
            </div>
        </motion.footer>
    )
}
