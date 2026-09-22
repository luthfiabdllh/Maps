'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ExpandableSearchBarProps = {
  expandDirection?: 'left' | 'right';
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  defaultOpen?: boolean;
  width?: number;
};

const COLLAPSED_SIZE = 40;

export default function ExpandableSearchBar(props: ExpandableSearchBarProps) {
  const {
    expandDirection = 'right',
    placeholder = 'Search...',
    onSearch,
    className = '',
    defaultOpen = false,
    width = 280,
  } = props;

  const [open, setOpen] = useState(defaultOpen);
  const [value, setValue] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isLeft = expandDirection === 'left';
  const inputPadding = isLeft ? 'pl-10 pr-10' : 'pl-11 pr-4';
  const placeholderLeft = isLeft ? 'left-10' : 'left-11';

  const handleClose = useCallback(() => {
    setOpen(false);
    setValue('');
    onSearch?.('');
  }, [onSearch]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        open &&
        value === ''
      ) {
        handleClose();
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open, value, handleClose]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }

      if (e.key === 'Enter' && open) {
        onSearch?.(value);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, value, onSearch, handleClose]);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
      style={{ width: COLLAPSED_SIZE, height: COLLAPSED_SIZE }}
    >
      {/* Icon button (always visible, overlays toggle corner of bar) */}
      <button
        type='button'
        aria-label={open ? 'Close search' : 'Open search'}
        onClick={() => {
          if (open) {
            handleClose();
          } else {
            setOpen(true);
          }
        }}
        className={cn(
          'absolute inset-0 z-20 grid place-items-center rounded-full border shadow-md',
          'bg-background/95 backdrop-blur-sm text-foreground hover:bg-background/10 transition-colors'
        )}
      >
        {open ? <X className='size-4' /> : <Search className='size-4' />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.form
            key='form'
            onSubmit={handleSubmit}
            className={cn(
              'absolute top-0 h-10 rounded-full border bg-background/95 backdrop-blur-sm text-foreground shadow-lg overflow-hidden flex items-center',
              isLeft ? 'right-0' : 'left-0'
            )}
            initial={{ width: COLLAPSED_SIZE, opacity: 0.98 }}
            animate={{ width: width, opacity: 1 }}
            exit={{
              width: COLLAPSED_SIZE,
              opacity: 0,
              transition: { type: 'spring', stiffness: 260, damping: 26 },
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            {/* Left search icon */}
            <span className='absolute left-3 z-10 text-muted-foreground pointer-events-none'>
              <Search className='size-4' />
            </span>

            <div className='relative flex-1 min-w-0 flex items-center'>
              <input
                ref={inputRef}
                type='text'
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  onSearch?.(e.target.value);
                }}
                placeholder={placeholder}
                className={cn(
                  'w-full bg-transparent text-sm outline-none placeholder-transparent whitespace-nowrap',
                  inputPadding
                )}
              />

              <AnimatePresence>
                {open && !value && (
                  <motion.span
                    key='ph'
                    className={cn(
                      'pointer-events-none absolute top-1/2 -translate-y-1/2 w-full truncate text-muted-foreground/80 text-sm select-none text-left',
                      placeholderLeft
                    )}
                    initial={{ opacity: 1, x: 0 }}
                    animate={{ opacity: 0.9, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {placeholder}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {!isLeft && (
              <AnimatePresence initial={false}>
                {open && (
                  <motion.button
                    key='go'
                    type='submit'
                    className='h-10 w-10 grid place-items-center text-muted-foreground hover:text-foreground'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    aria-label='Search'
                  >
                    <Search className='size-4' />
                  </motion.button>
                )}
              </AnimatePresence>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
