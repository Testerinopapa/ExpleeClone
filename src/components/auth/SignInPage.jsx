import React, { useState, useEffect } from 'react';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';
import { supabase } from '../../integrations/supabase/client';
import EmailVerificationPage from './EmailVerificationPage';

export default function SignInPage({ initialMode }) {
  const { navigate, authMode, currentPath } = useNavigation();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isVerificationInitial =
    initialMode === 'verification-code' ||
    authMode === 'verification-code' ||
    (typeof window !== 'undefined' &&
      (window.location.pathname.toLowerCase().includes('/verification-code') ||
       window.location.pathname.toLowerCase().includes('/verify-email') ||
       window.location.hash.toLowerCase().includes('verification-code')));

  const isRegisterInitial =
    initialMode === 'register' ||
    authMode === 'register' ||
    (typeof window !== 'undefined' &&
      (window.location.pathname.toLowerCase().includes('/register') ||
       window.location.pathname.toLowerCase().includes('/create-account') ||
       window.location.hash.toLowerCase().includes('register')));

  const [mode, setMode] = useState(
    isVerificationInitial ? 'verification-code' : isRegisterInitial ? 'register' : 'sign-in'
  );

  // Synchronize mode if navigation/history updates
  useEffect(() => {
    const isVer =
      authMode === 'verification-code' ||
      (typeof window !== 'undefined' &&
        (window.location.pathname.toLowerCase().includes('/verification-code') ||
         window.location.pathname.toLowerCase().includes('/verify-email') ||
         window.location.hash.toLowerCase().includes('verification-code')));
    if (isVer) {
      setMode('verification-code');
      return;
    }
    const isReg =
      authMode === 'register' ||
      (typeof window !== 'undefined' &&
        (window.location.pathname.toLowerCase().includes('/register') ||
         window.location.pathname.toLowerCase().includes('/create-account') ||
         window.location.hash.toLowerCase().includes('register')));
    setMode(isReg ? 'register' : 'sign-in');
  }, [authMode, currentPath]);

  // If already signed in (e.g. returning from LinkedIn), leave the login page
  useEffect(() => {
    if (!supabase?.auth) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) navigate(PRODUCT_ROUTES.AUTO_GTM);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate(PRODUCT_ROUTES.AUTO_GTM);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  // Dynamic document title
  useEffect(() => {
    if (mode === 'verification-code') {
      document.title = 'Verify your email';
    } else if (mode === 'register') {
      document.title = 'Create your account';
    } else {
      document.title = 'Sign in to your account';
    }
  }, [mode]);

  const toggleMode = (targetMode) => {
    setMode(targetMode);
    const search = window.location.search || '';
    if (targetMode === 'verification-code') {
      navigate(PRODUCT_ROUTES.VERIFICATION_CODE + search);
    } else if (targetMode === 'register') {
      navigate(PRODUCT_ROUTES.REGISTER + search);
    } else {
      navigate(PRODUCT_ROUTES.SIGN_IN + search);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_email', email);
    }

    try {
      if (supabase?.auth?.signInWithOtp) {
        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin + PRODUCT_ROUTES.AUTO_GTM,
            shouldCreateUser: true,
          },
        });
      }
    } catch (err) {
      console.warn('Supabase OTP notification:', err);
    }

    setIsLoading(false);
    if (mode === 'register') {
      const search = window.location.search || '';
      const params = new URLSearchParams(search);
      params.set('email', email);
      navigate(PRODUCT_ROUTES.VERIFICATION_CODE + '?' + params.toString());
    } else {
      setSubmitted(true);
      navigate(PRODUCT_ROUTES.AUTO_GTM);
    }
  };

  if (mode === 'verification-code') {
    return <EmailVerificationPage email={email} onBack={() => toggleMode('register')} />;
  }

  const handleLinkedInSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: window.location.origin + PRODUCT_ROUTES.AUTO_GTM,
        },
      });
      if (error) {
        console.error('LinkedIn auth error:', error.message);
      }
    } catch (err) {
      console.error('LinkedIn auth exception:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans antialiased">
      {/* Centered Modal Card */}
      <main className="w-full max-w-[540px] min-h-[540px] bg-[#111111] border border-white/[0.06] rounded-2xl shadow-[0px_25px_80px_0px_rgba(0,0,0,0.6)] px-6 py-10 sm:px-[70px] sm:py-[46px] flex flex-col items-center justify-center relative">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          
          {/* Header Section */}
          <div className="w-full flex flex-col items-center mb-6">
            {/* Explee Logo */}
            <div className="mb-3 flex justify-center items-center h-10">
              <svg width="143" height="40" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
                <rect y="16" width="12" height="6" transform="rotate(-90 0 16)" fill="white" fillOpacity="0.48" />
                <rect x="6" y="22" width="6" height="12" transform="rotate(-90 6 22)" fill="white" fillOpacity="0.48" />
                <rect x="12" y="10" width="6" height="6" transform="rotate(-90 12 10)" fill="#00FBBC" />
                <path d="M25.2 15.88C25.2 12.016 27.504 9.832 30.912 9.832C34.44 9.832 36.744 11.968 36.744 15.664V16.432H27.264C27.336 18.76 28.56 20.536 31.032 20.536C33.072 20.536 34.272 19.48 34.68 17.824H36.792C36.312 20.032 34.728 22.24 31.056 22.24C27.168 22.24 25.2 19.408 25.2 15.88ZM27.288 14.92H34.656C34.512 12.76 33.048 11.512 30.912 11.512C28.944 11.512 27.456 12.76 27.288 14.92ZM37.1261 22L41.1581 16L37.1261 10.072H39.5501L42.9581 15.184H43.3901L46.7981 10.072H49.2221L45.2141 16L49.2221 22H46.7981L43.3901 16.888H42.9581L39.5501 22H37.1261ZM50.9587 26.656V10.072H53.0947V11.728L52.7347 13.144H53.3347C53.8387 11.296 55.3988 9.832 58.1347 9.832C61.6147 9.832 63.7987 12.496 63.7987 16.048C63.7987 19.552 61.6147 22.24 58.1347 22.24C55.3988 22.24 53.8387 20.752 53.3347 18.904H52.7347L53.0947 20.344V26.656H50.9587ZM53.0947 16.048C53.0947 19.12 55.0387 20.416 57.4627 20.416C59.9107 20.416 61.6867 19.072 61.6867 16.048C61.6867 13 59.9107 11.656 57.4627 11.656C55.0387 11.656 53.0947 12.952 53.0947 16.048ZM64.3089 22V20.176H67.6449V6.184H65.1489V4.36H68.5329C69.3249 4.36 69.7809 4.768 69.7809 5.56V20.176H73.1169V22H64.3089ZM73.7653 15.88C73.7653 12.016 76.0693 9.832 79.4773 9.832C83.0053 9.832 85.3093 11.968 85.3093 15.664V16.432H75.8293C75.9013 18.76 77.1253 20.536 79.5973 20.536C81.6373 20.536 82.8373 19.48 83.2453 17.824H85.3573C84.8773 20.032 83.2933 22.24 79.6213 22.24C75.7333 22.24 73.7653 19.408 73.7653 15.88ZM75.8533 14.92H83.2213C83.0773 12.76 81.6133 11.512 79.4773 11.512C77.5093 11.512 76.0213 12.76 75.8533 14.92ZM87.1078 15.88C87.1078 12.016 89.4118 9.832 92.8198 9.832C96.3478 9.832 98.6518 11.968 98.6518 15.664V16.432H89.1718C89.2438 18.76 90.4678 20.536 92.9398 20.536C94.9798 20.536 96.1798 19.48 96.5878 17.824H98.6998C98.2198 20.032 96.6358 22.24 92.9638 22.24C89.0758 22.24 87.1078 19.408 87.1078 15.88ZM89.1958 14.92H96.5638C96.4198 12.76 94.9558 11.512 92.8198 11.512C90.8518 11.512 89.3638 12.76 89.1958 14.92Z" fill="white" />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="text-[20px] font-semibold text-[#fafafa] text-center leading-[26px] mb-3">
              {mode === 'register' ? 'Create your account' : 'Sign in to your account'}
            </h1>

            {/* "Work emails only" Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.25)] border-l-2 border-l-[#00fbbc] text-[13px] font-medium text-[#d4d4d4] select-none">
              <span className="text-[14px] leading-none">💼</span>
              <span>Work emails only</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            {/* Outlined Material Email Input */}
            <div className="relative w-full h-[44px] mb-4">
              <input
                id="email-input"
                type="email"
                name="identifier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full h-[44px] px-3.5 bg-transparent rounded-[10px] text-[15px] text-[#fafafa] transition-all duration-200 outline-none ${
                  isFocused
                    ? 'border border-[rgba(16,185,129,0.5)] shadow-[0_0_0_3px_rgba(16,185,129,0.15)]'
                    : 'border border-white/[0.12] hover:border-white/[0.2]'
                }`}
                autoComplete="email"
                required
              />

              {/* Floating label */}
              <label
                htmlFor="email-input"
                className={`absolute transition-all duration-200 pointer-events-none select-none ${
                  isFocused || email
                    ? '-top-2 left-2.5 px-1 bg-[#111111] text-[12px] font-medium ' +
                      (isFocused ? 'text-[#10b981]' : 'text-[#a1a1a1]')
                    : 'top-3 left-3.5 text-[14px] text-[#a1a1a1]'
                }`}
              >
                Email
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] rounded-[10px] bg-[#10b981] hover:bg-[#059669] active:bg-[#047857] text-black font-semibold text-[15px] shadow-[0_1px_2px_0_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{mode === 'register' ? 'Create account' : 'Sign in'}</span>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          {mode === 'register' ? (
            <div className="w-full flex items-center justify-center gap-1.5 text-sm mt-4 mb-4">
              <span className="text-[#a1a1a1]">Already have an account?</span>
              <button
                type="button"
                onClick={() => toggleMode('sign-in')}
                className="text-[#10b981] hover:text-[#34d399] font-medium transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                Sign in
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center gap-1.5 text-sm mt-4 mb-4">
              <span className="text-[#a1a1a1]">No account yet?</span>
              <button
                type="button"
                onClick={() => toggleMode('register')}
                className="text-[#10b981] hover:text-[#34d399] font-medium transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                Create account
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="w-full flex items-center mb-4">
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
            <span className="px-4 text-[13px] text-[#525252] select-none">or</span>
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
          </div>

          {/* Continue with LinkedIn */}
          <button
            type="button"
            onClick={handleLinkedInSignIn}
            className="w-full h-[44px] rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.06] border border-white/[0.12] hover:border-white/20 flex items-center relative transition-all duration-150 cursor-pointer"
          >
            {/* LinkedIn Icon */}
            <div className="absolute left-4 w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 72H64C68.4183 72 72 68.4183 72 64V8C72 3.58172 68.4183 0 64 0H8C3.58172 0 0 3.58172 0 8V64C0 68.4183 3.58172 72 8 72Z" fill="#007EBB" />
                <path d="M62 62H51.3156V43.8021C51.3156 38.8128 49.4198 36.0245 45.4707 36.0245C41.1746 36.0245 38.9301 38.9261 38.9301 43.8021V62H28.6333V27.3333H38.9301V32.0029C38.9301 32.0029 42.026 26.2742 49.3826 26.2742C56.7357 26.2742 62 30.7645 62 40.0512V62ZM16.3493 22.794C12.8421 22.794 10 19.9297 10 16.397C10 12.8644 12.8421 10 16.3493 10C19.8566 10 22.697 12.8644 22.697 16.397C22.697 19.9297 19.8566 22.794 16.3493 22.794ZM11.0326 62H21.7694V27.3333H11.0326V62Z" fill="#FFF" />
              </svg>
            </div>
            {/* Center label */}
            <span className="w-full text-center text-[#fafafa] font-medium text-sm">
              Continue with LinkedIn
            </span>
          </button>
        </div>
      </main>

      {/* Powered by Logto Footer */}
      <div className="mt-7 flex items-center justify-center">
        <a
          href="https://logto.io/?utm_source=sign_in&utm_medium=powered_by"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-[#928f9a] opacity-75 hover:opacity-100 transition-opacity cursor-pointer group"
          aria-label="Powered by Logto"
        >
          <span>Powered by</span>
          {/* Static SVG Icon */}
          <div className="relative w-[52px] h-[18px]">
            {/* Neutral static icon */}
            <svg
              width="52"
              height="18"
              viewBox="0 0 52 18"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 block group-hover:hidden"
            >
              <g opacity="0.8" clipPath="url(#clip0_logto_static)">
                <path fillRule="evenodd" clipRule="evenodd" d="M1 4.5299C1 4.15639 1 3.96963 1.06856 3.81931C1.12899 3.68684 1.22616 3.57457 1.34851 3.49586C1.48735 3.40655 1.67193 3.38004 2.0411 3.32702L7.3061 2.57085C7.784 2.50221 8.02295 2.46789 8.20864 2.54035C8.37165 2.60396 8.50768 2.72206 8.59369 2.87463C8.69167 3.04844 8.69167 3.2902 8.69167 3.77374V14.2263C8.69167 14.7098 8.69167 14.9516 8.59369 15.1254C8.50768 15.2779 8.37165 15.396 8.20864 15.4596C8.02296 15.5321 7.784 15.4978 7.30611 15.4291H7.3061L2.0411 14.673L2.04108 14.673L2.04106 14.673C1.67192 14.62 1.48734 14.5934 1.34851 14.5041C1.22616 14.4254 1.12899 14.3132 1.06856 14.1807C1 14.0304 1 13.8436 1 13.4701V4.5299ZM6.30838 8.07075C6.30838 7.959 6.30838 7.90312 6.32939 7.85895C6.3479 7.82005 6.37758 7.78756 6.41464 7.76561C6.45672 7.74068 6.51237 7.73562 6.62366 7.7255L7.12199 7.6802H7.122C7.25312 7.66828 7.31868 7.66232 7.3693 7.68419C7.41378 7.7034 7.45053 7.73696 7.47369 7.77951C7.50005 7.82795 7.50005 7.89378 7.50005 8.02544V9.97456C7.50005 10.1062 7.50005 10.1721 7.47369 10.2205C7.45053 10.263 7.41378 10.2966 7.3693 10.3158C7.31868 10.3377 7.25312 10.3317 7.12199 10.3198L6.62366 10.2745C6.51237 10.2644 6.45672 10.2593 6.41464 10.2344C6.37758 10.2124 6.3479 10.1799 6.32939 10.141C6.30838 10.0969 6.30838 10.041 6.30838 9.92925V8.07075ZM10.1866 3.58339H9.44997V14.4167H10.1866C10.6113 14.4167 10.8237 14.4167 10.9859 14.3341C11.1286 14.2614 11.2446 14.1454 11.3173 14.0027C11.4 13.8405 11.4 13.6281 11.4 13.2034V4.79673C11.4 4.37202 11.4 4.15967 11.3173 3.99745C11.2446 3.85476 11.1286 3.73875 10.9859 3.66605C10.8237 3.58339 10.6113 3.58339 10.1866 3.58339Z" fill="currentColor" />
              </g>
              <path d="M25.3042 13.8727C24.5566 13.8727 23.9109 13.7173 23.3672 13.4066C22.8234 13.0959 22.4059 12.6638 22.1146 12.1104C21.8233 11.5472 21.6777 10.8967 21.6777 10.1588C21.6777 9.4014 21.8282 8.746 22.1292 8.19255C22.4302 7.6391 22.8526 7.20702 23.3963 6.89632C23.9497 6.58561 24.5954 6.43025 25.3334 6.43025C26.081 6.43025 26.7218 6.58561 27.2559 6.89632C27.7996 7.20702 28.222 7.6391 28.523 8.19255C28.824 8.746 28.9745 9.39655 28.9745 10.1442C28.9745 10.8821 28.8191 11.5327 28.5084 12.0958C28.2074 12.659 27.7851 13.0959 27.2413 13.4066C26.6976 13.7076 26.0519 13.863 25.3042 13.8727ZM25.3188 12.4599C25.7266 12.4599 26.0762 12.358 26.3674 12.1541C26.6587 11.9502 26.8821 11.6735 27.0374 11.3239C27.2025 10.9744 27.285 10.5811 27.285 10.1442C27.285 9.69755 27.2073 9.29945 27.052 8.9499C26.8966 8.60036 26.6733 8.32849 26.382 8.13429C26.0907 7.93039 25.7412 7.82844 25.3334 7.82844C24.945 7.82844 24.6003 7.93039 24.2993 8.13429C23.9983 8.3382 23.7653 8.61492 23.6002 8.96447C23.4448 9.31402 23.3623 9.70726 23.3526 10.1442C23.3526 10.5908 23.4303 10.9889 23.5856 11.3385C23.741 11.688 23.9692 11.9647 24.2702 12.1686C24.5712 12.3628 24.9207 12.4599 25.3188 12.4599Z" fill="currentColor" />
              <path d="M36.4994 6.69557C36.4994 6.65361 36.4654 6.61959 36.4234 6.61959H34.9296C34.8876 6.61959 34.8536 6.65361 34.8536 6.69557V14.1494C34.8536 14.6446 34.6691 14.9522 34.3002 15.224C33.9409 15.4959 33.5368 15.5848 32.964 15.5945C32.5659 15.5848 32.1924 15.5493 31.8622 15.4425C31.5526 15.3514 31.2137 15.2176 30.8604 15.0411C30.8219 15.0219 30.775 15.0379 30.7567 15.0768L30.2198 16.2213C30.2042 16.2544 30.2144 16.2939 30.2446 16.3144C30.4084 16.4259 30.6 16.5256 30.8193 16.6133C31.062 16.7104 31.3096 16.7881 31.5621 16.8463C31.8242 16.9143 32.0951 16.971 32.3281 17.0001C32.5708 17.0292 32.8 17.0332 32.9457 17.0332C33.6836 17.0332 34.3147 16.9167 34.8391 16.6836C35.3731 16.4506 35.7809 16.1205 36.0625 15.6932C36.3538 15.266 36.4994 14.7563 36.4994 14.164V6.69557ZM35.3104 11.5198C35.2881 11.4671 35.2178 11.4569 35.1803 11.5C34.8943 11.8287 34.6043 12.0616 34.3293 12.2123C34.038 12.3774 33.703 12.4599 33.3244 12.4599C32.936 12.4599 32.5961 12.3628 32.3049 12.1686C32.0233 11.9647 31.8097 11.688 31.664 11.3385C31.5184 10.9889 31.4455 10.586 31.4455 10.1296C31.4455 9.69269 31.5184 9.30431 31.664 8.96447C31.8097 8.61492 32.0233 8.3382 32.3049 8.13429C32.5961 7.93039 32.9408 7.82844 33.3389 7.82844C33.7079 7.82844 33.9992 7.90612 34.3002 8.06147C34.5812 8.20197 34.8803 8.52282 35.1376 8.85792C35.1735 8.90461 35.2468 8.89592 35.2698 8.84172L35.6831 7.86653C35.6932 7.84278 35.6906 7.81558 35.6759 7.79442C35.1544 7.04603 34.2722 6.43025 33.2679 6.43025C32.5397 6.43025 31.965 6.58561 31.431 6.89632C30.897 7.20702 30.4843 7.6391 30.193 8.19255C29.9114 8.746 29.7706 9.39169 29.7706 10.1296C29.7706 10.887 29.9114 11.5472 30.193 12.1104C30.4746 12.6638 30.8775 13.0959 31.4019 13.4066C31.9359 13.7173 32.567 13.8727 33.2952 13.8727C33.5671 13.8727 33.8487 13.8193 34.14 13.7125C34.441 13.6154 34.7323 13.4697 35.0138 13.2755C35.2832 13.0898 35.5215 12.8684 35.7287 12.6115C35.7461 12.59 35.75 12.5606 35.7392 12.5352L35.3104 11.5198Z" fill="currentColor" />
              <path d="M41.9863 6.75383C41.9863 6.71187 41.9523 6.67785 41.9104 6.67785H40.2855C40.2435 6.67785 40.2095 6.64383 40.2095 6.60187V4.61531C40.2095 4.57334 40.1755 4.53933 40.1335 4.53933H38.6542C38.6123 4.53933 38.5783 4.57334 38.5783 4.61531V6.60187C38.5783 6.64383 38.5442 6.67785 38.5023 6.67785H37.5127C37.4704 6.67785 37.4363 6.71236 37.4367 6.75463L37.4497 7.98629C37.4501 8.02794 37.484 8.06147 37.5257 8.06147H38.5023C38.5442 8.06147 38.5783 8.09549 38.5783 8.13745V11.5715C38.5783 12.0861 38.6802 12.5231 38.8841 12.8823C39.0977 13.2319 39.389 13.4989 39.758 13.6834C40.1269 13.8678 40.5736 13.9601 41.0979 13.9601C41.2436 13.9601 41.3989 13.9407 41.564 13.9018C41.7387 13.863 41.9076 13.8221 42.0533 13.7638C42.1833 13.7151 42.4366 13.588 42.5658 13.5131C42.6001 13.4932 42.6108 13.4498 42.5914 13.4151L41.9903 12.3556C41.9714 12.3219 41.9304 12.3079 41.8944 12.3216C41.7972 12.3587 41.6968 12.3892 41.5931 12.4131C41.4669 12.4422 41.3407 12.4568 41.2144 12.4568C40.8746 12.4568 40.6221 12.4211 40.4571 12.1978C40.292 11.9647 40.2095 11.6686 40.2095 11.3093V8.13745C40.2095 8.09549 40.2435 8.06147 40.2855 8.06147H41.9104C41.9523 8.06147 41.9863 8.02745 41.9863 7.98549V6.75383Z" fill="currentColor" />
              <path d="M46.4061 13.8727C45.6584 13.8727 45.0128 13.7173 44.469 13.4066C43.9253 13.0959 43.5078 12.6638 43.2165 12.1104C42.9252 11.5472 42.7795 10.8967 42.7795 10.1588C42.7795 9.4014 42.93 8.746 43.231 8.19255C43.532 7.6391 43.9544 7.20702 44.4981 6.89632C45.0516 6.58561 45.6973 6.43025 46.4352 6.43025C47.1829 6.43025 47.8237 6.58561 48.3577 6.89632C48.9015 7.20702 49.3238 7.6391 49.6248 8.19255C49.9258 8.746 50.0763 9.39655 50.0763 10.1442C50.0763 10.8821 49.921 11.5327 49.6103 12.0958C49.3093 12.659 48.8869 13.0959 48.3432 13.4066C47.7994 13.7076 47.1537 13.863 46.4061 13.8727ZM46.4206 12.4599C46.8285 12.4599 47.178 12.358 47.4693 12.1541C47.7606 11.9502 47.9839 11.6735 48.1393 11.3239C48.3043 10.9744 48.3869 10.5811 48.3869 10.1442C48.3869 9.69755 48.3092 9.29945 48.1538 8.9499C47.9985 8.60036 47.7751 8.32849 47.4839 8.13429C47.1926 7.93039 46.843 7.82844 46.4352 7.82844C46.0468 7.82844 45.7021 7.93039 45.4011 8.13429C45.1001 8.3382 44.8671 8.61492 44.702 8.96447C44.5467 9.31402 44.4642 9.70726 44.4544 10.1442C44.4544 10.5908 44.5321 10.9889 44.6875 11.3385C44.8428 11.688 45.071 11.9647 45.372 12.1686C45.673 12.3628 46.0226 12.4599 46.4206 12.4599Z" fill="currentColor" />
              <path d="M21.0534 12.4017C21.0534 12.3597 21.0194 12.3257 20.9774 12.3257H17.0671C17.0252 12.3257 16.9912 12.2917 16.9912 12.2497V4.2354C16.9912 4.19344 16.9571 4.15942 16.9152 4.15942H15.4505C15.4085 4.15942 15.3745 4.19344 15.3745 4.2354V13.7967C15.3745 13.8387 15.4085 13.8727 15.4505 13.8727H20.9774C21.0194 13.8727 21.0534 13.8387 21.0534 13.7967V12.4017Z" fill="currentColor" />
              <defs>
                <clipPath id="clip0_logto_static">
                  <rect width="10.4" height="13" fill="white" transform="translate(1 2.5)" />
                </clipPath>
              </defs>
            </svg>

            {/* Gradient highlighted icon on hover */}
            <svg
              width="52"
              height="18"
              viewBox="0 0 52 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 hidden group-hover:block"
            >
              <g clipPath="url(#clip0_logto_hover)">
                <path d="M10.1866 3.58339H9.44997V14.4167H10.1866C10.6113 14.4167 10.8237 14.4167 10.9859 14.3341C11.1286 14.2614 11.2446 14.1454 11.3173 14.0027C11.4 13.8405 11.4 13.6281 11.4 13.2034V4.79673C11.4 4.37202 11.4 4.15967 11.3173 3.99745C11.2446 3.85476 11.1286 3.73875 10.9859 3.66605C10.8237 3.58339 10.6113 3.58339 10.1866 3.58339Z" fill="#928F9A" />
                <path fillRule="evenodd" clipRule="evenodd" d="M1 4.5299C1 4.15639 1 3.96963 1.06856 3.81931C1.12899 3.68684 1.22616 3.57457 1.34851 3.49586C1.48735 3.40655 1.67193 3.38004 2.0411 3.32702L7.3061 2.57085C7.784 2.50221 8.02295 2.46789 8.20864 2.54035C8.37165 2.60396 8.50768 2.72206 8.59369 2.87463C8.69167 3.04844 8.69167 3.2902 8.69167 3.77374V14.2263C8.69167 14.7098 8.69167 14.9516 8.59369 15.1254C8.50768 15.2779 8.37165 15.396 8.20864 15.4596C8.02296 15.5321 7.784 15.4978 7.30611 15.4291H7.3061L2.0411 14.673L2.04108 14.673L2.04106 14.673C1.67192 14.62 1.48734 14.5934 1.34851 14.5041C1.22616 14.4254 1.12899 14.3132 1.06856 14.1807C1 14.0304 1 13.8436 1 13.4701V4.5299ZM6.30838 8.07075C6.30838 7.959 6.30838 7.90312 6.32939 7.85895C6.3479 7.82005 6.37758 7.78756 6.41464 7.76561C6.45672 7.74068 6.51237 7.73562 6.62366 7.7255L7.12199 7.6802H7.122C7.25312 7.66828 7.31868 7.66232 7.3693 7.68419C7.41378 7.7034 7.45053 7.73696 7.47369 7.77951C7.50005 7.82795 7.50005 7.89378 7.50005 8.02544V9.97456C7.50005 10.1062 7.50005 10.1721 7.47369 10.2205C7.45053 10.263 7.41378 10.2966 7.3693 10.3158C7.31868 10.3377 7.25312 10.3317 7.12199 10.3198L6.62366 10.2745C6.51237 10.2644 6.45672 10.2593 6.41464 10.2344C6.37758 10.2124 6.3479 10.1799 6.32939 10.141C6.30838 10.0969 6.30838 10.041 6.30838 9.92925V8.07075ZM10.1866 3.58339H9.44997V14.4167H10.1866C10.6113 14.4167 10.8237 14.4167 10.9859 14.3341C11.1286 14.2614 11.2446 14.1454 11.3173 14.0027C11.4 13.8405 11.4 13.6281 11.4 13.2034V4.79673C11.4 4.37202 11.4 4.15967 11.3173 3.99745C11.2446 3.85476 11.1286 3.73875 10.9859 3.66605C10.8237 3.58339 10.6113 3.58339 10.1866 3.58339Z" fill="url(#paint0_logto_gradient)" />
              </g>
              <path d="M25.3042 13.8727C24.5566 13.8727 23.9109 13.7173 23.3672 13.4066C22.8234 13.0959 22.4059 12.6638 22.1146 12.1104C21.8233 11.5472 21.6777 10.8967 21.6777 10.1588C21.6777 9.4014 21.8282 8.746 22.1292 8.19255C22.4302 7.6391 22.8526 7.20702 23.3963 6.89632C23.9497 6.58561 24.5954 6.43025 25.3334 6.43025C26.081 6.43025 26.7218 6.58561 27.2559 6.89632C27.7996 7.20702 28.222 7.6391 28.523 8.19255C28.824 8.746 28.9745 9.39655 28.9745 10.1442C28.9745 10.8821 28.8191 11.5327 28.5084 12.0958C28.2074 12.659 27.7851 13.0959 27.2413 13.4066C26.6976 13.7076 26.0519 13.863 25.3042 13.8727ZM25.3188 12.4599C25.7266 12.4599 26.0762 12.358 26.3674 12.1541C26.6587 11.9502 26.8821 11.6735 27.0374 11.3239C27.2025 10.9744 27.285 10.5811 27.285 10.1442C27.285 9.69755 27.2073 9.29945 27.052 8.9499C26.8966 8.60036 26.6733 8.32849 26.382 8.13429C26.0907 7.93039 25.7412 7.82844 25.3334 7.82844C24.945 7.82844 24.6003 7.93039 24.2993 8.13429C23.9983 8.3382 23.7653 8.61492 23.6002 8.96447C23.4448 9.31402 23.3623 9.70726 23.3526 10.1442C23.3526 10.5908 23.4303 10.9889 23.5856 11.3385C23.741 11.688 23.9692 11.9647 24.2702 12.1686C24.5712 12.3628 24.9207 12.4599 25.3188 12.4599Z" fill="#fafafa" />
                <path d="M36.4994 6.69557C36.4994 6.65361 36.4654 6.61959 36.4234 6.61959H34.9296C34.8876 6.61959 34.8536 6.65361 34.8536 6.69557V14.1494C34.8536 14.6446 34.6691 14.9522 34.3002 15.224C33.9409 15.4959 33.5368 15.5848 32.964 15.5945C32.5659 15.5848 32.1924 15.5493 31.8622 15.4425C31.5526 15.3514 31.2137 15.2176 30.8604 15.0411C30.8219 15.0219 30.775 15.0379 30.7567 15.0768L30.2198 16.2213C30.2042 16.2544 30.2144 16.2939 30.2446 16.3144C30.4084 16.4259 30.6 16.5256 30.8193 16.6133C31.062 16.7104 31.3096 16.7881 31.5621 16.8463C31.8242 16.9143 32.0951 16.971 32.3281 17.0001C32.5708 17.0292 32.8 17.0332 32.9457 17.0332C33.6836 17.0332 34.3147 16.9167 34.8391 16.6836C35.3731 16.4506 35.7809 16.1205 36.0625 15.6932C36.3538 15.266 36.4994 14.7563 36.4994 14.164V6.69557ZM35.3104 11.5198C35.2881 11.4671 35.2178 11.4569 35.1803 11.5C34.8943 11.8287 34.6043 12.0616 34.3293 12.2123C34.038 12.3774 33.703 12.4599 33.3244 12.4599C32.936 12.4599 32.5961 12.3628 32.3049 12.1686C32.0233 11.9647 31.8097 11.688 31.664 11.3385C31.5184 10.9889 31.4455 10.586 31.4455 10.1296C31.4455 9.69269 31.5184 9.30431 31.664 8.96447C31.8097 8.61492 32.0233 8.3382 32.3049 8.13429C32.5961 7.93039 32.9408 7.82844 33.3389 7.82844C33.7079 7.82844 33.9992 7.90612 34.3002 8.06147C34.5812 8.20197 34.8803 8.52282 35.1376 8.85792C35.1735 8.90461 35.2468 8.89592 35.2698 8.84172L35.6831 7.86653C35.6932 7.84278 35.6906 7.81558 35.6759 7.79442C35.1544 7.04603 34.2722 6.43025 33.2679 6.43025C32.5397 6.43025 31.965 6.58561 31.431 6.89632C30.897 7.20702 30.4843 7.6391 30.193 8.19255C29.9114 8.746 29.7706 9.39169 29.7706 10.1296C29.7706 10.887 29.9114 11.5472 30.193 12.1104C30.4746 12.6638 30.8775 13.0959 31.4019 13.4066C31.9359 13.7173 32.567 13.8727 33.2952 13.8727C33.5671 13.8727 33.8487 13.8193 34.14 13.7125C34.441 13.6154 34.7323 13.4697 35.0138 13.2755C35.2832 13.0898 35.5215 12.8684 35.7287 12.6115C35.7461 12.59 35.75 12.5606 35.7392 12.5352L35.3104 11.5198Z" fill="#fafafa" />
                <path d="M41.9863 6.75383C41.9863 6.71187 41.9523 6.67785 41.9104 6.67785H40.2855C40.2435 6.67785 40.2095 6.64383 40.2095 6.60187V4.61531C40.2095 4.57334 40.1755 4.53933 40.1335 4.53933H38.6542C38.6123 4.53933 38.5783 4.57334 38.5783 4.61531V6.60187C38.5783 6.64383 38.5442 6.67785 38.5023 6.67785H37.5127C37.4704 6.67785 37.4363 6.71236 37.4367 6.75463L37.4497 7.98629C37.4501 8.02794 37.484 8.06147 37.5257 8.06147H38.5023C38.5442 8.06147 38.5783 8.09549 38.5783 8.13745V11.5715C38.5783 12.0861 38.6802 12.5231 38.8841 12.8823C39.0977 13.2319 39.389 13.4989 39.758 13.6834C40.1269 13.8678 40.5736 13.9601 41.0979 13.9601C41.2436 13.9601 41.3989 13.9407 41.564 13.9018C41.7387 13.863 41.9076 13.8221 42.0533 13.7638C42.1833 13.7151 42.4366 13.588 42.5658 13.5131C42.6001 13.4932 42.6108 13.4498 42.5914 13.4151L41.9903 12.3556C41.9714 12.3219 41.9304 12.3079 41.8944 12.3216C41.7972 12.3587 41.6968 12.3892 41.5931 12.4131C41.4669 12.4422 41.3407 12.4568 41.2144 12.4568C40.8746 12.4568 40.6221 12.4211 40.4571 12.1978C40.292 11.9647 40.2095 11.6686 40.2095 11.3093V8.13745C40.2095 8.09549 40.2435 8.06147 40.2855 8.06147H41.9104C41.9523 8.06147 41.9863 8.02745 41.9863 7.98549V6.75383Z" fill="#fafafa" />
                <path d="M46.4061 13.8727C45.6584 13.8727 45.0128 13.7173 44.469 13.4066C43.9253 13.0959 43.5078 12.6638 43.2165 12.1104C42.9252 11.5472 42.7795 10.8967 42.7795 10.1588C42.7795 9.4014 42.93 8.746 43.231 8.19255C43.532 7.6391 43.9544 7.20702 44.4981 6.89632C45.0516 6.58561 45.6973 6.43025 46.4352 6.43025C47.1829 6.43025 47.8237 6.58561 48.3577 6.89632C48.9015 7.20702 49.3238 7.6391 49.6248 8.19255C49.9258 8.746 50.0763 9.39655 50.0763 10.1442C50.0763 10.8821 49.921 11.5327 49.6103 12.0958C49.3093 12.659 48.8869 13.0959 48.3432 13.4066C47.7994 13.7076 47.1537 13.863 46.4061 13.8727ZM46.4206 12.4599C46.8285 12.4599 47.178 12.358 47.4693 12.1541C47.7606 11.9502 47.9839 11.6735 48.1393 11.3239C48.3043 10.9744 48.3869 10.5811 48.3869 10.1442C48.3869 9.69755 48.3092 9.29945 48.1538 8.9499C47.9985 8.60036 47.7751 8.32849 47.4839 8.13429C47.1926 7.93039 46.843 7.82844 46.4352 7.82844C46.0468 7.82844 45.7021 7.93039 45.4011 8.13429C45.1001 8.3382 44.8671 8.61492 44.702 8.96447C44.5467 9.31402 44.4642 9.70726 44.4544 10.1442C44.4544 10.5908 44.5321 10.9889 44.6875 11.3385C44.8428 11.688 45.071 11.9647 45.372 12.1686C45.673 12.3628 46.0226 12.4599 46.4206 12.4599Z" fill="#fafafa" />
                <path d="M21.0534 12.4017C21.0534 12.3597 21.0194 12.3257 20.9774 12.3257H17.0671C17.0252 12.3257 16.9912 12.2917 16.9912 12.2497V4.2354C16.9912 4.19344 16.9571 4.15942 16.9152 4.15942H15.4505C15.4085 4.15942 15.3745 4.19344 15.3745 4.2354V13.7967C15.3745 13.8387 15.4085 13.8727 15.4505 13.8727H20.9774C21.0194 13.8727 21.0534 13.8387 21.0534 13.7967V12.4017Z" fill="#fafafa" />
              <defs>
                <linearGradient id="paint0_logto_gradient" x1="-2.21904" y1="11.4904" x2="10.7367" y2="6.40599" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4B2EFB" />
                  <stop offset="1" stopColor="#E65FFC" />
                </linearGradient>
                <clipPath id="clip0_logto_hover">
                  <rect width="10.4" height="13" fill="white" transform="translate(1 2.5)" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}
