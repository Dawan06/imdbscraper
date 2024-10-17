import requests
from bs4 import BeautifulSoup
import json
import os

def convertRuntime(seconds):
    if seconds is not None and seconds != 'N/A':
        minutes = seconds // 60
        return minutes
    return 'N/A'

if not os.path.exists('movie_posters'):
    os.makedirs('movie_posters')

url = 'https://www.imdb.com/user/ur174609609/watchlist/'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'}
result = requests.get(url, headers=headers)

soup = BeautifulSoup(result.content, 'html.parser')
movieData = soup.find('script', id='__NEXT_DATA__')
moviesList = []

if movieData:
    jsonData = json.loads(movieData.string)
    movies = jsonData['props']['pageProps']['mainColumnData']['predefinedList']['titleListItemSearch']['edges']

    for movie in movies:
        movieInfo = {}
        movieItem = movie['listItem']

        movieInfo['title'] = movieItem['titleText']['text']
        movieInfo['year'] = movieItem['releaseYear']['year']
        movieInfo['rating'] = movieItem.get('ratingsSummary', {}).get('aggregateRating', 'N/A')
        runtimeSeconds = movieItem.get('runtime', {}).get('seconds', None)
        movieInfo['runtime'] = convertRuntime(runtimeSeconds)
        movieInfo['genres'] = [genre['genre']['text'] for genre in movieItem.get('titleGenres', {}).get('genres', [])]
        movieInfo['plot'] = movieItem.get('plot', {}).get('plotText', {}).get('plainText', 'N/A')
        principalCredits = movieItem.get('principalCredits', [])
        castList = []

        for credit in principalCredits:
            if credit['category']['id'] == 'cast':
                castList = [cast['name']['nameText']['text'] for cast in credit['credits'] if cast.get('name')]
                break
        movieInfo['cast'] = castList

        metacriticData = movieItem.get('metacritic')
        if metacriticData and 'metascore' in metacriticData:
            movieInfo['metascore'] = metacriticData['metascore'].get('score', 'N/A')
        else:
            movieInfo['metascore'] = 'N/A'

        imageUrl = movieItem.get('primaryImage', {}).get('url', None)
        if imageUrl:
            imageFilename = imageUrl.split('/')[-1]
            movieInfo['poster'] = imageFilename
            imageResponse = requests.get(imageUrl)
            with open(f'movie_posters/{imageFilename}', 'wb') as img_file:
                img_file.write(imageResponse.content)

        moviesList.append(movieInfo)

else:
    print("ERROR: Could not retrieve movie data.")

with open("movies_data.json", "w", encoding="utf-8") as json_file:
    json.dump(moviesList, json_file, ensure_ascii=False, indent=4)

print(f"{len(moviesList)} movies have been processed and saved.")