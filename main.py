import os
import utils
import spacy
import pprint
from spacy.matcher import Matcher

class ResumeParser(object):
    def __init__(self, resume):
        nlp = spacy.load('en_core_web_sm')
        self.matcher = Matcher(nlp.vocab)
        self.details = {
            'name'              : None,
            'email'             : None,
            'mobile_number'     : None,
            'skills'            : None,
            'education'         : None,
            'experience'        : None,
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
        name = utils.extract_name(self.nlp, matcher=self.matcher)
        email = utils.extract_email(self.text)
        mobile = utils.extract_mobile_number(self.text)
        skills = utils.extract_skills(self.nlp, self.nouns)
        edu = utils.extract_education([sent.text.strip() for sent in self.nlp.sents])
        experience = utils.extract_experience(self.text)
        self.details['name'] = name
        self.details['email'] = email
        self.details['mobile_number'] = mobile
        self.details['skills'] = skills
        self.details['education'] = edu
        self.details['experience'] = experience
        return

def resume_result_wrapper(resume):
        parser = ResumeParser(resume)
        return parser.get_extracted_data()

if __name__ == '__main__':
    resumes = []
    data = []
    for root, directories, filenames in os.walk('resumes'):
        for filename in filenames:
            file = os.path.join(root, filename)
            resumes.append(file)
    results = [resume_result_wrapper(x) for x in resumes]
    pprint.pprint(results)
    print()