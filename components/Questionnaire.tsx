import { Button, CircularProgress, IconButton } from '@mui/material';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Create, Delete } from '@mui/icons-material';
import { useMutation, useQuery } from 'react-query';
import { axiosInstance } from '../code/constants';
import styles from '../styles/Home.module.css';
import { Question } from './types';
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import type { XYCoord, Identifier } from 'dnd-core';
import jscookies from 'js-cookie';
import { useRouter } from 'next/router';
import { deleteQuestion, getQuestions, postQuestions } from '../code/api';
import jscookie from 'js-cookie';

const style = {
  border: '1px solid gray',
  boxShadow: '2px 2px 8px 1px rgba(0,0,0,0.28)',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

export const ItemTypes = {
  CARD: 'card',
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}
export interface CardProps {
  id: any;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string) => void;
}

export const QuestionCard: FC<CardProps> = ({ id, text, index, moveCard, onRemove }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <div className={styles.innerCard}>
        <div className={styles.innerCardText}>{text}</div>
        <div className={styles.innerCardIcons}>
          <IconButton onClick={() => router.push(`questions/${id}`)}>
            <Create />
          </IconButton>
          <IconButton onClick={() => onRemove(id)}>
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export const Questionnaire: FC<{ questions: Question[] }> = ({ questions }) => {
  const { isLoading: isMutationLoading, mutate } = useMutation(postQuestions);
  const [cards, setCards] = useState<Question[]>([]);
  const router = useRouter();
  const { data, refetch, isLoading } = useQuery('questions', getQuestions, {
    enabled: false,
    initialData: { questions },
    keepPreviousData: false,
  });
  const { mutate: removeQuestion } = useMutation(deleteQuestion);

  const onRemove = (id: string) => removeQuestion({ id, token: jscookie.get('token')! }, { onSuccess: () => refetch() });

  useEffect(() => {
    refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.questions) {
      setCards(data.questions);
    }
  }, [data?.questions]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const reorder = () => {
    mutate({ questions: cards, token: jscookies.get('token')! }, { onSuccess: ({ data }) => setCards(data.questions) });
  };

  return (
    <div>
      {cards.map((card, idx) => (
        <QuestionCard key={card.id} index={idx} id={card.id} text={card.text} moveCard={moveCard} onRemove={onRemove} />
      ))}
      <Button variant='contained' onClick={reorder} disabled={isMutationLoading}>
        {isMutationLoading || isLoading ? <CircularProgress /> : 'Uložit pořadí'}
      </Button>
      <Button sx={{ marginX: 2 }} variant='contained' onClick={() => router.push('questions/new')} disabled={isMutationLoading}>
        {isMutationLoading || isLoading ? <CircularProgress /> : 'Vytvořit novou'}
      </Button>
    </div>
  );
};
