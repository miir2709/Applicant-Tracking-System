import os
from numpy import e
from . import utils
import spacy
import pprint
import nltk
from spacy.matcher import Matcher
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

nlp = spacy.load(
    "c:/users/kaush/appdata/local/programs/python/python38/lib/site-packages/en_core_web_md/en_core_web_md-3.2.0"
)


class ResumeParser:
    def __init__(self, resume):
        self.matcher = Matcher(nlp.vocab)
        self.details = {
            "name": None,
            "email": None,
            "mobile_number": None,
            "skills": None,
            "education": None,
            "experience": None,
        }
        self.resume = resume
        self.text_raw = utils.extract_text(
            self.resume, os.path.splitext(self.resume)[1]
        )
        self.text = " ".join(self.text_raw.split())
        self.nlp = nlp(self.text)
        self.nouns = list(self.nlp.noun_chunks)
        self.getDetails()

    def get_extracted_data(self):
        return self.details["skills"]

    def getDetails(self):
        skills = utils.extract_skills(self.nlp, self.nouns)
        self.details["skills"] = skills
        return


class JobDescriptionParser:
    def __init__(self, jd):
        self.matcher = Matcher(nlp.vocab)
        self.details = {"skills": None}
        self.text = jd
        self.nlp = nlp(self.text)
        self.nouns = list(self.nlp.noun_chunks)
        self.getDetails()

    def get_extracted_data(self):
        return self.details

    def getDetails(self):
        skills = utils.extract_skills(self.nlp, self.nouns)
        self.details["skills"] = skills
        return


def jd_result_wrapper(jd):
    parser = JobDescriptionParser(jd)
    return parser.get_extracted_data()


def resume_result_wrapper(resume):
    parser = ResumeParser(resume)
    return parser.get_extracted_data()


def process(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = stopwords.words("english")
    temp = []
    for w in text:
        if w in list(set(stop_words)):
            continue
        temp.append(lemmatizer.lemmatize(w.lower()))
    temp = sorted(list(set(temp)))
    text = " ".join(w for w in temp)
    return text
