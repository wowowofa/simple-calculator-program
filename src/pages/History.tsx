import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculationRecord } from '../lib/types';

export default function History() {
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // 从localStorage加载历史记录
  useEffect(() => {
    const loadHistory = () => {
      const historyStr = localStorage.getItem('calculationHistory');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        // 只保留最近10条记录
        const recentHistory = history.slice(-10).reverse();
        setRecords(recentHistory);
      }
    };

    loadHistory();
  }, []);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => Math.min(records.length - 1, prev + 1));
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [records.length, navigate]);

  return (
    <div className="flex flex-col h-screen bg-yellow-100 text-black font-mono p-4">
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center mb-4 p-2 bg-yellow-300 rounded">
        <h1 className="text-xl font-bold">历史记录</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-3 py-1 bg-black text-yellow-300 rounded hover:bg-gray-800 transition-colors"
        >
          返回
        </button>
      </div>

      {/* 历史记录列表 */}
      <div className="flex-1 overflow-y-auto">
        {records.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>暂无历史记录</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {records.map((record, index) => (
              <li
                key={record.id}
                className={`p-3 rounded cursor-pointer transition-all duration-300 ${
                  index === selectedIndex ? 'bg-yellow-300' : 'bg-yellow-200 hover:bg-yellow-250'
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{record.expression}</span>
                  <span className="text-sm">{new Date(record.timestamp).toLocaleString()}</span>
                </div>
                <div className="mt-1">
                  <span className="text-green-800 font-bold">= {record.result}</span>
                </div>
                {/* 计算步骤 */}
                {index === selectedIndex && (
                  <div className="mt-2 pt-2 border-t border-yellow-400">
                    <div className="text-sm mb-1">计算步骤:</div>
                    <div className="flex flex-wrap gap-1">
                      {record.steps.map((step, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded text-xs ${
                            step.type === 'operator' ? 'bg-red-500' :
                            step.type === 'operand' ? 'bg-blue-500' :
                            'bg-green-500'
                          } text-white`}
                        >
                          {step.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 底部提示 */}
      <div className="mt-4 p-2 bg-yellow-300 rounded text-sm">
        <p>↑↓ 键选择记录 | ESC 返回</p>
      </div>
    </div>
  );
}
