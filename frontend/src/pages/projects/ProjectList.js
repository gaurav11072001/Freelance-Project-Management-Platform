import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Container,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getProjects } from '../../features/projects/projectSlice';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectFilters from '../../components/projects/ProjectFilters';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NoData from '../../components/common/NoData';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading, filters } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getProjects({ ...filters, search: searchQuery }));
  }, [dispatch, filters, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Projects"
        subtitle="Find projects that match your skills and interests"
        actionText={user?.role === 'client' ? 'Post a Project' : ''}
        actionIcon={user?.role === 'client' ? AddIcon : null}
        actionPath="/projects/create"
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={handleSearch}
        placeholder="Search projects by title, skills, or description..."
      />

      <ProjectFilters />

      {loading ? (
        <LoadingSpinner message="Loading projects..." />
      ) : projects.length === 0 ? (
        <NoData
          title="No Projects Found"
          message="There are no projects matching your search criteria."
          actionText={user?.role === 'client' ? 'Post a Project' : ''}
          actionPath={user?.role === 'client' ? '/projects/create' : ''}
        />
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectList;
