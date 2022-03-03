export enum QuestionType {
  OPEN = 'OPEN',
  SCALE = 'SCALE',
  SELECT = 'SELECT',
}

export type Answer = {
  id: string;
  text: string;
};
export interface Question {
  id: string;
  order: number;
  text: string;
  type: QuestionType;
  answers?: Answer[];
  answerType?: 'number' | 'string' | 'longString';
  scale?: number;
}

export type QuestionsProps = {};

export type QuestionProps = {
  question: Question;
  questionIndex: number;
};

export type FormProps = {
  welcomeText: string;
  thanksText: string;
  thanksSubText: string;
};

