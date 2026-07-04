import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { useColorblindMode } from '../../hooks/useColorblindMode';
import { useGameMusic } from '../../hooks/useGameMusic';
import {
  applyMusicEnabledPreference,
  primeAudioFromUserGesture,
} from '../../audio/splendorSoundtrackPlayer';
import { trackEvent } from '../../services/analytics/posthogClient';

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const { enabled, toggle } = useColorblindMode();
  const { enabled: musicEnabled, toggle: toggleMusic } = useGameMusic();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          onClick={() => trackEvent('settings_opened', { component_id: 'settings_modal' })}
        >
          <GearIcon className="h-5 w-5" />
        </Button>
      </ModalTrigger>
      <ModalContent className="lg:max-w-2xl max-w-sm max-h-max overflow-y-auto rounded-xl">
        <ModalHeader>
          <ModalTitle className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>Settings</ModalTitle>
        </ModalHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Background music</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={() => {
                  toggleMusic();
                  const on = useGameMusic.getState().enabled;
                  applyMusicEnabledPreference(on);
                  if (on) primeAudioFromUserGesture();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Colorblind Mode</div>
              <div className="text-xs text-gray-400">
                Add patterns to gem tokens for better accessibility
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={toggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
