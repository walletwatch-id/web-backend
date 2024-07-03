import { Box, Container, Toolbar, Typography } from '@mui/material';

export function About() {
  return (
    <Box component="section" className="w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full p-4 rounded-2xl"
      >
        <Toolbar className="min-h-[2.5rem] h-auto p-0 mb-4">
          <Typography variant="h6" component="h2" className="font-medium">
            Tentang
          </Typography>
        </Toolbar>
        <Typography variant="body2" component="p" className="text-justify	">
          Aplikasi automatic self-Control berbasis machine learning untuk meminimalisir tingkat
          kecanduan pengguna paylater.
        </Typography>
      </Container>
    </Box>
  );
}
