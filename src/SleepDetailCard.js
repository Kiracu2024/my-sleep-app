import React from 'react';
// 💡 LineChartとLineを忘れずにインポート
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts'; 
import { Moon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SleepDetailCard = ({ sleepRecord, availableDates, selectedDate, setSelectedDate, trendData }) => {
  
  // 💡 wakeCount を stats から取得できるようにします
  const { date, hourlyData, stats } = sleepRecord;

  const colors = {
    awake: '#ff6b6b', // 赤
    rem: '#4dd9ff', // シアン
    core: '#1e88ff', // 青
    deep: '#1a237e', // 濃い青/インディゴ
  };

  // 分を 'h'と'm'形式にフォーマットするヘルパー関数
  const formatDuration = (minutes) => {
    if (minutes === 0) return '0分';
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h > 0) {
      return `${h}h${String(m).padStart(2, '0')}m`;
    }
    return `${m}分`;
  };

  // 💡 【修正】トレンド表示用のユーティリティ関数（トレンドの明確化と色反転ロジックを追加）
  const renderTrend = (trend) => {
    if (!trend || trend.diff === 0) {
        return (
            <span className="flex items-center text-gray-500 text-xs mt-1 h-4">
                <Minus size={12} /> 前日差なし
            </span>
        );
    }
    
    const isPositive = trend.diff > 0;
    const diffSign = isPositive ? '+' : '';
    const unit = trend.unit || '分';
    
    // 覚醒系メトリック（totalAwakeやwakeCount）は、増加（+）が赤、減少（-）が緑
    // それ以外の睡眠系メトリックは、増加（+）が緑、減少（-）が赤
    const isWakeMetric = trend.isWakeMetric;
    
    const finalDiffColor = (isWakeMetric) 
        ? (isPositive ? 'text-red-500' : 'text-green-500') // 覚醒: 増加=赤(悪い), 減少=緑(良い)
        : (isPositive ? 'text-green-500' : 'text-red-500'); // 睡眠: 増加=緑(良い), 減少=赤(悪い)

    const Icon = isPositive ? TrendingUp : TrendingDown;
    
    // パーセント表示を調整
    const percentDisplay = trend.percent && trend.percent !== 0 
        ? `(${diffSign}${Math.abs(trend.percent)}%)` 
        : '';

    return (
        <span className={`flex items-center ${finalDiffColor} text-xs mt-1 font-semibold h-4`}>
            <Icon size={12} className="mr-1" /> 
            前日比 {diffSign}{Math.abs(trend.diff)}{unit} {percentDisplay}
        </span>
    );
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg text-sm border border-gray-700 shadow-lg">
          <p className="font-semibold">{payload[0].payload.time}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {parseFloat(entry.value).toFixed(1)}分
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-0"> {/* pt-0はApp.jsのpt-16で調整済み */}
      <div className="max-w-6xl mx-auto">
        
        {/* 日付選択ドロップダウン */}
        <div className="flex justify-between items-center mb-6 pt-6">
          <div className="flex items-center gap-3">
            <Moon size={32} className="text-blue-400" />
            <h1 className="text-4xl font-bold">{date}の睡眠分析</h1>
          </div>
          
          <select 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg p-2 text-lg font-semibold cursor-pointer hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* 日付は逆順にして最新が上にくるようにする (UIの工夫) */}
            {[...availableDates].reverse().map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <p className="text-gray-400 mb-8">Apple Watchデータに基づく詳細分析</p>

        {/* 統計パネル (トレンドと覚醒回数を追加) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          
          {/* 1. 総睡眠時間カード (トレンド追加) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <p className="text-gray-400 text-sm">総睡眠時間</p>
            <p className="text-3xl font-bold text-blue-400">{formatDuration(stats.totalSleep)}</p>
            <p className="text-xs text-gray-500">{stats.totalSleep}分</p>
            {renderTrend(trendData?.totalSleep)}
          </div>

          {/* 2. 深い睡眠カード (トレンド追加) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <p className="text-gray-400 text-sm">深い睡眠</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalDeep}分</p>
            <p className="text-xs text-gray-500">{stats.deepPercent}%</p>
            {renderTrend(trendData?.totalDeep)}
          </div>

          {/* 3. コア睡眠カード */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <p className="text-gray-400 text-sm">コア睡眠</p>
            <p className="text-3xl font-bold text-blue-500">{formatDuration(stats.totalCore)}</p>
            <p className="text-xs text-gray-500">{stats.corePercent}%</p>
            <span className="text-xs text-gray-500 mt-1 block h-4"></span>
          </div>

          {/* 4. レム睡眠カード */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
            <p className="text-gray-400 text-sm">レム睡眠</p>
            <p className="text-3xl font-bold text-cyan-400">{formatDuration(stats.totalRem)}</p>
            <p className="text-xs text-gray-500">{stats.remPercent}%</p>
            <span className="text-xs text-gray-500 mt-1 block h-4"></span>
          </div>

          {/* 5. 覚醒時間カード */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-red-500 transition-colors">
            <p className="text-gray-400 text-sm">覚醒時間</p>
            <p className="text-3xl font-bold text-red-500">{stats.totalAwake}分</p>
            <p className="text-xs text-gray-500">合計時間内</p>
            {/* 覚醒時間はisWakeMetric: trueを設定 */}
            {renderTrend(trendData?.totalAwake && { ...trendData.totalAwake, isWakeMetric: true })}
          </div>

          {/* 6. 💡 【追加】覚醒回数カード (トレンド追加) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-red-500 transition-colors">
            <p className="text-gray-400 text-sm">覚醒回数</p>
            <p className="text-3xl font-bold text-red-500">{stats.wakeCount || 0}回</p>
            <p className="text-xs text-gray-500">就寝中の回数</p>
            {/* 単位を '回' に設定し、isWakeMetric: trueを設定 */}
            {renderTrend(trendData?.wakeCount && { ...trendData.wakeCount, unit: '回', isWakeMetric: true })}
          </div>
        </div>

        {/* 積み上げ面グラフ (AreaChart) */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">睡眠ステージの推移 (積み上げ面グラフ)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#999" />
              <YAxis stroke="#999" label={{ value: '分', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="deep" stackId="1" stroke={colors.deep} fill={colors.deep} name="深い睡眠" />
              <Area type="monotone" dataKey="core" stackId="1" stroke={colors.core} fill={colors.core} name="コア睡眠" />
              <Area type="monotone" dataKey="rem" stackId="1" stroke={colors.rem} fill={colors.rem} name="レム睡眠" />
              <Area type="monotone" dataKey="awake" stackId="1" stroke={colors.awake} fill={colors.awake} name="覚醒" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 時間推移のライングラフ */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">各ステージの時間推移 (ライングラフ)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#999" />
              <YAxis stroke="#999" label={{ value: '分', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="deep" stroke={colors.deep} strokeWidth={2} name="深い睡眠" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="core" stroke={colors.core} strokeWidth={2} name="コア睡眠" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="rem" stroke={colors.rem} strokeWidth={2} name="レム睡眠" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="awake" stroke={colors.awake} strokeWidth={2} name="覚醒" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 下部の詳細パネルとテーブル */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">睡眠ステージの構成</h3>
            <div className="space-y-4">
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">深い睡眠</span>
                  <span className="font-semibold text-indigo-400">{stats.deepPercent}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-4 rounded-full" 
                    style={{ width: `${Math.max(stats.deepPercent, 2)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{stats.totalDeep}分</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">コア睡眠</span>
                  <span className="font-semibold text-blue-400">{stats.corePercent}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-4 rounded-full" 
                    style={{ width: `${Math.max(stats.corePercent, 2)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{stats.totalCore}分</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">レム睡眠</span>
                  <span className="font-semibold text-cyan-400">{stats.remPercent}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-cyan-300 h-4 rounded-full" 
                    style={{ width: `${Math.max(stats.remPercent, 2)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{stats.totalRem}分</p>
              </div>

            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">睡眠品質評価</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-800 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-300 text-sm">総睡眠時間</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-bold text-blue-400">
                    {formatDuration(stats.totalSleep)}
                  </p>
                  <span className={`text-sm px-2 py-1 rounded ${stats.totalSleep >= 420 ? 'bg-green-900 text-green-400' : 'bg-amber-900 text-amber-400'}`}>
                    {stats.totalSleep >= 420 ? '✓ 良好' : '△ 改善推奨'}
                  </span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-800 rounded-lg border-l-4 border-indigo-600">
                <p className="text-gray-300 text-sm">深い睡眠の質</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-bold text-indigo-400">{stats.deepPercent}%</p>
                  <span className={`text-sm px-2 py-1 rounded ${stats.deepPercent >= 15 ? 'bg-green-900 text-green-400' : 'bg-amber-900 text-amber-400'}`}>
                    {stats.deepPercent >= 15 ? '✓ 良好' : '△ 改善推奨'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-800 rounded-lg border-l-4 border-red-500">
                <p className="text-gray-300 text-sm">覚醒時間</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-bold text-red-400">{stats.totalAwake}分</p>
                  <span className={`text-sm px-2 py-1 rounded ${stats.totalAwake < 60 ? 'bg-green-900 text-green-400' : 'bg-amber-900 text-amber-400'}`}>
                    {stats.totalAwake < 60 ? '✓ 正常' : '△ 改善推奨'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-200">
                <strong>💡 おすすめ:</strong> 深い睡眠をさらに増やすため、就寝1時間前からスクリーン時間を減らし、寝室の温度を18-20℃に保つことをお勧めします。
              </p>
            </div>
          </div>
        </div>

        {/* 時間別データテーブル */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">時間別データ</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-600 bg-gray-800">
                  <th className="px-4 py-3 text-left text-blue-400 font-semibold">時刻</th>
                  <th className="px-4 py-3 text-center text-red-400 font-semibold">覚醒</th>
                  <th className="px-4 py-3 text-center text-cyan-400 font-semibold">レム睡眠</th>
                  <th className="px-4 py-3 text-center text-blue-400 font-semibold">コア睡眠</th>
                  <th className="px-4 py-3 text-center text-indigo-400 font-semibold">深い睡眠</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">合計</th>
                </tr>
              </thead>
              <tbody>
                {hourlyData.map((row, i) => {
                  const total = row.awake + row.rem + row.core + row.deep;
                  const formatMinutes = (minutes) => {
                    if (minutes === 0) return '0分';
                    const hours = Math.floor(minutes / 60);
                    const mins = Math.round(minutes % 60);
                    return hours > 0 ? `${hours}:${String(mins).padStart(2, '0')}` : `${mins}分`;
                  };
                  
                  return (
                    <tr key={i} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3 font-bold text-blue-300">{row.time}</td>
                      <td className="px-4 py-3 text-center text-red-300 bg-gray-800 bg-opacity-50">
                        {row.awake > 0 ? row.awake.toFixed(1) : '—'}分
                      </td>
                      <td className="px-4 py-3 text-center text-cyan-300 bg-gray-800 bg-opacity-50">
                        {row.rem > 0 ? row.rem.toFixed(1) : '—'}分
                      </td>
                      <td className="px-4 py-3 text-center text-blue-300 bg-gray-800 bg-opacity-50">
                        {row.core > 0 ? row.core.toFixed(1) : '—'}分
                      </td>
                      <td className="px-4 py-3 text-center text-indigo-300 bg-gray-800 bg-opacity-50">
                        {row.deep > 0 ? row.deep.toFixed(1) : '—'}分
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-200 bg-gray-700">
                        {total > 0 ? formatMinutes(total) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-300">
            <div className="p-2 bg-gray-800 rounded">
              <span className="text-red-400">●</span> 覚醒: {stats.totalAwake}分
            </div>
            <div className="p-2 bg-gray-800 rounded">
              <span className="text-cyan-400">●</span> レム: {stats.totalRem}分
            </div>
            <div className="p-2 bg-gray-800 rounded">
              <span className="text-blue-400">●</span> コア: {stats.totalCore}分
            </div>
            <div className="p-2 bg-gray-800 rounded">
              <span className="text-indigo-400">●</span> 深い: {stats.totalDeep}分
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepDetailCard;