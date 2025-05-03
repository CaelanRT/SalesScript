interface ScriptGenerationRequest {
  persona: {
    name: string;
    companyName: string;
    jobTitle: string;
    industry: string;
    painPoints: string;
    decisionMaking: string;
  };
  product: {
    name: string;
    companyName: string;
    features: string;
    benefits: string;
    price: string;
    uniqueValue: string;
  };
  tone: 'Friendly' | 'Professional' | 'Assertive';
  format: 'Cold Email' | 'Phone Call Script' | 'LinkedIn Message';
}

// Function to generate a new sales script
export const generateSalesScript = async ({ persona, product, tone, format }: ScriptGenerationRequest): Promise<string> => {
  // Define tone descriptions
  const toneDescriptions: Record<string, string> = {
    'Friendly': 'warm, approachable, and conversational. Use casual language and focus on building rapport.',
    'Professional': 'polished, respectful, and business-appropriate. Maintain formality while being clear and concise.',
    'Assertive': 'confident, direct, and persuasive. Use strong language that conveys expertise and urgency.'
  };
  
  // Define format-specific instructions
  const formatInstructions: Record<string, string> = {
    'Cold Email': 'Create a cold email with a compelling subject line, brief introduction, value proposition, and clear call-to-action. Include appropriate email formatting with greeting and signature.',
    'Phone Call Script': 'Create a cold call script with introduction, engaging questions, value proposition, handling objections, and closing with next steps.',
    'LinkedIn Message': 'Create a concise LinkedIn message that establishes connection, shows you\'ve researched them, provides value, and includes a soft call-to-action appropriate for the platform.'
  };
  
  const prompt = `You are a professional sales script generator. Create a ${format} with a ${tone.toLowerCase()} tone based on the following information:\n\nPersona Information:\n-Name: ${persona.name}\n-Company: ${persona.companyName}\n-Job Title: ${persona.jobTitle}\n-Industry: ${persona.industry}\nPain Points: ${persona.painPoints}\nDecision Making Process: ${persona.decisionMaking}\n\nProduct Information:\n-Name: ${product.name}\n-Your Company: ${product.companyName}\n-Features: ${product.features}\n-Benefits: ${product.benefits}\n-Price: ${product.price}\n-Unique Value Proposition: ${product.uniqueValue}\n\nTone Instructions:\nThe tone should be ${toneDescriptions[tone]}\n\nFormat Instructions:\n${formatInstructions[format]}\n\nGenerate a ${tone.toLowerCase()} ${format.toLowerCase()} that:\n1. Addresses the persona's specific pain points\n2. Highlights how the product can solve their problems\n3. Includes a clear value proposition\n4. Has an appropriate call-to-action for the format\n\n${format === 'Cold Email' ? 'Email' : format === 'LinkedIn Message' ? 'Message' : 'Script'}:\n`;

  try {
    console.log('Generating script with prompt:', prompt);
    
    // Use fetch API to handle streaming responses
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    // Read the response as text
    const text = await response.text();
    
    // Process the response
    let fullResponse = '';
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          fullResponse += data.response;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
    
    console.log('Full response:', fullResponse);
    return fullResponse;
  } catch (error: any) {
    console.error('Error generating script:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to generate script. Please check the console for details.');
  }
};

// Function to tweak an existing script based on user instructions
export const tweakScript = async (
  originalScript: string,
  instruction: string,
  { persona, product, tone, format }: ScriptGenerationRequest
): Promise<string> => {
  try {
    console.log('Tweaking script with instruction:', instruction);
    
    const prompt = `You are a professional sales script editor. You have been given a ${format.toLowerCase()} with a ${tone.toLowerCase()} tone.

Original Script:
${originalScript}

User Instruction: ${instruction}

Please revise the script according to the user's instruction. Maintain the same overall structure, tone (${tone}), and format (${format}), but implement the requested changes.

Revised ${format === 'Cold Email' ? 'Email' : format === 'LinkedIn Message' ? 'Message' : 'Script'}:
`;
    
    // Use fetch API to handle streaming responses
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });
    
    // Read the response as text
    const text = await response.text();
    
    // Process the response
    let fullResponse = '';
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          fullResponse += data.response;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
    
    console.log('Tweaked response:', fullResponse);
    return fullResponse;
  } catch (error: any) {
    console.error('Error tweaking script:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to tweak script. Please check the console for details.');
  }
};
