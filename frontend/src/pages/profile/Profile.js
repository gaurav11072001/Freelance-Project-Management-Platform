import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Button,
  Tabs,
  Tab,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NoData from '../../components/common/NoData';
import ProjectCard from '../../components/projects/ProjectCard';
import ContactButton from '../../components/common/ContactButton';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // In a real implementation, this would come from the Redux store
  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      // This is mock data - in a real app this would come from an API
      setProfile({
        _id: id || currentUser?._id,
        username: id ? 'JohnDoe' : currentUser?.username,
        email: id ? 'john@example.com' : currentUser?.email,
        role: id ? 'freelancer' : currentUser?.role,
        createdAt: new Date(),
        bio: 'Experienced web developer with a passion for creating clean, efficient code and user-friendly interfaces.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
        location: 'New York, USA',
        hourlyRate: 45,
        completedProjects: 24,
        rating: 4.8,
        reviews: [
          {
            _id: '1',
            reviewer: 'Alice Smith',
            rating: 5,
            comment: 'Excellent work! Delivered the project ahead of schedule.',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            _id: '2',
            reviewer: 'Bob Johnson',
            rating: 4,
            comment: 'Good communication and quality work.',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
        ],
        portfolio: [
          {
            _id: '1',
            title: 'E-commerce Website',
            description: 'Built a full-stack e-commerce platform with React and Node.js',
            imageUrl: 'https://source.unsplash.com/random/300x200/?website',
            link: 'https://example.com',
          },
          {
            _id: '2',
            title: 'Task Management App',
            description: 'Developed a mobile-responsive task management application',
            imageUrl: 'https://source.unsplash.com/random/300x200/?app',
            link: 'https://example.com',
          },
        ],
        projects: [
          {
            _id: '1',
            title: 'Website Redesign',
            description: 'Complete redesign of a corporate website with modern UI/UX',
            budget: 2500,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'in-progress',
            client: { username: 'TechCorp' },
            skills: ['UI/UX', 'React', 'CSS'],
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            _id: '2',
            title: 'Mobile App Development',
            description: 'Develop a cross-platform mobile application for inventory management',
            budget: 5000,
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'open',
            client: { username: 'InventorySolutions' },
            skills: ['React Native', 'Firebase', 'API Integration'],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
      });
      setLoading(false);
    }, 1000);

    // In a real app:
    // dispatch(getUserProfile(id || currentUser?._id));
  }, [id, currentUser, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const isOwnProfile = !id || id === currentUser?._id || id === currentUser?.userId;

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!profile) {
    return <NoData title="Profile Not Found" message="The requested profile could not be found." />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={isOwnProfile ? 'My Profile' : `${profile.username}'s Profile`}
        actionText={isOwnProfile ? 'Edit Profile' : ''}
        actionIcon={isOwnProfile ? EditIcon : null}
        actionPath="/profile/edit"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 100, height: 100, mb: 2 }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.username}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profile.role === 'freelancer' ? 'Freelancer' : 'Client'}
              </Typography>
              {profile.role === 'freelancer' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={profile.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({profile.rating})
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {profile.bio}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.location}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Member Since
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(profile.createdAt), 'MMMM yyyy')}
              </Typography>
            </Box>
            
            {!isOwnProfile && (
              <Box sx={{ mt: 3 }}>
                <ContactButton
                  userId={profile._id}
                  variant="contained"
                  fullWidth
                  buttonText="Contact"
                />
              </Box>
            )}

            {profile.role === 'freelancer' && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Hourly Rate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${profile.hourlyRate}/hour
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Completed Projects
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.completedProjects}
                  </Typography>
                </Box>
              </>
            )}

            {profile.role === 'freelancer' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {!isOwnProfile && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Contact
              </Button>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              {profile.role === 'freelancer' && (
                <Tab label="Portfolio" />
              )}
              {profile.role === 'client' && (
                <Tab label="Projects" />
              )}
              {profile.role === 'freelancer' && (
                <Tab label="Reviews" />
              )}
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Portfolio Tab */}
              {profile.role === 'freelancer' && tabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Portfolio</Typography>
                    {isOwnProfile && (
                      <Button
                        startIcon={<AddIcon />}
                        size="small"
                      >
                        Add Item
                      </Button>
                    )}
                  </Box>
                  
                  {profile.portfolio.length === 0 ? (
                    <NoData
                      title="No Portfolio Items"
                      message="No portfolio items have been added yet."
                      actionText={isOwnProfile ? 'Add Portfolio Item' : ''}
                    />
                  ) : (
                    <Grid container spacing={2}>
                      {profile.portfolio.map((item) => (
                        <Grid item xs={12} sm={6} key={item._id}>
                          <Paper
                            sx={{
                              p: 2,
                              position: 'relative',
                              height: '100%',
                            }}
                          >
                            {isOwnProfile && (
                              <IconButton
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  zIndex: 1,
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                            <Box
                              component="img"
                              src={item.imageUrl}
                              alt={item.title}
                              sx={{
                                width: '100%',
                                height: 150,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mb: 2,
                              }}
                            />
                            <Typography variant="subtitle1" gutterBottom>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {item.description}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Project
                            </Button>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}

              {/* Projects Tab for Clients */}
              {profile.role === 'client' && tabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Projects</Typography>
                    {isOwnProfile && (
                      <Button
                        startIcon={<AddIcon />}
                        size="small"
                        href="/projects/create"
                      >
                        Post New Project
                      </Button>
                    )}
                  </Box>
                  
                  {profile.projects.length === 0 ? (
                    <NoData
                      title="No Projects"
                      message="No projects have been posted yet."
                      actionText={isOwnProfile ? 'Post a Project' : ''}
                      actionPath={isOwnProfile ? '/projects/create' : ''}
                    />
                  ) : (
                    <Grid container spacing={3}>
                      {profile.projects.map((project) => (
                        <Grid item xs={12} sm={6} key={project._id}>
                          <ProjectCard project={project} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}

              {/* Reviews Tab */}
              {profile.role === 'freelancer' && tabValue === 1 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Reviews</Typography>
                  </Box>
                  
                  {profile.reviews.length === 0 ? (
                    <NoData
                      title="No Reviews"
                      message="No reviews have been received yet."
                    />
                  ) : (
                    <List>
                      {profile.reviews.map((review) => (
                        <React.Fragment key={review._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1">
                                    {review.reviewer}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {format(new Date(review.date), 'MMM dd, yyyy')}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                    <Rating value={review.rating} readOnly size="small" />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {review.comment}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
