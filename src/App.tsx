import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
} from '@mui/material';

interface Persona {
  name: string;
  jobTitle: string;
  industry: string;
  painPoints: string;
  decisionMaking: string;
}

interface Product {
  name: string;
  features: string;
  benefits: string;
  price: string;
  uniqueValue: string;
}

function App() {
  const [persona, setPersona] = useState<Persona>({
    name: '',
    jobTitle: '',
    industry: '',
    painPoints: '',
    decisionMaking: '',
  });

  const [product, setProduct] = useState<Product>({
    name: '',
    features: '',
    benefits: '',
    price: '',
    uniqueValue: '',
  });

  const [generatedScript, setGeneratedScript] = useState('');
  const [error, setError] = useState<string>('');

  const handleGenerateScript = async () => {
    try {
      // Placeholder for actual OpenAI integration
      setGeneratedScript(`
        Hello ${persona.name}, my name is [Your Name] from [Your Company].
        I noticed that as a ${persona.jobTitle} in the ${persona.industry} industry,
        you might be facing challenges with ${persona.painPoints}.
        
        I wanted to share that we've developed ${product.name}, which can help
        with ${product.features} and provide ${product.benefits}.
        
        Would you be interested in learning more about how we can help?
      `);
    } catch (err) {
      setError('Failed to generate script. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sales Script Generator
      </Typography>

      <Grid container spacing={3}>
        {/* Persona Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Persona Information
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              value={persona.name}
              onChange={(e) => setPersona({ ...persona, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Job Title"
              value={persona.jobTitle}
              onChange={(e) => setPersona({ ...persona, jobTitle: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Industry"
              value={persona.industry}
              onChange={(e) => setPersona({ ...persona, industry: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Pain Points"
              value={persona.painPoints}
              onChange={(e) => setPersona({ ...persona, painPoints: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Decision Making Process"
              value={persona.decisionMaking}
              onChange={(e) => setPersona({ ...persona, decisionMaking: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Paper>
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Product Information
            </Typography>
            <TextField
              fullWidth
              label="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Key Features"
              value={product.features}
              onChange={(e) => setProduct({ ...product, features: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Benefits"
              value={product.benefits}
              onChange={(e) => setProduct({ ...product, benefits: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Price"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Unique Value Proposition"
              value={product.uniqueValue}
              onChange={(e) => setProduct({ ...product, uniqueValue: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Paper>
        </Grid>

        {/* Generated Script */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Generated Sales Script
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              fullWidth
              value={generatedScript}
              multiline
              rows={10}
              margin="normal"
              variant="outlined"
              disabled
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateScript}
              sx={{ mt: 2 }}
            >
              Generate Script
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
