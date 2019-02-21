import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './CreateQuestionSet.css'

const isValidJson = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (err) {
    return false
  }
}

const CreateQuestionSet = ({ onSubmit }) => {
  const [name, setName] = useState('')
  const [questionsJson, setQuestionsJson] = useState('')
  const [questionsError, setQuestionsError] = useState('')

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleQuestionsChange = (e) => {
    setQuestionsJson(e.target.value)

    if (questionsError !== '') {
      setQuestionsError('')
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (!isValidJson(questionsJson)) {
      setQuestionsError('Field contains invalid JSON')
      return
    }

    const parsedQuestions = JSON.parse(questionsJson)
    onSubmit(name, parsedQuestions)
    setName('')
    setQuestionsJson('')
  }

  return (
    <form className="create-question-set-form" onSubmit={handleFormSubmit}>
      <TextField
        inputProps={{
          className: 'create-question-set-form__input-form'
        }}
        fullWidth
        required
        label="Name"
        margin="normal"
        value={name}
        onChange={handleNameChange}
      />
      <TextField
        error={!!questionsError}
        inputProps={{
          style: {
            fontFamily:
              'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
            fontSize: '0.9em'
          },
          className: 'create-question-set-form__input-json'
        }}
        fullWidth
        required
        label="Questions (JSON)"
        helperText={questionsError || ''}
        margin="normal"
        multiline
        rows={5}
        value={questionsJson}
        onChange={handleQuestionsChange}
      />
      <Button type="submit" variant="contained" color="primary">
        Create
      </Button>
    </form>
  )
}

export default CreateQuestionSet
