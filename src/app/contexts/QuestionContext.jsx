"use client";
import { createContext, useContext, useState } from "react";

const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [userId, setUserId] = useState(null);

  const setQuestion = (id, data) => {
    setCurrentQuestionId(id);
    setQuestionData(data);
  };

  const clearQuestion = () => {
    setCurrentQuestionId(null);
    setQuestionData(null);
  };

  const setUserIdentity = (id) => {
    setUserId(id);
  };

  return (
    <QuestionContext.Provider
      value={{
        currentQuestionId,
        questionData,
        userId,
        setQuestion,
        clearQuestion,
        setUserIdentity,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestion must be used within a QuestionProvider");
  }
  return context;
}
