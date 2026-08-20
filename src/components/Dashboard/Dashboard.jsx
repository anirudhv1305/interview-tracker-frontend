import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { AddRounded, CalendarMonthRounded, CheckCircleRounded, ChevronRightRounded, EventRounded, InsightsRounded, ScheduleRounded, WorkOutlineRounded } from '@mui/icons-material';
import { interviewService, jobService } from '../../services/api';
import PageHeader from '../UI/PageHeader';
import SectionCard from '../UI/SectionCard';
import RoundTimeline from '../UI/RoundTimeline';
import StatCard from './StatCard';
import StatusChart from './StatusChart';

const statusLabel = value => value === 'SELECTED' || value === 'OFFERED' ? 'Selected' : value === 'REJECTED' ? 'Rejected' : 'Pending';
const toDate = item => new Date(`${item.interviewDate}T${item.interviewTime || '00:00'}`);
const formatDate = item => toDate(item).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const formatTime = item => item.interviewTime ? toDate(item).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Time to be confirmed';
const roundsFor = item => item.plannedRounds?.length ? item.plannedRounds : Array.from({ length: item.totalRounds || 1 }, (_, index) => index === item.currentRoundNumber - 1 ? item.currentRoundName || `Round ${index + 1}` : `Round ${index + 1}`);
function remaining(date) { const ms = date - new Date(); if (ms <= 0) return 'Ready to update'; const days = Math.floor(ms / 86400000); const hours = Math.floor((ms % 86400000) / 3600000); return days ? `${days}d ${hours}h remaining` : `${hours}h remaining`; }

export default function Dashboard({ setView }) {
  const [jobs, setJobs] = useState([]); const [interviews, setInterviews] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = async () => { setLoading(true); setError(''); try { const [jobResponse, interviewResponse] = await Promise.all([jobService.getAll(), interviewService.getAll()]); setJobs(jobResponse.data?.data ?? jobResponse.data ?? []); setInterviews(interviewResponse.data?.data ?? interviewResponse.data ?? []); } catch { setError("We couldn't load your placement overview."); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const upcoming = useMemo(() => interviews.filter(item => toDate(item) > new Date()).sort((a, b) => toDate(a) - toDate(b)), [interviews]);
  const active = useMemo(() => jobs.filter(item => statusLabel(item.status) === 'Pending'), [jobs]);
  const counts = useMemo(() => jobs.reduce((result, item) => ({ ...result, [statusLabel(item.status).toUpperCase()]: (result[statusLabel(item.status).toUpperCase()] || 0) + 1 }), { PENDING: 0, SELECTED: 0, REJECTED: 0 }), [jobs]);
  if (loading) return <Stack spacing={3}><PageHeader title="Dashboard" description="Your placement command center" /> <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 2 }}>{[1,2,3,4,5].map(key => <Skeleton key={key} height={140} />)}</Box><Skeleton height={300} /></Stack>;
  return <Stack spacing={{ xs: 3, md: 4 }}>
    <PageHeader title="Dashboard" description="Your placement command center" actions={<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><Button variant="outlined" startIcon={<EventRounded />} onClick={() => setView('interviews')}>Schedule Interview</Button><Button variant="contained" startIcon={<AddRounded />} onClick={() => setView('status')}>Add Application</Button></Stack>} />
    {error && <Alert severity="error" action={<Button color="inherit" onClick={load}>Try again</Button>}>Something went wrong — {error}</Alert>}
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 2 }}>
      <StatCard title="Total applications" value={jobs.length} icon={WorkOutlineRounded} color="primary" />
      <StatCard title="Pending" value={counts.PENDING} icon={ScheduleRounded} color="warning" />
      <StatCard title="Selected" value={counts.SELECTED} icon={CheckCircleRounded} color="success" />
      <StatCard title="Rejected" value={counts.REJECTED} icon={InsightsRounded} color="error" />
      <StatCard title="Upcoming interviews" value={upcoming.length} icon={CalendarMonthRounded} color="info" />
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr .75fr' }, gap: 2 }}>
      <SectionCard title="Next interview" subtitle="Your nearest preparation milestone" action={<Button size="small" endIcon={<ChevronRightRounded />} onClick={() => setView('interviews')}>View interviews</Button>} contentSx={{ p: { xs: 2.5, sm: 3 } }}>
        {upcoming[0] ? <Stack spacing={2.25}><Stack direction="row" justifyContent="space-between" gap={2}><Box><Typography variant="h3">{upcoming[0].companyName}</Typography><Typography color="text.secondary">{upcoming[0].role}</Typography></Box><Chip icon={<ScheduleRounded />} label={remaining(toDate(upcoming[0]))} color="primary" variant="outlined" /></Stack><Divider /><Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}><Box><Typography variant="caption" color="text.secondary">WHEN</Typography><Typography fontWeight={700}>{formatDate(upcoming[0])} · {formatTime(upcoming[0])}</Typography></Box><Box><Typography variant="caption" color="text.secondary">PACKAGE</Typography><Typography fontWeight={700}>{upcoming[0].packageDetails || 'Not specified'}</Typography></Box><Box><Typography variant="caption" color="text.secondary">ROUNDS</Typography><Typography variant="h5">{upcoming[0].totalRounds}</Typography></Box></Stack><RoundTimeline compact rounds={upcoming[0].rounds || []} currentRound={0} /></Stack> : <Stack spacing={1.5} sx={{ py: 2 }}><Typography variant="h5">No upcoming interviews</Typography><Typography color="text.secondary">Schedule your next interview to start preparing.</Typography><Button variant="outlined" sx={{ alignSelf: 'flex-start' }} onClick={() => setView('interviews')}>Schedule Interview</Button></Stack>}
      </SectionCard>
      <SectionCard title="Placement funnel" subtitle="A quick pipeline snapshot" sx={{ height: '100%' }}><Stack spacing={1.5}>{[['Applications', jobs.length], ['Active processes', active.length], ['Selected', counts.SELECTED]].map(([name, value], index) => <React.Fragment key={name}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography color="text.secondary">{name}</Typography><Typography variant="h4">{value}</Typography></Stack>{index < 2 && <Divider />}</React.Fragment>)}</Stack></SectionCard>
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
      <SectionCard title="Current recruitment progress" subtitle="Your active applications"><Stack spacing={2}>{active.length ? active.slice(0, 4).map(item => <Box key={item.id} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 2 }}><Stack direction="row" justifyContent="space-between" gap={1}><Box><Typography fontWeight={700}>{item.companyName}</Typography><Typography variant="body2" color="text.secondary">{item.role}</Typography></Box><Chip size="small" label={`Round ${item.currentRoundNumber || 1} / ${item.totalRounds || 1}`} color="primary" variant="outlined" /></Stack><Box sx={{ mt: 1.5 }}><RoundTimeline compact rounds={roundsFor(item)} currentRound={item.currentRoundNumber || 1} status={item.status} /></Box></Box>) : <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No pending applications. You’re all caught up.</Typography>}</Stack></SectionCard>
      <SectionCard title="Upcoming interviews" subtitle="The next opportunities on your calendar" action={<Button size="small" onClick={() => setView('interviews')}>View all</Button>}><Stack spacing={1.25}>{upcoming.length ? upcoming.slice(0, 4).map(item => <Stack key={item.id} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.25, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}><Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: 'info.light', color: 'info.dark', display: 'grid', placeItems: 'center', flexShrink: 0 }}><CalendarMonthRounded /></Box><Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={700} noWrap>{item.companyName}</Typography><Typography variant="body2" color="text.secondary" noWrap>{item.role} · {formatDate(item)}</Typography></Box><Chip size="small" label="Scheduled" color="info" /></Stack>) : <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>Your scheduled interviews will appear here.</Typography>}</Stack></SectionCard>
    </Box>
    <StatusChart statusCounts={counts} />
  </Stack>;
}
