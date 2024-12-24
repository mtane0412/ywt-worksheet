'use client'

import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Download, Moon, Sun } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function YWTWorksheet() {
  const [yItems, setYItems] = useState<string[]>([])
  const [wItems, setWItems] = useState<string[]>([])
  const [tItems, setTItems] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState('YWT Worksheet')
  const worksheetRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)
    document.documentElement.classList.toggle('dark', darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
    }

    darkModeMediaQuery.addEventListener('change', handleChange)
    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      const value = e.currentTarget.value.trim()
      if (value) {
        setter(prev => [...prev, value])
        e.currentTarget.value = ''
      }
    }
  }

  const downloadAsPng = async () => {
    if (worksheetRef.current) {
      const inputs = worksheetRef.current.querySelectorAll('textarea')
      inputs.forEach(input => input.style.display = 'none')

      const canvas = await html2canvas(worksheetRef.current, {
        scale: 2,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
      })
    
      inputs.forEach(input => input.style.display = '')

      const link = document.createElement('a')
      link.download = 'ywt-worksheet.png'
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      setIsEditingTitle(false)
    }
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
  }

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isEditingTitle])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-white dark:bg-gray-800 transition-colors duration-200`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4 items-center">
          <Sun className="h-4 w-4 mr-2 text-gray-800 dark:text-white" />
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          <Moon className="h-4 w-4 ml-2 text-gray-800 dark:text-white" />
        </div>
        <Card className="w-full mb-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div ref={worksheetRef}>
            <CardHeader>
              {isEditingTitle ? (
                <Input
                  ref={titleInputRef}
                  value={title}
                  onChange={handleTitleChange}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleBlur}
                  className="text-2xl font-bold"
                />
              ) : (
                <CardTitle 
                  className="text-2xl font-bold"
                  onDoubleClick={handleTitleDoubleClick}
                >
                  {title}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <Column 
                title="やったこと" 
                items={yItems} 
                onKeyDown={(e) => handleKeyDown(e, setYItems)} 
                placeholder="やったことを入力" 
              />
              <Column 
                title="わかったこと" 
                items={wItems} 
                onKeyDown={(e) => handleKeyDown(e, setWItems)} 
                placeholder="わかったことを入力" 
              />
              <Column 
                title="次にやること" 
                items={tItems} 
                onKeyDown={(e) => handleKeyDown(e, setTItems)} 
                placeholder="次にやることを入��" 
              />
            </CardContent>
          </div>
        </Card>
        <div className="mt-4 flex justify-center">
          <Button onClick={downloadAsPng}>
            <Download className="mr-2 h-4 w-4" /> PNGで保存する
          </Button>
        </div>
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
          <a href="https://github.com/mtane0412">@mtane0412</a>
        </div>
      </div>
    </div>
  )
}

interface ColumnProps {
  title: string
  items: string[]
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder: string
}

function Column({ title, items, onKeyDown, placeholder }: ColumnProps) {
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="list-disc pl-5 space-y-1 mb-2">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <Textarea 
        placeholder={placeholder} 
        onKeyDown={onKeyDown} 
        onChange={handleTextareaChange}
        className="resize-none overflow-hidden"
        rows={1}
      />
    </div>
  )
}
