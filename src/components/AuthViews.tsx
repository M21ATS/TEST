
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthViewProps {
  onViewChange: (view: 'login' | 'signup' | 'landing') => void;
}

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const validatePassword = (password: string) => {
  return password.length >= 6;
};
const validateName = (name: string) => {
  return name.trim().length >= 3;
};

// Shared Password Input Component with Toggle INSIDE but Forced LTR
const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder, 
  label 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;
  label: string;
}) => {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        {/* Force LTR so the eye icon stays on the right regardless of Arabic/English */}
        <div className="relative" dir="ltr">
            <input 
                type={show ? "text" : "password"} 
                required 
                value={value} 
                onChange={onChange} 
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm pr-12 text-left" 
                placeholder={placeholder || "••••••••"}
            />
            <button 
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors z-10 p-1"
                title={show ? t('auth.hide') : t('auth.show')}
            >
                {show ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
            </button>
        </div>
    </div>
  );
};

export const LoginView: React.FC<AuthViewProps> = ({ onViewChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
        setError(t('auth.errors.emailInvalid'));
        return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(t('auth.errors.userNotFound'));
      } else {
        setError(t('auth.errors.generic'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="glass-panel bg-white/80 dark:bg-gray-800/80 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl animate-pop">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('auth.welcomeBackSub')}</p>
        </div>
        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-2xl text-sm mb-6 text-center border border-red-100 dark:border-red-800">
                {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('auth.email')}</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm text-left" dir="ltr" placeholder="name@example.com" />
            </div>
            
            <PasswordInput 
                label={t('auth.password')} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />

            <button type="submit" disabled={isLoading} className="btn-liquid-primary w-full py-3 px-4 font-bold rounded-2xl flex justify-center text-lg group">
                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t('auth.loginBtn')}
            </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.noAccount')} <button onClick={() => onViewChange('signup')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t('auth.createAccount')}</button>
        </div>
        <div className="mt-4 text-center">
            <button onClick={() => onViewChange('landing')} className="text-gray-400 hover:text-gray-600 text-xs transition-colors">{t('auth.backHome')}</button>
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
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateName(name)) { setError(t('auth.errors.nameShort')); return; }
    if (!validateEmail(email)) { setError(t('auth.errors.emailInvalid')); return; }
    if (!validatePassword(password)) { setError(t('auth.errors.passwordWeak')); return; }
    setIsLoading(true);
    try {
      await signup(name, email, password);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError(t('auth.errors.emailInUse'));
      else setError(t('auth.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="glass-panel bg-white/80 dark:bg-gray-800/80 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl animate-pop">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-2">{t('auth.signupTitle')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('auth.signupSub')}</p>
        </div>
        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-2xl text-sm mb-6 text-center border border-red-100 dark:border-red-800">
                {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('auth.name')}</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm" placeholder={t('auth.namePlaceholder')} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('auth.email')}</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm text-left" dir="ltr" placeholder="user@example.com" />
            </div>
            
            <PasswordInput 
                label={t('auth.password')} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />

            <button type="submit" disabled={isLoading} className="btn-liquid-primary w-full py-3 px-4 font-bold rounded-2xl flex justify-center text-lg group">
                 {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t('auth.createAccount')}
            </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.haveAccount')} <button onClick={() => onViewChange('login')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t('auth.loginBtn')}</button>
        </div>
        <div className="mt-4 text-center">
            <button onClick={() => onViewChange('landing')} className="text-gray-400 hover:text-gray-600 text-xs transition-colors">{t('auth.backHome')}</button>
        </div>
      </div>
    </div>
  );
};
