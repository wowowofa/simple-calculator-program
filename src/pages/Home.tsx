import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { CalculationRecord, Step } from '../lib/types';

export default function Home() {
  const [mode, setMode] = useState<'command' | 'menu' | 'help'>('command');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [error, setError] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const navigate = useNavigate();

  // 模拟光标闪烁
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') setMode('command');
      else if (e.key === 'F2') setMode('menu');
      else if (e.key === 'F3') setMode('help');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 计算表达式
  const calculate = useCallback((expr: string) => {
    try {
      // 简单验证
      if (expr.includes('/0')) {
        throw new Error('Division by zero');
      }
      
      // 这里使用eval仅作演示，实际应用中应该使用更安全的计算方式
      const value = eval(expr);
      
      // 生成步骤
      const newSteps: Step[] = [];
      const tokens = expr.split(/([+\-*/])/).filter(Boolean);
      
      tokens.forEach(token => {
        if (['+', '-', '*', '/'].includes(token)) {
          newSteps.push({ value: token, type: 'operator' });
        } else {
          newSteps.push({ value: token, type: 'operand' });
        }
      });
      
      newSteps.push({ value: value.toString(), type: 'result' });
      
      setResult(value);
      setSteps(newSteps);
      setError('');
      
      // 保存记录
      const record: CalculationRecord = {
        id: Date.now(),
        expression: expr,
        steps: newSteps,
        result: value,
        timestamp: new Date()
      };
      
      // 这里应该保存到历史记录，暂时用console.log模拟
      // 保存到localStorage
      const historyStr = localStorage.getItem('calculationHistory');
      let history = historyStr ? JSON.parse(historyStr) : [];
      history.push(record);
      localStorage.setItem('calculationHistory', JSON.stringify(history));
      
    } catch (err) {
      setError('Invalid expression');
      setResult(null);
      setSteps([]);
    }
  }, []);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (mode === 'command') {
      calculate(e.target.value);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-green-400 font-mono p-4">
      {/* 顶部状态栏 */}
      <div className="flex justify-between items-center mb-4 p-2 bg-blue-900 text-white rounded">
        <div>
          Mode: <span className="font-bold">{mode.toUpperCase()}</span>
        </div>
        <div className="space-x-4">
          <span>F1: Command</span>
          <span>F2: Menu</span>
          <span>F3: Help</span>
        </div>
      </div>

      {/* 主计算区域 */}
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* 输入区域 */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-blue-800 text-white p-4 rounded mb-2">
            {mode === 'command' ? (
              <div className="flex items-center">
                <span>&gt; </span>
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className="bg-transparent border-none outline-none flex-1 text-white"
                  placeholder="Enter expression (e.g. 3+5*2)"
                />
                <span className={`h-6 w-1 bg-white ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
              </div>
            ) : (
              <div className="text-center">Menu mode - Select operation with number keys</div>
            )}
          </div>

          {/* 结果显示 */}
          {result !== null && (
            <div className="bg-green-800 text-black p-4 rounded transition-all duration-500">
              <div className="font-bold text-xl">= {result}</div>
            </div>
          )}

          {/* 错误显示 */}
          {error && (
            <div className="bg-red-800 text-white p-2 rounded mt-2">
              Error: {error}
            </div>
          )}

          {/* 分步显示 */}
          {steps.length > 0 && (
            <div className="mt-4">
              <div className="text-sm mb-2">Calculation steps:</div>
              <div className="flex flex-wrap gap-2">
                {steps.map((step, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded ${
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
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="flex justify-between items-center p-2 bg-blue-900 text-white rounded">
        <button 
          onClick={() => navigate('/history')}
          className="hover:text-green-300 transition-colors"
        >
          View History
        </button>
        <button 
          onClick={() => navigate('/animation')}
          className="hover:text-green-300 transition-colors"
        >
          Animation Demo
        </button>
      </div>
    </div>
  );
}