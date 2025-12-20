import { test, expect } from '@playwright/test';

test.describe('EUREKA Main Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the home page
        await page.goto('http://localhost:5173');
    });

    test('should allow a user to generate a review and add it to favorites', async ({ page }) => {
        // 1. Verify we are on the home page
        await expect(page.locator('h1')).toContainText('Veille Technologique');

        // 2. Fill the form (optional pseudo)
        await page.fill('input[placeholder="Anonyme"]', 'Playwright Tester');

        // 3. Click generate
        const generateBtn = page.getByRole('button', { name: /Générer la revue/i });
        await generateBtn.click();

        // 4. Wait for the generation process (Status change to loading)
        // We expect the button to change text or show a spinner
        await expect(page.getByText(/Analyse en cours/i)).toBeVisible();

        // 5. Wait for redirection to ReviewDetail (can take up to 30s)
        await expect(page).toHaveURL(/\/review\//, { timeout: 60000 });

        // 6. Verify the content is visible
        await expect(page.locator('article')).toBeVisible();
        await expect(page.getByText('Playwright Tester')).toBeVisible();

        // 7. Test the favorite toggle
        const favBtn = page.getByRole('button', { name: /Favori/i });
        await favBtn.click();

        // 8. Verify the Toast notification appears
        await expect(page.getByText(/Ajouté aux favoris/i)).toBeVisible();

        // 9. Go to Favorites page and verify the review is there
        await page.click('text=Favoris');
        await expect(page).toHaveURL(/\/favorites/);
        await expect(page.getByText('Playwright Tester')).toBeVisible();
    });

    test('should navigate through different sections', async ({ page }) => {
        const sections = ['Recherche', 'Timeline', 'Stats'];

        for (const section of sections) {
            await page.click(`text=${section}`);
            await expect(page.locator('h1')).toBeVisible();
            // Go back to home
            await page.goto('http://localhost:5173');
        }
    });
});
