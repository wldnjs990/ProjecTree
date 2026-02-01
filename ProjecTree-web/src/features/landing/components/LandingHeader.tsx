import { motion } from 'framer-motion';
import { TreeDeciduous } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { logout } from '@/apis/oauth.api';

export function LandingHeader() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200"
            style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)' }}
          >
            <TreeDeciduous className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-lg font-bold text-zinc-900 tracking-tight">
            ProjecTree
          </span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {accessToken ? (
            <>
              <Link to="/workspace-lounge">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                >
                  워크스페이스
                </Button>
              </Link>

              <Button
                size="sm"
                onClick={handleLogout}
                className="bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-200/50"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-200/50"
              >
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
