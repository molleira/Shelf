import { useState } from "react"
import "../css/password-prompt.css"
interface PasswordPromptProps {
  onSubmit: (password: string) => void
  onClose: () => void
}

export const PasswordPrompt = ({ onSubmit, onClose }: PasswordPromptProps) => {
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(password)
    setPassword("")
  }

  return (
    <div className="password-overlay" onClick={onClose}>
      <div className="password-prompt" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 className="prompt-title">Protected Content</h3>
        <p className="prompt-message">This photo is protected. Please enter the password to view.</p>
        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="password-input"
            autoFocus
          />
          <button type="submit" className="submit-button">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
