import { Button, IconButton } from '@mui/material';
import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AppInput } from './AppInput';
import { v4 as uuidv4 } from 'uuid';
import { RemoveCircle } from '@mui/icons-material';

export const SelectForm: FC = () => {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'answers' });

  return (
    <>
      {fields.map((field, index, arr) => (
        <div key={field.id} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AppInput name={`answers.${index}.text`} fullWidth />
            <IconButton sx={{ width: 20, height: 20 }} color='error' onClick={() => remove(index)}>
              <RemoveCircle />
            </IconButton>
          </div>
        </div>
      ))}
      <Button sx={{ marginTop: 2 }} size='small' variant='contained' onClick={() => append({ id: uuidv4(), text: '' })}>
        + Přidat odpověď
      </Button>
    </>
  );
};
