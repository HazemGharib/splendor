import { useEffect } from 'react';
import { GameBoard } from './components/board/GameBoard';
import { useColorblindMode } from './hooks/useColorblindMode';

function App() {
  const { enabled: colorblindMode } = useColorblindMode();
  
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
