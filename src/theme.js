import { alpha, createTheme } from '@mui/material/styles';

const primaryMain = '#4F46E5';
const secondaryMain = '#22C55E';
const backgroundDefault = '#F8FAFC';
const surfaceMain = '#FFFFFF';
const textPrimary = '#0F172A';
const textSecondary = '#64748B';

export const statusVisuals = {
  PENDING: { label: 'Pending', color: '#F59E0B', chipColor: 'warning' },
  SELECTED: { label: 'Selected', color: secondaryMain, chipColor: 'success' },
  APPLIED: {
    label: 'Applied',
    color: '#4F46E5',
    chipColor: 'primary'
  },
  OA: {
    label: 'Online Assessment',
    color: '#0EA5E9',
    chipColor: 'info'
  },
  INTERVIEW: {
    label: 'Interview',
    color: '#F59E0B',
    chipColor: 'warning'
  },
  HR: {
    label: 'HR Round',
    color: '#8B5CF6',
    chipColor: 'secondary'
  },
  OFFERED: {
    label: 'Offered',
    color: secondaryMain,
    chipColor: 'success'
  },
  REJECTED: {
    label: 'Rejected',
    color: '#EF4444',
    chipColor: 'error'
  }
};

const shadows = [
  'none',
  '0 1px 2px rgba(15, 23, 42, 0.04)',
  '0 6px 18px rgba(15, 23, 42, 0.06)',
  '0 12px 28px rgba(15, 23, 42, 0.08)',
  '0 16px 36px rgba(15, 23, 42, 0.1)',
  '0 20px 44px rgba(15, 23, 42, 0.12)',
  ...Array(19).fill('0 20px 44px rgba(15, 23, 42, 0.12)')
];

export const makeTheme = (mode = 'light') => createTheme({
  spacing: 8,
  shape: {
    borderRadius: 16
  },
  shadows,
  palette: {
    mode,
    primary: {
      main: primaryMain,
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: secondaryMain,
      light: '#86EFAC',
      dark: '#15803D',
      contrastText: '#052E16'
    },
    background: {
      default: mode === 'dark' ? '#0F172A' : backgroundDefault,
      paper: mode === 'dark' ? '#172033' : surfaceMain
    },
    text: {
      primary: mode === 'dark' ? '#F8FAFC' : textPrimary,
      secondary: mode === 'dark' ? '#CBD5E1' : textSecondary
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#B91C1C',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#B45309',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#0EA5E9',
      light: '#7DD3FC',
      dark: '#0369A1',
      contrastText: '#FFFFFF'
    },
    success: {
      main: secondaryMain,
      light: '#86EFAC',
      dark: '#15803D',
      contrastText: '#FFFFFF'
    },
    divider: mode === 'dark' ? '#334155' : '#E2E8F0'
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.1
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.15
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.25
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.35
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.01em'
    },
    body1: {
      fontSize: '0.95rem',
      fontWeight: 400,
      lineHeight: 1.65
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6
    },
    button: {
      fontSize: '0.95rem',
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          color: mode === 'dark' ? '#F8FAFC' : textPrimary,
          backgroundColor: mode === 'dark' ? '#0F172A' : backgroundDefault,
          backgroundImage: mode === 'dark' ? `
            radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), transparent 28%),
            radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 25%),
            linear-gradient(180deg, #0F172A 0%, #111827 100%)
          ` : `
            radial-gradient(circle at top left, rgba(79, 70, 229, 0.10), transparent 26%),
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.10), transparent 24%),
            linear-gradient(180deg, #F8FAFC 0%, #EEF4FF 100%)
          `
        },
        '#root': {
          minHeight: '100vh'
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg'
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha(mode === 'dark' ? '#475569' : '#CBD5E1', 0.7)}`,
          borderRadius: 20,
          boxShadow: shadows[2]
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      variants: [
        {
          props: { variant: 'contained', color: 'error' },
          style: {
            boxShadow: '0 10px 24px rgba(239, 68, 68, 0.18)',
            '&:hover': {
              boxShadow: '0 16px 30px rgba(239, 68, 68, 0.22)'
            }
          }
        },
        {
          props: { variant: 'outlined', color: 'error' },
          style: {
            '&:hover': {
              backgroundColor: alpha('#EF4444', 0.06),
              borderColor: alpha('#EF4444', 0.5)
            }
          }
        }
      ],
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease'
        },
        contained: {
          boxShadow: '0 10px 24px rgba(79, 70, 229, 0.18)',
          '&:hover': {
            transform: 'translateY(-1px) scale(1.02)',
            boxShadow: '0 16px 30px rgba(79, 70, 229, 0.22)'
          }
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
            backgroundColor: alpha(primaryMain, 0.05),
            transform: 'translateY(-1px)'
          }
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.08)
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: alpha(mode === 'dark' ? '#1E293B' : surfaceMain, 0.94),
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(primaryMain, 0.48)
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 4px ${alpha(primaryMain, 0.12)}`
          }
        },
        input: {
          paddingTop: 14,
          paddingBottom: 14
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#CBD5E1' : textSecondary,
          fontWeight: 500
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha(mode === 'dark' ? '#172033' : surfaceMain, 0.9),
          color: mode === 'dark' ? '#F8FAFC' : textPrimary,
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${alpha(mode === 'dark' ? '#475569' : '#CBD5E1', 0.7)}`,
          boxShadow: 'none'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha('#CBD5E1', 0.8)
        },
        head: {
          backgroundColor: alpha(primaryMain, 0.06),
          color: textSecondary,
          fontWeight: 700
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: `1px solid ${alpha(mode === 'dark' ? '#475569' : '#CBD5E1', 0.7)}`
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 14
        }
      }
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
});

const theme = makeTheme();
export default theme;
