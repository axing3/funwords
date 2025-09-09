import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface StartPageProps {
  highScore: number
  onStartQuiz: () => void
}

export default function StartPage({ highScore, onStartQuiz }: StartPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ 
      backgroundColor: '#000000', 
      color: '#ffffff' 
    }}>
      {/* Logo Section */}
      <div className="mb-8 text-center animate-float">
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-success to-green-600 rounded-none shadow-pixel flex items-center justify-center pixel-border">
            <span className="font-pixel text-white text-4xl">FW</span>
          </div>
          <h1 className="font-pixel text-4xl md:text-6xl text-success mb-2">
            FunWords
          </h1>
          <p className="font-pixel text-lg" style={{ color: '#ffffff' }}>
            高考趣味背单词
          </p>
        </div>
      </div>

      {/* High Score */}
      <Card className="mb-8 border-4 border-gray-700 shadow-pixel" style={{ backgroundColor: 'rgba(20, 20, 20, 0.9)' }}>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="font-pixel text-sm mb-2" style={{ color: '#ffffff' }}>最高分</p>
            <p className="font-pixel text-3xl" style={{ color: '#ffff00' }}>{highScore}</p>
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button 
        onClick={onStartQuiz}
        className="font-pixel text-lg px-8 py-6 bg-success hover:bg-green-600 text-bg-dark border-4 border-green-700 pixel-button"
      >
        开始游戏
      </Button>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="font-pixel text-xs" style={{ color: '#cccccc' }}>
          高中3500词 · 离线可用 · 趣味学习
        </p>
      </div>
    </div>
  )
}