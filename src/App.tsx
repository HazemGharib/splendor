import { useEffect } from 'react';
import { GameBoard } from './components/board/GameBoard';
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
  
  return <GameBoard />;
}

export default App;
