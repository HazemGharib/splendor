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
          ⚙️
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
