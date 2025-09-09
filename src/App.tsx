import React, { useState } from 'react'
import StartPage from '@/components/StartPage'
import QuizPageSimple from '@/components/QuizPage.simple'
import ResultsPage from '@/components/ResultsPage'

type Page = 'start' | 'quiz' | 'results'

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  maxStreak: number
  timeSpent: number
}

export default function AppSimple() {
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
    <div className="min-h-screen" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      {currentPage === 'start' && (
        <StartPage 
          highScore={highScore} 
          onStartQuiz={handleStartQuiz} 
        />
      )}
      
      {currentPage === 'quiz' && (
        <QuizPageSimple onComplete={handleQuizComplete} />
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