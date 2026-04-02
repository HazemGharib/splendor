import { useEffect } from 'react';
import { GameBoard } from './components/board/GameBoard';
import { SplendorSoundtrack } from './components/audio/SplendorSoundtrack';
import { ConsentBanner } from './components/analytics/ConsentBanner';
import { useColorblindMode } from './hooks/useColorblindMode';
import { useDebugJewelKeyboardEgg } from './hooks/useDebugEasterEgg';

function App() {
  const { enabled: colorblindMode } = useColorblindMode();
  useDebugJewelKeyboardEgg();
  
  useEffect(() => {
    if (colorblindMode) {
      document.body.classList.add('colorblind-mode');
    } else {
      document.body.classList.remove('colorblind-mode');
    }
  }, [colorblindMode]);
  
  return (
    <>
      <SplendorSoundtrack />
      <GameBoard />
      <ConsentBanner />
    </>
  );
}

export default App;
