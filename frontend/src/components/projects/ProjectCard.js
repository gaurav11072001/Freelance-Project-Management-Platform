import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  Rating,
  Stack,
  IconButton,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  FavoriteBorder as FavoriteIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Default project images
const defaultProjectImages = [
  '/images/projects/project_images/project1.jpg',
  '/images/projects/project_images/project2.jpg',
  '/images/projects/project_images/project3.jpg',
  '/images/projects/project_images/project4.jpg',
  '/images/projects/project_images/project5.jpg',
];

// Get a random default project image
const getRandomProjectImage = () => {
  const randomIndex = Math.floor(Math.random() * defaultProjectImages.length);
  return defaultProjectImages[randomIndex];
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  const projectImage = project.image || getRandomProjectImage();
  const budget = project.budget?.toLocaleString() || 'Flexible';
  const bidCount = project.bids?.length || 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid #F0F0F0',
        backgroundColor: '#FFFFFF',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={projectImage}
          alt={project.title}
          sx={{
            transition: 'transform 0.6s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: 'brightness(0.95)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)',
          }}
        />
        <Chip
          label={project.status || 'Open'}
          color={project.status === 'completed' ? 'success' : 'primary'}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontWeight: 500,
            borderRadius: 100,
            px: 1,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& .MuiChip-label': { px: 1 },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={project.client?.avatar}
            sx={{
              width: 36,
              height: 36,
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {project.client?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ ml: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.2,
              }}
            >
              {project.client?.username || 'Client'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.2,
              }}
            >
              {bidCount} {bidCount === 1 ? 'Bid' : 'Bids'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 3, pt: 2.5, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            label={project.category || 'General'}
            size="small"
            color="primary"
            sx={{
              borderRadius: 100,
              height: 24,
              backgroundColor: 'rgba(56, 64, 222, 0.08)',
              color: 'primary.main',
              fontWeight: 500,
              '& .MuiChip-label': { px: 1.5 },
            }}
          />
          <Typography
            variant="body2"
            sx={{ 
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <TimeIcon fontSize="small" sx={{ fontSize: 16 }} />
            {format(new Date(project.createdAt), 'MMM d')}
          </Typography>
        </Box>
        
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 500,
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
            lineHeight: 1.4,
            color: '#000000',
          }}
        >
          {project.title}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '4.5em',
            color: 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          {project.description}
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 'auto',
            pt: 2,
            borderTop: '1px solid #F5F5F5',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon fontSize="small" sx={{ color: 'primary.main', mr: 0.5 }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              ${budget}
            </Typography>
          </Box>
          
          <Button
            size="small"
            color="primary"
            variant={project.status === 'open' ? 'contained' : 'outlined'}
            onClick={() => navigate(`/projects/${project._id}${project.status === 'open' ? '?action=bid' : ''}`)}
            sx={{
              borderRadius: 100,
              px: 2,
              py: 0.5,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: project.status === 'open' ? '0 4px 12px rgba(56, 64, 222, 0.2)' : 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: project.status === 'open' ? '0 6px 16px rgba(56, 64, 222, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {project.status === 'open' ? 'Submit Proposal' : 'View Details'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
