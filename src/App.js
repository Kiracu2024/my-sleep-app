import React from 'react';
import './App.css'; // App.cssは空でOK
import DailySleepGraph from './DailySleepGraph'; // グラフコンポーネントをインポート

function App() {
  return (
    // グラフコンポーネントを表示する
    <div className="App">
      <DailySleepGraph /> 
    </div>
  );
}

export default App;
// ⚠️ 考察禁止: 必ずこのコードでApp.jsを上書きし、保存してください。