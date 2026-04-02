import { useMemo, useState } from 'react';
import {
  acceptAnalyticsConsent,
  getAnalyticsConsent,
  rejectAnalyticsConsent,
} from '../../services/analytics/posthogClient';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '../design-system/Modal';

export function ConsentBanner() {
  const initialConsent = useMemo(() => getAnalyticsConsent(), []);
  const [consent, setConsent] = useState(initialConsent);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (consent !== 'pending') return null;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-[100] border-t border-gray-700 bg-gray-900/95 backdrop-blur p-3 sm:p-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-200">
              We collect anonymous usage data to help us improve the game.
            </p>
            <button
              type="button"
              className="mt-2 text-[11px] sm:text-xs text-gray-300 hover:text-white underline underline-offset-2"
              onClick={() => setDetailsOpen(true)}
            >
              Learn more
            </button>
          </div>

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

      <Modal open={detailsOpen} onOpenChange={setDetailsOpen}>
        <ModalContent className="lg:max-w-2xl max-w-sm max-h-[85vh] overflow-y-auto rounded-xl">
          <ModalHeader>
            <ModalTitle
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
            >
              Analytics Consent
            </ModalTitle>
          </ModalHeader>

          <div className="space-y-3 text-xs sm:text-sm text-gray-200">
            <p>
              We collect anonymous usage data, approximate IP-based location, and device/browser information.
            </p>
            <p>
              We do not collect personal information or precise GPS location.
            </p>
            <p className="text-gray-400">
              Accept to enable analytics, or reject to keep analytics disabled.
            </p>

            <div className="flex justify-end">
              <ModalClose asChild>
                <button
                  type="button"
                  className="rounded-md px-3 py-2 text-xs sm:text-sm font-semibold bg-gray-800 text-white hover:bg-gray-700"
                >
                  Close
                </button>
              </ModalClose>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
