from flask import Flask, request

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from sqlalchemy import true
from flask_cors import CORS

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

app = Flask(__name__)
CORS(app)

@app.route('/rate')
def handleGetGrades():
    try:
        fname = request.args.get('firstName').strip();
        lname = request.args.get('lastName').strip();
        url = 'https://www.ratemyprofessors.com/search/teachers?query=' + fname + '%20' + lname + '&sid=U2Nob29sLTE0MTM='
        driver.get(url)
        test = driver.find_element_by_xpath("//*[@id='root']/div/div/div[4]/div[1]/div[1]/div[1]/div/div/div")
        return '0.0'
    except:
        try:
            elem = driver.find_element_by_xpath("//*[@id='root']/div/div/div[4]/div[1]/div[1]/div[3]/a/div/div[1]/div/div[2]")
            return elem.get_attribute('innerHTML')
        except:
            return '0.0'

if (__name__ == "__main__"):
    app.run(port=5001)

