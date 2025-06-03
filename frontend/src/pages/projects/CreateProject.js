import React from 'react';
import { Container } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import ProjectForm from '../../components/projects/ProjectForm';

const CreateProject = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Create a New Project"
        subtitle="Describe your project to attract the right freelancers"
      />
      <ProjectForm />
    </Container>
  );
};

export default CreateProject;
