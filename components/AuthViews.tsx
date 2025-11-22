
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthViewProps {
  onViewChange: (view: 'login' | 'signup' | 'landing') => void;
}

export const LoginView: React.FC<AuthViewProps> = ({ onViewChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation handled by App.tsx observing user state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="glass-panel bg-white/80 dark:bg-gray-800/80 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl animate-pop">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">مرحباً بعودتك</h1>
            <p className="text-gray-500 dark:text-gray-400">أكمل رحلتك الريادية مع نموذج بدرية</p>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-2xl text-sm mb-6 text-center border border-red-100 dark:border-red-800">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                    dir="ltr"
                    placeholder="name@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                    dir="ltr"
                    placeholder="••••••••"
                />
            </div>
            
            <button 
                type="submit" 
                disabled={isLoading}
                className="btn-liquid-primary w-full py-3 px-4 font-bold rounded-2xl flex justify-center text-lg group"
            >
                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'تسجيل الدخول'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟ {' '}
            <button onClick={() => onViewChange('signup')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                أنشئ حساباً جديداً
            </button>
        </div>
        <div className="mt-4 text-center">
            <button onClick={() => onViewChange('landing')} className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
                العودة للرئيسية
            </button>
        </div>
      </div>
    </div>
  );
};

export const SignupView: React.FC<AuthViewProps> = ({ onViewChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signup(name, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="glass-panel bg-white/80 dark:bg-gray-800/80 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl animate-pop">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-2">حساب جديد</h1>
            <p className="text-gray-500 dark:text-gray-400">ابدأ رحلة التعلم والريادة اليوم</p>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-2xl text-sm mb-6 text-center border border-red-100 dark:border-red-800">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم الكامل</label>
                <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                    dir="ltr"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                    dir="ltr"
                />
            </div>
            
            <button 
                type="submit" 
                disabled={isLoading}
                className="btn-liquid-primary w-full py-3 px-4 font-bold rounded-2xl flex justify-center text-lg group"
            >
                 {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'إنشاء حساب'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟ {' '}
            <button onClick={() => onViewChange('login')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                تسجيل الدخول
            </button>
        </div>
        <div className="mt-4 text-center">
            <button onClick={() => onViewChange('landing')} className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
                العودة للرئيسية
            </button>
        </div>
      </div>
    </div>
  );
};
