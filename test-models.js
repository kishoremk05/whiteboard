// Test script to list available Gemini models
const API_KEY = "AIzaSyBemaAVx3IjT4gDin9g4lEqblGdDo-9K5s";

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    console.log("Available models:");
    data.models?.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(", ")}`);
    });
  })
  .catch(err => console.error("Error:", err));
