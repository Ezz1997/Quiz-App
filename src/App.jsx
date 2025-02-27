import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Questions from "./QuestionsData";
import './App.css';

const QUESTIONS_NUM = 20;
// Each question will have same weight
const QUESTION_WEIGHT = 5;

const centerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const mainCenterStyle = {
  ...centerStyle,
  position: "absolute",
  height: "100%",
  width: "100%",
};

// Fisher-Yates shuffle
function shuffleQuestions() {
  for (let i = Questions.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [Questions[i], Questions[j]] = [Questions[j], Questions[i]];
  }
}

shuffleQuestions();

export default function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("Good Luck!");
  const [curIndex, setCurIndex] = useState(0);
  const [grade, setGrade] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);


  // This function handles adding each selected answer to the answers array
  // based on the current index which serves as an id for each question,
  // in case the index for that question already exists the value for it will be replaced
  const handleRadioChange = (event) => {
    setValue(event.target.value);

    const newList = [...answers];
    const answer = newList.find((a) => a.id === curIndex);
    if (answer) {
      // existing entry
      answer.value = event.target.value;
      setAnswers(newList);
    } else {
      // new entry
      setAnswers([
        ...answers,
        {
          id: curIndex,
          value: event.target.value,
          correctAnswer: Questions[curIndex].correctAnswer,
        },
      ]);
    }
  };

  function displayMessage(message, isError) {
    setHelperText(message);
    setError(isError);
  }

  // If All Questions Answered: display success message, then calculate grade
  // Else: Display error message for 3 seconds then hide it
  const handleSubmit = (event) => {
    event.preventDefault();

    if (answers.length < QUESTIONS_NUM) {
      displayMessage("Please answer all questions.", true);

      setTimeout(() => {
        displayMessage(" ", false);
      }, 3000);
    } else {
      displayMessage("", false);
      const correctAnswers = answers.filter((ans) => {
        return ans.value === ans.correctAnswer;
      });

      setGrade(correctAnswers.length * QUESTION_WEIGHT);
      setIsQuizCompleted(true);
    }
  };

  // check if answer is in the list and update the value accordingly
  function findAnswer(index){
    const answer = answers.find((a) => a.id === index);
    setValue(answer ? answer.value : "");
  }

  function nextQuestion() {
    if (!(curIndex < QUESTIONS_NUM - 1)) return;

    findAnswer(curIndex + 1);
    setCurIndex((curIndex) => curIndex + 1);
  }

  function prevQuestion() {
    if (curIndex < 1) return;

    findAnswer(curIndex - 1);
    setCurIndex((curIndex) => curIndex - 1);
  }

  // reset main values and reshuffle questions
  function resetQuiz() {
    setValue("");
    setCurIndex(0);
    setGrade(0);
    setAnswers([]);
    setIsQuizCompleted(false);
    setHelperText(" ");
    shuffleQuestions();
  }

  return (
    <form onSubmit={handleSubmit} style={mainCenterStyle}>
      <FormControl
        sx={{
          border: 3,
          bgcolor: "#A3D1C6",
          borderColor: "#A3D1C6",
          borderRadius: 2,
          boxShadow: 2,
          width: 0.5,
        }}
        error={error}
        variant="standard"
      >
        <FormLabel
          id={Questions[curIndex].id}
          sx={{
            m: 1,
            "&.MuiFormLabel-root": { color: "black" },
          }}
        >
          {curIndex + 1}.{Questions[curIndex].question}
        </FormLabel>
        <RadioGroup
          sx={{
            m: 1,
            "& .MuiRadio-root": {
              "&:focus": {
                outline: "none",
                color: "#3D8D7A",
              },
            },
            "& .MuiSvgIcon-root": {
              color: "#3D8D7A",
            },
          }}
          aria-labelledby={Questions[curIndex].id}
          name="radio-buttons-group"
          value={value}
          onChange={handleRadioChange}
        >
          {Questions[curIndex].options.map((option, index) => {
            return (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                disabled={isQuizCompleted}
              />
            );
          })}
        </RadioGroup>
        <FormHelperText sx={{ ml: 1, color: "black" }}>
          {helperText}
        </FormHelperText>
        {isQuizCompleted && (
          <FormHelperText sx={{ ml: 1, color: "#d32f2f"}}>
            {answers[curIndex].value === answers[curIndex].correctAnswer
              ? " " // To prevent container size from changing
              : "Correct Answer: ".concat(answers[curIndex].correctAnswer)}
          </FormHelperText>
        )}
        <div style={centerStyle}>
          {curIndex > 0 && (
            <Button
              variant="contained"
              sx={{ m: 1, bgcolor: "#3D8D7A" }}
              onClick={prevQuestion}
            >
              Prev
            </Button>
          )}
          {curIndex < QUESTIONS_NUM - 1 && (
            <Button
              variant="contained"
              sx={{ m: 1, bgcolor: "#3D8D7A" }}
              onClick={nextQuestion}
            >
              Next
            </Button>
          )}
        </div>
        {!isQuizCompleted && (
          <div style={centerStyle}>
            <Button
              sx={{ m: 1, bgcolor: "#3D8D7A", width: "40%" }}
              type="submit"
              variant="contained"
              disabled={isQuizCompleted}
            >
              Submit
            </Button>
            <br />
          </div>
        )}
        <div style={centerStyle}>
          {isQuizCompleted && (
            <Stack sx={{ width: "40%", m: 1 }} spacing={2}>
              {grade >= 60 ? (
                <Alert severity="success">
                  Final Grade: <b>{grade}</b>. You Passed!
                </Alert>
              ) : (
                <Alert severity="error">
                  Final Grade: <b>{grade}</b>. You Failed!
                </Alert>
              )}
              <Button
                sx={{ m: 1, bgcolor: "#3D8D7A" }}
                variant="contained"
                onClick={resetQuiz}
              >
                Try Again
              </Button>
            </Stack>
          )}
        </div>
      </FormControl>
    </form>
  );
}
