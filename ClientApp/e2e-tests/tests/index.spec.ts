import { test, expect } from '@playwright/test';
import { heroItems } from '~/data/navigation';

test('Check index page title', async ({ page }) => {
    await page.goto("");
    await expect(page).toHaveTitle('SuperOffice Docs');
});


test('Click on hero items', async({page}) => {
    await page.goto("");

    for (const link of heroItems.links) {
        await page.getByRole('heading', { name: link.title , level: 2 }).click();
        await expect(page).toHaveURL(`/docs-next${link.url}`);
        await page.goBack()
    }
})


test('Index page snapshot test', async ({ page }) => {
    await page.goto("");
    await expect(page).toHaveScreenshot();
});