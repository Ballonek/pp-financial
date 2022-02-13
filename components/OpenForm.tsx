import { FC } from 'react';
import { AppSelect } from './AppSelect';

export const OpenForm: FC = () => {
  return (
    <>
      <AppSelect
        fullWidth
        name='answerType'
        label='Vyberte typ odpovědi'
        options={[
          { text: 'Číslo', value: 'number' },
          { text: 'Krátký text', value: 'string' },
          { text: 'Dlouhý text', value: 'longString' },
        ]}
        sx={{ marginY: 1 }}
      />
    </>
  );
};
