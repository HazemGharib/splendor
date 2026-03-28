import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
} from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { useColorblindMode } from '../../hooks/useColorblindMode';
import { useGameMusic } from '../../hooks/useGameMusic';
import {
  applyMusicEnabledPreference,
  primeAudioFromUserGesture,
} from '../../audio/splendorSoundtrackPlayer';

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const { enabled, toggle } = useColorblindMode();
  const { enabled: musicEnabled, toggle: toggleMusic } = useGameMusic();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          ⚙️
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-2xl font-bold text-white">Settings</ModalTitle>
          <ModalDescription className="text-gray-400">Configure game preferences</ModalDescription>
        </ModalHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Background music</div>
              <div className="text-sm text-white">
                Streams the OST (MP3); loading starts only after you interact with the page
              </div>
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
              <div className="text-sm text-white">
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
