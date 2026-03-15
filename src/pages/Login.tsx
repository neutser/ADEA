import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const from = redirectParam || (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }
    
    let success = false;
    if (isSignUp) {
      success = await register(email.trim(), password, name.trim());
    } else {
      success = await login(email.trim(), password);
    }

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError(isSignUp ? 'Registration failed. Email might be in use.' : 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div
      className="section"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <User size={48} color="var(--accent-neon-blue)" style={{ margin: '0 auto 16px' }} />
          <h1 className="heading-lg">Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sign in to manage your orders and projects.
          </p>
        </div>

        <form className="card glass-panel fade-in" onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: '#ff4444', fontSize: '0.9rem', marginBottom: 16 }}>{error}</p>
          )}

          {isSignUp && (
            <div className="input-group">
              <label htmlFor="login-name" className="input-label">
                Full Name
              </label>
              <input
                id="login-name"
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="login-email" className="input-label">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '8px' }}>
            <label htmlFor="login-password" className="input-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            {!isSignUp && (
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-neon-purple)' }}>
                Forgot password?
              </a>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}{' '}
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ color: 'var(--text-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
