import React from 'react';
import './App.css'; // 必要に応じて維持
// 1. 作成したコンポーネントをインポート
import DailySleepGraph from './DailySleepGraph'; 

function App() {
  return (
    // 2. デフォルトの<div>をDailySleepGraphに置き換える
    <div className="App">
      <DailySleepGraph />
    </div>
  );
}

export default App;
// ⚠️ 考察禁止: 既存のApp.jsの内容を削除し、このコードで上書きするだけと認識する。