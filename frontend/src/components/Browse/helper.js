export const displayStatus = status => {
  switch (status) {
    case 'ready':
      return 'Ready To Start'
    case 'inprogress':
      return 'In Progress'
    case 'review':
      return 'Needs Review'
    case 'deploy':
      return 'Ready To Deploy'
    case 'resolved':
      return 'Resolved'
    case 'invalid':
      return 'Invalid Ticket'
    default:
      return 'Ready To Start'
  }
}

export const styles = theme => ({
  root: {
    ...theme.typography.body1
  },
  header: {
    ...theme.typography.h4,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    boxShadow: theme.shadows[0],
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  button: {
    fontSize: '10px',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2
  },
  customChip: {
    fontSize: '12px',
    marginLeft: '20px'
  },
  prio: {
    ...theme.typography.subtitle2,
    marginLeft: theme.spacing.unit * (6 / 8),
    fontWeight: 'bold'
  },
  div: {
    marginBottom: theme.spacing.unit * 1.5
  },
  item2: {
    order: 3,
    [theme.breakpoints.up('lg')]: {
      order: 2,
    },
  },
  item3: {
    order: 2,
    [theme.breakpoints.up('lg')]: {
      order: 3,
    },
  },
  centeringChildren: {
    display: 'flex',
    alignItems: 'center'
  },
  assigneeField: {
    display: 'flex',
    alignItems: 'baseline'
  },
  cover: {
    position: 'relative',
    zIndex: 1,

    '&:before': {
      content: "''",
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
      zIndex: 2,
      animation: '1s pulsing ease infinite'
    }
  },
  '@keyframes pulsing': {
    '0%': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    '50%': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    '100%': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
  },
  hoverable: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#eee'
    }
  }
});