from playwright.sync_api import sync_playwright, Page, expect
import re

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify homepage changes
    page.goto("http://localhost:3000")
    expect(page.get_by_role("link", name="Liturgia Diária")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/homepage.png")

    # Verify /liturgia/hoje changes
    page.get_by_role("link", name="Liturgia Diária").click()
    page.wait_for_url("http://localhost:3000/liturgia/hoje")

    # Locate the h1 element and verify its content
    h1_locator = page.locator("h1")
    expect(h1_locator).to_contain_text("Liturgia do Dia -")

    page.screenshot(path="jules-scratch/verification/liturgia_hoje.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)