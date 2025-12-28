fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyA48NBQu6n3AzKtmx1pHc5yLhFq8WwiKHA')
  .then(res => res.json())
  .then(data => {
    console.log('\nAvailable Gemini Models:\n');
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log('  ✓ Supports generateContent');
      }
      console.log('');
    });
  })
  .catch(err => console.error('Error:', err));
