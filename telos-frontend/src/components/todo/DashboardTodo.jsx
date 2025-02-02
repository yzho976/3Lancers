/* eslint-disable arrow-body-style */
/* eslint-disable no-restricted-syntax */
// these eslint rules are disabled to allow  sortEvent() function properly.
import { useState } from 'react';
import {
  Checkbox,
  Divider,
  Box,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
  Dialog,
  Button,
  Menu,
  MenuItem,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ErrorIcon from '@material-ui/icons/Error';
import dashboardStyles from './DashboardTodo.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  datecontainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  datetextField: {
    marginRight: theme.spacing(1),
  },
}));

const outdated = {
    color: "red"
}

const DashboardTodo = () => {
  const listitems = [
    {
      name: 'OnGoing',
      due: '2021-04-30',
      onGoing: true,
      completed: false,
    },
    {
      name: 'OutDated',
      due: '2021-01-30',
      onGoing: false,
      completed: true,
    },
    {
      name: '一二三四五',
      due: '2021-04-30',
      onGoing: true,
      completed: true,
    },
    {
      name: '上山打老虎',
      due: '2021-04-30',
      onGoing: true,
      completed: false,
    },
  ];

  const classes = useStyles();
  const [item, setItem] = useState('');
  const [dueDate, setDueDate] = useState('2021-01-01');
  const [newItem, setNewItem] = useState(listitems);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cancel, setCancel] = useState([0]);
  const [reDate, setReDate] = useState('');
  const [reItem, setReItem] = useState('');
  const [add, setAdd] = useState(false);
  const [migrate, setMigrate] = useState(false);

  function dateToTimestamp(endTime) {
    const date = new Date();
    date.setFullYear(endTime.substring(0, 4));
    date.setMonth(endTime.substring(5, 7) - 1);
    date.setDate(endTime.substring(8, 10));
    return Date.parse(date) / 1000;
  }

  // Sort event in order of time line
  const sortEvent = () => {
    const sorted = newItem.sort((a, b) => {
      return dateToTimestamp(a.due) - dateToTimestamp(b.due);
    });
    setNewItem(sorted);
  };

  // Change date for reschedule
  const reDateChange = (event) => {
    setReDate(event.target.value);
    setReItem({ name: reItem.name, due: event.target.value, onGoing: true, completed: false });
  };

  // handle checkbox
  const handleToggle = (value) => () => {
    const newList = [...newItem];
    for (const x of newList) {
      if (x.name === value) {
        x.completed = !x.completed;
      }
    }

    setNewItem(newList);
  };

  const firstEvent = (event) => {
    setItem({ name: event.target.value, due: dueDate, onGoing: true, completed: false });
  };

  const dateChange = (event) => {
    setDueDate(event.target.value);
    setItem({ name: item.name, due: event.target.value, onGoing: true, completed: false });
  };

  const openAdd = () => {
    setAdd(true);
  };

  const closeAdd = () => {
    setAdd(false);
    sortEvent();
  };

  const openMigrate = () => {
    setMigrate(true);
  };

  const closeMigrate = () => {
    setMigrate(false);
    sortEvent();
  };

  const secondEvent = () => {
    setNewItem((prev) => [...prev, item]);
    // setItem('');
  };

  // Open menu
  const handleOption = (value) => (event) => {
    setReItem({
      name: value.name,
      due: value.due,
      onGoing: value.onGoing,
      completed: value.completed,
    });
    setAnchorEl(event.currentTarget);
  };

  const handleOptionClose = () => {
    setAnchorEl(null);
  };

  const cancelEvent = () => {
    const currentIndex = cancel.indexOf(reItem.name);
    const newCancel = [...cancel];

    if (currentIndex === -1) {
      newCancel.push(reItem.name);
    } else {
      newCancel.splice(currentIndex, 1);
    }
    setCancel(newCancel);
    setAnchorEl(null);
  };

  const deleteEvent = () => {
    const newList = [...newItem];
    for (const x of newList) {
      if (x.name === reItem.name) {
        const index = newList.indexOf(x);
        newList.splice(index, 1);
      }
    }

    setNewItem(newList);
    setAnchorEl(null);
  };

  const scheduleEvent = () => {
    const newList = [...newItem];
    const reItemInst = reItem;

    for (const x of newList) {
      if (x.name === reItemInst.name) {
        x.due = reItemInst.due;
      }
    }

    setNewItem(newList);
    setAnchorEl(null);
  };

  return (
    <Box className={dashboardStyles.container}>
      <div className={dashboardStyles.header}>
        <p> To Do </p>
      </div>
      <Divider />
      <List className={classes.root}>
        {newItem.map((value) => {
          const labelId = `checkbox-list-label-${value.name}`;

          return (
            <ListItem
              className={dashboardStyles.listItem}
              key={value.name}
              role={undefined}
              dense
              button
              onClick={handleToggle(value.name)}
            >
              {value.onGoing ? (
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    style={{ color: '#6200EE' }}
                    checked={value.completed === true}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
              ) : (
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    style={{ color: '#FF0000' }}
                    checked={value.completed === true}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
              )}
              {value.onGoing ? (
                <ListItemText
                  id={labelId}
                  primary={` ${value.name}`}
                  secondary={` ${value.due}`}
                  style={{
                    textDecorationLine: cancel.indexOf(value.name) !== -1 ? 'line-through' : '',
                    textDecorationStyle: cancel.indexOf(value.name) !== -1 ? 'solid' : '',
                  }}
                />
              ) : (
                <ListItemText
                  primaryTypographyProps={{ style: outdated }}
                  id={labelId}
                  primary={` ${value.name}`}
                  secondary={` ${value.due}`}
                  style={{
                    textDecorationLine: cancel.indexOf(value.name) !== -1 ? 'line-through' : '',
                    textDecorationStyle: cancel.indexOf(value.name) !== -1 ? 'solid' : '',
                  }}
                />
              )}
              {value.onGoing ? (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="schedule"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleOption(value)}
                  >
                    <BlockIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={deleteevent(value.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="schedule"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleOption(value)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              ) : (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="schedule"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleOption(value)}
                  >
                    <ErrorIcon className={dashboardStyles.outdated} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={deleteevent(value.name)}
                  >
                    <DeleteIcon className="outdated" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="schedule"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleOption(value)}
                  >
                    <ErrorIcon className="outdated" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          );
        })}
      </List>
      <div>
        <FormControl className={dashboardStyles.inputbox} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">New To Do</InputLabel>
          <OutlinedInput
            id="outlined-todo"
            value=""
            onChange={firstEvent}
            endAdornment={
              <InputAdornment position="end">
                <IconButton className={dashboardStyles.AddBtn} onClick={openAdd}>
                  <AddIcon className={dashboardStyles.Publish} />
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleOptionClose}
        style={{
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <MenuItem onClick={cancelEvent}>Cancel/Uncancel</MenuItem>
        <MenuItem onClick={deleteEvent}>Delete</MenuItem>
        <MenuItem onClick={openMigrate}>Reschedule</MenuItem>
      </Menu>
      <Dialog open={add} onClose={closeAdd} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New To Do</DialogTitle>
        <DialogContent>
          <form className={classes.datecontainer} noValidate>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Description"
              value={item.name}
              onChange={firstEvent}
              fullWidth
            />
            <TextField
              id="date"
              label="Due date"
              type="date"
              value={dueDate}
              onChange={dateChange}
              className={classes.datetextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={closeAdd}>
            Cancel
          </Button>
          <Button color="primary" onClick={secondEvent}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={migrate} onClose={closeMigrate} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Migrate Event</DialogTitle>
        <DialogContent>
          <form className={classes.datecontainer} noValidate>
            <TextField
              id="reDated"
              label="Reschedule"
              type="date"
              value={reDate}
              onChange={reDateChange}
              className={classes.datetextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={closeMigrate}>
            Cancel
          </Button>
          <Button color="primary" onClick={scheduleEvent}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardTodo;
