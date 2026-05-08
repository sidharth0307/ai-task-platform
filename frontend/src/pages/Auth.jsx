import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../helpers/authHelper';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        try {
            if (isLogin) {
                const data = await loginUser(email, password);
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                await registerUser(email, password);
                setIsLogin(true);
                alert('Registration successful. Please log in.');
                setPassword(''); // Clear password field on successful registration
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        {isLogin ? 'Welcome' : 'Create an account'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        {isLogin ? 'Enter your details to access your workspace.' : 'Sign up to start processing tasks.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-rose-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email address</label>
                        <input 
                            id="email"
                            name="email"
                            type="email" 
                            autoComplete="email"
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                        <input 
                            id="password"
                            name="password"
                            type="password" 
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2`}
                    >
                        {isSubmitting ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }} 
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>

            </div>
        </div>
    );
}