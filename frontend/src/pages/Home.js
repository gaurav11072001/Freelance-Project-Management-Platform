import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  useTheme,
  Paper,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Work as WorkIcon, 
  Person as PersonIcon, 
  Chat as ChatIcon, 
  Payment as PaymentIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      title: 'Post Projects',
      description: 'Post your projects and receive bids from qualified freelancers',
      icon: <WorkIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Find Talent',
      description: 'Browse through profiles of skilled freelancers for your projects',
      icon: <PersonIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Real-time Chat',
      description: 'Communicate with clients and freelancers in real-time',
      icon: <ChatIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Secure Payments',
      description: 'Use our secure escrow payment system for peace of mind',
      icon: <PaymentIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: { xs: 6, md: 10 },
          mb: 8,
          borderRadius: { md: '0 0 20px 20px' },
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  mb: 2
                }}
              >
                Find Expert Freelancers For Your Business
              </Typography>
              <Typography 
                variant="h6" 
                paragraph
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 400,
                  mb: 3,
                  opacity: 0.9
                }}
              >
                Connect with top talent, manage projects efficiently, and make secure payments all in one powerful platform.
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ color: theme.palette.secondary.light, mr: 1 }} />
                  <Typography variant="body1">Verified Freelancers</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ color: theme.palette.secondary.light, mr: 1 }} />
                  <Typography variant="body1">Secure Payments</Typography>
                </Box>
              </Stack>
              
              <Box sx={{ mt: 4 }}>
                {isAuthenticated ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/projects')}
                    sx={{ 
                      py: 1.5, 
                      px: 4, 
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 14px rgba(255,193,7,0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(255,193,7,0.6)',
                      }
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Browse Projects
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ 
                        py: 1.5, 
                        px: 4, 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 14px rgba(255,193,7,0.4)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(255,193,7,0.6)',
                        }
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{ 
                        py: 1.5, 
                        px: 4, 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  p: 1,
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: { md: 'perspective(1000px) rotateY(-5deg)' },
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: { md: 'perspective(1000px) rotateY(0deg)' },
                  },
                }}
              >
                <Box
                  component="img"
                  src="/images/landing/freelance-platform-hero.jpg"
                  alt="Freelance collaboration platform"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 3,
                    display: 'block',
                  }}
                />
                
                {/* Floating elements */}
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    bottom: 30,
                    left: -20,
                    p: 2,
                    borderRadius: 2,
                    width: 180,
                    backgroundColor: 'white',
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Project Completed</Typography>
                    <Typography variant="caption" color="text.secondary">Payment Released</Typography>
                  </Box>
                </Paper>
                
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: -15,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    display: { xs: 'none', sm: 'block' },
                    animation: 'float 3s ease-in-out infinite 1s',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
                    <StarIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
                    <StarIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
                    <StarIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
                    <StarIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
                    <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>5.0</Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            How Our Platform Works
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}
          >
            Our freelance marketplace connects talented professionals with businesses looking for specialized skills
          </Typography>
          <Divider sx={{ width: 80, mx: 'auto', my: 3, borderColor: theme.palette.primary.main, borderWidth: 2 }} />
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  },
                }}
                elevation={2}
              >
                <Box 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: '50%', 
                    bgcolor: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 70,
                    height: 70,
                  }}
                >
                  {React.cloneElement(feature.icon, { style: { fontSize: 36 } })}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Showcase section with image */}
        <Box sx={{ mt: 8, py: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/landing/freelance-collaboration.jpg"
                alt="Freelance collaboration"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h3" gutterBottom fontWeight={700}>
                Collaborate Seamlessly
              </Typography>
              <Typography variant="body1" paragraph>
                Our platform provides powerful tools for effective collaboration between clients and freelancers. From real-time messaging to file sharing and milestone tracking, we make working together easy and productive.
              </Typography>
              <Box sx={{ mt: 3 }}>
                {["Real-time chat system", "File sharing capabilities", "Time tracking tools", "Milestone management"].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1.5 }} />
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                ))}
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{ mt: 3, fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: 10,
          mt: 6,
          borderRadius: { md: '20px 20px 0 0' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -50,
          left: '10%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 0
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
            >
              Ready to Transform Your Freelance Experience?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              paragraph
              sx={{ mb: 4, maxWidth: 700, mx: 'auto', opacity: 0.9 }}
            >
              Join thousands of clients and freelancers who are already using our platform to connect, collaborate, and create amazing work together.
            </Typography>
          </Box>
          
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: theme.palette.secondary.light }}>10K+</Typography>
                <Typography variant="body1">Active Freelancers</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: theme.palette.secondary.light }}>8K+</Typography>
                <Typography variant="body1">Completed Projects</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: theme.palette.secondary.light }}>95%</Typography>
                <Typography variant="body1">Client Satisfaction</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                py: 1.5, 
                px: 4, 
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px rgba(255,193,7,0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(255,193,7,0.6)',
                }
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Sign Up Now
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/projects')}
              sx={{ 
                py: 1.5, 
                px: 4, 
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Browse Projects
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
