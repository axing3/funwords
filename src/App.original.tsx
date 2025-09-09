import { useState, useEffect } from 'react'
import { dbService } from '@/services/database'
import { allWords } from '@/data/extendedWords'
import StartPage from '@/components/StartPage'
import QuizPage from '@/components/QuizPage'
import ResultsPage from '@/components/ResultsPage'
import TestPage from '@/components/TestPage'

type Page = 'start' | 'quiz' | 'results'

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  maxStreak: number
  timeSpent: number
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('start')
  const [highScore, setHighScore] = useState(0)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...')
        await dbService.init()
        console.log('Database initialized')
        
        // Check if words exist, if not add all words
        const words = await dbService.getRandomWords(1)
        console.log('Words in database:', words.length)
        if (words.length === 0) {
          await dbService.addWords(allWords)
          console.log(`Added ${allWords.length} words to database`)
        }
        
        // Get high score
        const score = await dbService.getHighScore()
        setHighScore(score)
        console.log('High score loaded:', score)
        
        setIsInitialized(true)
        console.log('App initialized successfully')
      } catch (error) {
        console.error('Failed to initialize app:', error)
        // Even if database fails, show the app
        setIsInitialized(true)
      }
    }

    initializeApp()
  }, [])

  const handleStartQuiz = () => {
    setCurrentPage('quiz')
  }

  const handleQuizComplete = async (result: QuizResult) => {
    setQuizResult(result)
    
    // Update high score if needed
    if (result.score > highScore) {
      setHighScore(result.score)
      await dbService.updateHighScore(result.score)
    }
    
    setCurrentPage('results')
  }

  const handleBackToStart = () => {
    setCurrentPage('start')
    setQuizResult(null)
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="font-pixel text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      {!isInitialized ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-success mx-auto mb-4"></div>
            <p className="font-pixel text-lg text-gray-300">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {currentPage === 'start' && (
            <StartPage 
              highScore={highScore} 
              onStartQuiz={handleStartQuiz} 
            />
          )}
          
          {currentPage === 'quiz' && (
            <QuizPage onComplete={handleQuizComplete} />
          )}
          
          {currentPage === 'results' && quizResult && (
            <ResultsPage 
              result={quizResult}
              highScore={highScore}
              onBackToStart={handleBackToStart}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
