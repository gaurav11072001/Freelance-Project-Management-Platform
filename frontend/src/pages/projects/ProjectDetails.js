import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Avatar,
  Tab,
  Tabs,
  Container,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getProjectById, deleteProject } from '../../features/projects/projectSlice';
import BidList from '../../components/projects/BidList';
import BidForm from '../../components/projects/BidForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';
import ContactButton from '../../components/common/ContactButton';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { project, loading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [showBidForm, setShowBidForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Effect for fetching project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        console.log('Loading project with ID:', id);
        const result = await dispatch(getProjectById(id)).unwrap();
        console.log('Project loaded successfully:', result);
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    };
    loadProject();
  }, [dispatch, id]);
  
  // Separate effect for handling URL query parameters
  useEffect(() => {
    // Check if action=bid is in the URL query params
    const searchParams = new URLSearchParams(location.search);
    const action = searchParams.get('action');
    if (action === 'bid') {
      setShowBidForm(true);
      // Only set tab value if the tab exists
      if (project?.bids) {
        setTabValue(0); // Set to the first tab (Proposals)
      }
    }
  }, [location.search, project?.bids]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteProject = async () => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  // Contact functionality now handled by ContactButton component

  // Debug user and project information
  console.log('Current user:', user);
  console.log('Project client:', project?.client);
  console.log('Project status:', project?.status);
  
  // Debug user and project state
  console.log('Current user:', user);
  console.log('Project:', project);
  
  // Check if the user is the project owner
  const isOwner = user?.userId === project?.client?._id || user?._id === project?.client?._id;
  console.log('Is owner:', isOwner);
  
  // Check if user is a freelancer based on their role
  const isFreelancer = user?.role === 'freelancer';
  
  // Can bid if:
  // 1. User is a freelancer
  // 2. Project is open
  // 3. User is not the owner
  // 4. User is authenticated
  const canBid = isFreelancer && 
                project?.status === 'open' && 
                !isOwner && 
                project?._id &&
                user?.userId; // Make sure project is loaded
  
  // Check if user has already bid on this project
  const hasAlreadyBid = project?.bids?.some(bid => {
    const freelancerId = bid.freelancer._id || bid.freelancer;
    return freelancerId === user?.userId || freelancerId === user?._id;
  }) || false;
  
  console.log('Project status:', project?.status);
  console.log('Can bid:', canBid);
  console.log('Has already bid:', hasAlreadyBid);
  console.log('Show bid button:', canBid && !hasAlreadyBid);

  if (loading || !project) {
    return <LoadingSpinner message="Loading project details..." />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={project.title}
        subtitle={`Posted on ${format(new Date(project.createdAt), 'MMM dd, yyyy')}`}
        actionText={isOwner ? 'Edit Project' : ''}
        actionIcon={isOwner ? EditIcon : null}
        actionPath={isOwner ? `/projects/edit/${project._id}` : ''}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Chip
                label={project.status}
                color={
                  project.status === 'open'
                    ? 'success'
                    : project.status === 'in-progress'
                    ? 'primary'
                    : project.status === 'completed'
                    ? 'info'
                    : 'error'
                }
              />
              <Chip
                label={project.category}
                variant="outlined"
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {project.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Skills Required
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {project.skills.map((skill) => (
                <Chip key={skill} label={skill} size="small" />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    Budget: ${project.budget}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    Deadline: {format(new Date(project.deadline), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    Client: {project.client.username}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
              >
                <Tab label={`Proposals (${project.bids?.length || 0})`} />
                {project.milestones?.length > 0 && (
                  <Tab label={`Milestones (${project.milestones.length})`} />
                )}
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <BidList
                projectId={project._id}
                bids={project.bids}
                isOwner={isOwner}
                projectStatus={project.status}
              />
            )}

            {tabValue === 1 && (
              <div>
                {/* Milestone content will go here */}
                <Typography>Milestone tracking coming soon</Typography>
              </div>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Show bid button if user can bid and hasn't already */}
              {(canBid && !hasAlreadyBid) && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    console.log('Submit Proposal button clicked');
                    console.log('Project ID:', project?._id);
                    console.log('User:', user);
                    setShowBidForm(true);
                  }}
                >
                  Submit Proposal
                </Button>
              )}
              
              {/* Show message if user has already bid */}
              {hasAlreadyBid && (
                <Typography color="textSecondary" align="center">
                  You have already submitted a proposal for this project
                </Typography>
              )}

              {!isOwner && project?.client && (
                <ContactButton
                  userId={project.client._id}
                  variant="outlined"
                  fullWidth
                  buttonText="Contact Client"
                />
              )}

              {isOwner && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Project
                  </Button>
                </>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {project.client.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Client
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              Member since {format(new Date(project.client.createdAt || Date.now()), 'MMM yyyy')}
            </Typography>
            {!isOwner && (
              <Button
                variant="text"
                color="primary"
                fullWidth
                onClick={() => navigate(`/profile/${project.client._id}`)}
              >
                View Profile
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {project && project._id && (
        <BidForm
          open={showBidForm}
          onClose={() => setShowBidForm(false)}
          projectId={project._id}
        />
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDeleteProject}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Delete"
        severity="error"
      />
    </Container>
  );
};

export default ProjectDetails;
