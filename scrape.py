from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import time

url = 'https://www.tiktok.com/@deutschlands_politik'
driver = webdriver.Chrome()  # or use webdriver.Firefox() if using Firefox
# driver = webdriver.Firefox()
driver.get(url)

# Add waits if necessary to let elements load (adjust time as needed)
time.sleep(5)

try:
    close_button = driver.find_element(By.XPATH, "//button[@aria-label='Close']")
    close_button.click()
    print("Popup closed.")
except Exception as e:
    print("Close button not found or could not be clicked:", e)

time.sleep(5)

try:
    # decline_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Decline all')]")
    decline_button = driver.find_element(By.XPATH, "//button[text()='\"Decline all\"']")
    decline_button.click()
    print("Clicked 'Decline all' button.")
except Exception as e:
    print("Decline button not found or could not be clicked:", e)


try:
    # decline_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Decline all')]")
    decline_button = driver.find_element(By.XPATH, "//button[text()='\"Decline all\"']")
    decline_button.click()
    print("Clicked 'Decline all' button.")
except Exception as e:
    print("Decline button not found or could not be clicked:", e)

time.sleep(5)

try:
    refresh_button = driver.find_element(By.CSS_SELECTOR, ".emuynwa3.css-z9i4la-Button-StyledButton.ehk74z00")
    refresh_button.click()
    print("Button clicked.")
except Exception as e:
    print("Button not found or could not be clicked:", e)
time.sleep(5**10)

page_source = driver.page_source

soup = BeautifulSoup(page_source, 'html.parser')



data = soup.find_all('a', class_='e19c29qe13')

for item in data:
    print(item.href)

driver.quit()
