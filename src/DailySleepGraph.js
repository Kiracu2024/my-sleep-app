import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Moon } from 'lucide-react';

const DailySleepGraph = () => {
  // Apple Watchの正確な実データ（2025年10月1日）
  const sleepData = [
    { time: '22:00', awake: 1.0, rem: 0.0, core: 31.0, deep: 0.0 },
    { time: '23:00', awake: 1.1, rem: 0.0, core: 39.5, deep: 20.5 },
    { time: '00:00', awake: 0.9, rem: 0.0, core: 51.1, deep: 20.0 },
    { time: '01:00', awake: 0.0, rem: 0.0, core: 60.0, deep: 0.0 },
    { time: '02:00', awake: 0.0, rem: 13.5, core: 46.5, deep: 0.0 },
    { time: '03:00', awake: 3.0, rem: 0.0, core: 57.0, deep: 0.0 },
    { time: '04:00', awake: 1.5, rem: 16.0, core: 42.5, deep: 0.0 },
    { time: '05:00', awake: 0.0, rem: 18.8, core: 27.7, deep: 13.5 },
    { time: '06:00', awake: 0.5, rem: 3.2, core: 51.5, deep: 4.8 },
    { time: '07:00', awake: 13.5, rem: 17.3, core: 29.0, deep: 0.2 },
    { time: '08:00', awake: 8.5, rem: 8.2, core: 43.3, deep: 0.0 },
    { time: '09:00', awake: 0.0, rem: 18.9, core: 41.1, deep: 0.0 },
    { time: '10:00', awake: 3.0, rem: 15.6, core: 6.5, deep: 0.0 },
  ];

  // 統計計算
  const stats = (() => {
    let totalAwake = 0, totalRem = 0, totalCore = 0, totalDeep = 0;
    
    sleepData.forEach(d => {
      totalAwake += d.awake || 0;
      totalRem += d.rem || 0;
      totalCore += d.core || 0;
      totalDeep += d.deep || 0;
    });

    const totalSleep = totalRem + totalCore + totalDeep;

    return {
      totalAwake: Math.round(totalAwake),
      totalRem: Math.round(totalRem),
      totalCore: Math.round(totalCore),
      totalDeep: Math.round(totalDeep),
      totalSleep: Math.round(totalSleep),
      remPercent: totalSleep > 0 ? ((totalRem / totalSleep) * 100).toFixed(1) : 0,
      corePercent: totalSleep > 0 ? ((totalCore / totalSleep) * 100).toFixed(1) : 0,
      deepPercent: totalSleep > 0 ? ((totalDeep / totalSleep) * 100).toFixed(1) : 0,
    };
  })();

  const colors = {
    awake: '#ff6b6b',
    rem: '#4dd9ff',
    core: '#1e88ff',
    deep: '#1a237e',
  };

  const CustomBarLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (value < 5) return null;
    
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="bold"
      >
        {Math.round(value)}
      </text>
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Moon size={32} className="text-blue-400" />
            <h1 className="text-4xl font-bold">2025年10月1日の睡眠分析</h1>
          </div>
          <p className="text-gray-400">Apple Watchデータに基づく詳細分析</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <p className="text-gray-400 text-sm">総睡眠時間</p>
            <p className="text-3xl font-bold text-blue-400">{Math.floor(stats.totalSleep / 60)}h</p>
            <p className="text-xs text-gray-500">{Math.round(stats.totalSleep % 60)}分</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <p className="text-gray-400 text-sm">深い睡眠</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalDeep}分</p>
            <p className="text-xs text-gray-500">{stats.deepPercent}%</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <p className="text-gray-400 text-sm">コア睡眠</p>
            <p className="text-3xl font-bold text-blue-500">{Math.floor(stats.totalCore / 60)}h{Math.round(stats.totalCore % 60)}m</p>
            <p className="text-xs text-gray-500">{stats.corePercent}%</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
            <p className="text-gray-400 text-sm">レム睡眠</p>
            <p className="text-3xl font-bold text-cyan-400">{Math.floor(stats.totalRem / 60)}h{Math.round(stats.totalRem % 60)}m</p>
            <p className="text-xs text-gray-500">{stats.remPercent}%</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-red-500 transition-colors">
            <p className="text-gray-400 text-sm">覚醒</p>
            <p className="text-3xl font-bold text-red-500">{stats.totalAwake}分</p>
            <p className="text-xs text-gray-500">合計時間内</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">睡眠ステージの推移</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sleepData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#999" />
              <YAxis stroke="#999" label={{ value: '分', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="awake" stackId="a" fill={colors.awake} name="覚醒" label={<CustomBarLabel />} />
              <Bar dataKey="rem" stackId="a" fill={colors.rem} name="レム睡眠" label={<CustomBarLabel />} />
              <Bar dataKey="core" stackId="a" fill={colors.core} name="コア睡眠" label={<CustomBarLabel />} />
              <Bar dataKey="deep" stackId="a" fill={colors.deep} name="深い睡眠" label={<CustomBarLabel />} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">各ステージの時間推移</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sleepData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                    {Math.floor(stats.totalSleep / 60)}:{String(Math.round(stats.totalSleep % 60)).padStart(2, '0')}
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
                {sleepData.map((row, i) => {
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

export default DailySleepGraph;