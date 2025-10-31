import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import SleepDetailCard from './SleepDetailCard';
import WeeklyStats from './WeeklyStats';
import allSleepData from './SleepAnalysis.json';
import { Home, BarChart3 } from 'lucide-react';

// ページの状態管理
const PAGE_VIEWS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGE_VIEWS.DAILY);

  const availableDates = useMemo(() => {
    return allSleepData
      .map(record => record.date)
      .sort((a, b) => new Date(a) - new Date(b));
  }, []);

  const [selectedDate, setSelectedDate] = useState(availableDates[availableDates.length - 1]);
  const [currentSleepRecord, setCurrentSleepRecord] = useState(null);

  // 選択された日付に基づいて、表示するレコードを更新
  useEffect(() => {
    const record = allSleepData.find(r => r.date === selectedDate);
    
    if (record) {
      // 💡 【修正】hourlyDataから覚醒回数を計算し、statsに上書き
      // hourlyDataでawake > 0となっているセグメント（時間ブロック）の数を回数と見なす
      const calculatedWakeCount = record.hourlyData.filter(h => h.awake > 0).length;
      
      const updatedRecord = {
        ...record,
        stats: {
          ...record.stats,
          // 既存の wakeCount があっても、ここで hourlyData から計算した値で上書きして強制的に正しい値を表示させる
          wakeCount: calculatedWakeCount 
        }
      };
      setCurrentSleepRecord(updatedRecord);
    } else {
      setCurrentSleepRecord(null);
    }
  }, [selectedDate]); // selectedDateが変更されるたびに実行

  
  // 前日比の計算を useMemo で実行
  const trendData = useMemo(() => {
    if (!currentSleepRecord || availableDates.length < 2) {
      return null;
    }

    const currentIndex = availableDates.findIndex(date => date === selectedDate);
    const previousDate = availableDates[currentIndex - 1]; 
    
    if (!previousDate) {
      return null;
    }

    const previousRecordData = allSleepData.find(r => r.date === previousDate);
    
    if (previousRecordData) {
      // 💡 【修正】前日データに対しても同様に覚醒回数を計算し、比較に使用
      const prevWakeCount = previousRecordData.hourlyData.filter(h => h.awake > 0).length;
      
      const currentStats = currentSleepRecord.stats;

      // 総睡眠時間（分）のトレンド計算
      const totalSleepDiff = currentStats.totalSleep - previousRecordData.stats.totalSleep;
      const totalSleepPercentDiff = previousRecordData.stats.totalSleep !== 0 
                                     ? ((totalSleepDiff / previousRecordData.stats.totalSleep) * 100).toFixed(1)
                                     : 0;
      
      // 深い睡眠時間（分）のトレンド計算
      const deepSleepDiff = currentStats.totalDeep - previousRecordData.stats.totalDeep;
      const deepSleepPercentDiff = previousRecordData.stats.totalDeep !== 0 
                                     ? ((deepSleepDiff / previousRecordData.stats.totalDeep) * 100).toFixed(1)
                                     : 0;
      
      // 💡 【修正】覚醒回数のトレンド計算
      const wakeCountDiff = (currentStats.wakeCount || 0) - prevWakeCount;

      return {
        totalSleep: {
          diff: totalSleepDiff,
          percent: totalSleepPercentDiff
        },
        totalDeep: {
          diff: deepSleepDiff,
          percent: deepSleepPercentDiff
        },
        wakeCount: {
            diff: wakeCountDiff,
            percent: 0 // パーセント計算は今回は省略
        }
      };
    } else {
        return null;
    }
  }, [selectedDate, currentSleepRecord, availableDates]);

  if (!currentSleepRecord && currentPage === PAGE_VIEWS.DAILY) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>データがありません。</p>
      </div>
    );
  }
  
  // ナビゲーションメニューの表示
  const NavigationMenu = () => (
    <div className="fixed top-0 left-0 w-full bg-gray-800 border-b border-gray-700 z-10 shadow-lg">
      <div className="max-w-6xl mx-auto flex gap-4 p-3">
        <button
          onClick={() => setCurrentPage(PAGE_VIEWS.DAILY)}
          className={`flex items-center p-2 rounded-lg transition-colors text-sm font-medium ${
            currentPage === PAGE_VIEWS.DAILY 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Home size={18} className="mr-2" /> 日次詳細
        </button>
        <button
          onClick={() => setCurrentPage(PAGE_VIEWS.WEEKLY)}
          className={`flex items-center p-2 rounded-lg transition-colors text-sm font-medium ${
            currentPage === PAGE_VIEWS.WEEKLY 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <BarChart3 size={18} className="mr-2" /> 週次統計
        </button>
      </div>
    </div>
  );

  return (
    <div className="App pt-16"> {/* ナビゲーションバーの分だけパディングを追加 */}
        <NavigationMenu />
        
        {/* ページを条件によって切り替える */}
        {currentPage === PAGE_VIEWS.DAILY && (
            <SleepDetailCard 
                sleepRecord={currentSleepRecord} 
                availableDates={availableDates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                trendData={trendData}
            /> 
        )}
        
        {currentPage === PAGE_VIEWS.WEEKLY && (
            <WeeklyStats allSleepData={allSleepData} />
        )}
    </div>
  );
}

export default App;