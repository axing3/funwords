import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dbService, type QuizQuestion } from '@/services/database'

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
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [hints, setHints] = useState(2)
  const [showHint, setShowHint] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [startTime] = useState(Date.now())
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  
  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const words = await dbService.getRandomWords(10)
      const quizQuestions: QuizQuestion[] = words.map(word => {
        const types: ('choice' | 'type' | 'audio')[] = ['choice', 'type', 'audio']
        const type = types[Math.floor(Math.random() * types.length)]
        
        let options: string[] = []
        if (type === 'choice') {
          // Generate wrong options
          const allWords = words.filter(w => w.id !== word.id)
          const wrongOptions = allWords
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.meaning)
          options = [word.meaning, ...wrongOptions].sort(() => Math.random() - 0.5)
        }

        return {
          word,
          type,
          options: type === 'choice' ? options : undefined
        }
      })
      
      setQuestions(quizQuestions)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load questions:', error)
    }
  }

  const handleAnswer = async (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    const correct = answer === currentQuestion.word.meaning
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const newScore = score + 1
      const newStreak = streak + 1
      setScore(newScore)
      setStreak(newStreak)
      setMaxStreak(Math.max(maxStreak, newStreak))
      
      // Play success sound
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
      
      // Add screen shake effect
      document.body.classList.add('animate-screen-shake')
      setTimeout(() => {
        document.body.classList.remove('animate-screen-shake')
      }, 500)
    }

    // Update progress in database
    await dbService.updateProgress(currentQuestion.word.id, correct)

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1 && lives > (correct ? lives : lives - 1)) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setShowResult(false)
        setShowHint(false)
        setUserAnswer('')
      } else {
        // Quiz ended
        onComplete({
          score: correct ? score + 1 : score,
          totalQuestions: questions.length,
          correctAnswers: correct ? score + 1 : score,
          maxStreak,
          timeSpent: Math.floor((Date.now() - startTime) / 1000)
        })
      }
    }, 1500)
  }

  const playSound = (type: 'success' | 'wrong' | 'bonus') => {
    // Create simple pixel-style sound effects using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    switch (type) {
      case 'success':
        // Success sound: ascending notes
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
        
      case 'wrong':
        // Wrong sound: descending buzz
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break
        
      case 'bonus':
        // Bonus sound: fanfare
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.15) // C6
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.4)
        break
    }
  }

  const useHint = () => {
    if (hints > 0 && !showHint) {
      setHints(hints - 1)
      setShowHint(true)
    }
  }

  const playAudio = () => {
    // In a real implementation, you would play the audio file for the word
    console.log(`Playing audio for: ${questions[currentQuestionIndex]?.word.headword}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="font-pixel text-lg">Loading questions...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
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
            <div className="flex items-center gap-2">
              <span className="font-pixel text-blue-400">💡</span>
              <span className="font-pixel text-lg text-gray-300">{hints}</span>
            </div>
          </div>
          <div className="font-pixel text-lg text-gray-300">
            SCORE: {score}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-700 h-4 border-2 border-gray-600 rounded-none">
          <div 
            className="bg-success h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
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
                {streak + 1 >= 3 && isCorrect && (
                  <div className="font-pixel text-sm text-yellow-400 mt-2">
                    {streak + 1 >= 5 ? '5 COMBO! +1 LIFE!' : `${streak + 1} COMBO!`}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Question Content */}
                <div className="text-center mb-8">
                  {currentQuestion.type === 'choice' && (
                    <>
                      <div className="font-pixel text-xl mb-4 text-gray-400">
                        选择正确的中文释义：
                      </div>
                      <div className="font-pixel text-3xl mb-6 text-gray-200">
                        {currentQuestion.word.headword}
                      </div>
                      {currentQuestion.word.example && (
                        <div className="font-pixel text-sm text-gray-500 italic mb-6">
                          例句: {currentQuestion.word.example}
                        </div>
                      )}
                    </>
                  )}
                  
                  {currentQuestion.type === 'type' && (
                    <>
                      <div className="font-pixel text-xl mb-4 text-gray-400">
                        输入单词的中文释义：
                      </div>
                      <div className="font-pixel text-3xl mb-6 text-gray-200">
                        {currentQuestion.word.headword}
                      </div>
                      {showHint && (
                        <div className="font-pixel text-sm text-blue-400 mb-4">
                          提示：以 "{currentQuestion.word.meaning.charAt(0)}" 开头
                        </div>
                      )}
                    </>
                  )}
                  
                  {currentQuestion.type === 'audio' && (
                    <>
                      <div className="font-pixel text-xl mb-4 text-gray-400">
                        听音选词：
                      </div>
                      <Button 
                        onClick={playAudio}
                        className="mb-6 font-pixel bg-blue-600 hover:bg-blue-700 text-white pixel-button"
                      >
                        🔊 播放音频
                      </Button>
                      {showHint && (
                        <div className="font-pixel text-sm text-blue-400 mb-4">
                          提示：单词有 {currentQuestion.word.headword.length} 个字母
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.type === 'choice' && currentQuestion.options && (
                    currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="w-full font-pixel text-left justify-start border-2 border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 text-gray-200 pixel-button"
                      >
                        {option}
                      </Button>
                    ))
                  )}
                  
                  {(currentQuestion.type === 'type' || currentQuestion.type === 'audio') && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleAnswer(userAnswer)}
                        placeholder="输入你的答案..."
                        className="w-full p-4 font-pixel text-lg bg-bg-dark border-4 border-gray-600 rounded-none focus:border-success focus:outline-none text-gray-200"
                        autoFocus
                      />
                      <Button
                        onClick={() => userAnswer && handleAnswer(userAnswer)}
                        disabled={!userAnswer}
                        className="w-full font-pixel bg-success hover:bg-green-600 text-bg-dark border-4 border-green-700 pixel-button"
                      >
                        提交答案
                      </Button>
                    </div>
                  )}
                </div>

                {/* Hint Button */}
                {currentQuestion.type !== 'choice' && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={useHint}
                      disabled={hints === 0 || showHint}
                      className="font-pixel bg-yellow-500 hover:bg-yellow-600 text-bg-dark border-4 border-yellow-700 pixel-button"
                    >
                      使用提示 ({hints} 剩余)
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}