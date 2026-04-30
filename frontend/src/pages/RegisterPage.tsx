import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { RegisterPayload } from '../types';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      setError(null);
      await registerUser(data);
      navigate('/');
    } catch (err: any) {
      // Handle array of errors or string detail from DRF
      const errMsg = err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to create account.';
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3 mb-6">
          <CheckCircle className="w-10 h-10 text-primary-500" />
          <h2 className="text-3xl font-extrabold text-white tracking-tight">ProManage</h2>
        </div>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-100">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="label">First Name</label>
                <div className="mt-1">
                  <input
                    id="first_name"
                    type="text"
                    {...register('first_name')}
                    className={`input ${errors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.first_name && <p className="mt-1.5 text-sm text-red-400">{errors.first_name.message}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="last_name" className="label">Last Name</label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    type="text"
                    {...register('last_name')}
                    className={`input ${errors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.last_name && <p className="mt-1.5 text-sm text-red-400">{errors.last_name.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className={`input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center btn-primary"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center btn-secondary"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
