
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to wait/sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fn();
      
      if (response.status === 429) {
        // Rate limit hit, wait before retrying
        const waitTime = Math.min(Math.pow(2, attempt) * 1000, 10000); // Cap at 10 seconds
        console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
        
        if (attempt < maxRetries) {
          await sleep(waitTime);
          continue;
        }
      }
      
      if (response.ok) {
        return response;
      }
      
      // For other errors, still retry but with different logic
      if (attempt < maxRetries) {
        const waitTime = Math.min(Math.pow(2, attempt) * 500, 5000);
        console.log(`API error (${response.status}), retrying in ${waitTime}ms`);
        await sleep(waitTime);
        continue;
      }
      
      return response;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      
      const waitTime = Math.min(Math.pow(2, attempt) * 500, 5000);
      await sleep(waitTime);
    }
  }
  
  throw new Error('Max retries exceeded');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the API key from environment variables
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    console.log('Checking for GROQ_API_KEY...');
    console.log('API key found:', !!groqApiKey);
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'Groq API key is not configured. Please contact support.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing AI analysis request...');

    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await retryWithBackoff(async () => {
      console.log('Making request to Groq API with Llama 3.1 8B Instant...');
      return await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are a professional sustainability and ESG analyst specializing in greenwashing detection. Provide detailed, actionable analysis based on company scoring data. Your analysis should be comprehensive, evidence-based, and suitable for investment decision-making. Format your response in clear sections with headers and bullet points for readability.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.3,
        }),
      });
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errorData);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Groq API rate limit exceeded. Please try again in a few moments.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 401) {
        return new Response(JSON.stringify({ 
          error: 'Invalid Groq API key. Please check your configuration.' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: `Groq API error: ${response.statusText}. ${errorData.error?.message || ''}` 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Successfully received response from Groq API');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid response format:', data);
      return new Response(JSON.stringify({ 
        error: 'Invalid response format from Groq API' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-analysis function:', error);
    
    let errorMessage = 'An unexpected error occurred while generating analysis.';
    let statusCode = 500;
    
    if (error.message.includes('rate limit')) {
      statusCode = 429;
      errorMessage = 'Groq API rate limit exceeded. Please try again in a few moments.';
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
