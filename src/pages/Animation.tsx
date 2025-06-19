import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type AnimationStep = {
  graphic: string;
  description: string;
};

type AnimationData = {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  steps: AnimationStep[];
  currentStep: number;
  isPlaying: boolean;
};

export default function Animation() {
  const navigate = useNavigate();
  const [animation, setAnimation] = useState<AnimationData>({
    type: 'addition',
    steps: [],
    currentStep: 0,
    isPlaying: true
  });

  // 动画数据mockup
  const animationData = {
    addition: [
      {
        graphic: '5 + 7 = 12',
        description: '个位数相加：5 + 7 = 12，需要进位1'
      },
      {
        graphic: '1 (进位)',
        description: '将进位的1加到十位数上'
      }
    ],
    subtraction: [
      {
        graphic: '23 - 8 = ?',
        description: '个位数3小于8，需要从十位借1'
      },
      {
        graphic: '13 - 8 = 5',
        description: '借位后个位数变为13，13 - 8 = 5'
      }
    ],
    multiplication: [
      {
        graphic: '3 × 4 = 12',
        description: '3乘以4等于12'
      },
      {
        graphic: '12 × 10 = 120',
        description: '12乘以10（十位）等于120'
      }
    ],
    division: [
      {
        graphic: '15 ÷ 3 = ?',
        description: '将15分成3组'
      },
      {
        graphic: '每组5个',
        description: '每组包含5个，所以15 ÷ 3 = 5'
      }
    ]
  };

  // 初始化动画数据
  useEffect(() => {
    setAnimation(prev => ({
      ...prev,
      steps: animationData[prev.type],
      currentStep: 0
    }));
  }, [animation.type]);

  // 动画播放控制
  useEffect(() => {
    if (!animation.isPlaying) return;

    const timer = setInterval(() => {
      setAnimation(prev => {
        if (prev.currentStep >= prev.steps.length - 1) {
          return { ...prev, currentStep: 0 };
        }
        return { ...prev, currentStep: prev.currentStep + 1 };
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [animation.isPlaying, animation.steps.length]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setAnimation(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 切换运算类型
  const handleOperationChange = (type: AnimationData['type']) => {
    setAnimation({
      type,
      steps: animationData[type],
      currentStep: 0,
      isPlaying: true
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-green-400 font-mono p-4">
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center mb-4 p-2 bg-blue-900 text-white rounded">
        <h1 className="text-xl font-bold">
          {animation.type === 'addition' && '加法演示'}
          {animation.type === 'subtraction' && '减法演示'}
          {animation.type === 'multiplication' && '乘法演示'}
          {animation.type === 'division' && '除法演示'}
        </h1>
        <button 
          onClick={() => navigate('/')}
          className="px-3 py-1 bg-black text-green-400 rounded hover:bg-gray-800 transition-colors"
        >
          返回
        </button>
      </div>

      {/* 运算选择器 */}
      <div className="mb-4">
        <select
          value={animation.type}
          onChange={(e) => handleOperationChange(e.target.value as AnimationData['type'])}
          className="w-full p-2 bg-blue-800 text-white rounded border-none"
        >
          <option value="addition">加法</option>
          <option value="subtraction">减法</option>
          <option value="multiplication">乘法</option>
          <option value="division">除法</option>
        </select>
      </div>

      {/* 动画展示区 */}
      <div className="flex-1 flex flex-col items-center justify-center bg-blue-800 rounded-lg p-6 mb-4">
        <div className="text-4xl font-bold mb-4">
          {animation.steps[animation.currentStep]?.graphic}
        </div>
        <div className="text-xl text-center">
          {animation.steps[animation.currentStep]?.description}
        </div>
      </div>

      {/* 控制栏 */}
      <div className="p-2 bg-gray-700 text-white rounded text-sm">
        <p>空格键: {animation.isPlaying ? '暂停' : '继续'} | 当前步骤: {animation.currentStep + 1}/{animation.steps.length}</p>
      </div>
    </div>
  );
}
