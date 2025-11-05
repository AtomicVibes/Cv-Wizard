"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAppwriteInstances } from '@/lib/appwrite';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { account } = createAppwriteInstances();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check for an active session first
      await account.get();
      console.log("Session already active, skipping login.");
      router.push('/dashboard');
      return; // Exit if a session is found
    } catch (e: any) {
      // If get() throws an error (User not authenticated), proceed to create session
      if (e.code === 401) {
        try {
          await account.createEmailPasswordSession(email, password);
          router.push('/dashboard');
        } catch (loginError) {
          console.error('Login error:', loginError);
          alert('Login failed. Please check your credentials.');
        }
      } else {
        // Handle other unexpected errors
        console.error("Authentication check failed:", e);
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      margin: 0,
      boxSizing: 'border-box',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%), url(/assets/images/background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'multiply',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(116, 185, 255, 0.6) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        zIndex: -1,
        animation: 'float 15s infinite linear',
        top: '10%',
        left: '10%'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(116, 185, 255, 0.6) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        zIndex: -1,
        animation: 'float 15s infinite linear',
        top: '60%',
        right: '10%',
        animationDelay: '-5s'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(116, 185, 255, 0.6) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        zIndex: -1,
        animation: 'float 15s infinite linear',
        bottom: '20%',
        left: '20%',
        animationDelay: '-10s'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px 30px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          content: '',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(120, 119, 198, 0.3) 0%, transparent 70%)',
          zIndex: -1,
          animation: 'pulse 8s infinite alternate'
        }}></div>

        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #a29bfe, #74b9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>Cv Wizard</h1>
          <p style={{
            fontSize: '14px',
            opacity: 0.7,
            marginTop: '5px'
          }}>Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{
            marginBottom: '25px',
            position: 'relative'
          }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#ddd'
            }}>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor = '#74b9ff';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(116, 185, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.parentElement!.style.transform = 'translateY(-5px)';
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.parentElement!.style.transform = 'translateY(0)';
              }}
            />
          </div>

          <div style={{
            marginBottom: '25px',
            position: 'relative'
          }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#ddd'
            }}>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#74b9ff';
                e.target.style.boxShadow = '0 0 0 2px rgba(116, 185, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(90deg, #6c5ce7, #0984e3)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '25px',
              boxShadow: '0 5px 15px rgba(108, 92, 231, 0.4)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(108, 92, 231, 0.6)';
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(108, 92, 231, 0.4)';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{
            textAlign: 'center',
            fontSize: '14px'
          }}>
            Don&apos;t have an account?{' '}
            <a href="/signup" style={{
              color: '#74b9ff',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.3s'
            }}>Sign up</a>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translate(10px, 10px) scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, 15px) rotate(90deg);
          }
          50% {
            transform: translate(5px, 25px) rotate(180deg);
          }
          75% {
            transform: translate(-5px, 15px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 30px 20px;
          }

          .logo h1 {
            font-size: 24px;
          }

          .input-group input {
            padding: 12px 15px;
          }
        }
      `}</style>
    </div>
  );
}