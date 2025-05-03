import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  CircularProgress,
  ThemeProvider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import theme from './theme';
import { generateSalesScript, tweakScript, generateObjection, handleObjectionResponse, ObjectionResponse } from './services/ollamaService';
import ObjectionSimulator from './components/ObjectionSimulator';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

interface Persona {
  name: string;
  companyName: string;
  jobTitle: string;
  industry: string;
  painPoints: string;
  decisionMaking: string;
}

interface Product {
  name: string;
  companyName: string;
  features: string;
  benefits: string;
  price: string;
  uniqueValue: string;
}

type ToneType = 'Friendly' | 'Professional' | 'Assertive';
type FormatType = 'Cold Email' | 'Phone Call Script' | 'LinkedIn Message';

// Sample data for the example button
const samplePersona: Persona = {
  name: 'John Smith',
  companyName: 'TechInnovate Inc.',
  jobTitle: 'Marketing Director',
  industry: 'Technology',
  painPoints: 'Struggling to track ROI on marketing campaigns, managing multiple campaigns simultaneously, and demonstrating value to executives.',
  decisionMaking: 'Needs data-driven insights and clear metrics to justify budget decisions. Consults with CMO for major purchases.',
};

const sampleProduct: Product = {
  name: 'MarketingPro Analytics',
  companyName: 'DataDrive Solutions',
  features: 'Real-time campaign tracking, ROI calculator, customizable dashboards, automated reporting, integration with major ad platforms.',
  benefits: 'Saves 15+ hours per week on reporting, increases marketing ROI by 27% on average, provides clear attribution for all channels.',
  price: '$499/month with annual commitment',
  uniqueValue: 'Only platform with predictive AI that forecasts campaign performance and recommends budget allocation adjustments.',
};

function App() {
  const [isFormValid, setIsFormValid] = useState(true);

  const validateForm = () => {
    const hasPersona = Object.values(persona).some(value => value.trim() !== '');
    const hasProduct = Object.values(product).some(value => value.trim() !== '');
    const isValid = hasPersona && hasProduct;
    setIsFormValid(isValid);
    return isValid;
  };

  const [persona, setPersona] = useState<Persona>({
    name: '',
    companyName: '',
    jobTitle: '',
    industry: '',
    painPoints: '',
    decisionMaking: '',
  });

  const [product, setProduct] = useState<Product>({
    name: '',
    companyName: '',
    features: '',
    benefits: '',
    price: '',
    uniqueValue: '',
  });

  const [generatedScript, setGeneratedScript] = useState('');
  const [error, setError] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isTweaking, setIsTweaking] = useState(false);
  const [exportFormat, setExportFormat] = useState<'txt' | 'pdf'>('txt');
  const [tone, setTone] = useState<ToneType>('Professional');
  const [scriptFormat, setScriptFormat] = useState<FormatType>('Phone Call Script');
  const [tweakInstruction, setTweakInstruction] = useState('');
  
  // Objection simulator states
  const [isObjectionSimulatorOpen, setIsObjectionSimulatorOpen] = useState(false);
  const [isLoadingObjection, setIsLoadingObjection] = useState(false);
  const [currentObjection, setCurrentObjection] = useState<ObjectionResponse | null>(null);
  const [objectionMessages, setObjectionMessages] = useState<Array<{
    id: number;
    text: string;
    sender: 'user' | 'prospect';
    context?: string;
  }>>([]);
  const [isObjectionResolved, setIsObjectionResolved] = useState(false);

  const handleGenerateScript = async () => {
    if (!isFormValid) return;

    try {
      setIsGenerating(true);
      const script = await generateSalesScript({ persona, product, tone, format: scriptFormat });
      setGeneratedScript(script);
      setError('');
    } catch (error) {
      console.error('Error generating script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleExportFormatChange = (event: SelectChangeEvent) => {
    setExportFormat(event.target.value as 'txt' | 'pdf');
  };
  
  const handleToneChange = (event: SelectChangeEvent) => {
    setTone(event.target.value as ToneType);
  };
  
  const handleScriptFormatChange = (event: SelectChangeEvent) => {
    setScriptFormat(event.target.value as FormatType);
  };
  
  const handleLoadExample = () => {
    setPersona(samplePersona);
    setProduct(sampleProduct);
  };
  
  const handleTweakScript = async () => {
    if (!generatedScript || !tweakInstruction.trim()) return;
    
    try {
      setIsTweaking(true);
      const tweakedScript = await tweakScript(
        generatedScript,
        tweakInstruction,
        { persona, product, tone, format: scriptFormat }
      );
      setGeneratedScript(tweakedScript);
      setTweakInstruction('');
    } catch (error) {
      console.error('Error tweaking script:', error);
      setError('Failed to tweak script. Please try again.');
    } finally {
      setIsTweaking(false);
    }
  };
  
  const handleOpenObjectionSimulator = async () => {
    if (!generatedScript) return;
    
    try {
      setIsLoadingObjection(true);
      setIsObjectionSimulatorOpen(true);
      setObjectionMessages([]);
      setIsObjectionResolved(false);
      
      // Generate the initial objection
      const objection = await generateObjection(generatedScript, { persona, product, tone, format: scriptFormat });
      setCurrentObjection(objection);
      
      // Add the objection to the messages
      setObjectionMessages([{
        id: 1,
        text: objection.objection,
        sender: 'prospect',
        context: objection.context
      }]);
    } catch (error) {
      console.error('Error generating objection:', error);
      setError('Failed to generate objection. Please try again.');
      setIsObjectionSimulatorOpen(false);
    } finally {
      setIsLoadingObjection(false);
    }
  };
  
  const handleSubmitObjectionResponse = async (response: string) => {
    if (!currentObjection || !generatedScript) return;
    
    try {
      setIsLoadingObjection(true);
      
      // Add user response to messages
      const newUserMessageId = objectionMessages.length + 1;
      setObjectionMessages(prev => [...prev, {
        id: newUserMessageId,
        text: response,
        sender: 'user'
      }]);
      
      // Get AI response to user's handling of the objection
      const aiResponse = await handleObjectionResponse(
        generatedScript,
        currentObjection,
        response,
        { persona, product, tone, format: scriptFormat }
      );
      
      // Update current objection
      setCurrentObjection(aiResponse);
      setIsObjectionResolved(aiResponse.isResolved);
      
      // Add AI response to messages
      const newAiMessageId = newUserMessageId + 1;
      setObjectionMessages(prev => [...prev, {
        id: newAiMessageId,
        text: aiResponse.objection,
        sender: 'prospect',
        context: aiResponse.context
      }]);
    } catch (error) {
      console.error('Error handling objection response:', error);
      setError('Failed to process response. Please try again.');
    } finally {
      setIsLoadingObjection(false);
    }
  };
  
  const handleExportScript = () => {
    if (!generatedScript) return;
    
    const fileName = `sales-script-${persona.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;
    
    if (exportFormat === 'txt') {
      // Export as TXT
      const blob = new Blob([generatedScript], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${fileName}.txt`);
    } else {
      // Export as PDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Sales Script', 20, 20);
      
      // Add persona and product info
      doc.setFontSize(12);
      doc.text(`Persona: ${persona.name}, ${persona.jobTitle}`, 20, 30);
      doc.text(`Product: ${product.name}`, 20, 40);
      
      // Add script content with word wrapping
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(generatedScript, 170);
      doc.text(splitText, 20, 55);
      
      // Save the PDF
      doc.save(`${fileName}.pdf`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{
            textAlign: 'center',
            mb: 3,
            fontWeight: 700,
            color: '#393E41',
            position: 'relative',
            display: 'inline-block',
            width: '100%',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #44BBA4, #339985)',
              borderRadius: '2px'
            }
          }}>
            SALES SCRIPT GENERATOR
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            gap: 3, 
            mt: 4,
            mb: 2
          }}>
            <FormControl size="small" sx={{ 
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#44BBA4',
                }
              }
            }}>
              <InputLabel id="tone-select-label">Tone</InputLabel>
              <Select
                labelId="tone-select-label"
                value={tone}
                label="Tone"
                onChange={handleToneChange}
              >
                <MenuItem value="Friendly">Friendly</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Assertive">Assertive</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#44BBA4',
                }
              }
            }}>
              <InputLabel id="format-select-label">Format</InputLabel>
              <Select
                labelId="format-select-label"
                value={scriptFormat}
                label="Format"
                onChange={handleScriptFormatChange}
              >
                <MenuItem value="Cold Email">Cold Email</MenuItem>
                <MenuItem value="Phone Call Script">Phone Call Script</MenuItem>
                <MenuItem value="LinkedIn Message">LinkedIn Message</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLoadExample}
              sx={{ 
                height: 40, 
                borderRadius: 2,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(231, 184, 65, 0.15)'
                }
              }}
            >
              Load Example
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Persona Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4,
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 6px 20px rgba(57, 62, 65, 0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'rgba(211, 208, 203, 0.3)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(57, 62, 65, 0.1)',
              },
            }}>
              <Typography variant="h5" gutterBottom sx={{
                mb: 3,
                color: '#393E41',
                fontWeight: 600,
                position: 'relative',
                display: 'inline-block',
                pb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #44BBA4, #339985)',
                  borderRadius: '2px'
                }
              }}>
                Persona Information
              </Typography>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                value={persona.name}
                onChange={(e) => setPersona({ ...persona, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                margin="normal"
                value={persona.companyName}
                onChange={(e) => setPersona({ ...persona, companyName: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Job Title"
                variant="outlined"
                margin="normal"
                value={persona.jobTitle}
                onChange={(e) => setPersona({ ...persona, jobTitle: e.target.value })}
              />
              <TextField
                fullWidth
                label="Industry"
                variant="outlined"
                margin="normal"
                value={persona.industry}
                onChange={(e) => setPersona({ ...persona, industry: e.target.value })}
              />
              <TextField
                fullWidth
                label="Pain Points"
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                value={persona.painPoints}
                onChange={(e) => setPersona({ ...persona, painPoints: e.target.value })}
              />
              <TextField
                fullWidth
                label="Decision Making Process"
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                value={persona.decisionMaking}
                onChange={(e) => setPersona({ ...persona, decisionMaking: e.target.value })}
              />
            </Paper>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4,
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 6px 20px rgba(57, 62, 65, 0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'rgba(211, 208, 203, 0.3)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(57, 62, 65, 0.1)',
              },
            }}>
              <Typography variant="h5" gutterBottom sx={{
                mb: 3,
                color: '#393E41',
                fontWeight: 600,
                position: 'relative',
                display: 'inline-block',
                pb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #E7B841, #D19F2A)',
                  borderRadius: '2px'
                }
              }}>
                Product Information
              </Typography>
              <TextField
                fullWidth
                label="Product Name"
                variant="outlined"
                margin="normal"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Your Company Name"
                variant="outlined"
                margin="normal"
                value={product.companyName}
                onChange={(e) => setProduct({ ...product, companyName: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Key Features"
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                value={product.features}
                onChange={(e) => setProduct({ ...product, features: e.target.value })}
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
            <Paper sx={{ 
              p: 4,
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 6px 20px rgba(57, 62, 65, 0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'rgba(211, 208, 203, 0.3)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(57, 62, 65, 0.1)',
              },
            }}>
              <Typography variant="h5" gutterBottom sx={{
                mb: 3,
                color: '#393E41',
                fontWeight: 600,
                position: 'relative',
                display: 'inline-block',
                pb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #44BBA4, #E7B841)',
                  borderRadius: '2px'
                }
              }}>
                Generated Sales Script
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                multiline
                minRows={4}
                maxRows={8}
                label={`${scriptFormat} (Editable)`}
                variant="outlined"
                value={generatedScript}
                onChange={(e) => setGeneratedScript(e.target.value)}
                InputProps={{
                  sx: {
                    fontFamily: 'Georgia, serif',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  },
                }}
              />
              
              {generatedScript && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tweak your script with AI assistance or edit directly above
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleOpenObjectionSimulator}
                      disabled={isLoadingObjection}
                      startIcon={isLoadingObjection ? <CircularProgress size={20} /> : undefined}
                    >
                      Handle Common Objections
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      placeholder="e.g., 'Make it shorter' or 'Add more benefits'"
                      variant="outlined"
                      size="small"
                      value={tweakInstruction}
                      onChange={(e) => setTweakInstruction(e.target.value)}
                      disabled={isTweaking}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleTweakScript();
                        }
                      }}
                      InputProps={{
                        endAdornment: isTweaking && (
                          <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleTweakScript}
                      disabled={isTweaking || !tweakInstruction.trim()}
                      sx={{ minWidth: '100px' }}
                    >
                      Tweak
                    </Button>
                  </Box>
                </Box>
              )}
              {isGenerating ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
                  <CircularProgress color="primary" size={40} thickness={4} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
                  <Button
                    onClick={handleGenerateScript}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                    sx={{
                      width: '220px',
                      height: '48px',
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(68, 187, 164, 0.2)',
                      background: 'linear-gradient(135deg, #44BBA4 0%, #339985 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(68, 187, 164, 0.3)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        opacity: 0.7,
                        background: '#D3D0CB',
                      },
                    }}
                  >
                    Generate Script
                  </Button>
                  
                  {generatedScript && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mt: 2,
                      p: 2,
                      bgcolor: '#F8F8F6',
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: '#D3D0CB'
                    }}>
                      <FormControl size="small" sx={{ 
                        minWidth: 120,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'white',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#44BBA4',
                          }
                        }
                      }}>
                        <InputLabel id="export-format-label">Format</InputLabel>
                        <Select
                          labelId="export-format-label"
                          value={exportFormat}
                          label="Format"
                          onChange={handleExportFormatChange}
                        >
                          <MenuItem value="txt">TXT</MenuItem>
                          <MenuItem value="pdf">PDF</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleExportScript}
                        sx={{
                          borderRadius: 2,
                          borderWidth: '2px',
                          '&:hover': {
                            borderWidth: '2px',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(231, 184, 65, 0.15)'
                          }
                        }}
                      >
                        Export Script
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Objection Simulator Dialog */}
      {isObjectionSimulatorOpen && (
        <ObjectionSimulator
          open={isObjectionSimulatorOpen}
          onClose={() => setIsObjectionSimulatorOpen(false)}
          persona={persona}
          product={product}
          script={generatedScript}
          currentObjection={currentObjection}
          onSubmitResponse={handleSubmitObjectionResponse}
          isLoading={isLoadingObjection}
          messages={objectionMessages}
          isResolved={isObjectionResolved}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
