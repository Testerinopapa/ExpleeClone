import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';
import AutoGtmSidebar from './AutoGtmSidebar';

export default function AutoGtmNavigation(props) {
  const { navigate, currentPath } = useNavigation();
  const dialogRef = useRef(null);
  const dialogId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    closeMenu();
  }, [currentPath, closeMenu]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const handleResize = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener('change', handleResize);
    return () => desktop.removeEventListener('change', handleResize);
  }, [closeMenu]);

  const restart = () => {
    closeMenu();
    if (props.onRestart) props.onRestart();
    else navigate(PRODUCT_ROUTES.AUTO_GTM);
  };

  return (
    <>
      <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-black/[0.08] bg-white px-4 md:hidden">
        <a href={PRODUCT_ROUTES.AUTO_GTM} aria-label="Explee home" onClick={(event) => {
          event.preventDefault();
          restart();
        }}>
          <img src="/assets/logo-light.svg" alt="Explee" width="100" height="28" className="h-7 w-auto" />
        </a>
        <button
          type="button"
          aria-label="Open project menu"
          aria-haspopup="dialog"
          aria-controls={dialogId}
          aria-expanded={menuOpen}
          className="flex size-11 items-center justify-center rounded-lg text-gray-600 hover:bg-black/[0.04]"
          onClick={() => {
            dialogRef.current?.showModal();
            setMenuOpen(true);
          }}
        >
          <Menu className="size-5" />
        </button>
      </header>

      <div className="hidden h-full shrink-0 md:block">
        <AutoGtmSidebar {...props} />
      </div>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="Project menu"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(20rem,calc(100vw-2rem))] max-w-none border-0 bg-white p-0 backdrop:bg-black/40 md:hidden"
        onClose={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <AutoGtmSidebar
          {...props}
          onClose={closeMenu}
          onRestart={restart}
          onSelectSegment={(segment) => {
            props.onSelectSegment?.(segment);
            closeMenu();
          }}
        />
      </dialog>
    </>
  );
}
