import requests
from bs4 import BeautifulSoup

url = 'https://www.imdb.com/user/ur174609609/watchlist/'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'}
result = requests.get(url, headers=headers)
soup = BeautifulSoup(result.content, 'html.parser')

with open("output.html", "w", encoding="utf-8") as file:
    file.write(str(soup.prettify()))