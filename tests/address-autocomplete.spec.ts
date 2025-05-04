import { test, expect, Page } from '@playwright/test';

/**
 * E-commerce Address Autocomplete Test
 * 
 * Tests the Geoapify address autocomplete functionality on the user profile page.
 * The test verifies suggestions appear, can be selected, and form validation works.
 */
test.describe('Address Autocomplete Feature', () => {
  let startTime: number;
  let responseTime: number;
  let suggestionsQuality: string;
  let usabilityRating: number;
  let criticalIssues: string[] = [];

  // Helper function to measure time
  const startTimer = () => {
    startTime = performance.now();
  };

  const stopTimer = () => {
    responseTime = performance.now() - startTime;
    return responseTime;
  };

  // Helper to evaluate suggestion relevance
  const evaluateSuggestionRelevance = (query: string, suggestion: string): boolean => {
    const normalizedQuery = query.toLowerCase();
    const normalizedSuggestion = suggestion.toLowerCase();
    return normalizedSuggestion.includes(normalizedQuery);
  };

  test('Address autocomplete functionality', async ({ page }) => {
    // 1. Navigate to profile page
    await page.goto('/account/profile');
    
    // Wait for the page to load completely
    await page.waitForSelector('text=Selected Address:', { state: 'hidden', timeout: 2000 }).catch(() => {
      // If element is already visible, that's fine
    });

    // Check if autocomplete input is present
    const autocompleteInput = page.locator('input[placeholder="Enter an address (GB or PL)"]');
    await expect(autocompleteInput).toBeVisible();

    // 2. Test the autocomplete functionality
    
    // Test Case 1: Type partial address and verify suggestions appear
    const partialAddress = "10 Downing";
    
    startTimer();
    await autocompleteInput.fill(partialAddress);
    
    // Wait for suggestions dropdown to appear
    const suggestionsDropdown = page.locator('.autocomplete-dropdown, [data-testid="suggestions-dropdown"]');
    
    try {
      await suggestionsDropdown.waitFor({ state: 'visible', timeout: 5000 });
      const suggestionResponseTime = stopTimer();
      console.log(`Suggestions appeared in ${suggestionResponseTime}ms`);
      responseTime = suggestionResponseTime;
      
      if (suggestionResponseTime > 2000) {
        criticalIssues.push('Slow response time for address suggestions (>2s)');
      }
    } catch (error) {
      criticalIssues.push('Address suggestions did not appear');
      usabilityRating = 2;
      throw new Error('Address suggestions did not appear');
    }

    // Get all suggestions and verify they're relevant
    const suggestions = await page.locator('.autocomplete-suggestion, [data-testid="suggestion-item"]').all();
    
    if (suggestions.length === 0) {
      criticalIssues.push('No suggestions returned for valid partial address');
      suggestionsQuality = 'Poor';
    } else {
      // Check if suggestions are relevant
      let relevantCount = 0;
      
      for (const suggestion of suggestions) {
        const suggestionText = await suggestion.textContent() || '';
        if (evaluateSuggestionRelevance(partialAddress, suggestionText)) {
          relevantCount++;
        }
      }
      
      const relevancePercentage = (relevantCount / suggestions.length) * 100;
      
      if (relevancePercentage > 80) {
        suggestionsQuality = 'Excellent';
      } else if (relevancePercentage > 50) {
        suggestionsQuality = 'Good';
      } else {
        suggestionsQuality = 'Poor';
        criticalIssues.push('Low relevance of address suggestions');
      }
      
      console.log(`${relevantCount} of ${suggestions.length} suggestions are relevant`);
    }

    // Test Case 2: Select a suggestion and confirm it populates the field
    if (suggestions.length > 0) {
      await suggestions[0].click();
      
      // Verify the selected address appears
      const selectedAddressDisplay = page.locator('text=Selected Address:');
      await expect(selectedAddressDisplay).toBeVisible({ timeout: 2000 });
      
      // Check if the input field has been populated
      const inputValue = await autocompleteInput.inputValue();
      expect(inputValue.length).toBeGreaterThan(partialAddress.length);
    }

    // Test Case 3: Verify form validation with invalid address
    await autocompleteInput.fill('Invalid address that should not match anything');
    
    // Wait a moment for suggestions
    await page.waitForTimeout(2000);
    
    // Check if suggestions appear for invalid input
    const invalidSuggestions = await suggestionsDropdown.isVisible();
    
    if (invalidSuggestions) {
      // If suggestions appear for clearly invalid input, that's a usability issue
      const invalidSuggestionsCount = await page.locator('.autocomplete-suggestion, [data-testid="suggestion-item"]').count();
      if (invalidSuggestionsCount > 0) {
        criticalIssues.push('System shows suggestions for clearly invalid addresses');
      }
    }

    // Determine usability rating based on tests
    if (criticalIssues.length === 0 && suggestionsQuality === 'Excellent' && responseTime < 1000) {
      usabilityRating = 9;
    } else if (criticalIssues.length === 0 && suggestionsQuality === 'Good' && responseTime < 2000) {
      usabilityRating = 7;
    } else if (criticalIssues.length === 1) {
      usabilityRating = 5;
    } else if (criticalIssues.length > 1) {
      usabilityRating = 3;
    } else {
      usabilityRating = 6;
    }

    // Output the test results
    console.log(`
    === ADDRESS AUTOCOMPLETE TEST REPORT ===
    Feature working: ${criticalIssues.length === 0 ? 'Yes' : 'No - ' + criticalIssues.join(', ')}
    Response time: ${responseTime.toFixed(0)}ms
    Suggestions quality: ${suggestionsQuality}
    Usability rating: ${usabilityRating}/10
    Critical issues: ${criticalIssues.length > 0 ? criticalIssues.join(', ') : 'None'}
    `);
  });
});