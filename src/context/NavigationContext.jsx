import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getRegionBySlug } from '../data/gm/regionData';
import { getCountryBySlug } from '../data/gm/countryData';

const NavigationContext = createContext(null);

export const PRODUCT_ROUTES = {
  OUTREACH: '/',
  DATABASE: '/b2b-database',
  API: '/public/api/docs',
  GM: '/gm-dataset',
  EXPLORER: '/tools/explorer',
  SIGN_IN: '/sign-in',
  REGISTER: '/register',
  VERIFICATION_CODE: '/register/verification-code',
  AUTO_GTM: '/app-auto-gtm',
  AUTO_GTM_EXPLORE: '/auto-gtm/company',
};

// Map URL paths or hashes to product IDs
export function resolveProductFromLocation() {
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // 0a. Verification code (/register/verification-code, /verification-code, /verify-email)
  if (
    pathname.includes('/verification-code') ||
    pathname.includes('/verify-email') ||
    hash.includes('verification-code') ||
    hash.includes('verify-email')
  ) {
    return {
      product: 'sign-in',
      authMode: 'verification-code',
      canonicalPath: PRODUCT_ROUTES.VERIFICATION_CODE,
    };
  }

  // 0b. Register / Create Account (/register, /create-account, /signup, /sign-up, #register, #signup)
  if (
    pathname.includes('/register') ||
    pathname.includes('/create-account') ||
    pathname.includes('/signup') ||
    pathname.includes('/sign-up') ||
    hash.includes('register') ||
    hash.includes('signup')
  ) {
    return {
      product: 'sign-in',
      authMode: 'register',
      canonicalPath: PRODUCT_ROUTES.REGISTER,
    };
  }

  // 0b. Sign In (/sign-in, /login, #sign-in, #login)
  if (
    pathname.includes('/sign-in') ||
    pathname.includes('/login') ||
    hash.includes('sign-in') ||
    hash.includes('login')
  ) {
    return {
      product: 'sign-in',
      authMode: 'sign-in',
      canonicalPath: PRODUCT_ROUTES.SIGN_IN,
    };
  }

  // 0c. AutoGTM Explore (/auto-gtm/company/<domain>/explore)
  const autoGtmExploreMatch =
    pathname.match(/\/auto-gtm\/company\/([^/]+)\/explore/) ||
    hash.match(/\/auto-gtm\/company\/([^/]+)\/explore/);
  if (autoGtmExploreMatch) {
    const domain = autoGtmExploreMatch[1];
    return {
      product: 'auto-gtm-explore',
      domain,
      canonicalPath: `/auto-gtm/company/${domain}/explore`,
    };
  }

  // 0d. AutoGTM Landing (/app-auto-gtm)
  if (
    pathname.includes('/app-auto-gtm') ||
    hash.includes('app-auto-gtm')
  ) {
    return {
      product: 'app-auto-gtm',
      canonicalPath: PRODUCT_ROUTES.AUTO_GTM,
    };
  }

  // 1. Database (/b2b-database, /database, #b2b)
  if (pathname.includes('/b2b-database') || pathname.includes('/database') || hash.includes('b2b')) {
    return { product: 'database', canonicalPath: PRODUCT_ROUTES.DATABASE };
  }

  // 2a. Locations (/gm-dataset/locations/{slug}) - Check Region first, then Country
  const locationMatch =
    pathname.match(/\/gm-dataset\/locations\/([a-z0-9-]+)/) ||
    hash.match(/locations\/([a-z0-9-]+)/);
  if (locationMatch) {
    const slug = locationMatch[1];
    
    // Check if slug matches a known region
    const reg = getRegionBySlug(slug);
    if (reg) {
      return {
        product: 'gm-region',
        regionSlug: reg.slug,
        canonicalPath: `/gm-dataset/locations/${reg.slug}`,
      };
    }

    // Check if slug matches a known country
    const country = getCountryBySlug(slug);
    if (country) {
      return {
        product: 'gm-country',
        countrySlug: country.slug,
        canonicalPath: `/gm-dataset/locations/${country.slug}`,
      };
    }

    // Fallback: pass to country view which will render the country not found UI
    return {
      product: 'gm-country',
      countrySlug: slug,
      canonicalPath: `/gm-dataset/locations/${slug}`,
    };
  }

  // 2b. Google Maps Dataset (/gm-dataset, #gm)
  if (pathname.includes('/gm-dataset') || hash.includes('gm-dataset') || hash.includes('gm')) {
    return { product: 'gm', canonicalPath: PRODUCT_ROUTES.GM };
  }

  // 3. API Docs (/public/api/docs, /docs, /api, #description, #tag)
  if (
    pathname.includes('/public/api/docs') ||
    pathname.includes('/docs') ||
    pathname.includes('/api') ||
    hash.includes('docs') ||
    hash.includes('description') ||
    hash.includes('tag/')
  ) {
    return { product: 'api', canonicalPath: PRODUCT_ROUTES.API };
  }

  // 4. Explorer (/tools/explorer, /explorer, #explorer)
  if (pathname.includes('/tools/explorer') || pathname.includes('/explorer') || hash.includes('explorer')) {
    return { product: 'explorer', canonicalPath: PRODUCT_ROUTES.EXPLORER };
  }

  // 5. Outreach Agent / Main Landing Page (/ or /outreach-agent or /index.html or /landing)
  if (
    pathname === '/' ||
    pathname === '' ||
    pathname.endsWith('/index.html') ||
    pathname.includes('/outreach') ||
    pathname.includes('/landing') ||
    hash.includes('outreach')
  ) {
    return { product: 'outreach', canonicalPath: PRODUCT_ROUTES.OUTREACH };
  }

  // Unknown route
  return { product: 'unknown', canonicalPath: pathname };
}

export function NavigationProvider({ children }) {
  const [routeState, setRouteState] = useState(() => resolveProductFromLocation());

  // Listen to browser Back and Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setRouteState(resolveProductFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);


  const navigate = useCallback((targetPath) => {
    if (!targetPath) return;

    // Handle hash on same page or external URLs
    if (targetPath.startsWith('http')) {
      window.open(targetPath, '_blank', 'noopener,noreferrer');
      return;
    }

    // Scroll to section hash if on current page
    if (targetPath.startsWith('#')) {
      const el = document.querySelector(targetPath);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Update browser history
    const currentFull = window.location.pathname + window.location.search + window.location.hash;
    if (currentFull !== targetPath && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    setRouteState(resolveProductFromLocation());
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentProduct: routeState.product,
        currentPath: routeState.canonicalPath,
        authMode: routeState.authMode || 'sign-in',
        countrySlug: routeState.countrySlug,
        regionSlug: routeState.regionSlug,
        domain: routeState.domain || 'keethub.lovable.app',
        navigate,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
}
