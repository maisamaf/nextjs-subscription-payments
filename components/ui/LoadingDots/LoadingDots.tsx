import { Typography } from '@/components/ui/MaterialTailwind';
import s from './LoadingDots.module.css';

const LoadingDots = () => {
  return (
    <Typography className={s.root}>
      <Typography as="span" children />
      <Typography  as="span" children/>
      <Typography  as="span" children/>
    </Typography>
  );
};

export default LoadingDots;
