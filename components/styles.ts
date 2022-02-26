import { css } from '@emotion/react';

export const questionsContainerCss = css`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
`;

export const questionCss = css`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 500ms linear;
  flex-direction: column;
  z-index: 0;
  padding: 0 10px;
`;

export const activeQuestionCss = css`
  opacity: 1;
  z-index: 40;
`;

export const selectAnswersCss = css`
  min-width: 200px;
  display: flex;
  justify-content: space-around;
`;
export const scaleAnswersCss = css`
  min-width: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;
export const openAnswersCss = css`
  display: flex;
  justify-content: space-around;
  flex-direction: column;

  button: {
    background: red !important;
  }

  width: 400px;
  @media only screen and (max-width: 480px) {
    width: 90%;
  }
`;

export const questionHeaderCss = css`
  h2  {
    color: #2f2c27;

    text-align: center;
  }

  width: 70%;
  @media only screen and (max-width: 480px) {
    width: 90%;
  }
`;

export const longTextCss = css`
  input {
    height: 200px;
  }
`;
export const inputCss = css`
  input {
    background-color: rgba(255, 255, 255, 0.8);
  }
  input:focus {
    background-color: rgba(255, 255, 255, 1);
  }
  p {
    margin: 0;
    background-color: transparent;
  }
`;
