/** @jsxImportSource @emotion/react */
import { Button, Checkbox, FormGroup, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { gdprCss } from './styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const AppCheckbox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register } = useFormContext();

  return (
    <>
      <div>
        <FormGroup sx={{ display: 'flex', flexDirection: 'row', marginTop: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Checkbox id='gdpr' {...register('gdpr', { required: true })} />
          <Button
            component='label'
            sx={{ minWidth: 0, padding: 0, margin: 0, marginBottom: 0.1, marginLeft: 0.7 }}
            onClick={() => setIsModalOpen(true)}
          >
            <label htmlFor='gdpr' style={{ cursor: 'pointer' }} css={gdprCss}>
              Odesláním souhlasím s GDPR
            </label>
          </Button>
        </FormGroup>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            ...style,
            overflow: 'scroll',
            width: 800,
            height: 600,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography id='modal-modal-title' textAlign='center' variant='h6' component='h2'>
            Chcete se domluvit?
            <br />
            Je potřeba požádat o souhlas se zpracováním dat.
          </Typography>

          <Typography id='modal-modal-title' textAlign='center' variant='h6' component='h2'>
            *
          </Typography>
          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Abychom Vás mohli kontaktovat v případě,
            <br />
            že úspěšně vyplníte dotazník. Veškerá data
            <br />
            zpracováváme a uchováváme bezpečně dle zákona
            <br /> o Zpracování a ochraně osobních údajů č. 101/2000 Sb.,
            <br />a Nařízení Evropského parlamentu a Rady (EU)
            <br />
            2016/679 (GDPR).
          </Typography>

          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Můžeme Vás také kontaktovat se zajímavou
            <br /> nabídkou obchodní spolupráce a to
            <br /> prostřednictvím elektronické pošty, telefonického
            <br />
            hovoru nebo SMS zprávy. Zpracovatel je <br />
            Investhy a.s., IČO: 08571465, se sídlem: <br />
            Václavské náměstí 846/1,
            <br />
            Nové Město, Praha 1, 110 00.
          </Typography>

          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Kdykoliv můžete požádat o smazání svých dat
            <br />
            zaslanou žádostí na info@investhy.cz
            <br />
            Ze zákona jsme tak povinní to zajistit.
          </Typography>

          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Zaškrtnutím dáváte najevo svůj dobrovolný souhlas.
          </Typography>

          <Button onClick={() => setIsModalOpen(false)} sx={{ marginTop: 3 }} variant='contained'>
            Zavřít
          </Button>
        </Box>
      </Modal>
    </>
  );
};
