import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResultsPageProps {
  result: {
    score: number
    totalQuestions: number
    correctAnswers: number
    maxStreak: number
    timeSpent: number
  }
  highScore: number
  onBackToStart: () => void
}

export default function ResultsPage({ result, highScore, onBackToStart }: ResultsPageProps) {
  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100)
  const isNewHighScore = result.score > highScore

  const getGrade = (accuracy: number) => {
    if (accuracy >= 90) return { 
      grade: 'S', 
      color: 'text-yellow-400', 
      message: '完美！',
      medal: '🏆',
      bgColor: 'from-yellow-400 to-yellow-600'
    }
    if (accuracy >= 80) return { 
      grade: 'A', 
      color: 'text-success', 
      message: '优秀！',
      medal: '🥇',
      bgColor: 'from-success to-green-600'
    }
    if (accuracy >= 70) return { 
      grade: 'B', 
      color: 'text-blue-400', 
      message: '良好！',
      medal: '🥈',
      bgColor: 'from-blue-400 to-blue-600'
    }
    if (accuracy >= 60) return { 
      grade: 'C', 
      color: 'text-purple-400', 
      message: '继续努力！',
      medal: '🥉',
      bgColor: 'from-purple-400 to-purple-600'
    }
    return { 
      grade: 'D', 
      color: 'text-gray-400', 
      message: '需要更多练习',
      medal: '📚',
      bgColor: 'from-gray-400 to-gray-600'
    }
  }

  const gradeInfo = getGrade(accuracy)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Grade Display */}
        <div className="text-center mb-8">
          <div className={`inline-block p-8 rounded-none pixel-border mb-4 bg-gradient-to-br ${gradeInfo.bgColor} animate-float`}>
            <div className={`font-pixel text-8xl mb-2 ${gradeInfo.color}`}>
              {gradeInfo.grade}
            </div>
            <div className="font-pixel text-4xl">
              {gradeInfo.medal}
            </div>
          </div>
          <div className="font-pixel text-xl text-gray-300">
            {gradeInfo.message}
          </div>
          {isNewHighScore && (
            <div className="mt-4 font-pixel text-lg text-yellow-400 animate-pulse">
              🏆 新纪录！ 🏆
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-4 border-gray-700 shadow-pixel bg-bg-card">
            <CardContent className="p-6 text-center">
              <div className="font-pixel text-sm text-gray-400 mb-1">得分</div>
              <div className="font-pixel text-3xl text-success">{result.score}</div>
            </CardContent>
          </Card>

          <Card className="border-4 border-gray-700 shadow-pixel bg-bg-card">
            <CardContent className="p-6 text-center">
              <div className="font-pixel text-sm text-gray-400 mb-1">正确率</div>
              <div className="font-pixel text-3xl text-blue-400">{accuracy}%</div>
            </CardContent>
          </Card>

          <Card className="border-4 border-gray-700 shadow-pixel bg-bg-card">
            <CardContent className="p-6 text-center">
              <div className="font-pixel text-sm text-gray-400 mb-1">最高连击</div>
              <div className="font-pixel text-3xl text-yellow-400">{result.maxStreak}</div>
            </CardContent>
          </Card>

          <Card className="border-4 border-gray-700 shadow-pixel bg-bg-card">
            <CardContent className="p-6 text-center">
              <div className="font-pixel text-sm text-gray-400 mb-1">用时</div>
              <div className="font-pixel text-3xl text-purple-400">
                {Math.floor(result.timeSpent / 60)}:{String(result.timeSpent % 60).padStart(2, '0')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Summary */}
        <Card className="border-4 border-gray-700 shadow-pixel bg-bg-card mb-8">
          <CardHeader>
            <CardTitle className="font-pixel text-xl text-center text-gray-300">测试总结</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-gray-300">正确答案：</span>
                <span className="font-pixel text-success">
                  {result.correctAnswers} / {result.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-pixel text-gray-300">最高分：</span>
                <span className="font-pixel text-yellow-400">
                  {isNewHighScore ? result.score : highScore}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onBackToStart}
            className="font-pixel px-8 py-4 bg-success hover:bg-green-600 text-bg-dark border-4 border-green-700 pixel-button"
          >
            返回主菜单
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="font-pixel px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white border-4 border-blue-700 pixel-button"
          >
            再来一局
          </Button>
        </div>

        {/* Encouragement Message */}
        <div className="mt-8 text-center">
          <p className="font-pixel text-sm text-gray-500">
            {accuracy >= 80 
              ? "太棒了！你正在掌握这些单词！" 
              : accuracy >= 60 
              ? "做得不错！继续练习以提高水平！" 
              : "不要放弃！每个专家都曾是初学者！"
            }
          </p>
        </div>
      </div>
    </div>
  )
}