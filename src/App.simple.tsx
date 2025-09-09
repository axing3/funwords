import React, { useState } from 'react'
import StartPage from '@/components/StartPage'
import QuizPage from '@/components/QuizPage'
import ResultsPage from '@/components/ResultsPage'

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

  const handleStartQuiz = () => {
    setCurrentPage('quiz')
  }

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result)
    
    // Update high score if needed
    if (result.score > highScore) {
      setHighScore(result.score)
    }
    
    setCurrentPage('results')
  }

  const handleBackToStart = () => {
    setCurrentPage('start')
    setQuizResult(null)
  }

  return (
    <div className="min-h-screen bg-bg-dark">
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
    </div>
  )
}

export default App