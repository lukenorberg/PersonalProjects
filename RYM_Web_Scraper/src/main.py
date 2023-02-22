# This is a project to scrape data from the website RateYourMusic.com about a given year

from bs4 import BeautifulSoup
from datetime import datetime
import csv

albumNameList = []
artistNameList = []
averageScoreList = []
scoreList = []
reviewList = []
dateList = []
genreList = []

# takes data from rym.html to store in declared lists

with open('rym.html', 'r', encoding="utf8") as html_file:
    content = html_file.read()

    # gathers names of albums and artists
    soup = BeautifulSoup(content, 'html.parser')
    artistName = soup.findChildren("div", class_="page_charts_section_charts_item_credited_links_primary")
    albumName = soup.findChildren("div", class_="page_charts_section_charts_item_title")
    averageScore = soup.find_all("span", class_="stat page_charts_section_charts_item_details_average_num")
    reviews = soup.find_all("span", class_="stat has_tip")
    dates = soup.findChildren("div", class_="page_charts_section_charts_item_date")
    genreClump = soup.find_all("div", class_="page_charts_section_charts_item_genres_primary")

# sort data into lists

for i in range(len(albumName)):
    albumNameWithSpaces = albumName[i].get_text()
    albumNameWithoutSpaces = albumNameWithSpaces.strip()
    albumNameList.append(albumNameWithoutSpaces)

# clears whitespaces and combines artist names

for i in range(len(artistName)):
    stripped = artistName[i].get_text().strip()
    namesList = stripped.split("\n\n\n\n\n")
    if list(namesList[0])[-1] == '&':
        namesList[0] = namesList[0].replace(" &", "")
    if len(namesList) == 1:
        artistNameList.append(namesList[0])
    else:
        finalName = namesList[0] + " & " + namesList[1]
        artistNameList.append(finalName)

for score in range(len(averageScore)):
    averageScoreList.append(averageScore[score].get_text())
    print(averageScore[score])

# splits scores into scores without reviews and scores with reviews. set range to 80 because of extraneous values

for i in range(80):
    if i % 2 == 0:
        scoreWithSpaces = reviews[i].get_text()
        scoreWithoutSpaces = scoreWithSpaces.strip()
        scoreList.append(scoreWithoutSpaces)
    else:
        reviewWithSpaces = reviews[i].get_text()
        reviewWithoutSpaces = reviewWithSpaces.strip()
        reviewList.append(reviewWithoutSpaces)

# transforms dates into datetime format

for i in range(len(dates)):
    dateWithSpaces = dates[i].get_text()
    dateWithoutSpaces = dateWithSpaces.strip()
    dateStrip = dateWithoutSpaces.replace("\nAlbum", "")
    dateList.append(dateStrip)

# simplifies datetime to a more readable format

dateFormat = "%d %B %Y"
for i in range(len(dateList)):
    dateNoTime = datetime.strptime(dateList[i], dateFormat)
    dateList[i] = dateNoTime.strftime('%m-%d-%Y')

# formats album genres

for i in range(len(genreClump)):
    genresWithSpaces = genreClump[i].get_text()
    genresWithoutSpaces = genresWithSpaces.strip()
    genreSplit = genresWithoutSpaces.split("\n")
    genreList.append(genreSplit)

# ------------------------ csv -----------------------

filename = "rym_2022.csv"
fields = ["Album", "Artist", "Release Date", "Genres", "Score", "# of scores", "# of reviews"]
csvDataSet = []

for i in range(len(albumNameList)):
    csvRow = [albumNameList[i], artistNameList[i], averageScoreList[i], scoreList[i], reviewList[i], dateList[i]]
    csvDataSet.append(csvRow)


with open(filename, 'w', encoding="utf-8") as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(fields)
    csvwriter.writerows(csvDataSet)
