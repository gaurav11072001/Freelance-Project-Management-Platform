import React from 'react';
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../features/projects/projectSlice';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProjectFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.projects);

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const categoryOptions = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'DevOps',
    'Writing',
    'Marketing',
    'Other',
  ];

  const skillOptions = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'SQL',
    'AWS',
    'Docker',
    'UI Design',
    'Content Writing',
  ];

  const handleChange = (field) => (event) => {
    dispatch(setFilters({ [field]: event.target.value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={handleChange('status')}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={handleChange('category')}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {categoryOptions.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Skills</InputLabel>
          <Select
            multiple
            value={filters.skills}
            onChange={handleChange('skills')}
            input={<OutlinedInput label="Skills" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {skillOptions.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Min Budget"
            type="number"
            value={filters.minBudget}
            onChange={handleChange('minBudget')}
            sx={{ width: 150 }}
          />
          <TextField
            label="Max Budget"
            type="number"
            value={filters.maxBudget}
            onChange={handleChange('maxBudget')}
            sx={{ width: 150 }}
          />
        </Box>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleClearFilters}
          sx={{ height: 56 }}
        >
          Clear Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default ProjectFilters;
