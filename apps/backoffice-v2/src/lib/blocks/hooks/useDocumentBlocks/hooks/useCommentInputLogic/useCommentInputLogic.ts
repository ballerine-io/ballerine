import { useCallback, useState } from 'react';

export const useCommentInputLogic = () => {
  const [comment, setComment] = useState<string>();

  const onCommentChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  }, []);

  const onClearComment = useCallback(() => {
    setComment(undefined);
  }, []);

  return {
    comment,
    onCommentChange,
    onClearComment,
  };
};
