import { FC } from 'react';
import { AppInput } from './AppInput';

// { type: QuestionType.SCALE, text: 'Nejvíce mě baví začínat nové obchody', order: 4, id: '4', scale: 10 },
//   { type: QuestionType.SCALE, text: 'Jsem samostatný', order: 5, id: '5', scale: 10 },

export const ScaleForm: FC = () => {
  return (
    <>
      <AppInput sx={{ marginY: 1 }} name='scale' type='number' label='Zadejte největší na stupnici' />
    </>
  );
};
