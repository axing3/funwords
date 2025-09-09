import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sampleWords = [
  { headword: 'abandon', meaning: '放弃；抛弃' },
  { headword: 'ability', meaning: '能力；才能' },
  { headword: 'absent', meaning: '缺席的；不在的' },
  { headword: 'academy', meaning: '学院；研究院' },
  { headword: 'accept', meaning: '接受；同意' },
  { headword: 'accident', meaning: '事故；意外事件' },
  { headword: 'achieve', meaning: '实现；达到' },
  { headword: 'across', meaning: '穿过；横过' },
  { headword: 'act', meaning: '行动；表演' },
  { headword: 'active', meaning: '积极的；活跃的' },
]

interface QuizPageProps {
  onComplete: (result: {
    score: number
    totalQuestions: number
    correctAnswers: number
    maxStreak: number
    timeSpent: number
  }) => void
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [startTime] = useState(Date.now())
  const audioContextRef = useRef<AudioContext | null>(null)

  const questions = sampleWords.map(word => ({
    word,
    type: 'choice' as const,
    options: [
      word.meaning,
      ...sampleWords.filter(w => w.headword !== word.headword)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning)
    ].sort(() => Math.random() - 0.5)
  }))

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const playSound = (type: 'success' | 'wrong' | 'bonus') => {
    try {
      const audioContext = initAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      switch (type) {
        case 'success':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          break
          
        case 'wrong':
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          break
          
        case 'bonus':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.15)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
          break
      }
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }

  const handleAnswer = (answer: string) => {
    // Initialize audio on first user interaction
    initAudioContext()
    
    const currentQuestion = questions[currentQuestionIndex]
    const correct = answer === currentQuestion.word.meaning
    
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const newScore = score + 1
      const newStreak = streak + 1
      setScore(newScore)
      setStreak(newStreak)
      setMaxStreak(Math.max(maxStreak, newStreak))
      
      playSound('success')
      
      // Extra life at 5 streak
      if (newStreak === 5 && lives < 3) {
        setTimeout(() => {
          setLives(lives + 1)
          playSound('bonus')
        }, 500)
      }
    } else {
      setLives(lives - 1)
      setStreak(0)
      playSound('wrong')
    }

    setTimeout(() => {
      const newLives = correct ? lives : lives - 1
      
      if (currentQuestionIndex < questions.length - 1 && newLives > 0) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setShowResult(false)
      } else {
        // Game ended
        const finalScore = correct ? score + 1 : score
        onComplete({
          score: finalScore,
          totalQuestions: questions.length,
          correctAnswers: finalScore,
          maxStreak,
          timeSpent: Math.floor((Date.now() - startTime) / 1000)
        })
      }
    }, 1500)
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-error">❤️</span>
              <span className="font-pixel text-lg text-gray-300">{lives}</span>
            </div>
            <div className={`flex items-center gap-2 ${streak >= 3 ? 'animate-combo-glow' : ''}`}>
              <span className="font-pixel text-yellow-400">⚡</span>
              <span className="font-pixel text-lg text-gray-300">{streak}</span>
              {streak >= 5 && (
                <span className="font-pixel text-xs text-success animate-pulse">+1 LIFE!</span>
              )}
            </div>
          </div>
          <div className="font-pixel text-lg text-gray-300">
            SCORE: {score}
          </div>
        </div>
        
        <div className="mt-4 w-full bg-gray-700 h-4 border-2 border-gray-600 rounded-none">
          <div 
            className="bg-success h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className={`border-4 border-gray-700 shadow-pixel bg-bg-card ${showResult && !isCorrect ? 'animate-screen-shake' : ''}`}>
          <CardHeader className="text-center">
            <CardTitle className="font-pixel text-2xl text-gray-300">
              Q {currentQuestionIndex + 1} / {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {showResult ? (
              <div className={`text-center py-8 ${isCorrect ? 'text-success animate-pixel-flash' : 'text-error'}`}>
                <div className="font-pixel text-4xl mb-4">
                  {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
                </div>
                <div className="font-pixel text-lg text-gray-300">
                  {isCorrect ? '+1 POINT' : `ANSWER: ${currentQuestion.word.meaning}`}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="font-pixel text-xl mb-4 text-gray-400">
                    选择正确的中文释义：
                  </div>
                  <div className="font-pixel text-3xl mb-6 text-gray-200">
                    {currentQuestion.word.headword}
                  </div>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full font-pixel text-left justify-start border-2 border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 text-gray-200 pixel-button"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}