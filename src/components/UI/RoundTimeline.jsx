import React from 'react';
import { Stack, Typography } from '@mui/material';
import { CheckCircleRounded, RadioButtonCheckedRounded, RadioButtonUncheckedRounded, CancelRounded } from '@mui/icons-material';

export default function RoundTimeline({ rounds = [], currentRound = 1, status = 'PENDING', compact = false }) {
  return <Stack direction={compact ? 'row' : 'column'} spacing={compact ? .75 : 1} flexWrap="wrap" useFlexGap>
    {rounds.map((round, index) => {
      const number = index + 1;
      const rejected = status === 'REJECTED' && number === currentRound;
      const complete = status === 'SELECTED' || status === 'OFFERED' || number < currentRound;
      const current = status !== 'REJECTED' && status !== 'SELECTED' && status !== 'OFFERED' && number === currentRound;
      const Icon = rejected ? CancelRounded : complete ? CheckCircleRounded : current ? RadioButtonCheckedRounded : RadioButtonUncheckedRounded;
      const color = rejected ? 'error.main' : complete ? 'success.main' : current ? 'primary.main' : 'text.disabled';
      return <Stack key={`${round}-${number}`} direction="row" spacing={.5} alignItems="center" sx={{ minWidth: 0 }}>
        <Icon sx={{ color, fontSize: compact ? 17 : 20 }} />
        <Typography variant={compact ? 'caption' : 'body2'} sx={{ color: current ? 'text.primary' : 'text.secondary', fontWeight: current ? 700 : 500, whiteSpace: 'nowrap' }}>{round}</Typography>
        {!compact && <Typography variant="caption" color="text.secondary">{complete ? 'Cleared' : rejected ? 'Rejected' : current ? 'Current' : 'Upcoming'}</Typography>}
        {compact && number < rounds.length && <Typography color="text.disabled">→</Typography>}
      </Stack>;
    })}
  </Stack>;
}
