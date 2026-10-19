'use client';

import { useEffect } from 'react';

import { LEAVE_WARNING, subscribePendingTransactions } from '@/lib/pending-tx';

/**
 * Warns before the tab is closed or reloaded while a contract write is
 * still in flight.
 *
 * Mounted once in the root layout. The listener is registered only while a
 * transaction is pending, so ordinary navigation is never interrupted.
 *
 * Note that browsers only show the confirmation after the user has
 * interacted with the page — the write itself is such an interaction, so in
 * practice the dialog appears. The message string is a fallback: modern
 * browsers display their own wording and ignore this text.
 */
export function PendingTransactionGuard() {
  useEffect(() => {
    let active = false;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!active) return;
      event.preventDefault();
      // Chrome requires returnValue to be set; other engines use returnValue.
      event.returnValue = LEAVE_WARNING;
      return LEAVE_WARNING;
    };

    const unsubscribe = subscribePendingTransactions((pending) => {
      if (pending === active) return;
      active = pending;
      if (pending) window.addEventListener('beforeunload', onBeforeUnload);
      else window.removeEventListener('beforeunload', onBeforeUnload);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  return null;
}
