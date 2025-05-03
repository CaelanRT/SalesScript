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

// Types for objection handling feature
export interface ObjectionResponse {
  objection: string;
  context: string;
  isResolved: boolean;
}

// Function to generate an initial objection based on the script and persona
export const generateObjection = async (
  script: string,
  { persona, product }: ScriptGenerationRequest
): Promise<ObjectionResponse> => {
  try {
    console.log('Generating initial objection');
    
    const prompt = `You are a sales objection simulator acting as ${persona.name}, a ${persona.jobTitle} at ${persona.companyName} in the ${persona.industry} industry.

You've just heard this sales pitch:
${script}

Based on the persona's pain points (${persona.painPoints}) and decision-making process (${persona.decisionMaking}), generate a realistic, common objection that this person might raise.

Choose from objection types like:
- Price/budget concerns
- Timing issues
- Satisfaction with current solution
- Need for stakeholder approval
- Implementation concerns
- ROI skepticism
- Feature comparison

Provide your response in JSON format with these fields:
- objection: The actual objection statement as spoken by the prospect
- context: Brief explanation of why this objection is relevant to this persona
- isResolved: false

Response:
`;
    
    // Use fetch API to handle the response
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
    
    console.log('Full objection response:', fullResponse);
    
    // Extract the JSON object from the response
    // Find the first occurrence of { and the last occurrence of }
    const jsonStart = fullResponse.indexOf('{');
    const jsonEnd = fullResponse.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = fullResponse.substring(jsonStart, jsonEnd);
      try {
        const objectionData = JSON.parse(jsonStr);
        return {
          objection: objectionData.objection || 'I need to think about it.',
          context: objectionData.context || 'The prospect is hesitant.',
          isResolved: false
        };
      } catch (e) {
        console.error('Error parsing objection JSON:', e);
        return {
          objection: 'I appreciate your presentation, but I need to think about it more.',
          context: 'The prospect is giving a generic objection due to uncertainty.',
          isResolved: false
        };
      }
    } else {
      return {
        objection: 'This sounds interesting, but what about the cost? It seems a bit high for our current budget.',
        context: 'Price objection is common in initial sales conversations.',
        isResolved: false
      };
    }
  } catch (error: any) {
    console.error('Error generating objection:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to generate objection. Please check the console for details.');
  }
};

// Function to handle the user's response to an objection
export const handleObjectionResponse = async (
  script: string,
  objection: ObjectionResponse,
  userResponse: string,
  { persona, product }: ScriptGenerationRequest
): Promise<ObjectionResponse> => {
  try {
    console.log('Processing user response to objection');
    
    const prompt = `You are a sales objection simulator acting as ${persona.name}, a ${persona.jobTitle} at ${persona.companyName} in the ${persona.industry} industry with these pain points: ${persona.painPoints}.

Sales context:
${script}

Your previous objection: "${objection.objection}"

The salesperson from ${product.companyName} responded: "${userResponse}"

Evaluate how effectively the salesperson addressed your objection. Then, acting as the prospect, respond in one of these ways:

1. If they addressed your concern well: Show interest but raise a related follow-up objection or question
2. If they partially addressed it: Acknowledge their point but press for more specific information
3. If they didn't address it effectively: Restate your concern more firmly
4. If they completely resolved it: Show clear interest in moving forward

Provide your response in JSON format with these fields:
- objection: Your new statement/question as the prospect
- context: Brief explanation of why you responded this way
- isResolved: true only if the objection is fully resolved and you're ready to move forward

Response:
`;
    
    // Use fetch API to handle the response
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
    
    console.log('Full response handler response:', fullResponse);
    
    // Extract the JSON object from the response
    // Find the first occurrence of { and the last occurrence of }
    const jsonStart = fullResponse.indexOf('{');
    const jsonEnd = fullResponse.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = fullResponse.substring(jsonStart, jsonEnd);
      try {
        const responseData = JSON.parse(jsonStr);
        return {
          objection: responseData.objection || 'I need to discuss this with my team.',
          context: responseData.context || 'The prospect is considering the response.',
          isResolved: responseData.isResolved || false
        };
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        return {
          objection: 'You make some good points. Let me think about this and get back to you.',
          context: 'The prospect needs more time to consider.',
          isResolved: false
        };
      }
    } else {
      return {
        objection: "That's helpful. I'd like to discuss this with my team before making a decision.",
        context: 'The prospect is showing interest but needs internal alignment.',
        isResolved: false
      };
    }
  } catch (error: any) {
    console.error('Error handling objection response:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to process response. Please check the console for details.');
  }
};
