'use client';

import { useUserStore } from '@/store/user';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

const Auth = () => {
  const { login, register } = useUserStore((state) => ({
    login: state.login,
    register: state.register,
  }));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    setProcessing(true);
    setError(null);
    try {
      await register(username, password);
      setProcessing(false);
      setRegistered(true);
    } catch (error: any) {
      setError(error.message);
      setProcessing(false);
    }
  };

  const handleLogin = async () => {
    setError(null);
    try {
      setProcessing(true);
      await login(username, password);
      setProcessing(false);
      redirect('');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-dvh  flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              User Name
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <div className="w-full">
              <button
                disabled={processing}
                onClick={() => {
                  handleRegister();
                }}
                className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm  ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Sign up
              </button>
            </div>
            <div className="w-full">
              <button
                disabled={processing}
                onClick={() => {
                  handleLogin();
                }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
