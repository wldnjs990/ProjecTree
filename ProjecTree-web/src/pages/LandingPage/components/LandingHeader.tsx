import { motion } from 'framer-motion';
import { TreeDeciduous } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAccessToken } from '@/stores/authStore';

export default function LandingHeader() {
  const accessToken = useAccessToken();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 border border-emerald-500/30 transition-all duration-300 group-hover:bg-emerald-600/30"
            style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}
          >
            <TreeDeciduous className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-lg font-semibold text-white">ProjecTree</span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!accessToken && (
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              >
                로그인
              </Button>
            </Link>
          )}
          {/* TODO 로그아웃 API 필요 */}
          {accessToken && (
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            >
              로그아웃
            </Button>
          )}
          <Link to="/workspace-lounge">
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300"
              style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}
            >
              시작하기
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
