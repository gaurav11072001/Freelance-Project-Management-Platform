import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Paper,
  Grid,
  Button,
  Typography,
  Box,
} from '@mui/material';
import FormField from '../common/FormField';
import { createProject, updateProject } from '../../features/projects/projectSlice';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(100, 'Description must be at least 100 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  category: Yup.string()
    .required('Category is required'),
  budget: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) || value === '' ? null : value))
    .positive('Budget must be positive')
    .min(1, 'Budget must be at least 1 if provided'),
  deadline: Yup.date()
    .required('Deadline is required')
    .min(new Date(), 'Deadline must be in the future'),
  skills: Yup.array()
    .of(Yup.string())
    .required('At least one skill is required')
    .min(1, 'At least one skill is required'),
});

const ProjectForm = ({ project = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    budget: project?.budget ? String(project.budget) : '',
    deadline: project?.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
    skills: Array.isArray(project?.skills) ? [...project.skills] : [],
  };
  
  // Log the initial values to help with debugging
  console.log('Project form initialValues:', initialValues);

  const categoryOptions = [
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Writing', label: 'Writing' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Other', label: 'Other' },
  ];

  const skillOptions = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'SQL', label: 'SQL' },
    { value: 'AWS', label: 'AWS' },
    { value: 'Docker', label: 'Docker' },
    { value: 'UI Design', label: 'UI Design' },
    { value: 'Content Writing', label: 'Content Writing' },
  ];

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (project) {
        await dispatch(updateProject({ id: project._id, projectData: values })).unwrap();
      } else {
        await dispatch(createProject(values)).unwrap();
      }
      navigate('/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {project ? 'Edit Project' : 'Create New Project'}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  component={FormField}
                  name="title"
                  label="Project Title"
                  placeholder="Enter a descriptive title for your project"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={FormField}
                  name="description"
                  label="Project Description"
                  multiline
                  rows={6}
                  placeholder="Describe your project requirements, goals, and expectations..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  component={FormField}
                  name="category"
                  label="Category"
                  type="select"
                  options={categoryOptions}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  component={FormField}
                  name="budget"
                  label="Budget ($) - Optional"
                  type="number"
                  placeholder="Enter your project budget (optional)"
                  inputProps={{
                    min: 1,
                    step: 1
                  }}
                  helperText="Leave blank if budget is flexible or to be discussed"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  component={FormField}
                  name="deadline"
                  label="Deadline"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  component={FormField}
                  name="skills"
                  label="Required Skills"
                  type="select"
                  options={skillOptions}
                  multiple
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/projects')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="netflix"
                    disabled={isSubmitting}
                  >
                    {project ? 'Update Project' : 'Create Project'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ProjectForm;
