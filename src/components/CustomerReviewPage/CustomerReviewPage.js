import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import * as notificationActions from '../../reducers/actions/notificationActions'
import customerReviewPageActions from '../../reducers/actions/customerReviewPageActions'

import customerReviewService from '../../services/customerReview'

/* import questionSet from '../questions/questions_data.json' */

const Questions = ({ questions, answerSheet, updateAnswer }) => {

  return (
    <div>
      {questions.map((question, questionId) => {
        return (
          <Question
            key={questionId}
            question={question}
            questionId={questionId}
            answerSheet={answerSheet}
            updateAnswer={updateAnswer}
          />
        )
      })}
    </div>
  )
}

const Question = ({ question, questionId, answerSheet, updateAnswer }) => {
  if (question.type === 'text') {
    return (
      <div className="customer-review-box">
        <h3 className="customer-review-box__h3">{question.header}</h3>
        <p>{question.description}</p>

        <TextField
          value={answerSheet[questionId].answer}
          rows="4"
          style={{ width: 400 }}
          multiline
          variant="outlined"
          onChange={(e) =>
            textFieldHandler(e.target.value, questionId, updateAnswer)
          }
        />
      </div>
    )
  } else if (question.type === 'number') {
    return (
      <div className="customer-review-box">
        <h3>{question.header}</h3>
        <p>{question.description}</p>

        <input
          type="number"
          value={answerSheet[questionId].answer}
          onChange={(e) =>
            textFieldHandler(e.target.value, questionId, updateAnswer)
          }
        />
      </div>
    )
  } else if (question.type === 'info') {
    return (
      <div className="customer-review-box">
        <h3>{question.header}</h3>
        <p>{question.description}</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>Incorrect question type</p>
      </div>
    )
  }
}

const textFieldHandler = (value, questionId, updateAnswer) => {
  updateAnswer(value, questionId)
}

class CustomerReviewPage extends React.Component {
  componentWillMount() {}

  async componentDidMount() {

    const id = this.props.match.params.id
    console.log(id)

    try {


      const group = await customerReviewService.getDataForReview(id)

      this.props.setGroupName(group.groupName)
      this.props.setGroupId(group.groupId)
      this.props.setConfiguration(group.configuration)
      const reviewQuestionSet = await customerReviewService.getReviewQuestions(group.configuration)

      this.props.setQuestions(reviewQuestionSet.questions)

      this.fetchCustomerReviewQuestions(this.props.questionObject)

    } catch (e) {
      this.props.setError('Some error happened')
    }
  }

  async fetchCustomerReviewQuestions(questionObject) {


    const initializeNumberAnswer = (question, questionId) => {
      return {
        type: 'number',
        questionHeader: question.header,
        id: questionId,
        answer: 0
      }
    }

    const initializeTextAnswer = (question, questionId) => {
      return {
        type: 'text',
        questionHeader: question.header,
        id: questionId,
        answer: ''
      }
    }

    const tempAnswerSheet = questionObject.map((question, questionID) => {
      if (question.type === 'text') {
        return initializeTextAnswer(question, questionID)
      } else if (question.type === 'number') {
        return initializeNumberAnswer(question, questionID)
      } else {
        return question
      }
    })

    this.props.initializeAnswerSheet(tempAnswerSheet)
  }

  Submit = async (event, answerSheet) => {
    event.preventDefault()

    const answer = window.confirm(
      'Answers can not be changed after submitting. Continue?'
    )
    if (!answer) return
    try {


      await customerReviewService.create({
        customerReview: {
          answer_sheet: answerSheet,
          group_id: this.props.groupId,
          configuration_id: this.props.configuration
        }
      })






      this.props.setSuccess('Review saved!')
      this.props.history.push('/')
    } catch (e) {
      console.log('error happened', e)
      this.props.setError(e.response.data.error)
    }
  }

  render() {
    const {
      answerSheet,
      updateAnswer,
      isInitializing,
      questionObject,
      groupName,
    } = this.props


    if (isInitializing) {
      return (
        <div className="customer-review-container">
          <h1 className="customer-review-container__h1">Loading!</h1>
        </div>
      )
    } else {
      return (
        <div>
          <h2>Customer review</h2>
          <h3>{groupName}</h3>

          <Questions
            questions={questionObject}
            answerSheet={answerSheet}
            updateAnswer={updateAnswer}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              margin-right="auto"
              margin-left="auto"
              variant="contained"
              color="primary"
              onClick={(event) => this.Submit(event, answerSheet)}
            >
              Submit
            </Button>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groupPage.groups,
    answerSheet: state.customerReviewPage.answerSheet,
    isInitializing: state.customerReviewPage.isInitializing,
    questionObject: state.customerReviewPage.questions,
    groupName: state.customerReviewPage.groupName,
    groupId: state.customerReviewPage.groupId,
    configuration: state.customerReviewPage.configuration
  }
}

const mapDispatchToProps = {
  updateAnswer: customerReviewPageActions.updateAnswer,
  initializeAnswerSheet: customerReviewPageActions.initializeAnswerSheet,
  setLoading: customerReviewPageActions.setLoading,
  setQuestions: customerReviewPageActions.setQuestions,
  setGroupName: customerReviewPageActions.setGroupName,
  setGroupId: customerReviewPageActions.setGroupId,
  setConfiguration: customerReviewPageActions.setConfiguration,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess
}

const ConnectedCustomerReviewPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerReviewPage)
export default withRouter(ConnectedCustomerReviewPage)
