import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import allSleepData from './sleepData.json';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

// 週次統計コンポーネント
const WeeklyStats = () => {
    
    // 全データの日付を新しい順にソートし、日付オブジェクトに変換
    const sortedDates = useMemo(() => {
        return allSleepData
            .map(record => new Date(record.date.replace(/年|月|日/g, '-').slice(0, -1)))
            .sort((a, b) => a - b);
    }, []);

    // 期間選択の状態管理 (初期値は最新の日付を含む週の開始日)
    const latestDate = sortedDates[sortedDates.length - 1];
    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay(); // 日曜(0)から土曜(6)
        // 週の開始日（月曜日）に調整: 日曜を7として扱う
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    };
    
    // 初期選択期間の開始日（最新データを含む週の月曜日）
    const initialWeekStart = getWeekStart(latestDate);
    const [currentWeekStart, setCurrentWeekStart] = useState(initialWeekStart);

    // 💡 【メインロジック】週次データの集計
    const weeklySummary = useMemo(() => {
        if (!currentWeekStart || sortedDates.length === 0) return { summary: null, chartData: [] };

        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // 期間内のデータをフィルタリング
        const weekData = allSleepData.filter(record => {
            const recordDate = new Date(record.date.replace(/年|月|日/g, '-').slice(0, -1));
            return recordDate >= currentWeekStart && recordDate <= weekEnd;
        });

        if (weekData.length === 0) {
            return { 
                summary: { days: 0, avgTotalSleep: 0, avgDeep: 0, avgAwake: 0, totalWakeCount: 0 }, 
                chartData: [] 
            };
        }

        // 週次統計の計算
        const stats = weekData.reduce((acc, record) => {
            acc.totalSleep += record.stats.totalSleep || 0;
            acc.totalDeep += record.stats.totalDeep || 0;
            acc.totalAwake += record.stats.totalAwake || 0;
            // wakeCountがデータにない場合は0を仮定
            acc.totalWakeCount += record.stats.wakeCount || 0; 
            return acc;
        }, { totalSleep: 0, totalDeep: 0, totalAwake: 0, totalWakeCount: 0 });

        const days = weekData.length;
        const avgTotalSleep = stats.totalSleep / days;
        const avgDeep = stats.totalDeep / days;
        const avgAwake = stats.totalAwake / days;
        const totalWakeCount = stats.totalWakeCount;

        // 週次チャートデータの作成（日別サマリー）
        const chartData = weekData.map(record => ({
            name: record.date.substring(5), // 例: 10月31日
            総睡眠: record.stats.totalSleep,
            深い睡眠: record.stats.totalDeep,
            覚醒: record.stats.totalAwake
        }));


        return {
            summary: { days, avgTotalSleep, avgDeep, avgAwake, totalWakeCount },
            chartData
        };

    }, [currentWeekStart, sortedDates]);
    
    // 期間表示のフォーマット
    const formatPeriod = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };
    
    // 週のナビゲーション関数
    const navigateWeek = (direction) => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newDate);
    };
    
    // 期間タイトル
    const weekEndDisplay = new Date(currentWeekStart);
    weekEndDisplay.setDate(currentWeekStart.getDate() + 6);
    const periodTitle = `${formatPeriod(currentWeekStart)} 〜 ${formatPeriod(weekEndDisplay)}`;
    
    // データの表示形式ヘルパー
    const formatMinutesToHoursMinutes = (minutes) => {
        if (minutes <= 0) return '—';
        const h = Math.floor(minutes / 60);
        const m = Math.round(minutes % 60);
        return `${h}h${String(m).padStart(2, '0')}m`;
    };

    const { summary, chartData } = weeklySummary;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                
                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <Calendar size={32} className="text-purple-400" />
                    週次睡眠統計
                </h1>

                {/* 期間選択ナビゲーション */}
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-8 border border-gray-700">
                    <button 
                        onClick={() => navigateWeek('prev')} 
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors text-purple-400"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-200">{periodTitle}</h2>
                    <button 
                        onClick={() => navigateWeek('next')} 
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors text-purple-400"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* 集計統計パネル */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">計測日数</p>
                        <p className="text-3xl font-bold text-yellow-400">{summary.days}日</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">平均総睡眠時間</p>
                        <p className="text-3xl font-bold text-blue-400">
                            {formatMinutesToHoursMinutes(summary.avgTotalSleep)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">平均深い睡眠</p>
                        <p className="text-3xl font-bold text-indigo-600">
                            {Math.round(summary.avgDeep)}分
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm">総覚醒回数</p>
                        <p className="text-3xl font-bold text-red-500">
                            {summary.totalWakeCount}回
                        </p>
                    </div>
                </div>

                {/* 週次グラフ (BarChart) */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">日別ステージ比較</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#999" />
                            <YAxis stroke="#999" label={{ value: '分', angle: -90, position: 'insideLeft' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
                            <Legend />
                            {/* 💡 データが見やすくなるようにBarをグループ化 */}
                            <Bar dataKey="総睡眠" fill="#4299e1" name="総睡眠時間" />
                            <Bar dataKey="深い睡眠" fill="#6b46c1" name="深い睡眠" />
                            <Bar dataKey="覚醒" fill="#fc8181" name="覚醒時間" />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-gray-500 text-sm mt-4 text-center">X軸：日付, Y軸：時間（分）</p>
                </div>
            </div>
        </div>
    );
}

export default WeeklyStats;