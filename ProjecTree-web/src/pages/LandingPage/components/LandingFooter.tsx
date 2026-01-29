import { motion } from 'framer-motion';
import { TreeDeciduous, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative border-t border-zinc-800/50 bg-zinc-950"
    >
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] rounded-full bg-emerald-600/5 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 border border-emerald-500/30"
              style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)' }}
            >
              <TreeDeciduous className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-lg font-semibold text-white">ProjecTree</span>
          </Link>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/wldnjs990"
              target="blank"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-800/50 text-center text-sm text-zinc-600">
          2024 ProjecTree. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}
