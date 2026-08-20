import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { DescriptionRounded, OpenInNewRounded, SaveRounded } from '@mui/icons-material';
import { profileService } from '../../services/api';
import PageHeader from '../UI/PageHeader';
import SectionCard from '../UI/SectionCard';

export default function Resume() {
  const [url, setUrl] = useState(''); const [loading, setLoading] = useState(true); const [previewFailed, setPreviewFailed] = useState(false);
  useEffect(() => { profileService.getResume().then(response => setUrl(response.data.resumeUrl || '')).catch(() => setPreviewFailed(true)).finally(() => setLoading(false)); }, []);
  const save = async () => { await profileService.updateResume(url); setPreviewFailed(false); };
  return <Stack spacing={3}>
    <PageHeader title="My Resume" description="Keep your latest resume ready for every opportunity." />
    <SectionCard title="Current resume" subtitle="Use a shareable PDF or Google Drive link."><Stack spacing={2}><TextField fullWidth label="Resume URL" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://drive.google.com/..." /><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><Button variant="contained" startIcon={<SaveRounded />} onClick={save}>Save resume</Button>{url && <Button component="a" href={url} target="_blank" rel="noreferrer" startIcon={<OpenInNewRounded />}>Open resume</Button>}</Stack></Stack></SectionCard>
    {loading ? <SectionCard title="Resume preview"><Box sx={{ height: 420, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box></SectionCard> : url && !previewFailed ? <SectionCard title="Resume preview" subtitle="Preview may depend on your link sharing permissions."><iframe title="Resume preview" src={url} style={{ width: '100%', height: 'min(70vh, 680px)', border: 0, borderRadius: 12 }} onError={() => setPreviewFailed(true)} /></SectionCard> : <SectionCard><Stack alignItems="center" spacing={1.5} sx={{ py: 5, textAlign: 'center' }}><DescriptionRounded color="primary" sx={{ fontSize: 42 }} /><Typography variant="h5">Resume preview unavailable</Typography><Typography color="text.secondary">{url ? 'Open your resume in a new tab, or verify that the link is shareable.' : 'Add a shareable resume URL to get started.'}</Typography>{url && <Button component="a" href={url} target="_blank" rel="noreferrer" variant="outlined" startIcon={<OpenInNewRounded />}>Open resume</Button>}</Stack></SectionCard>}
  </Stack>;
}
