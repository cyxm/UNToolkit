import './Home.css';
import { Grid, Card, CardActionArea, CardContent, CardMedia, Typography, Box } from "@mui/material";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { useHomeStore } from './homeStore.js';

const iconMap = {
  BarChartIcon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=graph%20editor%20icon%20in%20blue%20colors&image_size=square_hd',
};

export default function Home() {
  const { menuItems } = useHomeStore();
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    navigate(`/${item.path}`);
  };

  return (
    <Box sx={{ 
      p: 4, 
      height: '100%', 
      overflow: 'auto',
      backgroundColor: '#f5f5f5'
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        功能选择
      </Typography>
      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea onClick={() => handleCardClick(item)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={iconMap[item.icon]}
                  alt={item.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
