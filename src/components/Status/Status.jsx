import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AddRounded, CheckCircleRounded, CloseRounded, DeleteRounded, EditRounded, RadioButtonCheckedRounded, RadioButtonUncheckedRounded, ScheduleRounded, SearchRounded, UpdateRounded } from '@mui/icons-material';
import { interviewService, jobService } from '../../services/api';
import PageHeader from '../UI/PageHeader';
import RoundBuilder from '../UI/RoundBuilder';
import SectionCard from '../UI/SectionCard';
import RoundTimeline from '../UI/RoundTimeline';

const blank = { companyName: '', role: '', appliedDate: new Date().toISOString().slice(0, 10), status: 'PENDING', totalRounds: 1, currentRoundNumber: 1, currentRoundName: '', plannedRounds: [''], notes: '' };
const label = status => status === 'SELECTED' || status === 'OFFERED' ? 'Selected' : status === 'REJECTED' ? 'Rejected' : 'Pending';
const isDue = interview => new Date(`${interview.interviewDate}T${interview.interviewTime || '00:00'}`) <= new Date();

function Progress({ application }) {
  return <Stack spacing={1}>{Array.from({ length: application.totalRounds || 1 }, (_, index) => {
    const number = index + 1;
    const done = label(application.status) === 'Selected' || number < (application.currentRoundNumber || 1);
    const current = number === (application.currentRoundNumber || 1) && label(application.status) === 'Pending';
    const rejected = number === (application.currentRoundNumber || 1) && label(application.status) === 'Rejected';
    const round = number === (application.currentRoundNumber || 1) ? application.currentRoundName : (application.plannedRounds?.[index] || names[index] || `Round ${number}`);
    return <Stack key={number} direction="row" spacing={1} alignItems="center">
      {done ? <CheckCircleRounded color="success" /> : current ? <RadioButtonCheckedRounded color="primary" /> : rejected ? <CloseRounded color="error" /> : <RadioButtonUncheckedRounded color="disabled" />}
      <Typography>{round}</Typography><Typography variant="caption" color="text.secondary">{done ? 'Cleared' : rejected ? 'Rejected' : current ? 'Current' : 'Upcoming'}</Typography>
    </Stack>;
  })}</Stack>;
}

export default function Status({ onChanged }) {
  const [items, setItems] = useState([]); const [scheduled, setScheduled] = useState([]); const [chosen, setChosen] = useState(null);
  const [form, setForm] = useState(blank); const [edit, setEdit] = useState(false); const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); const [query, setQuery] = useState('');
  const load = async () => { try { const [jobs, interviews] = await Promise.all([jobService.getAll(), interviewService.getAll()]); setItems(jobs.data?.data ?? jobs.data ?? []); setScheduled(interviews.data?.data ?? interviews.data ?? []); } catch { setError('Could not load applications.'); } };
  useEffect(() => { void load(); const timer = setInterval(load, 60000); return () => clearInterval(timer); }, []);
  const open = item => { setChosen(item); setForm({ ...blank, ...item }); setEdit(false); };
  const close = () => { setChosen(null); setEdit(false); };
  const save = async () => { try { const response = chosen ? await jobService.update(chosen.id, form) : await jobService.create(form); const item = response.data?.data ?? response.data; await load(); setChosen(item); setForm({ ...blank, ...item }); setEdit(false); onChanged?.(); } catch { setError('Could not save the application.'); } };
  const remove = async () => { if (!chosen || !window.confirm(`Delete ${chosen.companyName}? This also removes its linked interview.`)) return; try { await jobService.delete(chosen.id); close(); await load(); onChanged?.(); } catch { setError('Could not delete the application.'); } };
  const scheduleFor = item => scheduled.find(interview => interview.applicationId === item.id || (!interview.applicationId && interview.companyName === item.companyName && interview.role === item.role));
  const visible = items.filter(item => (filter === 'ALL' || label(item.status).toUpperCase() === filter) && `${item.companyName} ${item.role}`.toLowerCase().includes(query.toLowerCase()));
  return <Stack spacing={3}>
    <PageHeader title="Applications" description="Track applications and recruitment progress." actions={<Button variant="contained" startIcon={<AddRounded />} onClick={() => { setChosen(null); setForm(blank); setEdit(true); }}>Add application</Button>} />
    {error && <Alert severity="error" action={<Button color="inherit" onClick={load}>Try again</Button>}>{error}</Alert>}
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between"><ToggleButtonGroup exclusive value={filter} onChange={(_, value) => value && setFilter(value)} size="small" aria-label="Application status filter"><ToggleButton value="ALL">All</ToggleButton><ToggleButton value="PENDING">Pending</ToggleButton><ToggleButton value="SELECTED">Selected</ToggleButton><ToggleButton value="REJECTED">Rejected</ToggleButton></ToggleButtonGroup><TextField size="small" placeholder="Search companies or roles" value={query} onChange={event => setQuery(event.target.value)} InputProps={{ startAdornment: <SearchRounded fontSize="small" color="action" sx={{ mr: 1 }} /> }} sx={{ minWidth: { md: 280 } }} /></Stack>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 2 }}>
      {visible.map(item => {
        const interview = scheduleFor(item); const due = interview && isDue(interview);
        return <SectionCard key={item.id} onClick={() => open(item)} sx={{ cursor: 'pointer' }}><Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" gap={1}><Box><Typography variant="h5">{item.companyName}</Typography><Typography color="text.secondary">{item.role}</Typography></Box><Stack direction="row" spacing={.75} alignItems="flex-end"><Chip size="small" label={label(item.status)} color={label(item.status) === 'Selected' ? 'success' : label(item.status) === 'Rejected' ? 'error' : 'warning'} />{interview && label(item.status) === 'Pending' && <Chip size="small" icon={due ? <UpdateRounded /> : <ScheduleRounded />} label={due ? 'Update' : 'Scheduled'} color={due ? 'warning' : 'info'} />}</Stack></Stack>
          <Divider />
          {interview && <Typography variant="caption" color="text.secondary">Interview: {interview.interviewDate} · {interview.interviewTime || 'Time not set'}</Typography>}
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography fontWeight={700}>Round {item.currentRoundNumber || 1} / {item.totalRounds || 1}</Typography><Typography variant="caption" color="text.secondary">{label(item.status) === 'Pending' ? 'Awaiting result' : label(item.status)}</Typography></Stack>
          <RoundTimeline compact rounds={item.plannedRounds?.length ? item.plannedRounds : Array.from({ length: item.totalRounds || 1 }, (_, index) => index === item.currentRoundNumber - 1 ? item.currentRoundName || `Round ${index + 1}` : `Round ${index + 1}`)} currentRound={item.currentRoundNumber || 1} status={item.status} />
          <Typography variant="caption" color="text.secondary">Applied: {item.appliedDate}</Typography>
        </Stack></SectionCard>;
      })}
      {!visible.length && <Box sx={{ gridColumn: '1 / -1', py: 7, textAlign: 'center' }}><Typography variant="h5">No matching applications</Typography><Typography color="text.secondary" sx={{ mt: .5 }}>Try a different search or add a new application.</Typography></Box>}
    </Box>
    <Dialog open={Boolean(chosen) || edit} onClose={close} fullWidth maxWidth="sm" PaperProps={{ sx: { maxHeight: 'calc(100dvh - 32px)' } }}>
      <DialogTitle><Stack direction="row" justifyContent="space-between"><Box><Typography variant="h4">{form.companyName || 'New application'}</Typography><Typography color="text.secondary">{form.role}</Typography></Box><IconButton onClick={close}><CloseRounded /></IconButton></Stack></DialogTitle>
      <DialogContent dividers>{edit ? <Stack spacing={2}>
        <TextField label="Company" value={form.companyName} onChange={event => setForm({ ...form, companyName: event.target.value })} /><TextField label="Role" value={form.role} onChange={event => setForm({ ...form, role: event.target.value })} /><TextField type="date" label="Applied date" InputLabelProps={{ shrink: true }} value={form.appliedDate} onChange={event => setForm({ ...form, appliedDate: event.target.value })} />
        <FormControl><InputLabel>Status</InputLabel><Select label="Status" value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}><MenuItem value="PENDING">Pending</MenuItem><MenuItem value="SELECTED">Selected</MenuItem><MenuItem value="REJECTED">Rejected</MenuItem></Select></FormControl>
        <RoundBuilder totalRounds={form.totalRounds} rounds={form.plannedRounds?.length ? form.plannedRounds : Array.from({ length: form.totalRounds }, (_, index) => index === form.currentRoundNumber - 1 ? form.currentRoundName : '')} showCurrent currentRoundNumber={form.currentRoundNumber} onChange={(totalRounds, rounds) => setForm({ ...form, totalRounds, plannedRounds: rounds, currentRoundNumber: Math.min(form.currentRoundNumber, totalRounds), currentRoundName: rounds[Math.min(form.currentRoundNumber - 1, totalRounds - 1)] || '' })} onCurrentChange={(currentRoundNumber, currentRoundName) => setForm({ ...form, currentRoundNumber, currentRoundName })} />
        <TextField multiline minRows={3} label="Notes" value={form.notes || ''} onChange={event => setForm({ ...form, notes: event.target.value })} />
      </Stack> : <Stack spacing={2.5}><Stack direction="row" spacing={1}><Chip label={label(form.status)} color={label(form.status) === 'Selected' ? 'success' : label(form.status) === 'Rejected' ? 'error' : 'warning'} /><Typography color="text.secondary">Applied {form.appliedDate}</Typography></Stack><Box><Typography variant="subtitle2" color="text.secondary">CURRENT ROUND</Typography><Typography variant="h5">{form.currentRoundName || 'Not set'} · {form.currentRoundNumber || 1} / {form.totalRounds || 1}</Typography></Box><Divider /><Box><Typography variant="h6" sx={{ mb: 1 }}>Recruitment progress</Typography><Progress application={form} /></Box><Divider /><Box><Typography variant="h6">Notes</Typography><Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{form.notes || 'No notes added.'}</Typography></Box></Stack>}</DialogContent>
      <DialogActions sx={{ p: 2 }}>{edit ? <><Button onClick={() => chosen ? (setForm({ ...blank, ...chosen }), setEdit(false)) : close()}>Cancel</Button><Button variant="contained" onClick={save}>Save changes</Button></> : <><Button color="error" startIcon={<DeleteRounded />} onClick={remove} sx={{ mr: 'auto' }}>Delete</Button><Button onClick={close}>Close</Button><Button variant="contained" startIcon={<EditRounded />} onClick={() => setEdit(true)}>Edit</Button></>}</DialogActions>
    </Dialog>
  </Stack>;
}
