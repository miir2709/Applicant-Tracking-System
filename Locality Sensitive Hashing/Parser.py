import os
from numpy import e
import utils
import spacy
import pprint
import nltk
from spacy.matcher import Matcher

nlp = spacy.load('C:/users/kaush/appdata/local/programs/python/python38/lib/site-packages/en_core_web_md/en_core_web_md-3.2.0/')

class ResumeParser():

    def __init__(self, resume):
        self.matcher = Matcher(nlp.vocab)
        self.details = {
            'name' : None,
            'email' : None,
            'mobile_number' : None,
            'skills' : None,
            'education' : None,
            'experience' : None,
        }
        self.resume = resume
        self.text_raw = utils.extract_text(self.resume, os.path.splitext(self.resume)[1])
        self.text = ' '.join(self.text_raw.split())
        self.nlp = nlp(self.text)
        self.nouns = list(self.nlp.noun_chunks)
        self.getDetails()

    def get_extracted_data(self):
        return self.details

    def getDetails(self):
        skills = utils.extract_skills(self.nlp, self.nouns)
        self.details['skills'] = skills
        return

class JobDescriptionParser():

    def __init__(self, jd):
        nlp = spacy.load('/usr/local/lib/python3.7/dist-packages/en_core_web_md/en_core_web_md-2.2.5/')
        self.matcher = Matcher(nlp.vocab)
        self.details = {'skills' : None}
        self.jd = jd
        self.text_raw = utils.extract_text(self.jd, os.path.splitext(self.jd)[1])
        self.text = ' '.join(self.text_raw.split())
        self.nlp = nlp(self.text)
        self.nouns = list(self.nlp.noun_chunks)
        self.getDetails()

    def get_extracted_data(self):
        return self.details

    def getDetails(self):
        skills = utils.extract_skills(self.nlp, self.nouns)
        self.details['skills'] = skills
        return


def jd_result_wrapper(jd):
    parser = JobDescriptionParser(jd)
    return parser.get_extracted_data()

def resume_result_wrapper(resume):
    parser = ResumeParser(resume)
    return parser.get_extracted_data()