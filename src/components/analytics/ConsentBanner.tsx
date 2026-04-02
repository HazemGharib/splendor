import { useMemo, useState } from 'react';
import {
  acceptAnalyticsConsent,
  getAnalyticsConsent,
  rejectAnalyticsConsent,
} from '../../services/analytics/posthogClient';

export function ConsentBanner() {
  const initialConsent = useMemo(() => getAnalyticsConsent(), []);
  const [consent, setConsent] = useState(initialConsent);

  if (consent !== 'pending') return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] border-t border-gray-700 bg-gray-900/95 backdrop-blur p-3 sm:p-4">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-gray-200">
          We use anonymous analytics to improve gameplay (approximate location, device/OS, and main clicks).
        </p>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            className="rounded-md px-3 py-2 text-xs sm:text-sm font-semibold bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => {
              rejectAnalyticsConsent();
              setConsent('rejected');
            }}
          >
            Reject
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-2 text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500"
            onClick={() => {
              acceptAnalyticsConsent();
              setConsent('accepted');
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
